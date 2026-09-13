import { useCallback, useState } from "react"

import type { TrackedSubmission } from "@/components/org-dashboard/types"

export function useOrgDashboard() {
  const [isAppealsOpen, setIsAppealsOpen] = useState(false)
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(false)
  const [isNewEventOpen, setIsNewEventOpen] = useState(false)
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] =
    useState<TrackedSubmission | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const openAppeals = useCallback(() => setIsAppealsOpen(true), [])
  const closeAppeals = useCallback(() => setIsAppealsOpen(false), [])
  const openMilestone = useCallback(() => setIsMilestoneOpen(true), [])
  const closeMilestone = useCallback(() => setIsMilestoneOpen(false), [])
  const openNewEvent = useCallback(() => setIsNewEventOpen(true), [])
  const closeNewEvent = useCallback(() => setIsNewEventOpen(false), [])
  const closeNotifications = useCallback(() => setIsNotificationsOpen(false), [])

  const closeTracker = useCallback(() => {
    setIsTrackerOpen(false)
    setTimeout(() => setSelectedSubmission(null), 200)
  }, [])

  return {
    isAppealsOpen,
    isMilestoneOpen,
    isNewEventOpen,
    isTrackerOpen,
    selectedSubmission,
    isNotificationsOpen,
    selectedDate,
    setSelectedDate,
    calendarEvents: {} as Record<string, { title: string; time?: string }[]>,
    milestoneTasks: [],
    activities: [],
    appeals: [],
    openAppeals,
    closeAppeals,
    closeMilestone,
    openMilestone,
    openNewEvent,
    closeNewEvent,
    closeTracker,
    closeNotifications,
  }
}
