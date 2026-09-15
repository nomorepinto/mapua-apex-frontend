import { useMemo, useState } from "react"
import { Building2Icon, CircleAlertIcon, DownloadIcon, PlusIcon } from "lucide-react"
import { Link } from "react-router"

import { CsvFileField } from "@/components/admin-osa/csv-file-field"
import {
  ORGANIZATION_ASSIGNABLE_DESK_ITEMS,
  deskAssignment,
  findByRole,
  missingSharedRoles,
  optionFromPerson,
  optionsForRole,
  resolveSignatoryByRole,
  signatoryRoleLabel,
  type SignatoryOption,
} from "@/components/admin-osa/signatory-roles"
import { FormPageHeader } from "@/components/forms/form-page-header"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card"
import { layout } from "@/config"
import { cn } from "@/lib/utils"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toastManager } from "@/components/ui/toast"
import {
  useBulkCreateOrganizationsMutation,
  useCreateOrganizationMutation,
  useOrganizationsQuery,
  useSignatoriesQuery,
  useUpdateOrganizationMutation,
} from "@/hooks/use-admin"
import type {
  ApiOrganization,
  ApiOrganizationSignatory,
  ApiSignatory,
  CreateOrganizationPayload,
  OrganizationAssignableDeskRole,
} from "@/lib/dynamodb-adapters"
import {
  downloadCsvTemplate,
  parseOrganizationCsv,
  type OrganizationCsvRow,
} from "@/lib/parse-csv"

const EMPTY_ORGANIZATIONS: ApiOrganization[] = []
const EMPTY_SIGNATORIES: ApiSignatory[] = []

type AssignableDesks = Record<
  OrganizationAssignableDeskRole,
  SignatoryOption | null
>

function emptyDesks(): AssignableDesks {
  return { dean: null, adviser: null }
}

const ORG_CSV_TEMPLATE =
  "name,dean,adviser\nMapua Computing Society,Dr. Ana Reyes,Prof. Juan Dela Cruz\nIEEE Mapua,Dr. Ana Reyes,Prof. Elena Tan\n"

function toastBulkResult(created: number, failed: number, noun: string) {
  if (created > 0 && failed === 0) {
    toastManager.add({
      title: `${noun} added`,
      description: `Created ${created} ${noun.toLowerCase()}${created === 1 ? "" : "s"}.`,
      type: "success",
    })
    return
  }

  if (created > 0) {
    toastManager.add({
      title: `Partially added ${noun.toLowerCase()}s`,
      description: `Created ${created}. ${failed} failed.`,
      type: "warning",
    })
    return
  }

  toastManager.add({
    title: `Could not add ${noun.toLowerCase()}s`,
    description:
      failed > 0
        ? `${failed} row${failed === 1 ? "" : "s"} failed.`
        : "Nothing to import.",
    type: "error",
  })
}

function withSharedDesks(
  dean: SignatoryOption,
  adviser: SignatoryOption,
  people: ApiSignatory[]
): ApiOrganizationSignatory[] | null {
  const admin = findByRole(people, "admin")
  const cdm = findByRole(people, "cdm")
  if (!admin || !cdm || !findByRole(people, "osaar")) {
    return null
  }

  return [
    { role: "dean", signatory_id: dean.value },
    { role: "adviser", signatory_id: adviser.value },
    { role: "admin", signatory_id: admin.signatory_id },
    { role: "cdm", signatory_id: cdm.signatory_id },
  ]
}

function DeskName({
  signatoryId,
  person,
}: {
  signatoryId?: string
  person?: ApiSignatory
}) {
  if (person) {
    return <span className="whitespace-normal">{person.name}</span>
  }
  if (signatoryId) {
    return <Badge variant="outline">{signatoryId}</Badge>
  }
  return <span className="text-muted-foreground">—</span>
}

function SignatoryDeskCombobox({
  emptyLabel,
  items,
  label,
  onValueChange,
  placeholder,
  value,
}: {
  emptyLabel: string
  items: SignatoryOption[]
  label: string
  onValueChange: (value: SignatoryOption | null) => void
  placeholder: string
  value: SignatoryOption | null
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Combobox
        disabled={items.length === 0}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
        items={items}
        onValueChange={onValueChange}
        value={value}
      >
        <ComboboxInput
          placeholder={items.length === 0 ? emptyLabel : placeholder}
          showClear
        />
        <ComboboxPopup>
          <ComboboxEmpty>No matching {label.toLowerCase()}.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </Field>
  )
}

