import { memo } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
  DialogFooter,
} from "@/components/ui/dialog"
import { ReturnProposalModal } from "./return-proposal-modal"
import type { Activity } from "./activity.types"
import { useActivityDetail } from "@/hooks/use-activity-detail"
import { modal } from "@/config"
import { cn } from "@/lib/utils"

export interface ActivityDetailModalProps {
  activity: Activity | null
  onClose: () => void
  isActing?: boolean
  actionError?: string | null
  onAction?: (
    action: "approve" | "return" | "reject" | "defer",
    activityId: string,
    details?: { title: string; message: string }
  ) => void | Promise<void>
}

const ActivityDetailModal = memo(function ActivityDetailModal({
  activity,
  onClose,
  isActing = false,
  actionError,
  onAction,
}: ActivityDetailModalProps) {
  const {
    commentAction,
    setCommentAction,
    handleOpenChange,
    handleApprove,
    handleDefer,
    handleCommentSubmit,
  } = useActivityDetail({ activity, onClose, onAction })

  return (
    <>
      <Dialog open={activity !== null} onOpenChange={handleOpenChange}>
        <DialogPopup className={cn(modal.dialogXl, "flex-col")}>
          <DialogHeader className="shrink-0 rounded-t-2xl bg-[#2B2E35] px-4 py-6 text-white sm:px-8">
            <div className="w-full pr-10">
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Reviewing Target
                </span>
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Time Submitted
                </span>
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {activity?.title} Proposal
              </DialogTitle>
              <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#F6C768]">
                Submitted by: {activity?.org} • Representative: {activity?.representative}
              </p>
            </div>
          </DialogHeader>

          <DialogPanel className="flex-1 overflow-y-auto bg-white px-4 py-6 text-neutral-800 sm:px-8">
            {activity && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
                    Proponents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activity.proponents.map((prop, idx) => (
                      <div
                        key={idx}
                        className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5 text-center shadow-2xs hover:bg-neutral-100/50 transition-colors"
                      >
                        <p className="text-xs text-neutral-500 font-semibold">{prop.role}</p>
                        <p className="text-sm font-bold text-neutral-900 mt-0.5">{prop.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-neutral-200" />

                <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm md:grid-cols-2">
                  <div className="flex flex-col gap-1 border-b border-neutral-100 py-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-neutral-900">Event Date & Time</span>
                    <span className="font-medium text-neutral-600 sm:text-right">
                      {activity.time ? `${activity.time} ` : ""}{activity.date}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-neutral-100 py-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-neutral-900">Venue</span>
                    <span className="font-medium text-neutral-600 sm:text-right">{activity.venue}</span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-neutral-100 py-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-neutral-900">Estimated Budget</span>
                    <span className="font-medium text-neutral-600 sm:text-right">{activity.proposedBudget}</span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-neutral-100 py-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-neutral-900">Number of Participants</span>
                    <span className="font-medium text-neutral-600 sm:text-right">{activity.expectedParticipants}</span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-neutral-100 py-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-neutral-900">Activity type</span>
                    <span className="font-medium text-neutral-600 sm:text-right capitalize">
                      {activity.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-bold text-neutral-900">
                    Description of the Activity
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-neutral-900">
                    Objectives of the Activity
                  </h4>
                  <ul className="space-y-2.5 text-sm text-neutral-700">
                    {activity.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-neutral-400 font-bold mt-1 text-xs">•</span>
                        <div>
                          <span className="font-bold text-neutral-900">{obj.title}: </span>
                          <span className="leading-relaxed">{obj.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </DialogPanel>

          <DialogFooter className="shrink-0 rounded-b-2xl border-t border-neutral-200 bg-white px-4 py-4 sm:px-8">
            <div className="flex w-full flex-col items-stretch justify-end gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {actionError ? (
                <p className="mr-auto text-xs font-semibold text-rose-600">{actionError}</p>
              ) : null}
              <Button
                type="button"
                disabled={isActing}
                onClick={handleApprove}
                className="min-h-11 cursor-pointer rounded-xl border border-neutral-300 bg-white px-6 py-2.5 text-sm font-bold text-neutral-800 shadow-2xs hover:bg-neutral-50 disabled:opacity-50"
              >
                {isActing ? "Working…" : "Approve Proposal"}
              </Button>

              <Button
                type="button"
                disabled={isActing}
                onClick={() => setCommentAction("return")}
                className="min-h-11 cursor-pointer rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white shadow-2xs hover:bg-black disabled:opacity-50"
              >
                Return Proposal
              </Button>

              <Button
                type="button"
                disabled={isActing}
                onClick={() => setCommentAction("reject")}
                className="min-h-11 cursor-pointer rounded-xl bg-[#800000] px-6 py-2.5 text-sm font-bold text-white shadow-2xs hover:bg-[#660000] disabled:opacity-50"
              >
                Reject Proposal
              </Button>

              <Button
                type="button"
                disabled={isActing}
                onClick={handleDefer}
                className="min-h-11 cursor-pointer rounded-xl border border-neutral-300 bg-white px-6 py-2.5 text-sm font-bold text-neutral-800 shadow-2xs hover:bg-neutral-50 disabled:opacity-50"
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      <ReturnProposalModal
        activity={activity}
        variant={commentAction ?? "return"}
        open={commentAction !== null}
        onClose={() => setCommentAction(null)}
        onSubmit={handleCommentSubmit}
      />
    </>
  )
})

export { ActivityDetailModal }
