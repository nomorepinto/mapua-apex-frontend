import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type {
  ApiSubmission,
  ApiOrganization,
  ApiSignatory,
  ApiAppeal,
  ApiNotification,
} from "@/lib/dynamodb-adapters"

export const ADMIN_KEYS = {
  submissions: (params?: Record<string, string | undefined>) =>
    ["admin-submissions", params] as const,
  submissionDetail: (eventId: string, submissionId: string) =>
    ["admin-submission-detail", eventId, submissionId] as const,
  organizations: ["admin-organizations"] as const,
  signatories: ["admin-signatories"] as const,
  appeals: ["admin-appeals"] as const,
}

/**
 * Fetch all submissions system-wide with optional filters
 */
export function useAdminSubmissionsQuery(params?: {
  status?: "pending" | "approved" | "denied"
  activity_type?: string
}) {
  return useQuery({
    queryKey: ADMIN_KEYS.submissions(params),
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiSubmission[] }>("/admins/submissions", {
        params,
      })
      return res.data || []
    },
  })
}

/**
 * Fetch full submission document + notifications + appeals for admin
 */
export function useAdminSubmissionDetailQuery(eventId?: string, submissionId?: string) {
  return useQuery({
    queryKey: ADMIN_KEYS.submissionDetail(eventId || "", submissionId || ""),
    queryFn: async () => {
      if (!eventId || !submissionId) throw new Error("Event ID and Submission ID required")
      const res = await apiClient.get<{
        data: ApiSubmission & {
          notifications: ApiNotification[]
          appeals: ApiAppeal[]
        }
      }>(`/admins/events/${eventId}/submissions/${submissionId}`)
      return res.data
    },
    enabled: Boolean(eventId && submissionId),
  })
}

/**
 * Fetch all registered organizations
 */
export function useOrganizationsQuery() {
  return useQuery({
    queryKey: ADMIN_KEYS.organizations,
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiOrganization[] }>("/admins/organizations")
      return res.data || []
    },
  })
}

/**
 * Create a new organization
 */
export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const res = await apiClient.post<{ data: ApiOrganization }>(
        "/admins/organizations",
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.organizations })
    },
  })
}

/**
 * Fetch all registered signatories
 */
export function useSignatoriesQuery() {
  return useQuery({
    queryKey: ADMIN_KEYS.signatories,
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiSignatory[] }>("/admins/signatories")
      return res.data || []
    },
  })
}

/**
 * Create a new signatory
 */
export function useCreateSignatoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      name: string
      role: "adviser" | "cdm" | "dean"
      organization_id: string
    }) => {
      const res = await apiClient.post<{ data: ApiSignatory }>(
        "/admins/signatories",
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.signatories })
    },
  })
}

/**
 * Update an existing signatory
 */
export function useUpdateSignatoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      signatoryId,
      ...payload
    }: {
      signatoryId: string
      name: string
      role: "adviser" | "cdm" | "dean"
      organization_id: string
    }) => {
      const res = await apiClient.put<{ data: ApiSignatory }>(
        `/admins/signatories/${signatoryId}`,
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.signatories })
    },
  })
}
