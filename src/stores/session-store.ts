import { create } from "zustand"

type SessionState = {
  name: string | null
  signIn: (name: string) => void
  signOut: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  name: null,
  signIn: (name) => {
    set({ name })
  },
  signOut: () => {
    set({ name: null })
  },
}))
