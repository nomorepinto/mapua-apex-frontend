import { useMemo, useState } from "react"
import { CircleAlertIcon, DownloadIcon, PlusIcon, StampIcon } from "lucide-react"
import { Link } from "react-router"

import { CsvFileField } from "@/components/admin-osa/csv-file-field"
import {
  SIGNATORY_ROLE_ITEMS,
  signatoryRoleLabel,
  type SignatoryRoleValue,
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
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox"
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
  FieldLabel,
} from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  useBulkCreateSignatoriesMutation,
  useCreateSignatoryMutation,
  useOrganizationsQuery,
  useSignatoriesQuery,
} from "@/hooks/use-admin"
import type { ApiOrganization, ApiSignatory } from "@/lib/dynamodb-adapters"
import {
  downloadCsvTemplate,
  parseSignatoryCsv,
  type SignatoryCsvRow,
} from "@/lib/parse-csv"

type OrgOption = { label: string; value: string }

const ROLE_ITEMS = SIGNATORY_ROLE_ITEMS.map((item) => ({ ...item }))

function resolveOrganization(
  orgs: ApiOrganization[],
  value: string
): ApiOrganization | undefined {
  const needle = value.trim().toLowerCase()
  return orgs.find(
    (org) =>
      org.organization_id.toLowerCase() === needle ||
      org.name.toLowerCase() === needle
  )
}

function RoleCell({ people }: { people: ApiSignatory[] }) {
  if (people.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <div className="flex flex-col gap-1 whitespace-normal">
      {people.map((person) => (
        <span key={person.signatory_id}>{person.name}</span>
      ))}
    </div>
  )
}

