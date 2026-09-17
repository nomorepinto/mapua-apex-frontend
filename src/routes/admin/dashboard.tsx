import { useMemo, useState, type FormEvent } from "react"
import { CircleAlertIcon, PlusIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
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
import { layout, modal } from "@/config"
import { cn } from "@/lib/utils"
import {
  useAdminAnnouncementsQuery,
  useAdminSubmissionDetailQuery,
  useAdminSubmissionsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useSignatoriesQuery,
} from "@/hooks/use-admin"
import {
  apiNotificationsToStepper,
  apiSubmissionToDashboardRow,
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

export function AdminOsaPanel() {
  const [status, setStatus] = useState<"" | "pending" | "approved" | "denied" | "returned">("")
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
  const submissionsQuery = useAdminSubmissionsQuery({
    status: status || undefined,
    activity_type: activityType || undefined,
  })
  const announcementsQuery = useAdminAnnouncementsQuery()
  const detailQuery = useAdminSubmissionDetailQuery(
    selectedKeys?.eventId,
    selectedKeys?.submissionId
  )
  const createAnnouncement = useCreateAnnouncementMutation()
  const updateAnnouncement = useUpdateAnnouncementMutation()
  const deleteAnnouncement = useDeleteAnnouncementMutation()

  const rows = useMemo(
    () =>
      (submissionsQuery.data || []).map((sub) =>
        apiSubmissionToDashboardRow(sub, signatoriesQuery.data)
      ),
    [submissionsQuery.data, signatoriesQuery.data]
  )
  const announcements = announcementsQuery.data || []

  const selectedRow = detailQuery.data
    ? apiSubmissionToDashboardRow(detailQuery.data, signatoriesQuery.data)
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
        error instanceof Error ? error.message : "Could not post this announcement."
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
        error instanceof Error ? error.message : "Could not save this announcement."
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
        error instanceof Error ? error.message : "Could not delete this announcement."
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
          <div className="mb-5 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">Submissions</h2>
              <p className="text-xs text-neutral-500">
                Filter by status or activity type, then open a row for the full SAAF record.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-col gap-1 text-xs font-bold text-neutral-500">
                Status
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as "" | "pending" | "approved" | "denied" | "returned"
                    )
                  }
                  className="h-10 min-w-40 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-900"
                >
                  {STATUS_FILTERS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold text-neutral-500">
                Activity type
                <select
                  value={activityType}
                  onChange={(event) => setActivityType(event.target.value)}
                  className="h-10 min-w-44 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-900"
                >
                  {TYPE_FILTERS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className={cn("min-h-0 flex-1", layout.tableWrap)}>
            <Table className={layout.table}>
              <TableHeader>
                <TableRow className="border-b border-neutral-200 text-neutral-500">
                  <TableHead className="text-xs font-bold uppercase">Event</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Type</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Submitted</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-sm text-neutral-400">
                      Loading submissions…
                    </TableCell>
                  </TableRow>
                ) : submissionsQuery.isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-sm text-rose-600">
                      Could not load submissions.
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-sm text-neutral-400">
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
                      <TableCell className="text-xs capitalize text-neutral-500">
                        {row.activity_classification}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">
                        {row.submitted_date}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">{row.status}</TableCell>
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
              <h2 className="text-lg font-extrabold text-neutral-900">Announcements</h2>
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
                  <TableHead className="text-xs font-bold uppercase">Posted</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Notice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcementsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-12 text-center text-sm text-neutral-400">
                      Loading announcements…
                    </TableCell>
                  </TableRow>
                ) : announcementsQuery.isError ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-12 text-center text-sm text-rose-600">
                      Could not load announcements.
                    </TableCell>
                  </TableRow>
                ) : announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-12 text-center text-sm text-neutral-400">
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
                      <TableCell className="whitespace-nowrap text-sm text-neutral-500">
                        {formatDisplayDateTime(announcement.sent_at)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        <p className="line-clamp-2 whitespace-normal">{announcement.content}</p>
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
        <DialogPopup className={cn(modal.dialog, "max-w-3xl")}>
          <DialogHeader>
            <DialogTitle>{selectedRow?.activity_details.title || "Submission detail"}</DialogTitle>
            <DialogDescription>
              {selectedRow
                ? `${formatDocumentId(selectedRow.submission_id)} • ${selectedRow.status} • ${selectedRow.current_signatory}`
                : "Loading the full SAAF record and notifications."}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="flex flex-col gap-5 text-sm">
            {detailQuery.isLoading ? (
              <p className="text-neutral-500">Loading record…</p>
            ) : detailQuery.isError ? (
              <p className="font-semibold text-rose-600">Could not load this submission.</p>
            ) : selectedRow ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <p>
                    <span className="font-bold">Venue:</span> {selectedRow.activity_details.venue}
                  </p>
                  <p>
                    <span className="font-bold">Date:</span> {selectedRow.activity_details.date}
                  </p>
                  <p>
                    <span className="font-bold">Budget:</span> {selectedRow.activity_details.budget}
                  </p>
                  <p>
                    <span className="font-bold">Submitted:</span> {selectedRow.submitted_date}
                  </p>
                </div>
                <p className="leading-relaxed text-neutral-700">
                  {selectedRow.activity_details.description || "No description provided."}
                </p>
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Notifications
                  </h3>
                  {stepper.assigneesList.length === 0 ? (
                    <p className="text-neutral-400">No review notifications yet.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {stepper.assigneesList.map((item, index) => (
                        <li key={`${item.role}-${index}`}>
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-neutral-500"> — {item.statusText}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : null}
          </DialogPanel>
          <div className="flex justify-end px-6 pb-5">
            <DialogClose className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white">
              Close
            </DialogClose>
          </div>
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
                {editing ? `Posted ${formatDisplayDateTime(editing.sent_at)}` : "Update this notice."}
              </DialogDescription>
            </DialogHeader>
            <DialogPanel className="flex flex-col gap-4">
              <Field data-invalid={editError ? true : undefined}>
                <FieldLabel htmlFor="edit-announcement-content">Content</FieldLabel>
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
              This notice will be removed from the bulletin. This cannot be undone.
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
