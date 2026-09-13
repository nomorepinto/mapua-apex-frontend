import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type {
  ApiSubmission,
  ApiNotification,
  ApiAppeal,
  ApiDeadline,
} from "@/lib/dynamodb-adapters"

export const SUBMISSION_KEYS = {
  all: ["org-submissions"] as const,
  detail: (eventId: string, submissionId: string) =>
    ["submission-detail", eventId, submissionId] as const,
  notifications: (eventId: string, submissionId: string) =>
    ["submission-notifications", eventId, submissionId] as const,
  appeals: (eventId: string, submissionId: string) =>
    ["submission-appeals", eventId, submissionId] as const,
  deadlines: ["org-deadlines"] as const,
}

/**
 * Fetch all submissions belonging to the logged-in student's organization
 */
export function useOrgSubmissionsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.all,
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiSubmission[] }>("/students/submissions")
      return res.data || []
    },
    enabled: options?.enabled ?? true,
  })
}

/**
 * Fetch a single full SAAF submission
 */
export function useSubmissionDetailQuery(eventId?: string, submissionId?: string) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.detail(eventId || "", submissionId || ""),
    queryFn: async () => {
      if (!eventId || !submissionId) throw new Error("Event ID and Submission ID required")
      const res = await apiClient.get<{ data: ApiSubmission }>(
        `/students/events/${eventId}/submissions/${submissionId}`
      )
      return res.data
    },
    enabled: Boolean(eventId && submissionId),
  })
}

/**
 * Fetch review stepper/notifications for a submission
 */
export function useSubmissionNotificationsQuery(eventId?: string, submissionId?: string) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.notifications(eventId || "", submissionId || ""),
    queryFn: async () => {
      if (!eventId || !submissionId) return []
      const res = await apiClient.get<{ data: ApiNotification[] }>(
        `/students/events/${eventId}/submissions/${submissionId}/notifications`
      )
      return res.data || []
    },
    enabled: Boolean(eventId && submissionId),
  })
}

/**
 * Fetch appeals for a submission
 */
export function useSubmissionAppealsQuery(eventId?: string, submissionId?: string) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.appeals(eventId || "", submissionId || ""),
    queryFn: async () => {
      if (!eventId || !submissionId) return []
      const res = await apiClient.get<{ data: ApiAppeal[] }>(
        `/students/events/${eventId}/submissions/${submissionId}/appeals`
      )
      return res.data || []
    },
    enabled: Boolean(eventId && submissionId),
  })
}

/**
 * Fetch upcoming deadlines for the organization
 */
export function useOrgDeadlinesQuery() {
  return useQuery({
    queryKey: SUBMISSION_KEYS.deadlines,
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiDeadline[] }>("/students/deadlines")
      return res.data || []
    },
  })
}

/**
 * Mutation to create a new SAAF submission
 */
export function useCreateSubmissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await apiClient.post<{ data: ApiSubmission }>(
        "/students/submissions",
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.all })
    },
  })
}

/**
 * Mutation to update/resubmit a denied or pending submission
 */
export function useUpdateSubmissionMutation(eventId: string, submissionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await apiClient.put<{ data: ApiSubmission }>(
        `/students/events/${eventId}/submissions/${submissionId}`,
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.all })
      queryClient.invalidateQueries({
        queryKey: SUBMISSION_KEYS.detail(eventId, submissionId),
      })
      queryClient.invalidateQueries({
        queryKey: SUBMISSION_KEYS.notifications(eventId, submissionId),
      })
    },
  })
}

/**
 * Mutation to submit an appeal for a denied submission
 */
export function useCreateAppealMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { event_id: string; submission_id: string; comment: string }) => {
      const res = await apiClient.post<{ data: ApiAppeal }>("/students/appeals", payload)
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SUBMISSION_KEYS.appeals(variables.event_id, variables.submission_id),
      })
      queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.all })
    },
  })
}
