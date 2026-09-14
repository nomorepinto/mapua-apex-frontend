import { useMemo, useState } from "react"

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useAdminAppealsQuery,
  useAdminSubmissionDetailQuery,
  useAdminSubmissionsQuery,
} from "@/hooks/use-admin"
import {
  apiAppealToRow,
  apiNotificationsToStepper,
  apiSubmissionToDashboardRow,
  formatDisplayDate,
} from "@/lib/dynamodb-adapters"

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Returned" },
] as const

const TYPE_FILTERS = [
  { value: "", label: "All types" },
  { value: "extra-curricular", label: "Extra-curricular" },
  { value: "co-curricular", label: "Co-curricular" },
  { value: "curricular", label: "Curricular" },
] as const

export function AdminOsaPanel() {
  const [status, setStatus] = useState<"" | "pending" | "approved" | "denied">("")
  const [activityType, setActivityType] = useState("")
  const [selectedKeys, setSelectedKeys] = useState<{
    eventId: string
    submissionId: string
  } | null>(null)

  const submissionsQuery = useAdminSubmissionsQuery({
    status: status || undefined,
    activity_type: activityType || undefined,
  })
  const appealsQuery = useAdminAppealsQuery()
  const detailQuery = useAdminSubmissionDetailQuery(
    selectedKeys?.eventId,
    selectedKeys?.submissionId
  )

  const rows = useMemo(
    () => (submissionsQuery.data || []).map(apiSubmissionToDashboardRow),
    [submissionsQuery.data]
  )
  const appealRows = useMemo(
    () => (appealsQuery.data || []).map((appeal) => apiAppealToRow(appeal)),
    [appealsQuery.data]
  )

  const selectedRow = detailQuery.data
    ? apiSubmissionToDashboardRow(detailQuery.data)
    : null
  const stepper = apiNotificationsToStepper(
    detailQuery.data?.notifications || [],
    selectedRow?.current_signatory,
    selectedRow?.api_status
  )

  return (
    <div className="min-h-full w-full bg-[#F3F4F6] px-4 py-8 text-neutral-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="border-b border-neutral-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Admin Panel — Office of Student Affairs
          </h1>
          <p className="mt-1 text-xs font-normal text-neutral-500 sm:text-sm">
            Global submissions and appeals across every organization.
          </p>
        </div>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
                    setStatus(event.target.value as "" | "pending" | "approved" | "denied")
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

          <div className="overflow-x-auto">
            <Table className="min-w-[44rem]">
              <TableHeader>
                <TableRow className="border-b border-neutral-100 text-neutral-500">
                  <TableHead className="text-xs font-bold uppercase">Document</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Event</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Type</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Submitted</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-sm text-neutral-400">
                      Loading submissions…
                    </TableCell>
                  </TableRow>
                ) : submissionsQuery.isError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-sm text-rose-600">
                      Could not load submissions.
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-sm text-neutral-400">
                      No submissions match these filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={`${row.event_id}:${row.submission_id}`}
                      className="cursor-pointer hover:bg-neutral-50"
                      onClick={() =>
                        setSelectedKeys({
                          eventId: row.event_id,
                          submissionId: row.submission_id,
                        })
                      }
                    >
                      <TableCell className="font-mono text-xs font-bold">
                        {row.submission_id}
                      </TableCell>
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

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-neutral-900">Appeals</h2>
            <p className="text-xs text-neutral-500">
              All appeals filed against returned submissions.
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[40rem]">
              <TableHeader>
                <TableRow className="border-b border-neutral-100 text-neutral-500">
                  <TableHead className="text-xs font-bold uppercase">Appeal</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Submission</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Filed</TableHead>
                  <TableHead className="text-xs font-bold uppercase">Desk</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appealsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-sm text-neutral-400">
                      Loading appeals…
                    </TableCell>
                  </TableRow>
                ) : appealRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-sm text-neutral-400">
                      No appeals have been filed.
                    </TableCell>
                  </TableRow>
                ) : (
                  appealRows.map((appeal) => (
                    <TableRow
                      key={appeal.appeal_id}
                      className="cursor-pointer hover:bg-neutral-50"
                      onClick={() =>
                        setSelectedKeys({
                          eventId: appeal.event_id,
                          submissionId: appeal.submission_id,
                        })
                      }
                    >
                      <TableCell className="font-mono text-xs font-bold">
                        {appeal.appeal_id}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {appeal.title}
                        {appeal.comment ? (
                          <p className="mt-1 text-xs font-normal text-neutral-500">
                            {appeal.comment}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">{appeal.date}</TableCell>
                      <TableCell className="text-sm text-neutral-500">{appeal.department}</TableCell>
                      <TableCell className="text-right text-xs font-bold">{appeal.status}</TableCell>
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
        <DialogPopup className="flex max-h-[90dvh] w-full max-w-3xl flex-col">
          <DialogHeader>
            <DialogTitle>{selectedRow?.activity_details.title || "Submission detail"}</DialogTitle>
            <DialogDescription>
              {selectedRow
                ? `${selectedRow.submission_id} • ${selectedRow.status} • ${selectedRow.current_signatory}`
                : "Loading the full SAAF record, notifications, and appeals."}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="space-y-5 text-sm">
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
                    <ul className="space-y-2">
                      {stepper.assigneesList.map((item, index) => (
                        <li key={`${item.role}-${index}`}>
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-neutral-500"> — {item.statusText}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Appeals
                  </h3>
                  {(detailQuery.data?.appeals || []).length === 0 ? (
                    <p className="text-neutral-400">No appeals on this submission.</p>
                  ) : (
                    <ul className="space-y-2">
                      {detailQuery.data?.appeals.map((appeal) => (
                        <li key={appeal.appeal_id}>
                          <span className="font-semibold">{appeal.appeal_id}</span>
                          <span className="text-neutral-500">
                            {" "}
                            — {appeal.status}
                            {appeal.resolution ? ` (${appeal.resolution})` : ""} •{" "}
                            {formatDisplayDate(appeal.sent_at)}
                          </span>
                          <p className="text-neutral-600">{appeal.comment}</p>
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
    </div>
  )
}
