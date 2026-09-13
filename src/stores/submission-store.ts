import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { useShallow } from "zustand/shallow"

import type { ReservationDraft } from "@/components/reservation/types"
import type { SaafDraft } from "@/components/submission/types"
import {
  applyReservationToSubmission,
  applySaafToSubmission,
  assignDraftKeys,
  createEmptySubmission,
  stampSubmission,
  submissionToReservation,
  submissionToSaaf,
} from "@/lib/submission-draft"
import type { Submission } from "@/lib/types"

type SubmissionDraftState = {
  hasHydrated: boolean
  draft: Submission
  setHasHydrated: (hasHydrated: boolean) => void
  startWizard: (eventName: string, reserveFacilities: boolean) => void
  updateFromSaaf: (saaf: SaafDraft) => void
  updateFromReservation: (reservation: ReservationDraft) => void
  finalizeDraft: () => Submission
  resetDraft: () => void
}

const initialDraft = createEmptySubmission()

export const useSubmissionStore = create<SubmissionDraftState>()(
  persist(
    devtools(
      immer((set, get) => ({
        hasHydrated: false,
        draft: initialDraft,

        setHasHydrated: (hasHydrated) =>
          set(
            (state) => {
              state.hasHydrated = hasHydrated
            },
            false,
            "submission/setHasHydrated"
          ),

        startWizard: (eventName, reserveFacilities) =>
          set(
            (state) => {
              if (!state.draft.PK || !state.draft.SK) {
                const keyed = assignDraftKeys(state.draft)
                state.draft.PK = keyed.PK
                state.draft.SK = keyed.SK
              }
              state.draft.activity_details.title_and_nature = eventName
              state.draft.venue_reservation.has_reservation = reserveFacilities
            },
            false,
            "submission/startWizard"
          ),

        updateFromSaaf: (saaf) =>
          set(
            (state) => {
              state.draft = applySaafToSubmission(state.draft, saaf)
            },
            false,
            "submission/updateSaaf"
          ),

        updateFromReservation: (reservation) =>
          set(
            (state) => {
              state.draft = applyReservationToSubmission(state.draft, reservation)
            },
            false,
            "submission/updateReservation"
          ),

        finalizeDraft: () => {
          const stamped = stampSubmission(get().draft)
          set(
            (state) => {
              state.draft = stamped
            },
            false,
            "submission/finalize"
          )
          return stamped
        },

        resetDraft: () =>
          set(
            (state) => {
              state.draft = createEmptySubmission()
            },
            false,
            "submission/reset"
          ),
      })),
      {
        name: "SubmissionStore",
        enabled: import.meta.env.DEV,
      }
    ),
    {
      name: "apex_submission_draft_v1",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      partialize: (state) => ({ draft: state.draft }),
      migrate: (persisted) => {
        const parsed = persisted as { draft?: Submission }
        return {
          draft: {
            ...createEmptySubmission(),
            ...parsed.draft,
          },
        }
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate submission draft", error)
        }
        state?.setHasHydrated(true)
      },
    }
  )
)

if (typeof window !== "undefined") {
  const markHydrated = () => useSubmissionStore.setState({ hasHydrated: true })
  if (useSubmissionStore.persist.hasHydrated()) {
    markHydrated()
  }
  useSubmissionStore.persist.onFinishHydration(markHydrated)
}

export const useSubmissionHydrated = () =>
  useSubmissionStore((state) => state.hasHydrated)

export const useHasReservation = () =>
  useSubmissionStore((state) => state.draft.venue_reservation.has_reservation)

export const useWizardStart = () =>
  useSubmissionStore(
    useShallow((state) => ({
      eventName: state.draft.activity_details.title_and_nature,
      hasReservation: state.draft.venue_reservation.has_reservation,
      hasHydrated: state.hasHydrated,
    }))
  )

export const useSaafDraft = () =>
  useSubmissionStore((state) => submissionToSaaf(state.draft))

export const useReservationDraft = () =>
  useSubmissionStore((state) => submissionToReservation(state.draft))

export const useSubmissionActions = () =>
  useSubmissionStore(
    useShallow((state) => ({
      startWizard: state.startWizard,
      updateFromSaaf: state.updateFromSaaf,
      updateFromReservation: state.updateFromReservation,
      finalizeDraft: state.finalizeDraft,
      resetDraft: state.resetDraft,
    }))
  )
