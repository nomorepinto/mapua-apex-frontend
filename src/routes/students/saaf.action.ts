import type { ActionFunctionArgs } from "react-router"

import type { SubmissionActionData } from "@/components/submission/types"
import { useSubmissionStore } from "@/stores/submission-store"

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

  useSubmissionStore.getState().finalizeDraft()
  useSubmissionStore.getState().resetDraft()

  return {
    success: true,
    message: "Activity Application Submitted!",
  }
}
