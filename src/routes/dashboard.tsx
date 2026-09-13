import { useState, useCallback, useMemo } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSessionStore } from "@/stores/session-store"

import { STATS, ACTIVITIES, DEPARTMENT_ORG_MAP, DEPARTMENTS } from "@/components/ui/activity.data"
import { StatCard } from "@/components/ui/stat-card"
import { ActivityRow } from "@/components/ui/activity-row"
import { ActivityDetailModal } from "@/components/ui/activity-detail-modal"
import { ActivityFilter } from "@/components/ui/activity-filter"
import type { Activity } from "@/components/ui/activity.types"

// ─── Signatory Review Dashboard page ──────────────────────────────────────────
// Faithful implementation of Figma node 11621-9591 & 11849-2751
// Thin orchestration layer: state, handlers, derived values only.

export function Dashboard() {
  const name = useSessionStore((state) => state.name)

  const [activitiesList, setActivitiesList] = useState<Activity[]>(ACTIVITIES)
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)

  // Cascade: reset org when dept changes (rerender-functional-setstate)
  const handleDeptSelect = useCallback((dept: string | null) => {
    setSelectedDept(dept)
    setSelectedOrg(null)
  }, [])

  const handleOrgSelect = useCallback((org: string | null) => {
    setSelectedOrg(org)
  }, [])

  const handleActivitySelect = useCallback((activity: Activity) => {
    setActiveActivity(activity)
  }, [])

  const handleModalClose = useCallback(() => {
    setActiveActivity(null)
  }, [])

  const handleModalAction = useCallback(
    (action: "approve" | "return" | "defer", activityId: string) => {
      setActivitiesList((prev) =>
        prev.map((act) => {
          if (act.id !== activityId) return act
          if (action === "return") {
            return { ...act, decision: "Return", status: "Returned" }
          }
          if (action === "defer") {
            return { ...act, decision: "Review" }
          }
          return { ...act, decision: "Review", status: "Accepted" }
        }),
      )
    },
    [],
  )

  const filteredActivities = useMemo(() => {
    if (!selectedDept && !selectedOrg) return activitiesList
    return activitiesList.filter((a) => {
      const deptMatch = !selectedDept || a.department === selectedDept
      const orgMatch = !selectedOrg || a.org === selectedOrg
      return deptMatch && orgMatch
    })
  }, [activitiesList, selectedDept, selectedOrg])

  return (
    <div className="w-full min-h-full bg-[#F5F6F8] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-7">
        {/* Welcome Header per Figma node 11621-9591 */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-sans">
            {name ? `${name} Review Dashboard` : "[ROLE] Review Dashboard"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Academic Term: 2026-2027 • Pending institutional approvals for student activities.
          </p>
        </div>

        {/* Stats Grid matching Figma (07, 42, 04, 53) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Unified Filter Bar */}
        <div className="flex items-center justify-end">
          <ActivityFilter
            departments={DEPARTMENTS}
            departmentOrgMap={DEPARTMENT_ORG_MAP}
            selectedDept={selectedDept}
            selectedOrg={selectedOrg}
            onDeptSelect={handleDeptSelect}
            onOrgSelect={handleOrgSelect}
          />
        </div>

        {/* Activity Table Card matching Figma node 11621-9591 */}
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
                {filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-14 text-center text-sm text-neutral-400"
                    >
                      No activities match the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.map((activity) => (
                    <ActivityRow
                      key={activity.id}
                      activity={activity}
                      onSelect={handleActivitySelect}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Review Details Modal from Figma node 11849-2751 */}
      <ActivityDetailModal
        activity={activeActivity}
        onClose={handleModalClose}
        onAction={handleModalAction}
      />
    </div>
  )
}
