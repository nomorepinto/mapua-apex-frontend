import { useCallback } from "react"
import { useAuth } from "react-oidc-context"

export function useSignOut() {
  const auth = useAuth()

  return useCallback(() => {
    auth.signoutRedirect()
  }, [auth])
}
