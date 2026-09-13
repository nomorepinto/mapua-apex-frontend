import { useSubmissionStore } from "@/stores/submission-store"
import { stampSubmission } from "@/lib/submission-draft"
import type { Submission } from "@/lib/types"

export function buildCombinedProposalPayload(): Submission {
  return stampSubmission(useSubmissionStore.getState().draft)
}
