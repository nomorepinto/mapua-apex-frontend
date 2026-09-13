import { memo } from "react"
import { CheckCircle2Icon } from "lucide-react"

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

// ─── ActivityDetailModal ──────────────────────────────────────────────────────

export interface ActivityDetailModalProps {
  activity: Activity | null
  onClose: () => void
  onAction?: (action: "approve" | "return" | "defer", activityId: string, details?: { title: string; message: string }) => void
}

const ActivityDetailModal = memo(function ActivityDetailModal({
  activity,
  onClose,
  onAction,
}: ActivityDetailModalProps) {
  const {
    returnModalOpen,
    setReturnModalOpen,
    handleOpenChange,
    handleApprove,
    handleDefer,
    handleReturnSubmit,
  } = useActivityDetail({ activity, onClose, onAction })

  return (
    <>
      <Dialog open={activity !== null} onOpenChange={handleOpenChange}>
        <DialogPopup className="max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Top Dark Banner Header matching Figma 11849-2751 */}
          <DialogHeader className="bg-[#2B2E35] text-white px-6 sm:px-8 py-6 shrink-0 rounded-t-2xl">
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

          {/* Scrollable Content Body */}
          <DialogPanel className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 bg-white text-neutral-800">
            {activity && (
              <div className="space-y-6">
                {/* 1. Proponents Section */}
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

                {/* 2. Key Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                  <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900">Event Date & Time</span>
                    <span className="text-neutral-600 font-medium">
                      {activity.time ? `${activity.time} ` : ""}{activity.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900">Venue</span>
                    <span className="text-neutral-600 font-medium">{activity.venue}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900">Estimated Budget</span>
                    <span className="text-neutral-600 font-medium">{activity.proposedBudget}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900">Number of Participants</span>
                    <span className="text-neutral-600 font-medium">{activity.expectedParticipants}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900">Advisor Signoff</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                      <CheckCircle2Icon className="w-3.5 h-3.5" />
                      {activity.advisorSignoff}
                    </span>
                  </div>
                </div>

                {/* 3. Description of the Activity */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-bold text-neutral-900">
                    Description of the Activity
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                {/* 4. Objectives of the Activity */}
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

          {/* Action Footer matching Figma 11849-2751 */}
          <DialogFooter className="border-t border-neutral-200 px-6 sm:px-8 py-4 bg-white shrink-0 rounded-b-2xl">
            <div className="w-full flex items-center justify-end gap-3 flex-wrap">
              {/* Approve Proposal */}
              <Button
                type="button"
                onClick={handleApprove}
                className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-bold px-6 py-2.5 rounded-xl shadow-2xs cursor-pointer text-sm"
              >
                Approve Proposal
              </Button>

              {/* Return Proposal */}
              <Button
                type="button"
                onClick={() => setReturnModalOpen(true)}
                className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl shadow-2xs cursor-pointer text-sm"
              >
                Return Proposal
              </Button>

              {/* Defer Decision */}
              <Button
                type="button"
                onClick={handleDefer}
                className="bg-[#800000] hover:bg-[#660000] text-white font-bold px-6 py-2.5 rounded-xl shadow-2xs cursor-pointer text-sm"
              >
                Defer Decision
              </Button>
            </div>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      {/* Return Sub-Modal */}
      <ReturnProposalModal
        activity={activity}
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        onSubmit={handleReturnSubmit}
      />
    </>
  )
})

export { ActivityDetailModal }
