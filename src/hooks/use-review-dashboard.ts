import { useCallback, useMemo, useState } from "react"
import { useAuth } from "react-oidc-context"

import {
  buildDepartmentOrgMap,
  computeReviewStats,
} from "@/components/ui/activity.data"
import type { Activity } from "@/components/ui/activity.types"

export function useReviewDashboard() {
  const auth = useAuth()
  const name = auth.user?.profile?.email || auth.user?.profile?.name || "Guest"
  const [activitiesList, setActivitiesList] = useState<Activity[]>([])
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)

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
        })
      )
    },
    []
  )

  const stats = useMemo(
    () => computeReviewStats(activitiesList),
    [activitiesList]
  )
  const departmentOrgMap = useMemo(
    () => buildDepartmentOrgMap(activitiesList),
    [activitiesList]
  )
  const departments = useMemo(
    () => Object.keys(departmentOrgMap),
    [departmentOrgMap]
  )

  const filteredActivities =
    !selectedDept && !selectedOrg
      ? activitiesList
      : activitiesList.filter((activity) => {
          const deptMatch = !selectedDept || activity.department === selectedDept
          const orgMatch = !selectedOrg || activity.org === selectedOrg
          return deptMatch && orgMatch
        })

  return {
    name,
    stats,
    departments,
    departmentOrgMap,
    selectedDept,
    selectedOrg,
    activeActivity,
    filteredActivities,
    hasActivities: activitiesList.length > 0,
    handleDeptSelect,
    handleOrgSelect,
    handleActivitySelect,
    handleModalClose,
    handleModalAction,
  }
}
