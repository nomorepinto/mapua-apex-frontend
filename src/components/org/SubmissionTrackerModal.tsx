import { useState } from "react"
import { useNavigate } from "react-router"
import { X, Check, FileText, CheckCircle2 } from "lucide-react"

import {
  useSubmissionDetailQuery,
  useSubmissionNotificationsQuery,
  useCurrentOrganizationQuery,
} from "@/hooks/use-submissions"
import {
  apiNotificationsToStepper,
  apiSubmissionToDashboardRow,
  formatDocumentId,
} from "@/lib/dynamodb-adapters"
import { useOrgStore } from "@/stores/org-store"
import { layout } from "@/config"
import { cn } from "@/lib/utils"

interface SubmissionTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  eventId?: string | null
  submissionId?: string | null
}

export function SubmissionTrackerModal({
  isOpen,
  onClose,
  eventId,
  submissionId,
}: SubmissionTrackerModalProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"details" | "progress">("details")

  const orgQuery = useCurrentOrganizationQuery()
  const detailQuery = useSubmissionDetailQuery(
    isOpen ? eventId || undefined : undefined,
    isOpen ? submissionId || undefined : undefined
  )
  const notificationsQuery = useSubmissionNotificationsQuery(
    isOpen ? eventId || undefined : undefined,
    isOpen ? submissionId || undefined : undefined
  )

  if (!isOpen || !eventId || !submissionId) return null

  const submission = detailQuery.data
    ? apiSubmissionToDashboardRow(detailQuery.data, orgQuery.data?.signatories)
    : null
  const stepper = apiNotificationsToStepper(
    notificationsQuery.data || [],
    detailQuery.data?.current_signatory,
    detailQuery.data?.status,
    {
      activityType: detailQuery.data?.activity_classification?.activity_type,
      hasVenue: Boolean(detailQuery.data?.venue_reservation?.has_reservation),
      orgSignatories: orgQuery.data?.signatories,
    }
  )
  const canResubmit =
    submission?.api_status === "pending" || submission?.api_status === "returned"
  const isDenied = submission?.api_status === "denied"

  const handleResubmit = () => {
    useOrgStore.getState().setEditingSubmission(eventId, submissionId)
    onClose()
    navigate(
      `/students/submissions/saaf?event=${encodeURIComponent(eventId)}&submission=${encodeURIComponent(submissionId)}`
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        <div className="px-8 pt-7 pb-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#D9291C] bg-red-50 px-2 py-0.5 rounded-md" title={submission?.id || submissionId}>
                {formatDocumentId(submission?.id || submissionId)}
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#475569] bg-neutral-100 px-2 py-0.5 rounded-md">
                {submission?.activity_classification || "saaf"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight">
              {detailQuery.isLoading
                ? "Loading submission…"
                : submission?.activity_details.title || "Submission"}
            </h2>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">
              {submission?.activity_details.proponent
                ? `Submitted by ${submission.activity_details.proponent}`
                : "Student activity application"}
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            <div className="bg-slate-100/90 p-1 rounded-xl relative flex items-center w-84 h-10 border border-slate-200/80 shadow-inner">
              <div
                className="absolute top-1 bottom-1 rounded-lg bg-white shadow-xs border border-slate-200/60 transition-all duration-200 ease-in-out z-0"
                style={{
                  left: activeTab === "details" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)",
                }}
              ></div>

              <button
                onClick={() => setActiveTab("details")}
                className={`relative z-10 w-1/2 h-full text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === "details"
                    ? "text-[#D9291C] font-bold"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
              >
                <FileText
                  className={`w-3.5 h-3.5 shrink-0 ${activeTab === "details" ? "text-[#D9291C]" : "text-slate-400"}`}
                />
                <span>Document Details</span>
              </button>

              <button
                onClick={() => setActiveTab("progress")}
                className={`relative z-10 w-1/2 h-full text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === "progress"
                    ? "text-[#D9291C] font-bold"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${activeTab === "progress" ? "text-[#D9291C]" : "text-slate-400"}`}
                />
                <span>Milestone & Progress</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 bg-neutral-50/40">
          {detailQuery.isError ? (
            <p className="text-sm font-semibold text-rose-600">
              Could not load this submission. Try again from the dashboard.
            </p>
          ) : null}

          {activeTab === "details" && submission && (
            <div className={cn(layout.stack, "animate-in fade-in duration-200")}>
              <div className={cn("grid grid-cols-1 lg:grid-cols-2", layout.gap, "items-stretch")}>
                <div className={cn(layout.section, "flex flex-col")}>
                  <h3 className="text-lg font-extrabold text-[#1E293B] mb-4">
                    Document Specification & Details
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100 text-xs font-bold text-[#94A3B8] tracking-wider">
                          <th className="pb-3 pr-4 w-1/3">Field</th>
                          <th className="pb-3">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">
                            Document / Event Name
                          </td>
                          <td className="py-3 font-bold text-[#1E293B]">
                            {submission.activity_details.title}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">
                            Classification
                          </td>
                          <td className="py-3 font-bold text-[#1E293B] capitalize">
                            {submission.activity_classification}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">
                            Requested Venue
                          </td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.venue}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">
                            Proposed Date & Time
                          </td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.date}
                            {submission.activity_details.time
                              ? ` | ${submission.activity_details.time}`
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">
                            Expected Attendees
                          </td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.expected_attendees ?? "—"} students
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">
                            Estimated Budget
                          </td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.budget}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className={cn(layout.section, "flex-1 flex flex-col min-h-[220px]")}>
                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2 shrink-0">
                      Description
                    </h4>
                    <div className="flex-1 overflow-y-auto max-h-[260px] pr-2 space-y-3 [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
                      <p className="text-sm text-[#1E293B] leading-relaxed">
                        {submission.activity_details.description || "No description provided."}
                      </p>
                      {submission.activity_details.objectives ? (
                        <div className="pt-3 border-t border-neutral-100">
                          <h5 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                            Objectives
                          </h5>
                          <p className="text-sm text-[#1E293B] leading-relaxed">
                            {submission.activity_details.objectives}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className={cn(layout.section, "shrink-0")}>
                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                      Proponent & Routing
                    </h4>
                    <p className="text-xs text-[#64748B] mb-3">
                      Current signatory:{" "}
                      <span className="font-bold text-[#1E293B]">
                        {submission.current_signatory}
                      </span>
                    </p>
                    <span className="text-xs font-semibold text-[#475569] bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200/60">
                      {submission.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "progress" && (
            <div className={cn(layout.stack, "animate-in fade-in duration-200")}>
              <div className={layout.section}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-extrabold text-[#1E293B]">Progress</h3>
                  <span className="text-xs text-[#94A3B8] font-medium">
                    {notificationsQuery.isLoading ? "Loading notifications…" : "From review notifications"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B] mb-6">
                  <span>
                    {formatDocumentId(submissionId)} • Submitted {submission?.submitted_date || "—"} •{" "}
                    {stepper.isAllApproved
                      ? "All steps completed"
                      : `${stepper.remainingSteps} tasks remaining before final approval`}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#64748B] font-medium">Overall progress</span>
                    <span className="text-base font-extrabold text-[#1E293B]">
                      {stepper.progressPercent}%
                    </span>
                  </div>
                </div>

                <div className="relative py-4 px-2 select-none">
                  <div className="absolute top-9 left-8 right-8 -translate-y-1/2 h-1.5 bg-neutral-200 rounded-full z-0 overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${
                          stepper.fullSteps.length > 1
                            ? (Math.min(stepper.currentStepIdx, stepper.fullSteps.length - 1) /
                                (stepper.fullSteps.length - 1)) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="relative z-10 w-full min-h-[76px]">
                    {stepper.fullSteps.map((stepName, idx) => {
                      const totalSteps = stepper.fullSteps.length
                      const isCompleted = stepper.isAllApproved || idx < stepper.currentStepIdx
                      const isCurrent = !stepper.isAllApproved && idx === stepper.currentStepIdx

                      let nodeBg = "bg-neutral-100 border-neutral-300 text-neutral-400"
                      if (isCompleted) {
                        nodeBg = "bg-[#D1FAE5] border-[#10B981] text-[#065F46]"
                      } else if (isCurrent) {
                        nodeBg = "bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] ring-4 ring-amber-100"
                      }

                      return (
                        <div
                          key={`${stepName}-${idx}`}
                          className="absolute top-4 -translate-x-1/2 flex flex-col items-center"
                          style={{
                            left: totalSteps > 1
                              ? `calc(32px + (100% - 64px) * ${idx / (totalSteps - 1)})`
                              : "50%",
                          }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 shadow-xs ${nodeBg}`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5 stroke-[2.5] text-emerald-800" />
                            ) : isCurrent ? (
                              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse"></span>
                            ) : (
                              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-xs font-bold mt-2 text-center whitespace-nowrap px-1 max-w-[120px] truncate",
                              isCompleted
                                ? "text-[#1E293B]"
                                : isCurrent
                                ? "text-amber-900 font-extrabold"
                                : "text-slate-400"
                            )}
                            title={stepName}
                          >
                            {stepName}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className={layout.section}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-extrabold text-[#1E293B]">Pending approval</h3>
                </div>
                <p className="text-xs font-bold text-[#64748B] mb-4">Assignees</p>
                <div className="space-y-4">
                  {stepper.assigneesList.map((item, idx) => {
                    let iconBg = "bg-neutral-200 text-neutral-400"
                    if (item.state === "completed") iconBg = "bg-[#10B981] text-white"
                    else if (item.state === "current") iconBg = "bg-[#FBBF24] text-white"

                    return (
                      <div key={`${item.role}-${idx}`} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
                        >
                          {item.state === "completed" ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-[#1E293B]">
                          <span className="font-bold">{item.name}</span>
                          <span className="text-[#64748B]"> — {item.statusText}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {canResubmit ? (
            <div className={cn(layout.section, "space-y-4")}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-[#475569]">
                  Update this application and resubmit it to the current signatory.
                </p>
                <button
                  type="button"
                  onClick={handleResubmit}
                  className="rounded-xl bg-[#1E293B] px-4 py-2 text-xs font-bold text-white"
                >
                  Edit and resubmit
                </button>
              </div>
            </div>
          ) : null}

          {isDenied ? (
            <div className={cn(layout.section)}>
              <p className="text-sm text-[#475569]">
                This submission was denied and cannot be edited.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
