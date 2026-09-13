import { useCallback, useState } from "react"

import { ACTIVITIES } from "@/components/ui/activity.data"
import type { Activity } from "@/components/ui/activity.types"
import { useSessionStore } from "@/stores/session-store"

export function useReviewDashboard() {
  const name = useSessionStore((state) => state.name)
  const [activitiesList, setActivitiesList] = useState<Activity[]>(ACTIVITIES)
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
    selectedDept,
    selectedOrg,
    activeActivity,
    filteredActivities,
    handleDeptSelect,
    handleOrgSelect,
    handleActivitySelect,
    handleModalClose,
    handleModalAction,
  }
}
