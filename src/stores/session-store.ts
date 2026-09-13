import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type AppRole = "students" | "signatories" | "admin"

export type SessionState = {
  name: string | null
  role: AppRole | null
  signIn: (name: string, role: AppRole) => void
  signOut: () => void
}

export const ROLE_LABELS: Record<AppRole, string> = {
  students: "Student organization",
  signatories: "Signatory",
  admin: "Office of Student Affairs",
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      name: null,
      role: null,
      signIn: (name: string, role: AppRole) => {
        set({ name, role })
      },
      signOut: () => {
        set({ name: null, role: null })
      },
    }),
    {
      name: "apex-session-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
