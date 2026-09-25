import { useMemo, useState, type FormEvent } from "react"
import { CircleAlertIcon, PlusIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
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
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toastManager } from "@/components/ui/toast"
import { brand, layout, modal } from "@/config"
import { cn } from "@/lib/utils"
import {
  useAdminAnnouncementsQuery,
  useAdminSubmissionDetailQuery,
  useAdminSubmissionsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useOrganizationsQuery,
  useSignatoriesQuery,
} from "@/hooks/use-admin"
import {
  apiNotificationsToStepper,
  apiSubmissionToDashboardRow,
  submissionOrganizationId,
  formatDisplayDateTime,
  formatDocumentId,
  type ApiAnnouncement,
} from "@/lib/dynamodb-adapters"

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Under Review" },
  { value: "returned", label: "Returned" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
] as const

const TYPE_FILTERS = [
  { value: "", label: "All types" },
  { value: "extra-curricular", label: "Extra-curricular" },
  { value: "co-curricular", label: "Co-curricular" },
  { value: "curricular", label: "Curricular" },
] as const

const ANNOUNCEMENT_MAX = 5000
const FILTER_LABEL_CLASS =
  "flex w-full flex-col gap-1 text-xs font-bold text-neutral-500 sm:w-44"
const FILTER_SELECT_CLASS =
  "h-10 min-w-0 rounded-xl border-neutral-200 bg-white text-sm font-semibold text-neutral-900"

type FilterOption = { value: string; label: string }

