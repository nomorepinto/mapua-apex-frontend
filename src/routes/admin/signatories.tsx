import { useMemo, useState } from "react"
import {
  CircleAlertIcon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  StampIcon,
} from "lucide-react"

import { CsvFileField } from "@/components/admin-osa/csv-file-field"
import {
  SIGNATORY_ROLE_ITEMS,
  compareSignatoriesByRole,
  signatoryRoleLabel,
  takenSingletonRoles,
  type SignatoryRoleValue,
} from "@/components/admin-osa/signatory-roles"
import { FormPageHeader } from "@/components/forms/form-page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { layout, modal } from "@/config"
import { cn } from "@/lib/utils"
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
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
  useSignatoriesQuery,
  useUpdateSignatoryMutation,
} from "@/hooks/use-admin"
import { DEPARTMENT_ITEMS, departmentLabel } from "@/lib/departments"
import {
  buildSignatoryPayload,
  type ApiSignatory,
} from "@/lib/dynamodb-adapters"
import {
  downloadCsvTemplate,
  parseSignatoryCsv,
  type SignatoryCsvRow,
} from "@/lib/parse-csv"

const EMPTY_SIGNATORIES: ApiSignatory[] = []

type RoleOption = { label: string; value: SignatoryRoleValue }

const ROLE_ITEMS: RoleOption[] = SIGNATORY_ROLE_ITEMS.map((item) => ({
  label: item.label,
  value: item.value,
}))
const DEPT_ITEMS = DEPARTMENT_ITEMS.map((item) => ({ ...item }))

type DepartmentOption = { label: string; value: string }

const NO_DEPARTMENT: DepartmentOption = {
  label: "No department",
  value: "",
}

const SIGNATORY_CSV_TEMPLATE =
  "name,role,department\nProf. Juan Dela Cruz,adviser,\nDean Maria Santos,dean,SOIT\nMaria Santos,admin,\nEngr. Leo Cruz,cdm,\nAtty. Kim Ramos,osaar,\n"

function departmentOption(code?: string | null): DepartmentOption | null {
  if (!code) {
    return null
  }
  const needle = code.trim().toUpperCase()
  return (
    DEPT_ITEMS.find((item) => item.value === needle) ?? {
      label: needle,
      value: needle,
    }
  )
}

