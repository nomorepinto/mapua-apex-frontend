import { Link } from "react-router"

import { CalendarCard } from "@/components/org-dashboard/calendar-card"
import { MilestonePreview } from "@/components/org-dashboard/milestone-preview"
import { PortfolioSection } from "@/components/org-dashboard/portfolio-section"
import { ProjectStatusTable } from "@/components/org-dashboard/project-status-table"
import { RecentActivities } from "@/components/org-dashboard/recent-activities"
import { ResourceLinks } from "@/components/org-dashboard/resource-links"
import { AppealsModal } from "@/components/org/AppealsModal"
import { MilestoneModal } from "@/components/org/MilestoneModal"
import { NewEventModal } from "@/components/org/NewEventModal"
import { NotificationsModal } from "@/components/org/NotificationsModal"
import { SubmissionTrackerModal } from "@/components/org/SubmissionTrackerModal"
import { useOrgDashboard } from "@/hooks/use-org-dashboard"

export function OrgDashboard() {
  const dashboard = useOrgDashboard()

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1E293B]">
          Organization Dashboard
        </h1>
        <Link
          to="/students/submissions"
          className="inline-block cursor-pointer rounded-xl bg-[#1E293B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
        >
          Create Project/Event
        </Link>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <PortfolioSection />
        <CalendarCard
          selectedDate={dashboard.selectedDate}
          calendarEvents={dashboard.calendarEvents}
          onSelectDate={dashboard.setSelectedDate}
          onNewEvent={dashboard.openNewEvent}
        />
      </div>

      <ProjectStatusTable
        appeals={dashboard.appeals}
        onViewAll={dashboard.openAppeals}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <MilestonePreview
            tasks={dashboard.milestoneTasks}
            onViewAll={dashboard.openMilestone}
          />
          <ResourceLinks onAccess={dashboard.handleResourceAccess} />
        </div>
        <RecentActivities activities={dashboard.activities} />
      </div>

      <AppealsModal
        isOpen={dashboard.isAppealsOpen}
        onClose={dashboard.closeAppeals}
      />
      <MilestoneModal
        isOpen={dashboard.isMilestoneOpen}
        onClose={dashboard.closeMilestone}
      />
      <NewEventModal
        isOpen={dashboard.isNewEventOpen}
        onClose={dashboard.closeNewEvent}
        defaultDate={dashboard.selectedDate}
      />
      <SubmissionTrackerModal
        isOpen={dashboard.isTrackerOpen}
        onClose={dashboard.closeTracker}
        submission={dashboard.selectedSubmission}
      />
      <NotificationsModal
        isOpen={dashboard.isNotificationsOpen}
        onClose={dashboard.closeNotifications}
      />
    </div>
  )
}
