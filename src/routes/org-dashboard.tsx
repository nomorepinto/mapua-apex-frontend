import { Link } from "react-router"
import { useState } from "react"
import { Cloud, FileText, Folder, CheckCircle, ChevronRight, Clock, AlertCircle, Plus, AlertTriangle, Volume2 } from "lucide-react"
import { AppealsModal } from "@/components/org/AppealsModal"
import { MilestoneModal } from "@/components/org/MilestoneModal"
import { NewEventModal } from "@/components/org/NewEventModal"
import { SubmissionTrackerModal } from "@/components/org/SubmissionTrackerModal"
import { NotificationsModal } from "@/components/org/NotificationsModal"
import { useOrgStore, type Submission } from "@/stores/org-store"
import { DayPicker } from "react-day-picker"

export function OrgDashboard() {
  const [isAppealsOpen, setIsAppealsOpen] = useState(false)
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(false)
  const [isNewEventOpen, setIsNewEventOpen] = useState(false)
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const { selectedDate, setSelectedDate, calendarEvents, milestoneTasks, activities, appeals, submissions, logActivity } = useOrgStore()

  const completedTasks = milestoneTasks.filter(t => t.status === 'Completed').length;
  const totalTasks = milestoneTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getProgressColor = (percent: number) => {
    if (percent === 100) return '#10B981'; // Green
    if (percent >= 80) return '#EAB308'; // Yellow
    if (percent >= 60) return '#F59E0B'; // Orange
    return '#D9291C'; // Red
  };

  const progressColor = getProgressColor(progressPercentage);

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Exact DayPicker styles matching the screenshot
  const dayPickerStyles = {
    root: "w-full font-sans relative",
    months: "flex flex-col space-y-4",
    month: "w-full",
    month_caption: "flex items-center pt-1 mb-5 h-8",
    caption_label: "text-[15px] font-bold text-[#1E293B]",
    nav: "absolute right-12 top-0 flex items-center gap-1.5 z-10",
    button_previous: "w-7 h-7 rounded-full bg-neutral-50 text-[#1E293B] flex items-center justify-center hover:bg-neutral-100 hover:shadow-sm transition-all border border-neutral-100/50 cursor-pointer",
    button_next: "w-7 h-7 rounded-full bg-neutral-50 text-[#1E293B] flex items-center justify-center hover:bg-neutral-100 hover:shadow-sm transition-all border border-neutral-100/50 cursor-pointer",
    month_grid: "w-full border-collapse",
    weekdays: "flex w-full mb-2 justify-between",
    weekday: "text-[#94A3B8] rounded-md w-9 font-semibold text-[11px] uppercase text-center shrink-0",
    week: "flex w-full mt-1.5 justify-between",
    day: "w-9 h-9 p-0 flex items-center justify-center relative",
    day_button: "w-8 h-8 rounded-full flex items-center justify-center font-medium text-[13px] text-[#1E293B] hover:bg-neutral-100 transition-colors cursor-pointer outline-none",
    selected: "!bg-neutral-100 !border !border-neutral-300 !text-[#1E293B] !font-bold",
    today: "!bg-red-50 !text-[#D9291C] !font-bold !border !border-red-200/60",
    outside: "text-neutral-300 opacity-50 cursor-default hover:bg-transparent",
    disabled: "text-neutral-300 opacity-50",
    hidden: "invisible",
  };

  // Standardized status color mapping matching reference image
  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-[#10B981]'; // Green
      case 'under review':
        return 'text-[#3B82F6]'; // Blue
      case 'pending':
        return 'text-[#F59E0B]'; // Amber/Orange
      case 'rejected':
        return 'text-[#D9291C]'; // Red
      default:
        return 'text-[#64748B]';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1360px] mx-auto w-full flex flex-col gap-6">

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1E293B]">Organization Dashboard</h1>

        <Link
          to="/submission"
          className="bg-[#1E293B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer inline-block"
        >
          Create Project/Event
        </Link>
      </div>

      {/* ROW 1: Project & Event Portfolio (75%) + Calendar (25%) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">

        {/* Left Column: Project & Event Portfolio */}
        <div className="xl:col-span-2 bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-neutral-100 w-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B] mb-1">Project & Event Portfolio</h2>
            <p className="text-sm text-[#94A3B8] mb-6">Overall project health, upcoming events, and committee tasks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-stretch">

            {/* PLANNING */}
            <div className="bg-[#F8FAFC] border-t-4 border-[#3B82F6] rounded-b-2xl p-5 flex flex-col gap-4 h-full justify-between">
              <span className="text-sm font-extrabold text-[#3B82F6] uppercase tracking-wider">PLANNING</span>
              <div className="bg-white rounded-xl p-6 shadow-2xs border border-neutral-100 flex flex-col gap-3 flex-1 justify-center">
                <h3 className="font-extrabold text-[#1E293B] text-xl sm:text-2xl leading-snug">Charity Gala</h3>
                <div className="flex flex-col gap-1.5 text-sm sm:text-base text-[#64748B]">
                  <p className="font-semibold">Health: <span className="font-bold text-[#10B981]">Green</span></p>
                  <p className="font-semibold">Tasks: <span className="font-bold text-[#1E293B]">5/10</span></p>
                </div>
              </div>
            </div>

            {/* IN-PROGRESS */}
            <div className="bg-[#FFFBEB] border-t-4 border-[#F59E0B] rounded-b-2xl p-5 flex flex-col gap-4 h-full justify-between">
              <span className="text-sm font-extrabold text-[#F59E0B] uppercase tracking-wider">IN-PROGRESS</span>
              <div className="bg-white rounded-xl p-6 shadow-2xs border border-neutral-100 flex flex-col gap-3 flex-1 justify-center">
                <h3 className="font-extrabold text-[#1E293B] text-xl sm:text-2xl leading-snug">New Member Orientation</h3>
                <div className="flex flex-col gap-1.5 text-sm sm:text-base text-[#64748B]">
                  <p className="font-semibold">Health: <span className="font-bold text-[#F59E0B]">Yellow</span></p>
                  <p className="font-semibold">Tasks: <span className="font-bold text-[#1E293B]">8/12</span></p>
                </div>
              </div>
            </div>

            {/* COMPLETED */}
            <div className="bg-[#F0FDF4] border-t-4 border-[#10B981] rounded-b-2xl p-5 flex flex-col gap-4 h-full justify-between">
              <span className="text-sm font-extrabold text-[#10B981] uppercase tracking-wider">COMPLETED</span>
              <div className="bg-white rounded-xl p-6 shadow-2xs border border-neutral-100 flex flex-col gap-3 flex-1 justify-center">
                <h3 className="font-extrabold text-[#1E293B] text-xl sm:text-2xl leading-snug">Club Showcase</h3>
                <p className="text-sm sm:text-base font-extrabold text-[#10B981] pt-1">Completed</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Calendar */}
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 relative min-w-0 flex flex-col justify-between">
          <button
            onClick={() => setIsNewEventOpen(true)}
            className="absolute top-6 right-6 w-7 h-7 flex items-center justify-center rounded-full bg-neutral-50 text-[#1E293B] hover:bg-neutral-100 transition-colors z-10 border border-neutral-100 cursor-pointer"
            title="New Event"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <DayPicker
            mode="single"
            selected={selectedDate || new Date(2026, 7, 14)}
            onSelect={setSelectedDate}
            classNames={dayPickerStyles}
            formatters={{
              formatWeekdayName: (day) => day.toLocaleDateString('en-US', { weekday: 'narrow' })
            }}
            modifiers={{
              hasEvent: (date) => date.getDate() === 19 || !!calendarEvents[getDateKey(date)]?.length
            }}
            modifiersClassNames={{
              hasEvent: "relative after:content-[''] after:absolute after:bottom-[3px] after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-[#4ADE80] after:rounded-full"
            }}
            showOutsideDays
          />

          {selectedDate && calendarEvents[getDateKey(selectedDate)]?.length > 0 && (
            <div className="mt-5 pt-3 border-t border-neutral-100 flex flex-col gap-2">
              <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                Events on {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </h3>
              <div className="flex flex-col gap-2">
                {calendarEvents[getDateKey(selectedDate)].map((evt, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shrink-0 mt-1.5"></div>
                    <div>
                      <p className="text-xs font-bold text-[#1E293B] leading-snug">{evt.title}</p>
                      {evt.time && <p className="text-xs text-[#64748B] mt-0.5">{evt.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ROW 2: Project Status (Full Width 100%) */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-6 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#1E293B]">Project Status</h2>
          <button
            onClick={() => setIsAppealsOpen(true)}
            className="text-[#D9291C] font-bold text-xs hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider border-b border-neutral-100">
                <th className="pb-3 pr-6 font-bold">APPEAL ID</th>
                <th className="pb-3 pr-6 font-bold">PURPOSE / EVENT TITLE</th>
                <th className="pb-3 pr-6 font-bold text-right">SUBMITTED DATE</th>
                <th className="pb-3 pr-6 font-bold">DEPARTMENT</th>
                <th className="pb-3 font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {appeals.slice(0, 3).map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-50/50 transition-colors cursor-pointer"
                  onClick={() => setIsAppealsOpen(true)}
                >
                  <td className="py-3.5 pr-6 font-mono text-sm text-[#1E293B] font-bold whitespace-nowrap">{item.id}</td>
                  <td className="py-3.5 pr-6 text-sm text-[#64748B] font-medium">{item.title}</td>
                  <td className="py-3.5 pr-6 text-sm text-[#64748B] whitespace-nowrap text-right">{item.date}</td>
                  <td className="py-3.5 pr-6 text-sm text-[#64748B]">{item.department}</td>
                  <td className="py-3.5 whitespace-nowrap">
                    <span className={`text-xs font-bold ${getStatusTextColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROW 3: Split Grid (Left 75%: Milestone & Quick Links | Right 25%: Recent Activities) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* Left Column: Stacked Milestone + Resource Quick Links */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* APEX Tech Semestral Milestone */}
          <div className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1E293B]">APEX Tech Semestral Milestone</h2>
              <div className="flex items-center gap-3">
                <div className="w-36 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%`, backgroundColor: progressColor }}></div>
                </div>
                <span className="font-bold text-xs sm:text-sm transition-colors duration-500" style={{ color: progressColor }}>{progressPercentage}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {milestoneTasks.slice(0, 3).map((task, index) => {
                const isCompleted = task.status === 'Completed';
                const isInProgress = task.status === 'In Progress';

                return (
                  <div key={task.id} className="flex items-center gap-3.5">
                    {isCompleted ? (
                      <CheckCircle className="w-5.5 h-5.5 text-[#10B981] fill-[#10B981] stroke-white shrink-0" />
                    ) : (
                      <div className={`w-5.5 h-5.5 rounded-full border-2 ${isInProgress ? 'border-[#F59E0B] text-[#F59E0B]' : 'border-neutral-300 text-neutral-400'} flex items-center justify-center font-bold text-xs shrink-0`}>
                        {index + 1}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${isInProgress ? 'text-[#F59E0B]' : 'text-[#1E293B]'}`}>{task.title}</h4>
                        {isInProgress && (
                          <span className="text-[10px] font-bold text-[#F59E0B] bg-[#FFFBEB] px-1.5 py-0.5 rounded">In Review</span>
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8]">
                        {isCompleted ? `Completed ${task.dueDate}` : `Due ${task.dueDate}`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsMilestoneOpen(true)}
                className="text-xs sm:text-sm font-semibold text-[#D9291C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all &rarr;
              </button>
            </div>
          </div>

          {/* Resource Quick Links */}
          <div className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold text-[#1E293B] mb-5">Resource Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => {
                  logActivity('Resource accessed', 'Opened Official Templates resource link.', 'info');
                  alert('Official Templates directory coming soon');
                }}
                className="flex items-center gap-3 text-left cursor-pointer group"
              >
                <FileText className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#3B82F6] transition-colors" />
                <span className="text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Official Templates</span>
              </button>

              <button
                onClick={() => {
                  logActivity('Resource accessed', 'Opened Governance and Documentation resource link.', 'info');
                  alert('Governance and Documentation coming soon');
                }}
                className="flex items-center gap-3 text-left cursor-pointer group"
              >
                <Folder className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#F59E0B] transition-colors" />
                <span className="text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Governance and Documentation</span>
              </button>

              <button
                onClick={() => {
                  logActivity('Resource accessed', 'Opened Shared Drive resource link.', 'info');
                  alert('Shared Drive coming soon');
                }}
                className="flex items-center gap-3 text-left cursor-pointer group"
              >
                <Cloud className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#10B981] transition-colors" />
                <span className="text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Shared Drive</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activities */}
        <div className="xl:col-span-1 bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-neutral-100">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">Recent Activities</h2>

          <div className="flex flex-col gap-3">
            {activities.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic">No recent activities.</p>
            ) : (
              activities.slice(0, 5).map(activity => {
                let iconBg = "bg-[#ECFDF5]";
                let iconColor = "text-[#10B981]";
                let Icon = CheckCircle;

                if (activity.type === 'success') {
                  Icon = CheckCircle; iconBg = "bg-[#ECFDF5]"; iconColor = "text-[#10B981]";
                } else if (activity.type === 'warning') {
                  Icon = AlertTriangle; iconBg = "bg-[#FFFBEB]"; iconColor = "text-[#F59E0B]";
                } else if (activity.type === 'error') {
                  Icon = Volume2; iconBg = "bg-[#FEF2F2]"; iconColor = "text-[#D9291C]";
                }

                const diffMs = Date.now() - new Date(activity.timestamp).getTime();
                const diffMins = Math.floor(diffMs / 60000);
                let timeStr = "Just now";
                if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins}m ago`;
                else if (diffMins >= 60 && diffMins < 1440) timeStr = `${Math.floor(diffMins / 60)}h ago`;
                else if (diffMins >= 1440 && diffMins < 2880) timeStr = "Yesterday";
                else if (diffMins >= 2880) timeStr = new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                return (
                  <div key={activity.id} className="bg-[#F8FAFC] border border-neutral-100/80 p-4 rounded-xl flex gap-3 items-start">
                    <div className={`w-7 h-7 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="w-full min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1E293B] leading-snug">{activity.title}</h4>
                        <span className="text-[10px] sm:text-xs text-[#94A3B8] ml-2 shrink-0">{timeStr}</span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <AppealsModal isOpen={isAppealsOpen} onClose={() => setIsAppealsOpen(false)} />
      <MilestoneModal isOpen={isMilestoneOpen} onClose={() => setIsMilestoneOpen(false)} />
      <NewEventModal isOpen={isNewEventOpen} onClose={() => setIsNewEventOpen(false)} defaultDate={selectedDate} />
      <SubmissionTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setTimeout(() => setSelectedSubmission(null), 200);
        }}
        submission={selectedSubmission}
      />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

    </div>
  )
}