function DepartmentSelect({
  items,
  onValueChange,
  value,
}: {
  items: DepartmentOption[]
  onValueChange: (value: DepartmentOption | null) => void
  value: DepartmentOption | null
}) {
  const selectItems = [NO_DEPARTMENT, ...items]
  const selected = value && value.value ? value : NO_DEPARTMENT

  return (
    <Field>
      <FieldLabel>Department</FieldLabel>
      <Select
        itemToStringValue={(item) => item.value}
        items={selectItems}
        name="department"
        onValueChange={(item) =>
          onValueChange(item && item.value ? item : null)
        }
        value={selected}
      >
        <SelectTrigger>
          <SelectValue placeholder="Optional" />
        </SelectTrigger>
        <SelectPopup>
          {selectItems.map((item) => (
            <SelectItem key={item.value || "none"} value={item}>
              {item.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <FieldDescription>
        Optional. Stored uppercase and used only for deans (
        <code>ROLE#DEAN#SOIT</code>).
      </FieldDescription>
    </Field>
  )
}

export function AdminSignatoriesPage() {
  const signatoriesQuery = useSignatoriesQuery()
  const createSignatory = useCreateSignatoryMutation()
  const updateSignatory = useUpdateSignatoryMutation()
  const bulkCreate = useBulkCreateSignatoriesMutation()

  const [name, setName] = useState("")
  const [role, setRole] = useState<SignatoryRoleValue | null>(null)
  const [department, setDepartment] = useState<DepartmentOption | null>(null)
  const [formError, setFormError] = useState("")
  const [csvError, setCsvError] = useState("")
  const [csvFileName, setCsvFileName] = useState("")
  const [csvRecords, setCsvRecords] = useState<SignatoryCsvRow[]>([])
  const [csvParseErrors, setCsvParseErrors] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<ApiSignatory | null>(null)
  const [editName, setEditName] = useState("")
  const [editRole, setEditRole] = useState<SignatoryRoleValue | null>(null)
  const [editDepartment, setEditDepartment] = useState<DepartmentOption | null>(
    null
  )
  const [editError, setEditError] = useState("")

  const signatories = signatoriesQuery.data ?? EMPTY_SIGNATORIES
  const takenRoles = takenSingletonRoles(signatories)

  const roleItems = useMemo(
    () => ROLE_ITEMS.filter((item) => !takenRoles.has(item.value)),
    [takenRoles]
  )
  const selectedRole = roleItems.find((item) => item.value === role) ?? null

  const editRoleItems = useMemo(() => {
    const taken = takenSingletonRoles(signatories, editing?.signatory_id)
    return ROLE_ITEMS.filter((item) => !taken.has(item.value))
  }, [editing?.signatory_id, signatories])
  const selectedEditRole =
    editRoleItems.find((item) => item.value === editRole) ?? null

  const departmentItems = useMemo(() => {
    if (
      department &&
      !DEPT_ITEMS.some((item) => item.value === department.value)
    ) {
      return [department, ...DEPT_ITEMS]
    }
    return DEPT_ITEMS
  }, [department])

  const editDepartmentItems = useMemo(() => {
    if (
      editDepartment &&
      !DEPT_ITEMS.some((item) => item.value === editDepartment.value)
    ) {
      return [editDepartment, ...DEPT_ITEMS]
    }
    return DEPT_ITEMS
  }, [editDepartment])

  const sortedSignatories = useMemo(
    () => [...signatories].sort(compareSignatoriesByRole),
    [signatories]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return sortedSignatories
    }
    return sortedSignatories.filter((person) => {
      const haystack = [
        person.name,
        person.signatory_id,
        person.role,
        signatoryRoleLabel(person.role),
        person.department ?? "",
        person.department ? departmentLabel(person.department) : "",
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [search, sortedSignatories])

  const csvPayloads = useMemo(() => {
    const payloads = []
    const errors: string[] = [...csvParseErrors]
    const singletonCounts: Record<string, number> = {
      admin: takenRoles.has("admin") ? 1 : 0,
      cdm: takenRoles.has("cdm") ? 1 : 0,
      osaar: takenRoles.has("osaar") ? 1 : 0,
    }

    for (const record of csvRecords) {
      if (record.role in singletonCounts) {
        singletonCounts[record.role] += 1
        if (singletonCounts[record.role] > 1) {
          errors.push(
            `${record.name}: ${signatoryRoleLabel(record.role)} is already registered. Only one is allowed.`
          )
          continue
        }
      }
      payloads.push(
        buildSignatoryPayload(record.name, record.role, record.department)
      )
    }

    return { payloads, errors }
  }, [csvParseErrors, csvRecords, takenRoles])

  function openEdit(person: ApiSignatory) {
    setEditing(person)
    setEditName(person.name)
    setEditRole(person.role)
    setEditDepartment(departmentOption(person.department))
    setEditError("")
  }

  async function handleAddOne(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !role) {
      setFormError("Name and role are required.")
      return
    }
    if (takenRoles.has(role)) {
      setFormError(
        `${signatoryRoleLabel(role)} is already registered. Only one is allowed.`
      )
      return
    }

    try {
      await createSignatory.mutateAsync(
        buildSignatoryPayload(name.trim(), role, department?.value)
      )
      const addedName = name.trim()
      const addedRole = role
      setName("")
      setRole(null)
      setDepartment(null)
      setFormError("")
      toastManager.add({
        title: "Signatory added",
        description: `${addedName} is now registered as ${signatoryRoleLabel(addedRole)}.`,
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
    const { payloads, errors } = csvPayloads
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
      setCsvRecords([])
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
    if (!editName.trim() || !editRole) {
      setEditError("Name and role are required.")
      return
    }

    const taken = takenSingletonRoles(signatories, editing.signatory_id)
    if (taken.has(editRole)) {
      setEditError(
        `${signatoryRoleLabel(editRole)} is already registered. Only one is allowed.`
      )
      return
    }

    try {
      await updateSignatory.mutateAsync({
        signatoryId: editing.signatory_id,
        ...buildSignatoryPayload(
          editName.trim(),
          editRole,
          editDepartment?.value
        ),
      })
      setEditing(null)
      toastManager.add({
        title: "Signatory updated",
        description: `${editName.trim()} was saved.`,
        type: "success",
      })
    } catch (error) {
      toastManager.add({
        title: "Could not update signatory",
        description: error instanceof Error ? error.message : "Request failed.",
        type: "error",
      })
    }
  }

  return (
    <div className={layout.page}>
      <div className={cn(layout.container, layout.stack)}>
        <FormPageHeader
          subtitle="Register deans, advisers, and the shared admin, CDM, and OSAAR accounts. Department applies only to deans."
          title="Signatories"
        />

        {signatoriesQuery.isError ? (
          <Alert variant="error">
            <CircleAlertIcon />
            <AlertTitle>Could not load signatories</AlertTitle>
            <AlertDescription>
              {signatoriesQuery.error instanceof Error
                ? signatoriesQuery.error.message
                : "The admin signatories list failed to load."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div
          className={cn(
            "grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]",
            layout.gap
          )}
        >
          <Card className={layout.card}>
            <CardHeader>
              <CardTitle>Add signatory</CardTitle>
              <CardDescription>
                Required fields: <code>name</code> and <code>role</code>.
                Department is optional for deans.
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
                </Field>

                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    itemToStringValue={(item) => item.value}
                    items={roleItems}
                    name="role"
                    onValueChange={(item) => {
                      const nextRole = item?.value ?? null
                      setRole(nextRole)
                      if (nextRole !== "dean") {
                        setDepartment(null)
                      }
                      if (formError) setFormError("")
                    }}
                    value={selectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectPopup>
                      {roleItems.map((item) => (
                        <SelectItem key={item.value} value={item}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <FieldDescription>
                    Dean, adviser, admin, CDM, or OSAAR. Admin, CDM, and OSAAR
                    are limited to one account each.
                  </FieldDescription>
                </Field>

                {role === "dean" ? (
                  <DepartmentSelect
                    items={departmentItems}
                    onValueChange={setDepartment}
                    value={department}
                  />
                ) : null}

                {takenRoles.size > 0 ? (
                  <Alert variant="info">
                    <AlertTitle>Shared accounts registered</AlertTitle>
                    <AlertDescription>
                      {[...takenRoles]
                        .map((item) => signatoryRoleLabel(item))
                        .join(", ")}{" "}
                      already exist and cannot be added again.
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
                <Button loading={createSignatory.isPending} type="submit">
                  <PlusIcon aria-hidden="true" />
                  Add signatory
                </Button>
              </CardFooter>
            </Form>
            <Separator />
            <CardHeader>
              <CardTitle>Import CSV</CardTitle>
              <CardDescription>
                Columns: name, role, and optional department for deans.
              </CardDescription>
            </CardHeader>
            <CardPanel className="flex flex-col gap-4">
              <CsvFileField
                description="name, role, department."
                error={csvError}
                fileName={csvFileName}
                id="signatories-csv"
                onFile={(file, text) => {
                  if (!file) {
                    setCsvRecords([])
                    setCsvParseErrors([])
                    setCsvFileName("")
                    setCsvError("")
                    return
                  }
                  const parsed = parseSignatoryCsv(text)
                  setCsvFileName(file.name)
                  setCsvRecords(parsed.records)
                  setCsvParseErrors(parsed.errors)
                  setCsvError(parsed.errors[0] ?? "")
                }}
              />
              {csvRecords.length > 0 ? (
                <Alert variant="info">
                  <AlertTitle>
                    {csvPayloads.payloads.length} signatory row
                    {csvPayloads.payloads.length === 1 ? "" : "s"}
                  </AlertTitle>
                  <AlertDescription>
                    Extra admin, CDM, or OSAAR rows are skipped. Department is
                    ignored unless the role is dean.
                  </AlertDescription>
                </Alert>
              ) : null}
            </CardPanel>
            <CardFooter className="justify-between gap-2">
              <Button
                onClick={() =>
                  downloadCsvTemplate("signatories.csv", SIGNATORY_CSV_TEMPLATE)
                }
                type="button"
                variant="ghost"
              >
                <DownloadIcon aria-hidden="true" />
                Template
              </Button>
              <Button
                disabled={csvPayloads.payloads.length === 0}
                loading={bulkCreate.isPending}
                onClick={handleCsvImport}
                type="button"
                variant="outline"
              >
                Import CSV
              </Button>
            </CardFooter>
          </Card>

          <Card className={cn(layout.card, "min-w-0")}>
            <CardHeader>
              <CardTitle>Registered signatories</CardTitle>
              <CardDescription>
                {signatoriesQuery.isLoading
                  ? "Loading…"
                  : `${signatories.length} signator${
                      signatories.length === 1 ? "y" : "ies"
                    } · sorted by role · use Edit to update a row`}
              </CardDescription>
              <CardAction>
                <Input
                  aria-label="Search signatories"
                  className="w-full min-w-0 sm:w-56"
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder="Search name or role"
                  type="search"
                  value={search}
                />
              </CardAction>
            </CardHeader>
            <CardPanel className="p-0">
              {signatoriesQuery.isLoading ? (
                <div className="space-y-2 px-6 pb-6">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : signatories.length === 0 ? (
                <Empty className="py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <StampIcon aria-hidden="true" />
                    </EmptyMedia>
                    <EmptyTitle>No signatories yet</EmptyTitle>
                    <EmptyDescription>
                      Add a name and role on the left. Organizations need shared
                      admin, CDM, and OSAAR accounts before they can be
                      registered.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-7 md:pb-7">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="w-28 text-right">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className="text-muted-foreground"
                            colSpan={4}
                          >
                            No signatories match “{search}”.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.map((person) => (
                          <TableRow
                            className="cursor-pointer"
                            key={person.signatory_id}
                            onContextMenu={(event) => {
                              event.preventDefault()
                              openEdit(person)
                            }}
                          >
                            <TableCell className="font-medium whitespace-normal">
                              {person.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {signatoryRoleLabel(person.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {person.role === "dean" && person.department ? (
                                <Badge variant="outline">
                                  {person.department.toUpperCase()}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openEdit(person)}
                              >
                                <PencilIcon />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
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
        <DialogPopup className={modal.dialogMd}>
          <DialogHeader>
            <DialogTitle>Edit signatory</DialogTitle>
            <DialogDescription>
              The signatory ID cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <Form className="contents" onSubmit={handleEditSave}>
            <DialogPanel className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="edit-signatory-id">
                  Signatory ID
                </FieldLabel>
                <Input
                  disabled
                  id="edit-signatory-id"
                  readOnly
                  type="text"
                  value={editing?.signatory_id ?? ""}
                />
                <FieldDescription>Generated by the API.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-signatory-name">Name</FieldLabel>
                <Input
                  autoComplete="off"
                  id="edit-signatory-name"
                  onChange={(event) => {
                    setEditName(event.currentTarget.value)
                    if (editError) setEditError("")
                  }}
                  required
                  type="text"
                  value={editName}
                />
              </Field>
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  itemToStringValue={(item) => item.value}
                  items={editRoleItems}
                  onValueChange={(item) => {
                    const nextRole = item?.value ?? null
                    setEditRole(nextRole)
                    if (nextRole !== "dean") {
                      setEditDepartment(null)
                    }
                    if (editError) setEditError("")
                  }}
                  value={selectedEditRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectPopup>
                    {editRoleItems.map((item) => (
                      <SelectItem key={item.value} value={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </Field>
              {editRole === "dean" ? (
                <DepartmentSelect
                  items={editDepartmentItems}
                  onValueChange={setEditDepartment}
                  value={editDepartment}
                />
              ) : null}
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
              <Button loading={updateSignatory.isPending} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </div>
  )
}
