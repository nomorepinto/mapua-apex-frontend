import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiSubmission, ApiAppeal } from "@/lib/dynamodb-adapters"

export const SIGNATORY_KEYS = {
  queue: ["signatory-queue"] as const,
  detail: (eventId: string, submissionId: string) =>
    ["signatory-submission-detail", eventId, submissionId] as const,
  appeals: ["signatory-appeals"] as const,
}

/**
 * Fetch all pending submissions currently in this signatory's queue (GSI2)
 */
export function useSignatoryQueueQuery() {
  return useQuery({
    queryKey: SIGNATORY_KEYS.queue,
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiSubmission[] }>("/signatories/submissions")
      return res.data || []
    },
  })
}

/**
 * Fetch one full SAAF on this signatory's desk
 */
export function useSignatorySubmissionDetailQuery(eventId?: string, submissionId?: string) {
  return useQuery({
    queryKey: SIGNATORY_KEYS.detail(eventId || "", submissionId || ""),
    queryFn: async () => {
      if (!eventId || !submissionId) throw new Error("Event ID and Submission ID required")
      const res = await apiClient.get<{ data: ApiSubmission }>(
        `/signatories/events/${eventId}/submissions/${submissionId}`
      )
      return res.data
    },
    enabled: Boolean(eventId && submissionId),
  })
}

/**
 * Fetch open appeals routed to this signatory
 */
export function useSignatoryAppealsQuery() {
  return useQuery({
    queryKey: SIGNATORY_KEYS.appeals,
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiAppeal[] }>("/signatories/appeals")
      return res.data || []
    },
  })
}

/**
 * Mutation to approve a submission
 */
export function useApproveSubmissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      submissionId,
    }: {
      eventId: string
      submissionId: string
    }) => {
      const res = await apiClient.post<{ data: { event_id: string; submission_id: string; status: string } }>(
        `/signatories/events/${eventId}/submissions/${submissionId}/approve`
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIGNATORY_KEYS.queue })
    },
  })
}

/**
 * Mutation to deny a submission with required comment
 */
export function useDenySubmissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      submissionId,
      comment,
    }: {
      eventId: string
      submissionId: string
      comment: string
    }) => {
      const res = await apiClient.post<{ data?: unknown }>(
        `/signatories/events/${eventId}/submissions/${submissionId}/deny`,
        { comment }
      )
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIGNATORY_KEYS.queue })
    },
  })
}

/**
 * Mutation to resolve an appeal (upheld or overturned)
 */
export function useResolveAppealMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      submissionId,
      appealId,
      resolution,
      comment,
    }: {
      eventId: string
      submissionId: string
      appealId: string
      resolution: "upheld" | "overturned"
      comment?: string
    }) => {
      const res = await apiClient.post<{ data: ApiAppeal }>(
        `/signatories/events/${eventId}/submissions/${submissionId}/appeals/${appealId}/resolve`,
        { resolution, comment }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIGNATORY_KEYS.appeals })
      queryClient.invalidateQueries({ queryKey: SIGNATORY_KEYS.queue })
    },
  })
}
