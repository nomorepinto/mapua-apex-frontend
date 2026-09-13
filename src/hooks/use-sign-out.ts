import { useCallback } from "react"
import { useAuth } from "react-oidc-context"

import { useSubmissionStore } from "@/stores/submission-store"

export function useSignOut() {
  const auth = useAuth()

  return useCallback(() => {
    useSubmissionStore.getState().resetDraft()
    auth.signoutRedirect()
  }, [auth])
}
