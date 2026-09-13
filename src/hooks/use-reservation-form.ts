import { useCallback, useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

import { buildCombinedProposalPayload } from "@/components/reservation/build-proposal-payload"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import type {
  AVItem,
  EquipmentFlags,
  FacilityItem,
  ReservationDraft,
  RoomItem,
} from "@/components/reservation/types"
import { saveProposalPdf } from "@/lib/save-proposal-pdf"
import {
  submissionToReservation,
  submissionToSaaf,
} from "@/lib/submission-draft"
import {
  useSubmissionActions,
  useSubmissionStore,
} from "@/stores/submission-store"

export function useReservationForm() {
  const navigate = useNavigate()
  const submission = useSubmissionStore((state) => state.draft)
  const { updateFromReservation, finalizeDraft, resetDraft } =
    useSubmissionActions()
  const draft = useMemo(
    () => submissionToReservation(submission),
    [submission]
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useScrollToTop()

  const commit = useCallback(
    (next: ReservationDraft) => {
      updateFromReservation(next)
    },
    [updateFromReservation]
  )

  const updateField = useCallback(
    <K extends keyof ReservationDraft>(key: K, value: ReservationDraft[K]) => {
      commit({ ...draft, [key]: value })
    },
    [commit, draft]
  )

  const toggleEquipment = useCallback(
    (key: keyof EquipmentFlags, checked: boolean) => {
      commit({
        ...draft,
        equipment: { ...draft.equipment, [key]: checked },
      })
    },
    [commit, draft]
  )

  const handleAddFacilityItem = useCallback(() => {
    commit({
      ...draft,
      facilityItems: [
        ...draft.facilityItems,
        {
          id: String(Date.now()),
          item: String(draft.facilityItems.length + 1),
          dateOfUse: "",
          timeOfUse: "",
          location: "",
        },
      ],
    })
  }, [commit, draft])

  const handleRemoveFacilityItem = useCallback(
    (id: string) => {
      if (draft.facilityItems.length === 1) return
      commit({
        ...draft,
        facilityItems: draft.facilityItems.filter((item) => item.id !== id),
      })
    },
    [commit, draft]
  )

  const handleUpdateFacilityItem = useCallback(
    (id: string, field: keyof FacilityItem, value: string) => {
      commit({
        ...draft,
        facilityItems: draft.facilityItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      })
    },
    [commit, draft]
  )

  const handleRemoveRoomItem = useCallback(
    (id: string) => {
      if (draft.roomItems.length === 1) return
      commit({
        ...draft,
        roomItems: draft.roomItems.filter((item) => item.id !== id),
      })
    },
    [commit, draft]
  )

  const handleUpdateRoomItem = useCallback(
    (id: string, field: keyof RoomItem, value: string) => {
      commit({
        ...draft,
        roomItems: draft.roomItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      })
    },
    [commit, draft]
  )

  const handleAddAvItem = useCallback(() => {
    commit({
      ...draft,
      avItems: [
        ...draft.avItems,
        {
          id: String(Date.now()),
          dateNeeded: "",
          timeNeeded: "",
          equipmentNeeded: "Others",
          remarks: "",
        },
      ],
    })
  }, [commit, draft])

  const handleRemoveAvItem = useCallback(
    (id: string) => {
      if (draft.avItems.length === 1) return
      commit({
        ...draft,
        avItems: draft.avItems.filter((item) => item.id !== id),
      })
    },
    [commit, draft]
  )

  const handleUpdateAvItem = useCallback(
    (id: string, field: keyof AVItem, value: string) => {
      commit({
        ...draft,
        avItems: draft.avItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      })
    },
    [commit, draft]
  )

  const handleGoBack = useCallback(() => {
    window.scrollTo(0, 0)
    navigate("/students/submissions/saaf")
  }, [navigate])

  const handleInitiateSubmit = useCallback(
    (e: FormEvent, form: HTMLFormElement | null) => {
      e.preventDefault()
      if (form && form.reportValidity()) {
        setShowConfirmModal(true)
      }
    },
    []
  )

  const handleConfirmProceed = useCallback(() => {
    setShowConfirmModal(false)
    console.log(
      "Submitting Combined Proposal (SAAF + Reservation):",
      buildCombinedProposalPayload()
    )
    finalizeDraft()
    resetDraft()
    setShowSuccessModal(true)
  }, [finalizeDraft, resetDraft])

  const handleSuccessAction = useCallback(() => {
    setShowSuccessModal(false)
    navigate("/students/submissions/saaf")
  }, [navigate])

  const handleSavePdf = useCallback(() => {
    void saveProposalPdf(submissionToSaaf(submission), draft)
  }, [draft, submission])

  return {
    draft,
    showConfirmModal,
    showSuccessModal,
    updateField,
    toggleEquipment,
    handleAddFacilityItem,
    handleRemoveFacilityItem,
    handleUpdateFacilityItem,
    handleRemoveRoomItem,
    handleUpdateRoomItem,
    handleAddAvItem,
    handleRemoveAvItem,
    handleUpdateAvItem,
    handleGoBack,
    handleInitiateSubmit,
    handleConfirmProceed,
    handleSuccessAction,
    handleSavePdf,
    setShowConfirmModal,
  }
}
