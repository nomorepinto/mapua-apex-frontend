import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { STATS, DEPARTMENT_ORG_MAP, DEPARTMENTS } from "@/components/ui/activity.data"
import { StatCard } from "@/components/ui/stat-card"
import { ActivityRow } from "@/components/ui/activity-row"
import { ActivityDetailModal } from "@/components/ui/activity-detail-modal"
import { ActivityFilter } from "@/components/ui/activity-filter"
import { useReviewDashboard } from "@/hooks/use-review-dashboard"

export function Dashboard() {
  const dashboard = useReviewDashboard()

  return (
    <div className="w-full min-h-full bg-[#F5F6F8] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-7">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-sans">
            {dashboard.name
              ? `${dashboard.name} Review Dashboard`
              : "[ROLE] Review Dashboard"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Academic Term: 2026-2027 • Pending institutional approvals for student activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="flex items-center justify-end">
          <ActivityFilter
            departments={DEPARTMENTS}
            departmentOrgMap={DEPARTMENT_ORG_MAP}
            selectedDept={dashboard.selectedDept}
            selectedOrg={dashboard.selectedOrg}
            onDeptSelect={dashboard.handleDeptSelect}
            onOrgSelect={dashboard.handleOrgSelect}
          />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-neutral-200 text-neutral-500 text-xs font-bold uppercase tracking-wider hover:bg-transparent">
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">
                    ORGANIZATION
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">
                    ACTIVITY NAME
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">
                    SUBMITTED
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">
                    PRIORITY
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500 text-right">
                    DECISION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-14 text-center text-sm text-neutral-400"
                    >
                      No activities match the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  dashboard.filteredActivities.map((activity) => (
                    <ActivityRow
                      key={activity.id}
                      activity={activity}
                      onSelect={dashboard.handleActivitySelect}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ActivityDetailModal
        activity={dashboard.activeActivity}
        onClose={dashboard.handleModalClose}
        onAction={dashboard.handleModalAction}
      />
    </div>
  )
}
