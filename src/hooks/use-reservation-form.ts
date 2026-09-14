import { useCallback, useState, type FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router"

import { DEFAULT_RESERVATION_DRAFT } from "@/components/reservation/constants"

import { DEFAULT_SAAF_DRAFT } from "@/components/submission/constants"
import { useHydrateEditingSubmission } from "@/hooks/use-hydrate-editing-submission"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import type {
  AVItem,
  EquipmentFlags,
  FacilityItem,
  ReservationDraft,
  RoomItem,
} from "@/components/reservation/types"
import { buildSaafApiPayload, omitEventIdFromPayload } from "@/lib/dynamodb-adapters"
import { useCreateSubmissionMutation, useUpdateSubmissionMutation } from "@/hooks/use-submissions"
import { saveProposalPdf } from "@/lib/save-proposal-pdf"
import { useOrgStore } from "@/stores/org-store"

export function useReservationForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  useHydrateEditingSubmission()
  const createSubmission = useCreateSubmissionMutation()
  const updateSubmission = useUpdateSubmissionMutation()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Directly select draft from Zustand with fallback to default
  const storedDraft = useOrgStore((state) => state.reservationDraft)
  const draft: ReservationDraft = storedDraft ?? DEFAULT_RESERVATION_DRAFT

  useScrollToTop()

  const updateField = useCallback(
    <K extends keyof ReservationDraft>(key: K, value: ReservationDraft[K]) => {
      useOrgStore.getState().patchReservationDraft({ [key]: value })
    },
    []
  )

  const toggleEquipment = useCallback(
    (key: keyof EquipmentFlags, checked: boolean) => {
      const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
      useOrgStore.getState().patchReservationDraft({
        equipment: { ...current.equipment, [key]: checked },
      })
    },
    []
  )

  const handleAddFacilityItem = useCallback(() => {
    const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
    useOrgStore.getState().patchReservationDraft({
      facilityItems: [
        ...current.facilityItems,
        {
          id: String(Date.now()),
          item: String(current.facilityItems.length + 1),
          dateOfUse: "",
          timeOfUse: "",
          location: "",
        },
      ],
    })
  }, [])

  const handleRemoveFacilityItem = useCallback((id: string) => {
    const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
    if (current.facilityItems.length === 1) return
    useOrgStore.getState().patchReservationDraft({
      facilityItems: current.facilityItems.filter((i) => i.id !== id),
    })
  }, [])

  const handleUpdateFacilityItem = useCallback(
    (id: string, field: keyof FacilityItem, value: string) => {
      const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
      useOrgStore.getState().patchReservationDraft({
        facilityItems: current.facilityItems.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      })
    },
    []
  )

  const handleRemoveRoomItem = useCallback((id: string) => {
    const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
    if (current.roomItems.length === 1) return
    useOrgStore.getState().patchReservationDraft({
      roomItems: current.roomItems.filter((i) => i.id !== id),
    })
  }, [])

  const handleUpdateRoomItem = useCallback(
    (id: string, field: keyof RoomItem, value: string) => {
      const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
      useOrgStore.getState().patchReservationDraft({
        roomItems: current.roomItems.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      })
    },
    []
  )

  const handleAddAvItem = useCallback(() => {
    const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
    useOrgStore.getState().patchReservationDraft({
      avItems: [
        ...current.avItems,
        {
          id: String(Date.now()),
          dateNeeded: "",
          timeNeeded: "",
          equipmentNeeded: "Others",
          remarks: "",
        },
      ],
    })
  }, [])

  const handleRemoveAvItem = useCallback((id: string) => {
    const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
    if (current.avItems.length === 1) return
    useOrgStore.getState().patchReservationDraft({
      avItems: current.avItems.filter((i) => i.id !== id),
    })
  }, [])

  const handleUpdateAvItem = useCallback(
    (id: string, field: keyof AVItem, value: string) => {
      const current = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
      useOrgStore.getState().patchReservationDraft({
        avItems: current.avItems.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      })
    },
    []
  )

  const handleGoBack = useCallback(() => {
    window.scrollTo(0, 0)
    const query = searchParams.toString()
    navigate(`/students/submissions/saaf${query ? `?${query}` : ""}`)
  }, [navigate, searchParams])

  const handleInitiateSubmit = useCallback(
    (e: FormEvent, form: HTMLFormElement | null) => {
      e.preventDefault()
      if (form && form.reportValidity()) {
        setShowConfirmModal(true)
      }
    },
    []
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleConfirmProceed = useCallback(async () => {
    setShowConfirmModal(false)
    const saafDraft = useOrgStore.getState().saafDraft
    const currentDraft = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT

    if (!saafDraft) {
      setSubmitError("SAAF form draft is missing. Please review Step 1.")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const editingEventId = useOrgStore.getState().editingEventId
      const editingSubmissionId = useOrgStore.getState().editingSubmissionId
      const payload = buildSaafApiPayload(
        saafDraft,
        currentDraft,
        editingEventId ?? undefined
      )

      if (editingEventId && editingSubmissionId) {
        await updateSubmission.mutateAsync({
          eventId: editingEventId,
          submissionId: editingSubmissionId,
          payload: omitEventIdFromPayload(payload),
        })
      } else {
        await createSubmission.mutateAsync(payload)
      }

      useOrgStore.getState().clearSaafDraft()
      useOrgStore.getState().clearReservationDraft()
      useOrgStore.getState().clearSubmissionStart()
      useOrgStore.getState().clearEditingSubmission()

      setShowSuccessModal(true)
    } catch (error) {
      console.error("Submission failed:", error)
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit reservation proposal"
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [createSubmission, updateSubmission])

  const handleSuccessAction = useCallback(() => {
    setShowSuccessModal(false)
    navigate("/students/dashboard")
  }, [navigate])


  const handleSavePdf = useCallback(() => {
    const saafDraft = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
    const currentDraft = useOrgStore.getState().reservationDraft ?? DEFAULT_RESERVATION_DRAFT
    void saveProposalPdf(
      {
        activityType: saafDraft.activityType,
        totalOrgMembers: saafDraft.totalOrgMembers,
        activityTitle: saafDraft.activityTitle,
        activityDescription: saafDraft.activityDescription,
        activityObjectives: saafDraft.activityObjectives,
        activityVenue: saafDraft.activityVenue,
        dateOfEvent: saafDraft.dateOfEvent,
        dayOfEvent: saafDraft.dayOfEvent,
        timeOfEvent: saafDraft.timeOfEvent,
        expectedParticipants: saafDraft.expectedParticipants,
        individualContribution: saafDraft.individualContribution,
        proposedBudget: saafDraft.proposedBudget,
        mission1: saafDraft.mission1,
        mission2: saafDraft.mission2,
        mission3: saafDraft.mission3,
        coreValuesExplanation: saafDraft.coreValuesExplanation,
        peoExplanation: saafDraft.peoExplanation,
        sdgExplanation: saafDraft.sdgExplanation,
        proponents: saafDraft.proponents || [],
        budgetItems: saafDraft.budgetItems || [],
      },
      currentDraft
    )
  }, [])

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
    isSubmitting,
    submitError,
  }
}

