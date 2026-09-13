import type { ActionFunctionArgs } from "react-router"

import type { SubmissionActionData } from "@/components/submission/types"
import { apiClient } from "@/lib/api-client"
import { buildSaafApiPayload } from "@/lib/dynamodb-adapters"
import { queryClient } from "@/main"
import { SUBMISSION_KEYS } from "@/hooks/use-submissions"
import { useOrgStore } from "@/stores/org-store"

export async function action({
  request,
}: ActionFunctionArgs): Promise<SubmissionActionData> {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())

  if (!data.activityType) {
    return {
      success: false,
      errors: { activityType: "Please select an activity classification" },
    }
  }

  const saafDraft = useOrgStore.getState().saafDraft
  const reservationDraft = useOrgStore.getState().reservationDraft

  if (!saafDraft) {
    return {
      success: false,
      errors: { activityType: "Form draft is missing" },
    }
  }

  try {
    const payload = buildSaafApiPayload(saafDraft, reservationDraft)
    await apiClient.post("/students/submissions", payload)

    // Clear drafts from Zustand client store
    useOrgStore.getState().clearSaafDraft()
    useOrgStore.getState().clearReservationDraft()
    useOrgStore.getState().clearSubmissionStart()

    // Invalidate server queries
    queryClient.invalidateQueries({ queryKey: SUBMISSION_KEYS.all })

    return {
      success: true,
      message: "Activity Application Submitted Successfully!",
    }
  } catch (error) {
    console.error("Submission failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
    }
  }
}

