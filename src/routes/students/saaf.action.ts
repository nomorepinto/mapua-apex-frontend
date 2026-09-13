import type { ActionFunctionArgs } from "react-router"

import type { SubmissionActionData } from "@/components/submission/types"
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

  useOrgStore.getState().addSubmission({
    activity_classification: (data.activityType as string) || "co-curricular",
    current_signatory: "Adviser",
    target_date:
      (data.dateOfEvent as string) || new Date().toISOString().split("T")[0],
    activity_details: {
      title: (data.activityTitle as string) || "Untitled Activity",
      description: (data.activityDescription as string) || "",
      venue: (data.activityVenue as string) || "",
      date: (data.dateOfEvent as string) || "",
    },
  })
  useOrgStore.getState().clearSaafDraft()
  useOrgStore.getState().clearReservationDraft()
  useOrgStore.getState().clearSubmissionStart()

  return {
    success: true,
    message: "Activity Application Submitted!",
  }
}