export function AdminOrganizationsPage() {
  const orgsQuery = useOrganizationsQuery()
  const signatoriesQuery = useSignatoriesQuery()
  const createOrg = useCreateOrganizationMutation()
  const updateOrg = useUpdateOrganizationMutation()
  const bulkCreate = useBulkCreateOrganizationsMutation()

  const [name, setName] = useState("")
  const [desks, setDesks] = useState<AssignableDesks>(emptyDesks)
  const [formError, setFormError] = useState("")
  const [csvRows, setCsvRows] = useState<OrganizationCsvRow[]>([])
  const [csvParseErrors, setCsvParseErrors] = useState<string[]>([])
  const [csvFileName, setCsvFileName] = useState("")
  const [csvError, setCsvError] = useState("")
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<ApiOrganization | null>(null)
  const [editName, setEditName] = useState("")
  const [editDesks, setEditDesks] = useState<AssignableDesks>(emptyDesks)
  const [editError, setEditError] = useState("")

  const organizations = orgsQuery.data ?? EMPTY_ORGANIZATIONS
  const signatories = signatoriesQuery.data ?? EMPTY_SIGNATORIES
  const peopleById = useMemo(
    () =>
      new Map(
        signatories.map((person) => [person.signatory_id, person] as const)
      ),
    [signatories]
  )

  const existingNames = useMemo(
    () => new Set(organizations.map((org) => org.name.trim().toLowerCase())),
    [organizations]
  )

  const deskOptions = useMemo(
    () => ({
      dean: optionsForRole(signatories, "dean"),
      adviser: optionsForRole(signatories, "adviser"),
    }),
    [signatories]
  )

  const missingShared = missingSharedRoles(signatories)
  const sharedAccountsReady = missingShared.length === 0
  const missingAssignable = ORGANIZATION_ASSIGNABLE_DESK_ITEMS.filter(
    (item) => deskOptions[item.value].length === 0
  )

  const sharedAdmin = findByRole(signatories, "admin")
  const sharedCdm = findByRole(signatories, "cdm")
  const sharedOsaar = findByRole(signatories, "osaar")

  const csvResolved = useMemo(() => {
    const payloads: CreateOrganizationPayload[] = []
    const errors: string[] = []
    const skippedDuplicates: string[] = []

    for (const row of csvRows) {
      if (existingNames.has(row.name.trim().toLowerCase())) {
        skippedDuplicates.push(row.name)
        continue
      }

      let rowFailed = false
      const selected: Partial<AssignableDesks> = {}

      for (const item of ORGANIZATION_ASSIGNABLE_DESK_ITEMS) {
        const { match, ambiguous } = resolveSignatoryByRole(
          signatories,
          item.value,
          row.desks[item.value]
        )
        if (ambiguous) {
          errors.push(
            `${row.name}: more than one ${item.label.toLowerCase()} matches “${row.desks[item.value]}”.`
          )
          rowFailed = true
          break
        }
        if (!match) {
          errors.push(
            `${row.name}: unknown ${item.label.toLowerCase()} “${row.desks[item.value]}”.`
          )
          rowFailed = true
          break
        }
        selected[item.value] = {
          label: match.name,
          value: match.signatory_id,
        }
      }

      if (rowFailed || !selected.dean || !selected.adviser) {
        continue
      }

      const assignments = withSharedDesks(
        selected.dean,
        selected.adviser,
        signatories
      )
      if (!assignments) {
        errors.push(
          `${row.name}: admin, CDM, and OSAAR accounts must exist before importing organizations.`
        )
        continue
      }

      payloads.push({ name: row.name.trim(), signatories: assignments })
    }

    return { payloads, errors, skippedDuplicates }
  }, [csvRows, existingNames, signatories])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return organizations
    }
    return organizations.filter((org) => {
      const haystack = [
        org.name,
        org.organization_id,
        ...ORGANIZATION_ASSIGNABLE_DESK_ITEMS.map((item) => {
          const id = deskAssignment(org, item.value)
          return id ? (peopleById.get(id)?.name ?? id) : ""
        }),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [organizations, peopleById, search])

  function openEdit(org: ApiOrganization) {
    setEditing(org)
    setEditName(org.name)
    setEditDesks({
      dean: optionFromPerson(
        peopleById.get(deskAssignment(org, "dean") ?? "")
      ),
      adviser: optionFromPerson(
        peopleById.get(deskAssignment(org, "adviser") ?? "")
      ),
    })
    setEditError("")
  }

  async function handleAddOne(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = name.trim()

    if (!trimmed) {
      setFormError("Organization name is required.")
      return
    }
    if (existingNames.has(trimmed.toLowerCase())) {
      setFormError("That organization is already registered.")
      return
    }
    if (!sharedAccountsReady) {
      setFormError("Register shared admin, CDM, and OSAAR accounts first.")
      return
    }
    if (!desks.dean || !desks.adviser) {
      setFormError("Select a dean and an adviser.")
      return
    }

    const assignments = withSharedDesks(desks.dean, desks.adviser, signatories)
    if (!assignments) {
      setFormError("Register shared admin, CDM, and OSAAR accounts first.")
      return
    }

    try {
      await createOrg.mutateAsync({
        name: trimmed,
        signatories: assignments,
      })
      setName("")
      setDesks(emptyDesks())
      setFormError("")
      toastManager.add({
        title: "Organization added",
        description: `${trimmed} is now registered.`,
        type: "success",
      })
    } catch (error) {
      toastManager.add({
        title: "Could not add organization",
        description: error instanceof Error ? error.message : "Request failed.",
        type: "error",
      })
    }
  }

  async function handleCsvImport() {
    if (!sharedAccountsReady) {
      setCsvError("Register shared admin, CDM, and OSAAR accounts first.")
      return
    }

    const errors = [...csvParseErrors, ...csvResolved.errors]
    if (csvResolved.payloads.length === 0) {
      setCsvError(
        errors[0] ??
          (csvRows.length === 0
            ? "Choose a CSV with name, dean, and adviser columns."
            : csvResolved.skippedDuplicates.length > 0
              ? "Every organization in this file is already registered."
              : "No valid organization rows to import.")
      )
      return
    }

    const result = await bulkCreate.mutateAsync(csvResolved.payloads)
    const failed = result.failed.length + errors.length
    toastBulkResult(result.created.length, failed, "Organization")
    if (result.created.length > 0) {
      setCsvRows([])
      setCsvParseErrors([])
      setCsvFileName("")
      setCsvError(errors.length > 0 ? errors.join(" ") : "")
    } else if (errors.length > 0) {
      setCsvError(errors.join(" "))
    }
  }

  async function handleEditSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing) {
      return
    }

    const trimmed = editName.trim()
    if (!trimmed) {
      setEditError("Organization name is required.")
      return
    }
    const duplicate = organizations.some(
      (org) =>
        org.organization_id !== editing.organization_id &&
        org.name.trim().toLowerCase() === trimmed.toLowerCase()
    )
    if (duplicate) {
      setEditError("That organization is already registered.")
      return
    }
    if (!editDesks.dean || !editDesks.adviser) {
      setEditError("Select a dean and an adviser.")
      return
    }

    const assignments = withSharedDesks(
      editDesks.dean,
      editDesks.adviser,
      signatories
    )
    if (!assignments) {
      setEditError("Register shared admin, CDM, and OSAAR accounts first.")
      return
    }

    try {
      await updateOrg.mutateAsync({
        organizationId: editing.organization_id,
        name: trimmed,
        signatories: assignments,
      })
      setEditing(null)
      toastManager.add({
        title: "Organization updated",
        description: `${trimmed} was saved.`,
        type: "success",
      })
    } catch (error) {
      toastManager.add({
        title: "Could not update organization",
        description: error instanceof Error ? error.message : "Request failed.",
        type: "error",
      })
    }
  }

  const canAddOrganization =
    sharedAccountsReady && missingAssignable.length === 0

  return (
    <div className={layout.page}>
      <div className={cn(layout.container, layout.stack)}>
        <FormPageHeader
          subtitle="Assign a dean and adviser to each organization. Admin, CDM, and OSAAR are shared accounts used by every organization."
          title="Organizations"
        />

        {orgsQuery.isError || signatoriesQuery.isError ? (
          <Alert variant="error">
            <CircleAlertIcon />
            <AlertTitle>Could not load directory</AlertTitle>
            <AlertDescription>
              {(orgsQuery.error instanceof Error && orgsQuery.error.message) ||
                (signatoriesQuery.error instanceof Error &&
                  signatoriesQuery.error.message) ||
                "Organizations or signatories failed to load."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className={cn("grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]", layout.gap)}>
          <Card className={layout.card}>
            <CardHeader>
              <CardTitle>Add organization</CardTitle>
              <CardDescription>
                Admin and CDM are not selected here — they share one account
                each.
              </CardDescription>
            </CardHeader>
            <Form className="contents" onSubmit={handleAddOne}>
              <CardPanel className="flex flex-col gap-4">
                <Field>
                  <FieldLabel htmlFor="organization-name">Name</FieldLabel>
                  <Input
                    aria-invalid={formError ? true : undefined}
                    autoComplete="off"
                    id="organization-name"
                    name="name"
                    onChange={(event) => {
                      setName(event.currentTarget.value)
                      if (formError) {
                        setFormError("")
                      }
                    }}
                    placeholder="Mapua Computing Society"
                    required
                    type="text"
                    value={name}
                  />
                  {formError && formError.includes("name") ? (
                    <FieldError>{formError}</FieldError>
                  ) : null}
                </Field>

                {ORGANIZATION_ASSIGNABLE_DESK_ITEMS.map((item) => (
                  <SignatoryDeskCombobox
                    emptyLabel={`No ${item.label} registered`}
                    items={deskOptions[item.value]}
                    key={item.value}
                    label={item.label}
                    onValueChange={(value) => {
                      setDesks((current) => ({
                        ...current,
                        [item.value]: value,
                      }))
                      if (formError) {
                        setFormError("")
                      }
                    }}
                    placeholder={`Search ${item.label.toLowerCase()}`}
                    value={desks[item.value]}
                  />
                ))}

                {!sharedAccountsReady && !signatoriesQuery.isLoading ? (
                  <Alert variant="warning">
                    <AlertTitle>Shared accounts required</AlertTitle>
                    <AlertDescription>
                      Register{" "}
                      {missingShared
                        .map((role) => signatoryRoleLabel(role))
                        .join(", ")}{" "}
                      before adding organizations.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {sharedAccountsReady &&
                missingAssignable.length > 0 &&
                !signatoriesQuery.isLoading ? (
                  <Alert variant="warning">
                    <AlertTitle>Dean and adviser required</AlertTitle>
                    <AlertDescription>
                      Register at least one{" "}
                      {missingAssignable
                        .map((item) => item.label.toLowerCase())
                        .join(" and ")}{" "}
                      to assign to this organization.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {formError && !formError.includes("name") ? (
                  <Alert variant="error">
                    <CircleAlertIcon />
                    <AlertTitle>Missing fields</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}
              </CardPanel>
              <CardFooter className="justify-end">
                <Button
                  disabled={!canAddOrganization}
                  loading={createOrg.isPending}
                  type="submit"
                >
                  <PlusIcon aria-hidden="true" />
                  Add organization
                </Button>
              </CardFooter>
            </Form>
            <Separator />
            <CardHeader>
              <CardTitle>Import CSV</CardTitle>
              <CardDescription>
                Three columns: organization name, dean, adviser. Shared admin
                and CDM are attached automatically.
              </CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-4">
              <CsvFileField
                description="name, dean, adviser."
                error={csvError}
                fileName={csvFileName}
                id="organizations-csv"
                onFile={(file, text) => {
                  if (!file) {
                    setCsvRows([])
                    setCsvParseErrors([])
                    setCsvFileName("")
                    setCsvError("")
                    return
                  }
                  const parsed = parseOrganizationCsv(text)
                  setCsvFileName(file.name)
                  setCsvRows(parsed.rows)
                  setCsvParseErrors(parsed.errors)
                  setCsvError(parsed.errors[0] ?? "")
                }}
              />
              {csvRows.length > 0 ? (
                <Alert variant="info">
                  <AlertTitle>
                    {csvResolved.payloads.length} new
                    {csvResolved.skippedDuplicates.length > 0
                      ? ` · ${csvResolved.skippedDuplicates.length} already registered`
                      : ""}
                    {csvResolved.errors.length > 0
                      ? ` · ${csvResolved.errors.length} could not be matched`
                      : ""}
                  </AlertTitle>
                  <AlertDescription>
                    {csvResolved.payloads
                      .slice(0, 8)
                      .map((row) => row.name)
                      .join(", ")}
                    {csvResolved.payloads.length > 8
                      ? ` and ${csvResolved.payloads.length - 8} more`
                      : ""}
                  </AlertDescription>
                </Alert>
              ) : null}
            </CardPanel>
            <CardFooter className="justify-between gap-2">
              <Button
                onClick={() =>
                  downloadCsvTemplate("organizations.csv", ORG_CSV_TEMPLATE)
                }
                type="button"
                variant="ghost"
              >
                <DownloadIcon aria-hidden="true" />
                Template
              </Button>
              <Button
                disabled={
                  !sharedAccountsReady || csvResolved.payloads.length === 0
                }
                loading={bulkCreate.isPending}
                onClick={handleCsvImport}
                type="button"
                variant="outline"
              >
                Import{" "}
                {csvResolved.payloads.length > 0
                  ? csvResolved.payloads.length
                  : ""}{" "}
                {csvResolved.payloads.length === 1 ? "org" : "orgs"}
              </Button>
            </CardFooter>
          </Card>

          <Card className={cn(layout.card, "min-w-0")}>
            <CardHeader>
              <CardTitle>Registered organizations</CardTitle>
              <CardDescription>
                {orgsQuery.isLoading || signatoriesQuery.isLoading
                  ? "Loading…"
                  : `${organizations.length} organization${
                      organizations.length === 1 ? "" : "s"
                    } · right-click a row to edit`}
              </CardDescription>
              <CardAction>
                <Input
                  aria-label="Search organizations and signatories"
                  className="w-full min-w-0 sm:w-56"
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder="Search name or signatory"
                  type="search"
                  value={search}
                />
              </CardAction>
            </CardHeader>
            <CardPanel className="p-0">
              {orgsQuery.isLoading || signatoriesQuery.isLoading ? (
                <div className="space-y-2 px-6 pb-6">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : organizations.length === 0 ? (
                <Empty className="py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Building2Icon aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>No organizations yet</EmptyTitle>
                    <EmptyDescription>
                      Register shared admin, CDM, and OSAAR accounts, then
                      assign a dean and adviser to each organization.
                    </EmptyDescription>
                  </EmptyHeader>
                  {!sharedAccountsReady ? (
                    <EmptyContent>
                      <Button render={<Link to="/admin/signatories" />}>
                        Add signatories
                      </Button>
                    </EmptyContent>
                  ) : null}
                </Empty>
              ) : (
                <>
                  <div className="border-b px-6 py-3 text-sm text-muted-foreground">
                    Shared desks: Admin {sharedAdmin?.name ?? "—"} · CDM{" "}
                    {sharedCdm?.name ?? "—"} · OSAAR {sharedOsaar?.name ?? "—"}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Dean</TableHead>
                        <TableHead>Adviser</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className="text-muted-foreground"
                            colSpan={3}
                          >
                            No organizations match “{search}”.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.map((org) => (
                          <TableRow
                            className="cursor-context-menu"
                            key={org.organization_id}
                            onContextMenu={(event) => {
                              event.preventDefault()
                              openEdit(org)
                            }}
                            title="Right-click to edit"
                          >
                            <TableCell className="whitespace-normal">
                              <div className="font-medium">{org.name}</div>
                              <Badge className="mt-1" variant="outline">
                                {org.organization_id}
                              </Badge>
                            </TableCell>
                            {ORGANIZATION_ASSIGNABLE_DESK_ITEMS.map((item) => {
                              const signatoryId = deskAssignment(
                                org,
                                item.value
                              )
                              return (
                                <TableCell key={item.value}>
                                  <DeskName
                                    person={
                                      signatoryId
                                        ? peopleById.get(signatoryId)
                                        : undefined
                                    }
                                    signatoryId={signatoryId}
                                  />
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardPanel>
          </Card>
        </div>
      </div>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            setEditError("")
          }
        }}
        open={editing !== null}
      >
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Edit organization</DialogTitle>
            <DialogDescription>
              The organization ID cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <Form className="contents" onSubmit={handleEditSave}>
            <DialogPanel className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="edit-organization-id">
                  Organization ID
                </FieldLabel>
                <Input
                  disabled
                  id="edit-organization-id"
                  readOnly
                  type="text"
                  value={editing?.organization_id ?? ""}
                />
                <FieldDescription>Generated by the API.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-organization-name">Name</FieldLabel>
                <Input
                  autoComplete="off"
                  id="edit-organization-name"
                  onChange={(event) => {
                    setEditName(event.currentTarget.value)
                    if (editError) setEditError("")
                  }}
                  required
                  type="text"
                  value={editName}
                />
              </Field>
              {ORGANIZATION_ASSIGNABLE_DESK_ITEMS.map((item) => (
                <SignatoryDeskCombobox
                  emptyLabel={`No ${item.label} registered`}
                  items={deskOptions[item.value]}
                  key={item.value}
                  label={item.label}
                  onValueChange={(value) => {
                    setEditDesks((current) => ({
                      ...current,
                      [item.value]: value,
                    }))
                    if (editError) setEditError("")
                  }}
                  placeholder={`Search ${item.label.toLowerCase()}`}
                  value={editDesks[item.value]}
                />
              ))}
              {editError ? (
                <Alert variant="error">
                  <CircleAlertIcon />
                  <AlertTitle>Could not save</AlertTitle>
                  <AlertDescription>{editError}</AlertDescription>
                </Alert>
              ) : null}
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="ghost" />}>
                Cancel
              </DialogClose>
              <Button loading={updateOrg.isPending} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </div>
  )
}
