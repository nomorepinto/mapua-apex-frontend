import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
            {dashboard.roleLabel} Review Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Academic Term: 2026-2027 • Pending institutional approvals for student activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {dashboard.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="flex items-center justify-end">
          <ActivityFilter
            departments={dashboard.departments}
            departmentOrgMap={dashboard.departmentOrgMap}
            selectedDept={dashboard.selectedDept}
            selectedOrg={dashboard.selectedOrg}
            onDeptSelect={dashboard.handleDeptSelect}
            onOrgSelect={dashboard.handleOrgSelect}
          />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[40rem]">
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
                    TYPE
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500 text-right">
                    DECISION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-14 text-center text-sm text-neutral-400"
                    >
                      Loading your review queue…
                    </TableCell>
                  </TableRow>
                ) : dashboard.filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-14 text-center text-sm text-neutral-400"
                    >
                      {dashboard.hasActivities
                        ? "No activities match the selected filters."
                        : "No submissions to review yet."}
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

        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100">
            <h2 className="text-lg font-extrabold text-neutral-900">Appeals on your desk</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Resolve open appeals routed to your signatory account.
            </p>
            {dashboard.actionError ? (
              <p className="mt-2 text-xs font-semibold text-rose-600">{dashboard.actionError}</p>
            ) : null}
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[40rem]">
              <TableHeader>
                <TableRow className="border-b border-neutral-200 text-neutral-500 text-xs font-bold uppercase tracking-wider hover:bg-transparent">
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">Appeal</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">Submission</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">Filed</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500">Status</TableHead>
                  <TableHead className="py-4 px-6 font-bold text-neutral-500 text-right">
                    Resolve
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.appealsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-neutral-400">
                      Loading appeals…
                    </TableCell>
                  </TableRow>
                ) : dashboard.appealRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-neutral-400">
                      No appeals assigned to you.
                    </TableCell>
                  </TableRow>
                ) : (
                  dashboard.appealRows.map((appeal) => (
                    <TableRow key={appeal.appeal_id} className="border-b border-neutral-100">
                      <TableCell className="py-4 px-6 font-mono text-xs font-bold">
                        {appeal.appeal_id}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-sm font-medium">
                        {appeal.title}
                        {appeal.comment ? (
                          <p className="mt-1 text-xs font-normal text-neutral-500">{appeal.comment}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-sm text-neutral-500">
                        {appeal.date}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs font-bold">{appeal.status}</TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        {appeal.status === "Under Review" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={dashboard.isActing}
                              onClick={() => dashboard.handleResolveAppeal(appeal, "overturned")}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                            >
                              Overturn
                            </button>
                            <button
                              type="button"
                              disabled={dashboard.isActing}
                              onClick={() => dashboard.handleResolveAppeal(appeal, "upheld")}
                              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                            >
                              Uphold
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400">Resolved</span>
                        )}
                      </TableCell>
                    </TableRow>
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
        isActing={dashboard.isActing}
        actionError={dashboard.actionError}
      />
    </div>
  )
}