function FilterSelect({
  id,
  items,
  onValueChange,
  value,
}: {
  id: string
  items: readonly FilterOption[]
  onValueChange: (value: string) => void
  value: string
}) {
  const selected = items.find((item) => item.value === value) ?? null

  return (
    <Select
      itemToStringValue={(item) => item.value}
      items={items}
      onValueChange={(item) => onValueChange(item?.value ?? "")}
      value={selected}
    >
      <SelectTrigger id={id} className={FILTER_SELECT_CLASS}>
        <SelectValue />
      </SelectTrigger>
      <SelectPopup className="bg-white text-neutral-900">
        {items.map((item) => (
          <SelectItem
            key={item.value || "all"}
            value={item}
            className="text-neutral-900 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-900"
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

export function AdminOsaPanel() {
  const [organizationId, setOrganizationId] = useState("")
  const [status, setStatus] = useState<
    "" | "pending" | "approved" | "denied" | "returned"
  >("")
  const [activityType, setActivityType] = useState("")
  const [selectedKeys, setSelectedKeys] = useState<{
    eventId: string
    submissionId: string
  } | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createContent, setCreateContent] = useState("")
  const [createError, setCreateError] = useState("")
  const [editing, setEditing] = useState<ApiAnnouncement | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editError, setEditError] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const signatoriesQuery = useSignatoriesQuery()
  const organizationsQuery = useOrganizationsQuery()
  const submissionsQuery = useAdminSubmissionsQuery({
    status: status || undefined,
    activity_type: activityType || undefined,
    organization_id: organizationId || undefined,
  })
  const announcementsQuery = useAdminAnnouncementsQuery()
  const detailQuery = useAdminSubmissionDetailQuery(
    selectedKeys?.eventId,
    selectedKeys?.submissionId
  )
  const createAnnouncement = useCreateAnnouncementMutation()
  const updateAnnouncement = useUpdateAnnouncementMutation()
  const deleteAnnouncement = useDeleteAnnouncementMutation()

  const organizations = useMemo(
    () =>
      [...(organizationsQuery.data || [])].sort((left, right) =>
        left.name.localeCompare(right.name, undefined, { sensitivity: "base" })
      ),
    [organizationsQuery.data]
  )
  const rows = useMemo(() => {
    const selectedOrganization = organizationId.replace(/^ORGANIZATION#/i, "")

    return (submissionsQuery.data || [])
      .filter((submission) => {
        if (!selectedOrganization) return true
        return submissionOrganizationId(submission) === selectedOrganization
      })
      .map((submission) =>
        apiSubmissionToDashboardRow(
          submission,
          signatoriesQuery.data,
          organizations
        )
      )
  }, [
    organizationId,
    organizations,
    signatoriesQuery.data,
    submissionsQuery.data,
  ])
  const announcements = announcementsQuery.data || []

  const selectedRow = detailQuery.data
    ? apiSubmissionToDashboardRow(
        detailQuery.data,
        signatoriesQuery.data,
        organizations
      )
    : null
  const stepper = apiNotificationsToStepper(
    detailQuery.data?.notifications || [],
    detailQuery.data?.current_signatory,
    detailQuery.data?.status,
    {
      activityType: detailQuery.data?.activity_classification?.activity_type,
      hasVenue: Boolean(detailQuery.data?.venue_reservation?.has_reservation),
      orgSignatories: signatoriesQuery.data,
    }
  )

  function openCreate() {
    setCreateContent("")
    setCreateError("")
    setCreateOpen(true)
  }

  function openEdit(announcement: ApiAnnouncement) {
    setEditing(announcement)
    setEditContent(announcement.content)
    setEditError("")
    setDeleteError("")
  }

  function closeEdit() {
    setEditing(null)
    setEditContent("")
    setEditError("")
    setDeleteOpen(false)
    setDeleteError("")
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = createContent.trim()
    if (!content) {
      setCreateError("Content is required.")
      return
    }

    try {
      await createAnnouncement.mutateAsync(content)
      toastManager.add({
        title: "Announcement posted",
        description: "The notice is now on the bulletin.",
        type: "success",
      })
      setCreateOpen(false)
      setCreateContent("")
      setCreateError("")
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "Could not post this announcement."
      )
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing) return
    const content = editContent.trim()
    if (!content) {
      setEditError("Content is required.")
      return
    }

    try {
      await updateAnnouncement.mutateAsync({ sentAt: editing.sent_at, content })
      toastManager.add({
        title: "Announcement updated",
        description: "The notice content was replaced.",
        type: "success",
      })
      closeEdit()
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Could not save this announcement."
      )
    }
  }

  async function handleDelete() {
    if (!editing) return

    try {
      await deleteAnnouncement.mutateAsync(editing.sent_at)
      toastManager.add({
        title: "Announcement deleted",
        description: "The notice was removed from the bulletin.",
        type: "success",
      })
      closeEdit()
    } catch (error) {
      setDeleteOpen(false)
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Could not delete this announcement."
      )
    }
  }

  return (
    <div className={layout.page}>
      <div className={cn(layout.container, layout.stack)}>
        <div>
          <h1 className={layout.pageTitle}>
            Admin Panel — Office of Student Affairs
          </h1>
          <p className={layout.pageSubtitle}>
            Global submissions and announcements across every organization.
          </p>
        </div>

        <section className={layout.section}>
          <div className="mb-5 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 sm:max-w-sm">
              <h2 className="text-lg font-extrabold text-neutral-900">
                Submissions
              </h2>
              <p className="text-xs text-neutral-500">
                Filter by organization, status, or activity type, then open a
                row for the full SAAF record.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className={FILTER_LABEL_CLASS}>
                  <label htmlFor="status-filter">Status</label>
                  <FilterSelect
                    id="status-filter"
                    items={STATUS_FILTERS}
                    value={status}
                    onValueChange={(next) =>
                      setStatus(
                        next as
                          | ""
                          | "pending"
                          | "approved"
                          | "denied"
                          | "returned"
                      )
                    }
                  />
                </div>
                <div className={FILTER_LABEL_CLASS}>
                  <label htmlFor="activity-type-filter">Activity type</label>
                  <FilterSelect
                    id="activity-type-filter"
                    items={TYPE_FILTERS}
                    value={activityType}
                    onValueChange={setActivityType}
                  />
                </div>
              </div>
              <div
                className={cn(FILTER_LABEL_CLASS, "sm:w-auto sm:self-stretch")}
              >
                <label htmlFor="organization-filter">Organization</label>
                <FilterSelect
                  id="organization-filter"
                  items={[
                    { value: "", label: "All organizations" },
                    ...organizations.map((organization) => ({
                      value: organization.organization_id,
                      label: organization.name,
                    })),
                  ]}
                  value={organizationId}
                  onValueChange={setOrganizationId}
                />
              </div>
            </div>
          </div>

          <div className={cn("min-h-0 flex-1", layout.tableWrap)}>
            <Table className={layout.table}>
              <TableHeader>
                <TableRow className="border-b border-neutral-200 text-neutral-500">
                  <TableHead className="text-xs font-bold uppercase">
                    Event
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase">
                    Organization
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase">
                    Submitted
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionsQuery.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-sm text-neutral-400"
                    >
                      Loading submissions…
                    </TableCell>
                  </TableRow>
                ) : submissionsQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-sm text-rose-600"
                    >
                      Could not load submissions.
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-sm text-neutral-400"
                    >
                      No submissions match these filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={`${row.event_id}:${row.submission_id}`}
                      className="cursor-pointer hover:bg-neutral-50"
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setSelectedKeys({
                          eventId: row.event_id,
                          submissionId: row.submission_id,
                        })
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          setSelectedKeys({
                            eventId: row.event_id,
                            submissionId: row.submission_id,
                          })
                        }
                      }}
                    >
                      <TableCell className="text-sm font-semibold">
                        {row.activity_details.title}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-700">
                        {row.organization_name}
                      </TableCell>
                      <TableCell className="text-xs text-neutral-500 capitalize">
                        {row.activity_classification}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">
                        {row.submitted_date}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">
                        {row.status}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className={layout.section}>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">
                Announcements
              </h2>
              <p className="text-xs text-neutral-500">
                Post a notice, or open a row to edit or delete it.
              </p>
            </div>
            <Button onClick={openCreate} type="button">
              <PlusIcon aria-hidden="true" />
              New announcement
            </Button>
          </div>
          <div className={layout.tableWrap}>
            <Table className={layout.table}>
              <TableHeader>
                <TableRow className="border-b border-neutral-200 text-neutral-500">
                  <TableHead className="text-xs font-bold uppercase">
                    Posted
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase">
                    Notice
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcementsQuery.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="py-12 text-center text-sm text-neutral-400"
                    >
                      Loading announcements…
                    </TableCell>
                  </TableRow>
                ) : announcementsQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="py-12 text-center text-sm text-rose-600"
                    >
                      Could not load announcements.
                    </TableCell>
                  </TableRow>
                ) : announcements.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="py-12 text-center text-sm text-neutral-400"
                    >
                      No announcements have been posted.
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((announcement) => (
                    <TableRow
                      key={announcement.sent_at}
                      className="cursor-pointer hover:bg-neutral-50"
                      role="button"
                      tabIndex={0}
                      onClick={() => openEdit(announcement)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          openEdit(announcement)
                        }
                      }}
                    >
                      <TableCell className="text-sm whitespace-nowrap text-neutral-500">
                        {formatDisplayDateTime(announcement.sent_at)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        <p className="line-clamp-2 whitespace-normal">
                          {announcement.content}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>

      <Dialog
        open={selectedKeys !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedKeys(null)
        }}
      >
        <DialogPopup
          className={cn(
            modal.dialog,
            "max-w-3xl overflow-x-hidden [&_button[aria-label=Close]]:text-white [&_button[aria-label=Close]]:hover:bg-white/15 [&_button[aria-label=Close]]:hover:text-white"
          )}
        >
          <DialogHeader className="shrink-0 rounded-t-2xl bg-[#8B0000] px-6 py-5 pb-6! text-white in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-6 max-sm:rounded-none">
            <div className="flex min-w-0 flex-wrap items-center gap-2 pe-8">
              {selectedRow ? (
                <span
                  className={cn(brand.chipGold, "max-w-full wrap-anywhere")}
                >
                  {selectedRow.organization_name || "Organization"}
                </span>
              ) : null}
              {selectedRow ? (
                <span className="rounded-sm bg-white/15 px-2.5 py-0.5 text-xs font-bold tracking-wide text-white uppercase">
                  {selectedRow.status}
                </span>
              ) : null}
            </div>
            <DialogTitle className="pe-8 text-xl font-extrabold tracking-tight wrap-anywhere text-white sm:text-2xl">
              {selectedRow?.activity_details.title || "Submission detail"}
            </DialogTitle>
            <DialogDescription className="wrap-anywhere text-[#FBC02D]">
              {selectedRow
                ? `${formatDocumentId(selectedRow.submission_id)} · ${selectedRow.current_signatory}`
                : "Loading the full SAAF record and notifications."}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="flex min-w-0 flex-col gap-5 overflow-x-hidden pt-6! text-sm in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-6">
            {detailQuery.isLoading ? (
              <p className="text-sm text-neutral-600">Loading record…</p>
            ) : detailQuery.isError ? (
              <p className="text-sm font-semibold text-rose-600">
                Could not load this submission.
              </p>
            ) : selectedRow ? (
              <>
                <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {[
                    ["Organization", selectedRow.organization_name || "—"],
                    ["Venue", selectedRow.activity_details.venue || "—"],
                    ["Date", selectedRow.activity_details.date || "—"],
                    ["Budget", selectedRow.activity_details.budget || "—"],
                    ["Submitted", selectedRow.submitted_date || "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="min-w-0 rounded-xl border border-neutral-200 bg-[#F8FAFC] px-3.5 py-3"
                    >
                      <dt className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
                        {label}
                      </dt>
                      <dd className="mt-1 font-semibold wrap-anywhere text-neutral-900">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <section className="min-w-0">
                  <h3 className="mb-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">
                    Description
                  </h3>
                  <div className="max-h-48 min-w-0 overflow-x-hidden overflow-y-auto overscroll-y-contain rounded-xl border border-neutral-200 bg-[#F8FAFC] p-4">
                    <p className="text-sm leading-relaxed wrap-anywhere whitespace-pre-wrap text-neutral-700">
                      {selectedRow.activity_details.description ||
                        "No description provided."}
                    </p>
                  </div>
                </section>
                <section className="min-w-0">
                  <h3 className="mb-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">
                    Notifications
                  </h3>
                  {stepper.assigneesList.length === 0 ? (
                    <p className="text-sm text-neutral-600">
                      No review notifications yet.
                    </p>
                  ) : (
                    <ul className="flex min-w-0 flex-col gap-2">
                      {stepper.assigneesList.map((item, index) => (
                        <li
                          key={`${item.role}-${index}`}
                          className="min-w-0 rounded-xl border border-neutral-200 px-3.5 py-3"
                        >
                          <p className="font-semibold wrap-anywhere text-neutral-900">
                            {item.name}
                          </p>
                          <p className="text-sm wrap-anywhere text-neutral-600">
                            {item.statusText}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            ) : null}
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) {
            setCreateContent("")
            setCreateError("")
          }
        }}
      >
        <DialogPopup className={modal.dialogMd}>
          <Form className="contents" onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>New announcement</DialogTitle>
              <DialogDescription>
                Posted notices are visible on the institutional bulletin.
              </DialogDescription>
            </DialogHeader>
            <DialogPanel className="flex flex-col gap-4">
              <Field data-invalid={createError ? true : undefined}>
                <FieldLabel htmlFor="announcement-content">Content</FieldLabel>
                <Textarea
                  aria-invalid={createError ? true : undefined}
                  id="announcement-content"
                  maxLength={ANNOUNCEMENT_MAX}
                  onChange={(event) => {
                    setCreateContent(event.currentTarget.value)
                    if (createError) setCreateError("")
                  }}
                  required
                  rows={6}
                  value={createContent}
                />
                <FieldDescription>
                  {createContent.length}/{ANNOUNCEMENT_MAX}
                </FieldDescription>
                {createError ? <FieldError>{createError}</FieldError> : null}
              </Field>
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="ghost" />}>
                Cancel
              </DialogClose>
              <Button loading={createAnnouncement.isPending} type="submit">
                Post announcement
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) closeEdit()
        }}
      >
        <DialogPopup className={modal.dialogMd}>
          <Form className="contents" onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit announcement</DialogTitle>
              <DialogDescription>
                {editing
                  ? `Posted ${formatDisplayDateTime(editing.sent_at)}`
                  : "Update this notice."}
              </DialogDescription>
            </DialogHeader>
            <DialogPanel className="flex flex-col gap-4">
              <Field data-invalid={editError ? true : undefined}>
                <FieldLabel htmlFor="edit-announcement-content">
                  Content
                </FieldLabel>
                <Textarea
                  aria-invalid={editError ? true : undefined}
                  id="edit-announcement-content"
                  maxLength={ANNOUNCEMENT_MAX}
                  onChange={(event) => {
                    setEditContent(event.currentTarget.value)
                    if (editError) setEditError("")
                  }}
                  required
                  rows={6}
                  value={editContent}
                />
                <FieldDescription>
                  {editContent.length}/{ANNOUNCEMENT_MAX}
                </FieldDescription>
                {editError ? <FieldError>{editError}</FieldError> : null}
              </Field>
              {deleteError ? (
                <Alert variant="error">
                  <CircleAlertIcon />
                  <AlertTitle>Could not delete</AlertTitle>
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              ) : null}
            </DialogPanel>
            <DialogFooter>
              <Button
                onClick={() => {
                  setDeleteError("")
                  setDeleteOpen(true)
                }}
                type="button"
                variant="destructive-outline"
              >
                Delete
              </Button>
              <DialogClose render={<Button type="button" variant="ghost" />}>
                Cancel
              </DialogClose>
              <Button loading={updateAnnouncement.isPending} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setDeleteError("")
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this announcement?</AlertDialogTitle>
            <AlertDialogDescription>
              This notice will be removed from the bulletin. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button type="button" variant="ghost" />}>
              Keep
            </AlertDialogClose>
            <Button
              loading={deleteAnnouncement.isPending}
              onClick={handleDelete}
              type="button"
              variant="destructive"
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  )
}
