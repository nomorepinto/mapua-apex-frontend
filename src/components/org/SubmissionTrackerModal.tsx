import { useState } from "react"
import { X, Check, FileText, CheckCircle2, MapPin, Calendar, Users, DollarSign, User, ShieldCheck } from "lucide-react"
import { getSignatorySequence, type Submission } from "@/stores/org-store"

interface SubmissionTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  submission: Submission | null
}

export function SubmissionTrackerModal({ isOpen, onClose, submission }: SubmissionTrackerModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'progress'>('details')

  if (!isOpen || !submission) return null

  // Dynamic signatory steps ending with 'Approved'
  const signatoryRoles = getSignatorySequence(submission) // e.g. ["Dean", "OSAAR", "CDM"] or ["Adviser", "OSAAR"]
  const fullSteps = [...signatoryRoles, "Approved"]

  // Determine current step index
  const isAllApproved = submission.status === 'Approved' || submission.status === 'Completed'
  let currentStepIdx = signatoryRoles.indexOf(submission.current_signatory)
  if (currentStepIdx === -1) currentStepIdx = 0
  if (isAllApproved) currentStepIdx = signatoryRoles.length

  // Compute progress percentage
  const totalSignatories = signatoryRoles.length
  const completedCount = isAllApproved ? totalSignatories : Math.max(0, currentStepIdx)
  const progressPercent = Math.round((completedCount / totalSignatories) * 100)
  const remainingSteps = totalSignatories - completedCount

  // Assignees list
  const assigneeInfo: Record<string, { name: string; roleLabel: string }> = {
    'Adviser': { name: 'Prof. Reynilda Layno', roleLabel: 'Faculty Adviser' },
    'Dean': { name: 'Alan S. Mercado', roleLabel: 'College Dean' },
    'OSAAR': { name: 'Director of Student Affairs', roleLabel: 'OSAAR' },
    'CDM': { name: 'Campus Development & Management', roleLabel: 'CDM' },
  }

  const assigneesList = signatoryRoles.map((role, idx) => {
    const info = assigneeInfo[role] || { name: `${role} Officer`, roleLabel: role }
    let statusText = ""
    let state: 'completed' | 'current' | 'queued' = 'queued'

    if (isAllApproved || idx < currentStepIdx) {
      state = 'completed'
      statusText = idx === 0 ? `Endorsed (${submission.submitted_date})` : `Approved (${submission.submitted_date})`
    } else if (idx === currentStepIdx && submission.status !== 'Returned') {
      state = 'current'
      statusText = "Pending Signature (In Review)"
    } else if (submission.status === 'Returned' && idx === currentStepIdx) {
      state = 'current'
      statusText = "Returned for Revision"
    } else {
      state = 'queued'
      const prevRole = signatoryRoles[idx - 1] || 'Previous Step'
      statusText = `Queued (Awaiting ${prevRole})`
    }

    return {
      role,
      name: info.name,
      statusText,
      state
    }
  })

  assigneesList.push({
    role: 'System',
    name: 'System Sign-off',
    statusText: isAllApproved ? 'Approved' : 'Queued (Pending All Signatures)',
    state: isAllApproved ? 'completed' : 'queued'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-8 pt-7 pb-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#D9291C] bg-red-50 px-2 py-0.5 rounded-md">
                {submission.id}
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#475569] bg-neutral-100 px-2 py-0.5 rounded-md">
                {submission.activity_classification}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight">
              {submission.activity_details.title}
            </h2>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">
              Submitted by {submission.activity_details.proponent || 'John Benedict Vida'}
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            {/* Polished Segmented Control Pill Switcher */}
            <div className="bg-slate-100/90 p-1 rounded-xl relative flex items-center w-84 h-10 border border-slate-200/80 shadow-inner">
              {/* Animated Sliding Background Pill */}
              <div
                className="absolute top-1 bottom-1 rounded-lg bg-white shadow-xs border border-slate-200/60 transition-all duration-200 ease-in-out z-0"
                style={{
                  left: activeTab === 'details' ? '4px' : 'calc(50% + 2px)',
                  width: 'calc(50% - 6px)',
                }}
              ></div>

              <button
                onClick={() => setActiveTab('details')}
                className={`relative z-10 w-1/2 h-full text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === 'details'
                    ? 'text-[#D9291C] font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'details' ? 'text-[#D9291C]' : 'text-slate-400'}`} />
                <span>Document Details</span>
              </button>

              <button
                onClick={() => setActiveTab('progress')}
                className={`relative z-10 w-1/2 h-full text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === 'progress'
                    ? 'text-[#D9291C] font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'progress' ? 'text-[#D9291C]' : 'text-slate-400'}`} />
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

        {/* Scrollable Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-neutral-50/40">

          {/* LEFT TAB: Document Details View */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Document Details Table */}
                <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 sm:p-7 shadow-xs">
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
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Document / Event Name</td>
                          <td className="py-3 font-bold text-[#1E293B]">{submission.activity_details.title}</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Classification</td>
                          <td className="py-3 font-bold text-[#1E293B] capitalize">{submission.activity_classification}</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Requested Venue</td>
                          <td className="py-3 font-medium text-[#1E293B]">{submission.activity_details.venue}</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Proposed Date & Time</td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.date} {submission.activity_details.time ? `| ${submission.activity_details.time}` : '| 2:00 PM - 5:00 PM'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Expected Attendees</td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.expected_attendees || 100} students
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Estimated Budget</td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.budget || '$5000'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Proponent & Requirements Info */}
                <div className="space-y-4">
                  <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 shadow-xs">
                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Description & Objective</h4>
                    <p className="text-sm text-[#1E293B] leading-relaxed">
                      {submission.activity_details.description}
                    </p>
                  </div>

                  <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 shadow-xs">
                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Proponent & Requirements</h4>
                    <p className="text-xs text-[#64748B] mb-3">
                      Organized by <span className="font-bold text-[#1E293B]">{submission.activity_details.proponent || 'John Benedict Vida'}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {submission.activity_details.requirements?.map((req, i) => (
                        <span key={i} className="text-xs font-semibold text-[#475569] bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200/60">
                          ✓ {req}
                        </span>
                      )) || (
                        <span className="text-xs text-neutral-400 italic">No special requirements listed</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* RIGHT TAB: Milestone & Progress Tracker View */}
          {activeTab === 'progress' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Progress Stepper Card */}
              <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-extrabold text-[#1E293B]">Progress</h3>
                  <span className="text-xs text-[#94A3B8] font-medium">Updated 2h ago</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B] mb-6">
                  <span>
                    {submission.id} • Submitted {submission.submitted_date} • {isAllApproved ? 'All steps completed' : `${remainingSteps} tasks remaining before final approval`}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#64748B] font-medium">Overall progress</span>
                    <span className="text-base font-extrabold text-[#1E293B]">{progressPercent}%</span>
                  </div>
                </div>

                {/* Stepper Bar */}
                <div className="relative py-4 px-3">
                  <div className="absolute top-1/2 left-8 right-8 -translate-y-4 h-1 bg-neutral-200 rounded-full z-0">
                    <div
                      className="h-full bg-[#4ADE80] rounded-full transition-all duration-500"
                      style={{
                        width: `${fullSteps.length > 1 ? (Math.min(currentStepIdx, fullSteps.length - 1) / (fullSteps.length - 1)) * 100 : 0}%`
                      }}
                    ></div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between w-full">
                    {fullSteps.map((stepName, idx) => {
                      const isCompleted = isAllApproved || idx < currentStepIdx
                      const isCurrent = !isAllApproved && idx === currentStepIdx

                      let nodeBg = "bg-neutral-200 border-neutral-200 text-neutral-400"
                      if (isCompleted) {
                        nodeBg = "bg-[#6EE7B7] border-[#4ADE80] text-emerald-900"
                      } else if (isCurrent) {
                        nodeBg = "bg-[#FCD34D] border-[#F59E0B] text-amber-900"
                      }

                      return (
                        <div key={stepName} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all shadow-xs ${nodeBg}`}>
                            {isCompleted ? (
                              <Check className="w-5 h-5 stroke-[3] text-emerald-900" />
                            ) : (
                              <span className="w-3 h-3 rounded-full bg-current opacity-60"></span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#1E293B] mt-3">{stepName}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Pending Approval (Assignees List) */}
              <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-extrabold text-[#1E293B]">Pending approval</h3>
                  <span className="text-xs text-[#94A3B8] font-medium">Updated 2h ago</span>
                </div>

                <p className="text-xs font-bold text-[#64748B] mb-4">Assignees</p>

                <div className="space-y-4">
                  {assigneesList.map((item, idx) => {
                    let iconBg = "bg-neutral-200 text-neutral-400"

                    if (item.state === 'completed') {
                      iconBg = "bg-[#10B981] text-white"
                    } else if (item.state === 'current') {
                      iconBg = "bg-[#FBBF24] text-white"
                    }

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                          {item.state === 'completed' ? (
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

        </div>

      </div>
    </div>
  )
}
