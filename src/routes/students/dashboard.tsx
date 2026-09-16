import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  Megaphone,
  AlertTriangle,
  FileText,
  Folder,
  Cloud,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Bell,
} from "lucide-react"

import { SubmissionTrackerModal } from "@/components/org/SubmissionTrackerModal"
import { layout } from "@/config"
import {
  useCurrentOrganizationQuery,
  useOrgAnnouncementsQuery,
  useOrgDeadlinesQuery,
  useOrgSubmissionsQuery,
} from "@/hooks/use-submissions"
import {
  apiDeadlinesToReminders,
  apiSubmissionToDashboardRow,
  formatDisplayDateTime,
  formatDocumentId,
} from "@/lib/dynamodb-adapters"
import { cn } from "@/lib/utils"

export function OrgDashboard() {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<{
    eventId: string
    submissionId: string
  } | null>(null)
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(true)
  const [dismissedReminderIds, setDismissedReminderIds] = useState<string[]>([])

  const organizationQuery = useCurrentOrganizationQuery()
  const submissionsQuery = useOrgSubmissionsQuery()
  const announcementsQuery = useOrgAnnouncementsQuery()
  const deadlinesQuery = useOrgDeadlinesQuery()

  const submissions = useMemo(
    () =>
      (submissionsQuery.data || []).map((sub) =>
        apiSubmissionToDashboardRow(sub, organizationQuery.data?.signatories)
      ),
    [submissionsQuery.data, organizationQuery.data?.signatories]
  )
  const announcements = announcementsQuery.data || []

  const reminders = useMemo(() => {
    const items = apiDeadlinesToReminders(
      deadlinesQuery.data || [],
      submissionsQuery.data || []
    )
    return items.filter((item) => !dismissedReminderIds.includes(item.id))
  }, [deadlinesQuery.data, dismissedReminderIds, submissionsQuery.data])

  const importantReminders = reminders.filter((item) => item.section === "Important")
  const upcomingReminders = reminders.filter((item) => item.section === "Upcoming")

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
        return "text-[#10B981] bg-emerald-50"
      case "under review":
        return "text-[#3B82F6] bg-blue-50"
      case "submitted":
      case "pending":
        return "text-[#F59E0B] bg-amber-50"
      case "denied":
      case "rejected":
        return "text-[#D9291C] bg-red-50"
      case "returned":
        return "text-[#F59E0B] bg-amber-50"
      default:
        return "text-[#64748B] bg-neutral-100"
    }
  }

  const openTracker = (eventId: string, submissionId: string) => {
    setSelectedKeys({ eventId, submissionId })
    setIsTrackerOpen(true)
  }

  return (
    <div className={cn(layout.page, layout.stack)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            {organizationQuery.data?.name || "Organization"} Dashboard
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Overview of active submittals, official announcements, and reminders timeline
          </p>
        </div>

        <Link
          to="/students/submissions"
          className="bg-[#1E293B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <span>Create Project/Event</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className={cn("grid grid-cols-1 items-start xl:grid-cols-3", layout.gap)}>
        <div className={cn("xl:col-span-2", layout.stack)}>
          <div className={layout.section}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#D9291C] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
                    Announcements & Bulletins
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Important notices and policy updates from administration
                  </p>
                </div>
              </div>
            </div>

            {announcementsQuery.isLoading ? (
              <div className="rounded-xl bg-[#F8FAFC] p-8 text-center text-xs font-semibold text-[#94A3B8]">
                Loading announcements…
              </div>
            ) : announcementsQuery.isError ? (
              <div className="rounded-xl bg-red-50 p-8 text-center text-xs font-semibold text-[#D9291C]">
                Could not load announcements.
              </div>
            ) : announcements.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAFC] p-8 text-center text-xs font-semibold text-[#94A3B8]">
                No announcements at this time
              </div>
            ) : (
              <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1 scrollbar-thin">
                {announcements.map((announcement) => (
                  <article
                    key={announcement.sent_at}
                    className="rounded-xl bg-[#F8FAFC] px-4 py-3.5"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      {formatDisplayDateTime(announcement.sent_at)}
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[#1E293B]">
                      {announcement.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className={cn(layout.section, "overflow-hidden")}>
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
                Project Status & Submissions
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Track current signatory routing and approval statuses
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider border-b border-neutral-100">
                    <th className="pb-3 pr-4 font-bold">DOCUMENT ID</th>
                    <th className="pb-3 pr-6 font-bold">EVENT TITLE</th>
                    <th className="pb-3 pr-4 font-bold">CLASSIFICATION</th>
                    <th className="pb-3 pr-4 font-bold">CURRENT SIGNATORY</th>
                    <th className="pb-3 font-bold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {submissionsQuery.isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm font-semibold text-[#94A3B8]">
                        Loading submissions…
                      </td>
                    </tr>
                  ) : submissionsQuery.isError ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm font-semibold text-rose-600">
                        Could not load submissions.
                      </td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p className="text-sm font-bold text-[#1E293B]">No submissions yet</p>
                          <p className="text-xs text-[#94A3B8] mb-2">
                            Create your first activity proposal to start tracking approvals.
                          </p>
                          <Link
                            to="/students/submissions"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D9291C] hover:bg-[#B81F14] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                          >
                            <span>+ Create Project / Event</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr
                        key={`${sub.event_id}:${sub.submission_id}`}
                        className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                        onClick={() => openTracker(sub.event_id, sub.submission_id)}
                      >
                        <td
                          className="py-3.5 pr-4 font-mono text-xs text-[#1E293B] font-bold whitespace-nowrap group-hover:text-[#D9291C]"
                          title={sub.submission_id}
                        >
                          {formatDocumentId(sub.submission_id)}
                        </td>
                        <td className="py-3.5 pr-6 text-xs text-[#1E293B] font-semibold">
                          {sub.activity_details.title}
                          {sub.requires_venue && (
                            <span className="ml-2 text-[10px] text-[#3B82F6] font-normal">
                              ({sub.activity_details.venue})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-[#64748B] capitalize">
                          {sub.activity_classification}
                        </td>
                        <td className="py-3.5 pr-4 text-xs font-medium text-[#475569]">
                          {sub.current_signatory}
                        </td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md ${getStatusTextColor(sub.status)}`}
                          >
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={layout.section}>
            <h2 className="text-base font-bold text-[#1E293B] mb-4">Resource Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                className="flex items-center gap-3 text-left cursor-pointer group hover:bg-neutral-50 p-2 rounded-xl transition-colors"
              >
                <FileText className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#3B82F6] transition-colors" />
                <span className="text-xs sm:text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">
                  Official Templates
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-left cursor-pointer group hover:bg-neutral-50 p-2 rounded-xl transition-colors"
              >
                <Folder className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#F59E0B] transition-colors" />
                <span className="text-xs sm:text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">
                  Governance and Documentation
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-left cursor-pointer group hover:bg-neutral-50 p-2 rounded-xl transition-colors"
              >
                <Cloud className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#10B981] transition-colors" />
                <span className="text-xs sm:text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">
                  Shared Drive
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={cn("xl:col-span-1", layout.stack)}>
          <div className={layout.section}>
            <div
              onClick={() => setIsRemindersExpanded(!isRemindersExpanded)}
              className="flex items-center justify-between cursor-pointer group select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-red-50 text-[#D9291C] flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1E293B] group-hover:text-[#D9291C] transition-colors">
                    Timeline Reminders
                  </h2>
                  <p className="text-[11px] text-[#94A3B8]">Institutional action items timeline</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {reminders.length > 0 && (
                  <span className="bg-red-50 text-[#D9291C] text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-red-200/60">
                    {reminders.length}
                  </span>
                )}
                {isRemindersExpanded ? (
                  <ChevronUp className="w-5 h-5 text-[#94A3B8] group-hover:text-[#1E293B] transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#94A3B8] group-hover:text-[#1E293B] transition-colors" />
                )}
              </div>
            </div>

            {isRemindersExpanded && (
              <div className="mt-4 pt-3 border-t border-neutral-100 max-h-[560px] overflow-y-auto pr-2 scrollbar-thin">
                {deadlinesQuery.isLoading ? (
                  <div className="p-8 text-center text-xs text-[#94A3B8]">Loading deadlines…</div>
                ) : reminders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#94A3B8] bg-[#F8FAFC] rounded-xl border border-neutral-100 flex flex-col items-center justify-center gap-1.5">
                    <Bell className="w-6 h-6 text-neutral-300 mb-1" />
                    <p className="font-bold text-[#1E293B]">No reminders at this time</p>
                    <p className="text-[11px] text-[#64748B]">
                      Upcoming action items and deadline alerts will appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    {importantReminders.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          <h3 className="text-lg font-light text-[#D9291C] font-sans tracking-wide">
                            Important
                          </h3>
                        </div>
                        <div className="border-l-2 border-red-300 ml-1.5 pl-4 space-y-6">
                          {importantReminders.map((item) => (
                            <div
                              key={item.id}
                              className="relative flex items-start justify-between gap-3 group"
                            >
                              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-md bg-white border border-red-300 flex items-center justify-center text-red-600 shadow-2xs">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1 pl-1">
                                <span className="text-[11px] text-[#64748B] italic block mb-0.5 font-sans">
                                  {item.dateStr}
                                </span>
                                <h4 className="text-xs font-bold text-[#1E293B] leading-tight tracking-tight uppercase">
                                  {item.title}{" "}
                                  <span className="text-neutral-500 font-semibold font-mono">
                                    ({item.code})
                                  </span>
                                </h4>
                                <p className="text-xs text-red-600 font-semibold mt-1 leading-snug">
                                  {item.statusText}
                                </p>
                                <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                                  Due Date: {item.dueDateText}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  setDismissedReminderIds((prev) => [...prev, item.id])
                                }
                                className="bg-neutral-200/80 hover:bg-neutral-300 text-[#475569] font-bold text-[11px] px-3 py-1 rounded transition-all cursor-pointer shrink-0 mt-1"
                              >
                                Dismiss
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {upcomingReminders.length > 0 && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full border-2 border-neutral-400 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div>
                          </div>
                          <h3 className="text-lg font-light text-[#475569] font-sans tracking-wide">
                            Upcoming
                          </h3>
                        </div>
                        <div className="border-l-2 border-neutral-200 ml-1.5 pl-4 space-y-6">
                          {upcomingReminders.map((item) => (
                            <div
                              key={item.id}
                              className="relative flex items-start justify-between gap-3 group"
                            >
                              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-md bg-white border border-neutral-300 flex items-center justify-center text-[#64748B] shadow-2xs">
                                <CheckSquare className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1 pl-1">
                                <span className="text-[11px] text-[#64748B] italic block mb-0.5 font-sans">
                                  {item.dateStr}
                                </span>
                                <h4 className="text-xs font-bold text-[#1E293B] leading-tight tracking-tight uppercase">
                                  {item.title}{" "}
                                  <span className="text-neutral-500 font-semibold font-mono">
                                    ({item.code})
                                  </span>
                                </h4>
                                <p className="text-xs text-[#334155] font-semibold mt-1 leading-snug">
                                  {item.statusText}
                                </p>
                                <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                                  Due Date: {item.dueDateText}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  setDismissedReminderIds((prev) => [...prev, item.id])
                                }
                                className="bg-neutral-200/80 hover:bg-neutral-300 text-[#475569] font-bold text-[11px] px-3 py-1 rounded transition-all cursor-pointer shrink-0 mt-1"
                              >
                                Dismiss
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SubmissionTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false)
          setSelectedKeys(null)
        }}
        eventId={selectedKeys?.eventId}
        submissionId={selectedKeys?.submissionId}
      />
    </div>
  )
}
