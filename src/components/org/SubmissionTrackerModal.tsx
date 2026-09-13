import { X, CheckCircle, Clock, Circle } from "lucide-react"
import type { TrackedSubmission } from "@/components/org-dashboard/types"

interface SubmissionTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  submission: TrackedSubmission | null
}

const SIGNATORY_STEPS = ["Adviser", "CSS", "Dean", "OSAAR"]

export function SubmissionTrackerModal({ isOpen, onClose, submission }: SubmissionTrackerModalProps) {
  if (!isOpen || !submission) return null

  // Determine current step index based on current_signatory and status
  let currentStepIndex = SIGNATORY_STEPS.indexOf(submission.current_signatory);
  if (submission.status === 'Submitted') currentStepIndex = 0;
  if (submission.status === 'Completed' || submission.status === 'Approved') currentStepIndex = SIGNATORY_STEPS.length;
  if (currentStepIndex === -1 && submission.status === 'Under Review') currentStepIndex = 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div>
            <h2 className="text-lg font-bold text-[#1E293B]">Submission Progress Tracker</h2>
            <p className="text-xs text-[#64748B] mt-0.5">{submission.id} • {submission.activity_classification}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-bold text-[#1E293B] text-[15px]">{submission.activity_details.title}</h3>
            <p className="text-sm text-[#64748B] mt-1 line-clamp-2">{submission.activity_details.description}</p>
            <div className="flex items-center gap-4 mt-3">
               <span className="text-xs font-semibold text-[#1E293B] bg-neutral-100 px-2.5 py-1 rounded-md">
                 Target Date: {submission.target_date}
               </span>
               <span className={`text-xs font-semibold px-2.5 py-1 rounded-md bg-opacity-10 ${submission.statusColor.replace('text-', 'bg-')} ${submission.statusColor}`}>
                 {submission.status}
               </span>
            </div>
          </div>

          <div className="relative pl-4 mt-8 space-y-6">
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-neutral-200"></div>

            {SIGNATORY_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex && submission.status !== 'Approved' && submission.status !== 'Completed' && submission.status !== 'Returned';
              
              let Icon = Circle;
              let iconColor = "text-neutral-300 bg-white";
              let textColor = "text-neutral-400";
              let statusText = "Pending";

              if (isCompleted) {
                Icon = CheckCircle;
                iconColor = "text-[#10B981] bg-white";
                textColor = "text-[#1E293B]";
                statusText = "Approved";
              } else if (isCurrent) {
                Icon = Clock;
                iconColor = "text-[#F59E0B] bg-white";
                textColor = "text-[#1E293B]";
                statusText = "Under Review";
              } else if (submission.status === 'Returned' && idx === currentStepIndex) {
                 Icon = X;
                 iconColor = "text-[#D9291C] bg-white rounded-full border border-[#D9291C]";
                 textColor = "text-[#D9291C]";
                 statusText = "Returned for Revision";
              }

              return (
                <div key={step} className="relative flex items-start gap-4">
                  <div className={`relative z-10 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textColor}`}>{step}</h4>
                    <p className={`text-xs ${isCompleted || isCurrent ? 'text-[#64748B]' : 'text-neutral-400'} mt-0.5`}>
                      {statusText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-neutral-50 px-6 py-4 flex justify-end border-t border-neutral-100">
          <button onClick={onClose} className="px-4 py-2 bg-[#1E293B] text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer">
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  )
}