export function AdminSignatoriesPage() {
  const orgsQuery = useOrganizationsQuery()
  const signatoriesQuery = useSignatoriesQuery()
  const createSignatory = useCreateSignatoryMutation()
  const bulkCreate = useBulkCreateSignatoriesMutation()

  const [name, setName] = useState("")
  const [role, setRole] = useState<SignatoryRoleValue | null>(null)
  const [organization, setOrganization] = useState<OrgOption | null>(null)
  const [formError, setFormError] = useState("")
  const [csvError, setCsvError] = useState("")
  const [csvFileName, setCsvFileName] = useState("")
  const [csvOrganizations, setCsvOrganizations] = useState<string[]>([])
  const [csvRecords, setCsvRecords] = useState<SignatoryCsvRow[]>([])
  const [csvMode, setCsvMode] = useState<"organizations" | "records" | null>(
    null
  )
  const [search, setSearch] = useState("")

  const organizations = orgsQuery.data ?? []
  const signatories = signatoriesQuery.data ?? []

  const orgItems = useMemo<OrgOption[]>(
    () =>
      organizations.map((org) => ({
        label: org.name,
        value: org.organization_id,
      })),
    [organizations]
  )

  const selectedRole = ROLE_ITEMS.find((item) => item.value === role) ?? null

  const orgRows = useMemo(() => {
    const byId = new Map(
      organizations.map((org) => [org.organization_id, org] as const)
    )
    const ids = new Set([
      ...byId.keys(),
      ...signatories.map((person) => person.organization_id),
    ])

    return [...ids].map((organizationId) => {
      const assigned = signatories.filter(
        (person) => person.organization_id === organizationId
      )
      return {
        organization_id: organizationId,
        name: byId.get(organizationId)?.name ?? "Unknown organization",
        adviser: assigned.filter((person) => person.role === "adviser"),
        cdm: assigned.filter((person) => person.role === "cdm"),
        dean: assigned.filter((person) => person.role === "dean"),
      }
    })
  }, [organizations, signatories])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return orgRows
    }
    return orgRows.filter((row) => {
      const haystack = [
        row.name,
        row.organization_id,
        ...row.adviser.map((person) => person.name),
        ...row.cdm.map((person) => person.name),
        ...row.dean.map((person) => person.name),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [orgRows, search])

  function buildPayloadsFromCsv(): {
    payloads: Array<{
      name: string
      role: SignatoryRoleValue
      organization_id: string
    }>
    errors: string[]
  } {
    const errors: string[] = []
    const payloads: Array<{
      name: string
      role: SignatoryRoleValue
      organization_id: string
    }> = []

    if (csvMode === "organizations") {
      if (!name.trim() || !role) {
        errors.push(
          "Enter a signatory name and role first. One-column CSVs assign that person to each organization."
        )
        return { payloads, errors }
      }

      for (const orgValue of csvOrganizations) {
        const org = resolveOrganization(organizations, orgValue)
        if (!org) {
          errors.push(`Unknown organization: ${orgValue}`)
          continue
        }
        payloads.push({
          name: name.trim(),
          role,
          organization_id: org.organization_id,
        })
      }
      return { payloads, errors }
    }

    for (const record of csvRecords) {
      const org = resolveOrganization(organizations, record.organization)
      if (!org) {
        errors.push(`Unknown organization: ${record.organization}`)
        continue
      }
      payloads.push({
        name: record.name,
        role: record.role,
        organization_id: org.organization_id,
      })
    }

    return { payloads, errors }
  }

  async function handleAddOne(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !role || !organization) {
      setFormError("Name, role, and organization are required.")
      return
    }

    try {
      await createSignatory.mutateAsync({
        name: name.trim(),
        role,
        organization_id: organization.value,
      })
      setName("")
      setRole(null)
      setOrganization(null)
      setFormError("")
      toastManager.add({
        title: "Signatory added",
        description: `${name.trim()} is now ${signatoryRoleLabel(role)} for ${organization.label}.`,
        type: "success",
      })
    } catch (error) {
      toastManager.add({
        title: "Could not add signatory",
        description: error instanceof Error ? error.message : "Request failed.",
        type: "error",
      })
    }
  }

  async function handleCsvImport() {
    const { payloads, errors } = buildPayloadsFromCsv()
    if (errors.length > 0 && payloads.length === 0) {
      setCsvError(errors[0])
      return
    }
    if (payloads.length === 0) {
      setCsvError("No valid signatory rows to import.")
      return
    }

    const result = await bulkCreate.mutateAsync(payloads)
    const failed = result.failed.length + errors.length
    if (result.created.length > 0 && failed === 0) {
      toastManager.add({
        title: "Signatories added",
        description: `Created ${result.created.length}.`,
        type: "success",
      })
    } else if (result.created.length > 0) {
      toastManager.add({
        title: "Partially added signatories",
        description: `Created ${result.created.length}. ${failed} skipped or failed.`,
        type: "warning",
      })
    } else {
      toastManager.add({
        title: "Could not add signatories",
        description: errors[0] ?? "Every row failed.",
        type: "error",
      })
    }

    if (result.created.length > 0) {
      setCsvOrganizations([])
      setCsvRecords([])
      setCsvFileName("")
      setCsvMode(null)
      setCsvError(errors.length > 0 ? errors.join(" ") : "")
    } else if (errors.length > 0) {
      setCsvError(errors.join(" "))
    }
  }

  const csvPreviewCount =
    csvMode === "records" ? csvRecords.length : csvOrganizations.length

  return (
    <div className="min-h-full w-full bg-background px-4 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <FormPageHeader
          subtitle="Register advisers, CDM, and deans. Each record writes GSI4 as ROLE#{ROLE}#ORG#{organization_id}."
          title="Signatories"
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Add signatory</CardTitle>
              <CardDescription>
                Required fields: <code>name</code>, <code>role</code>, and{" "}
                <code>organization_id</code>.
              </CardDescription>
            </CardHeader>
            <Form className="contents" onSubmit={handleAddOne}>
              <CardPanel className="flex flex-col gap-4">
                <Field>
                  <FieldLabel htmlFor="signatory-name">Name</FieldLabel>
                  <Input
                    autoComplete="off"
                    id="signatory-name"
                    name="name"
                    onChange={(event) => {
                      setName(event.currentTarget.value)
                      if (formError) setFormError("")
                    }}
                    placeholder="Prof. Juan Dela Cruz"
                    required
                    type="text"
                    value={name}
                  />
                  <FieldDescription>
                    Matches <code>SIGNATORY.name</code>.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    itemToStringValue={(item) => item.value}
                    items={ROLE_ITEMS}
                    name="role"
                    onValueChange={(item) => {
                      setRole(item?.value ?? null)
                      if (formError) setFormError("")
                    }}
                    value={selectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectPopup>
                      {ROLE_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <FieldDescription>
                    <code>adviser</code>, <code>cdm</code>, or <code>dean</code>.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Organization</FieldLabel>
                  <Combobox
                    disabled={organizations.length === 0}
                    itemToStringLabel={(item) => item.label}
                    itemToStringValue={(item) => item.value}
                    items={orgItems}
                    onValueChange={(value) => {
                      setOrganization(value)
                      if (formError) setFormError("")
                    }}
                    value={organization}
                  >
                    <ComboboxInput
                      placeholder={
                        organizations.length === 0
                          ? "Add an organization first"
                          : "Search organizations"
                      }
                      showClear
                    />
                    <ComboboxPopup>
                      <ComboboxEmpty>No organizations found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxPopup>
                  </Combobox>
                  <FieldDescription>
                    Links GSI4 to <code>ORGANIZATION#uuid</code>.
                  </FieldDescription>
                </Field>

                {organizations.length === 0 && !orgsQuery.isLoading ? (
                  <Alert variant="warning">
                    <AlertTitle>No organizations registered</AlertTitle>
                    <AlertDescription>
                      Add organizations before assigning signatories.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {formError ? (
                  <Alert variant="error">
                    <CircleAlertIcon />
                    <AlertTitle>Missing fields</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}
              </CardPanel>
              <CardFooter className="justify-end">
                <Button
                  disabled={organizations.length === 0}
                  loading={createSignatory.isPending}
                  type="submit"
                >
                  <PlusIcon aria-hidden="true" />
                  Add signatory
                </Button>
              </CardFooter>
            </Form>
            <Separator />
            <CardHeader>
              <CardTitle>Import CSV</CardTitle>
              <CardDescription>
                One column of organization names (uses the name and role above),
                or three columns: name, role, organization.
              </CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-4">
              <CsvFileField
                description="One organization per row, or name,role,organization."
                error={csvError}
                fileName={csvFileName}
                id="signatories-csv"
                onFile={(file, text) => {
                  if (!file) {
                    setCsvOrganizations([])
                    setCsvRecords([])
                    setCsvFileName("")
                    setCsvMode(null)
                    setCsvError("")
                    return
                  }
                  const parsed = parseSignatoryCsv(text)
                  setCsvFileName(file.name)
                  setCsvMode(parsed.mode)
                  setCsvOrganizations(parsed.organizations)
                  setCsvRecords(parsed.records)
                  setCsvError(parsed.errors[0] ?? "")
                }}
              />
              {csvPreviewCount > 0 ? (
                <Alert variant="info">
                  <AlertTitle>
                    {csvMode === "records"
                      ? `${csvRecords.length} signatory row${csvRecords.length === 1 ? "" : "s"}`
                      : `${csvOrganizations.length} organization${csvOrganizations.length === 1 ? "" : "s"}`}
                  </AlertTitle>
                  <AlertDescription>
                    {csvMode === "organizations"
                      ? "Each organization will receive the name and role entered above."
                      : "Each row includes its own name, role, and organization."}
                  </AlertDescription>
                </Alert>
              ) : null}
            </CardPanel>
            <CardFooter className="justify-between gap-2">
              <Button
                onClick={() =>
                  downloadCsvTemplate(
                    "signatory-organizations.csv",
                    "organization\nMapua Computing Society\nIEEE Mapua\n"
                  )
                }
                type="button"
                variant="ghost"
              >
                <DownloadIcon aria-hidden="true" />
                Template
              </Button>
              <Button
                disabled={csvPreviewCount === 0}
                loading={bulkCreate.isPending}
                onClick={handleCsvImport}
                type="button"
                variant="outline"
              >
                Import CSV
              </Button>
            </CardFooter>
          </Card>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Organizations and roles</CardTitle>
              <CardDescription>
                {orgsQuery.isLoading || signatoriesQuery.isLoading
                  ? "Loading…"
                  : `${organizations.length} organization${
                      organizations.length === 1 ? "" : "s"
                    } · ${signatories.length} signator${
                      signatories.length === 1 ? "y" : "ies"
                    }`}
              </CardDescription>
              <CardAction>
                <Input
                  aria-label="Search organizations and signatories"
                  className="w-full min-w-0 sm:w-56"
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder="Search org or signatory"
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
              ) : orgRows.length === 0 ? (
                <Empty className="py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <StampIcon aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>No organizations yet</EmptyTitle>
                    <EmptyDescription>
                      Register organizations first, then assign adviser, CDM, and
                      dean roles.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button render={<Link to="/admin/organizations" />}>
                      Add organizations
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Adviser</TableHead>
                      <TableHead>CDM</TableHead>
                      <TableHead>Dean</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-muted-foreground" colSpan={4}>
                          No rows match “{search}”.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row) => (
                        <TableRow key={row.organization_id}>
                          <TableCell className="whitespace-normal">
                            <div className="font-medium">{row.name}</div>
                            <Badge className="mt-1" variant="outline">
                              {row.organization_id}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <RoleCell people={row.adviser} />
                          </TableCell>
                          <TableCell>
                            <RoleCell people={row.cdm} />
                          </TableCell>
                          <TableCell>
                            <RoleCell people={row.dean} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardPanel>
          </Card>
        </div>
      </div>
    </div>
  )
}
