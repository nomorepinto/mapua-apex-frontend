import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

import { buildCombinedProposalPayload } from "@/components/reservation/build-proposal-payload"
import { DEFAULT_RESERVATION_DRAFT } from "@/components/reservation/constants"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import type {
  AVItem,
  EquipmentFlags,
  FacilityItem,
  ReservationDraft,
  RoomItem,
} from "@/components/reservation/types"
import { saveProposalPdf } from "@/lib/save-proposal-pdf"
import { useOrgStore } from "@/stores/org-store"

function getSavedReservationDraft(): ReservationDraft {
  const saved = useOrgStore.getState().reservationDraft
  if (!saved) return DEFAULT_RESERVATION_DRAFT
  return {
    ...DEFAULT_RESERVATION_DRAFT,
    ...saved,
    equipment: {
      ...DEFAULT_RESERVATION_DRAFT.equipment,
      ...(saved.equipment ?? {}),
    },
  }
}

export function useReservationForm() {
  const navigate = useNavigate()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [draft, setDraft] = useState<ReservationDraft>(getSavedReservationDraft)

  useScrollToTop()

  useEffect(() => {
    useOrgStore.getState().setReservationDraft(draft)
  }, [draft])

  const updateField = useCallback(
    <K extends keyof ReservationDraft>(key: K, value: ReservationDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const toggleEquipment = useCallback(
    (key: keyof EquipmentFlags, checked: boolean) => {
      setDraft((prev) => ({
        ...prev,
        equipment: { ...prev.equipment, [key]: checked },
      }))
    },
    []
  )

  const handleAddFacilityItem = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      facilityItems: [
        ...prev.facilityItems,
        {
          id: String(Date.now()),
          item: String(prev.facilityItems.length + 1),
          dateOfUse: "",
          timeOfUse: "",
          location: "",
        },
      ],
    }))
  }, [])

  const handleRemoveFacilityItem = useCallback((id: string) => {
    setDraft((prev) => {
      if (prev.facilityItems.length === 1) return prev
      return {
        ...prev,
        facilityItems: prev.facilityItems.filter((i) => i.id !== id),
      }
    })
  }, [])

  const handleUpdateFacilityItem = useCallback(
    (id: string, field: keyof FacilityItem, value: string) => {
      setDraft((prev) => ({
        ...prev,
        facilityItems: prev.facilityItems.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      }))
    },
    []
  )

  const handleRemoveRoomItem = useCallback((id: string) => {
    setDraft((prev) => {
      if (prev.roomItems.length === 1) return prev
      return {
        ...prev,
        roomItems: prev.roomItems.filter((i) => i.id !== id),
      }
    })
  }, [])

  const handleUpdateRoomItem = useCallback(
    (id: string, field: keyof RoomItem, value: string) => {
      setDraft((prev) => ({
        ...prev,
        roomItems: prev.roomItems.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      }))
    },
    []
  )

  const handleAddAvItem = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      avItems: [
        ...prev.avItems,
        {
          id: String(Date.now()),
          dateNeeded: "",
          timeNeeded: "",
          equipmentNeeded: "Others",
          remarks: "",
        },
      ],
    }))
  }, [])

  const handleRemoveAvItem = useCallback((id: string) => {
    setDraft((prev) => {
      if (prev.avItems.length === 1) return prev
      return {
        ...prev,
        avItems: prev.avItems.filter((i) => i.id !== id),
      }
    })
  }, [])

  const handleUpdateAvItem = useCallback(
    (id: string, field: keyof AVItem, value: string) => {
      setDraft((prev) => ({
        ...prev,
        avItems: prev.avItems.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      }))
    },
    []
  )

  const handleGoBack = useCallback(() => {
    window.scrollTo(0, 0)
    navigate("/submission")
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
      buildCombinedProposalPayload(draft)
    )
    useOrgStore.getState().clearSaafDraft()
    useOrgStore.getState().clearReservationDraft()
    setShowSuccessModal(true)
  }, [draft])

  const handleSuccessAction = useCallback(() => {
    setShowSuccessModal(false)
    navigate("/submission")
  }, [navigate])

  const handleSavePdf = useCallback(() => {
    const saafDraft = useOrgStore.getState().saafDraft || {}
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
      draft
    )
  }, [draft])

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
