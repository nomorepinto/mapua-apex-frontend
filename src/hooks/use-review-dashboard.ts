import { useCallback, useMemo, useState } from "react"
import { useAuth } from "react-oidc-context"

import {
  buildDepartmentOrgMap,
  computeReviewStats,
} from "@/components/ui/activity.data"
import type { Activity } from "@/components/ui/activity.types"
import {
  roleFromCognitoGroups,
  signatoryRoleLabel,
} from "@/components/admin-osa/signatory-roles"
import {
  useApproveSubmissionMutation,
  useCurrentSignatoryQuery,
  useDenySubmissionMutation,
  useResolveAppealMutation,
  useSignatoryAppealsQuery,
  useSignatoryQueueQuery,
  useSignatorySubmissionDetailQuery,
} from "@/hooks/use-signatory"
import { apiAppealToRow, apiSubmissionToActivity } from "@/lib/dynamodb-adapters"

export function useReviewDashboard() {
  const auth = useAuth()
  const groups = (auth.user?.profile["cognito:groups"] as string[]) || []
  const meQuery = useCurrentSignatoryQuery()
  const role = meQuery.data?.role || roleFromCognitoGroups(groups)
  const roleLabel = role ? signatoryRoleLabel(role) : "Signatory"
  const queueQuery = useSignatoryQueueQuery()
  const appealsQuery = useSignatoryAppealsQuery()
  const approveMutation = useApproveSubmissionMutation()
  const denyMutation = useDenySubmissionMutation()
  const resolveMutation = useResolveAppealMutation()

  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [activeKeys, setActiveKeys] = useState<{
    eventId: string
    submissionId: string
  } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const detailQuery = useSignatorySubmissionDetailQuery(
    activeKeys?.eventId,
    activeKeys?.submissionId
  )

  const activitiesList = useMemo(
    () => (queueQuery.data || []).map(apiSubmissionToActivity),
    [queueQuery.data]
  )

  const appealRows = useMemo(
    () => (appealsQuery.data || []).map((appeal) => apiAppealToRow(appeal)),
    [appealsQuery.data]
  )

  const activeActivity = useMemo(() => {
    if (detailQuery.data) return apiSubmissionToActivity(detailQuery.data)
    if (!activeKeys) return null
    return (
      activitiesList.find(
        (activity) =>
          activity.eventId === activeKeys.eventId &&
          activity.submissionId === activeKeys.submissionId
      ) || null
    )
  }, [activeKeys, activitiesList, detailQuery.data])

  const handleDeptSelect = useCallback((dept: string | null) => {
    setSelectedDept(dept)
    setSelectedOrg(null)
  }, [])

  const handleOrgSelect = useCallback((org: string | null) => {
    setSelectedOrg(org)
  }, [])

  const handleActivitySelect = useCallback((activity: Activity) => {
    setActionError(null)
    setActiveKeys({
      eventId: activity.eventId,
      submissionId: activity.submissionId,
    })
  }, [])

  const handleModalClose = useCallback(() => {
    setActiveKeys(null)
    setActionError(null)
  }, [])

  const handleModalAction = useCallback(
    async (
      action: "approve" | "return" | "defer",
      _activityId: string,
      details?: { title: string; message: string }
    ) => {
      if (!activeKeys) return
      if (action === "defer") {
        handleModalClose()
        return
      }

      setActionError(null)
      try {
        if (action === "approve") {
          await approveMutation.mutateAsync(activeKeys)
        } else {
          const comment = [details?.title, details?.message]
            .map((part) => part?.trim())
            .filter(Boolean)
            .join(" — ")
          if (!comment) {
            setActionError("A return comment is required.")
            return
          }
          await denyMutation.mutateAsync({ ...activeKeys, comment })
        }
        handleModalClose()
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Could not update this submission."
        )
      }
    },
    [activeKeys, approveMutation, denyMutation, handleModalClose]
  )

  const handleResolveAppeal = useCallback(
    async (appeal: {
      event_id: string
      submission_id: string
      appeal_id: string
    }, resolution: "upheld" | "overturned") => {
      setActionError(null)
      try {
        await resolveMutation.mutateAsync({
          eventId: appeal.event_id,
          submissionId: appeal.submission_id,
          appealId: appeal.appeal_id,
          resolution,
        })
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Could not resolve this appeal."
        )
      }
    },
    [resolveMutation]
  )

  const stats = useMemo(() => computeReviewStats(activitiesList), [activitiesList])
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
    roleLabel,
    stats,
    departments,
    departmentOrgMap,
    selectedDept,
    selectedOrg,
    activeActivity,
    filteredActivities,
    hasActivities: activitiesList.length > 0,
    isLoading: queueQuery.isLoading,
    isActing:
      approveMutation.isPending || denyMutation.isPending || resolveMutation.isPending,
    actionError,
    appealRows,
    appealsLoading: appealsQuery.isLoading,
    handleDeptSelect,
    handleOrgSelect,
    handleActivitySelect,
    handleModalClose,
    handleModalAction,
    handleResolveAppeal,
  }
}
