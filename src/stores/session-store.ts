import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type SessionState = {
  name: string | null
  signIn: (name: string) => void
  signOut: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      name: null,
      signIn: (name: string) => {
        set({ name })
      },
      signOut: () => {
        set({ name: null })
      },
    }),
    {
      name: "apex-session-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
