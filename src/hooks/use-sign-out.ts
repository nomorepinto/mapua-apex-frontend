import { useCallback } from "react"
import { useNavigate } from "react-router"

import { useSessionStore } from "@/stores/session-store"

export function useSignOut() {
  const navigate = useNavigate()
  const signOut = useSessionStore((state) => state.signOut)

  return useCallback(() => {
    signOut()
    navigate("/")
  }, [navigate, signOut])
}
