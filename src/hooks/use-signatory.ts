import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiSubmission, ApiSignatory } from "@/lib/dynamodb-adapters"

export const SIGNATORY_KEYS = {
  me: ["signatory-me"] as const,
  queue: ["signatory-queue"] as const,
  detail: (eventId: string, submissionId: string) =>
    ["signatory-submission-detail", eventId, submissionId] as const,
}

/**
 * Fetch the signed-in signatory (JWT custom:signatory_id).
 */
export function useCurrentSignatoryQuery() {
  return useQuery({
    queryKey: SIGNATORY_KEYS.me,
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiSignatory }>("/signatories/me")
      return res.data
    },
  })
}

/**
 * Fetch submissions currently in this signatory's queue (GSI2), including returned papers.
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

function commentMutation(path: string) {
  return async ({
    eventId,
    submissionId,
    comment,
  }: {
    eventId: string
    submissionId: string
    comment: string
  }) => {
    const res = await apiClient.post<{ data?: unknown }>(
      `/signatories/events/${eventId}/submissions/${submissionId}/${path}`,
      { comment }
    )
    return res
  }
}

/**
 * Return a submission for revision. It stays on this desk.
 */
export function useReturnSubmissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: commentMutation("return"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIGNATORY_KEYS.queue })
    },
  })
}

/**
 * Deny a submission. It leaves the desk queue and cannot be edited.
 */
export function useDenySubmissionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: commentMutation("deny"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIGNATORY_KEYS.queue })
    },
  })
}
