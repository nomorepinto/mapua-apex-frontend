import { useCallback, useEffect, useState, type MouseEvent } from "react"
import { useFetcher, useNavigate, useNavigation, useSearchParams } from "react-router"

import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { useHydrateEditingSubmission } from "@/hooks/use-hydrate-editing-submission"
import {
  createEmptyProponent,
  DEFAULT_SAAF_DRAFT,
} from "@/components/submission/constants"
import type {
  BudgetItem,
  Proponent,
  SaafDraft,
  SubmissionActionData,
} from "@/components/submission/types"
import {
  calculateRowTotal,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
} from "@/lib/numeric-input"
import { saveProposalPdf } from "@/lib/save-proposal-pdf"
import { useOrgStore } from "@/stores/org-store"

export function useSaafForm() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<SubmissionActionData>()
  const reserveFacilities = useOrgStore((state) => state.reserveFacilities)
  useHydrateEditingSubmission()
  const isSubmitting =
    navigation.state === "submitting" || fetcher.state === "submitting"

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [successDismissed, setSuccessDismissed] = useState(false)
  const showSuccessModal = Boolean(fetcher.data?.success) && !successDismissed
  const submitError =
    fetcher.data && fetcher.data.success === false
      ? fetcher.data.message ||
        Object.values(fetcher.data.errors ?? {})[0] ||
        "Failed to submit application. Please try again."
      : null

  // Directly select draft from Zustand with fallback to default
  const saafDraft = useOrgStore((state) => state.saafDraft)
  const draft: SaafDraft = saafDraft ?? DEFAULT_SAAF_DRAFT

  useScrollToTop()

  // Ensure submission date is always locked to today's date upon opening
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
    const needsDateUpdate = current.proponents.some(
      (p) => p.dateOfSubmission !== today
    )

    if (needsDateUpdate) {
      useOrgStore.getState().patchSaafDraft({
        proponents: current.proponents.map((p) => ({
          ...p,
          dateOfSubmission: today,
        })),
      })
    }
  }, [])

  // Reset drafts on successful submission
  useEffect(() => {
    if (fetcher.data?.success) {
      useOrgStore.getState().clearSaafDraft()
      useOrgStore.getState().clearReservationDraft()
      useOrgStore.getState().clearSubmissionStart()
      useOrgStore.getState().clearEditingSubmission()
    }
  }, [fetcher.data?.success])

  const updateField = useCallback(
    <K extends keyof SaafDraft>(key: K, value: SaafDraft[K]) => {
      useOrgStore.getState().patchSaafDraft({ [key]: value })
    },
    []
  )

  const handleAddProponent = useCallback(() => {
    const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
    const today = new Date().toISOString().split("T")[0]
    const newProponent = createEmptyProponent(String(Date.now()))
    newProponent.dateOfSubmission = today

    useOrgStore.getState().patchSaafDraft({
      proponents: [...current.proponents, newProponent],
    })
  }, [])

  const handleRemoveProponent = useCallback((id: string) => {
    const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
    if (current.proponents.length === 1) return
    useOrgStore.getState().patchSaafDraft({
      proponents: current.proponents.filter((p) => p.id !== id),
    })
  }, [])

  const handleUpdateProponent = useCallback(
    (id: string, field: keyof Proponent, value: string) => {
      const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
      useOrgStore.getState().patchSaafDraft({
        proponents: current.proponents.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      })
    },
    []
  )

  const handleDepartmentChange = useCallback((id: string, value: string) => {
    const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
    useOrgStore.getState().patchSaafDraft({
      departmentValues: { ...current.departmentValues, [id]: value },
    })
  }, [])

  const handleAddBudgetItem = useCallback(() => {
    const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
    useOrgStore.getState().patchSaafDraft({
      budgetItems: [
        ...current.budgetItems,
        {
          id: String(Date.now()),
          item: "",
          unit: "1",
          quantity: "1",
          pricePerUnit: "0",
        },
      ],
    })
  }, [])

  const handleRemoveBudgetItem = useCallback((id: string) => {
    const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
    if (current.budgetItems.length === 1) return
    useOrgStore.getState().patchSaafDraft({
      budgetItems: current.budgetItems.filter((item) => item.id !== id),
    })
  }, [])

  const handleUpdateBudgetItem = useCallback(
    (id: string, field: keyof BudgetItem, value: string) => {
      let sanitized = value
      if (field === "unit" || field === "quantity") {
        sanitized = sanitizeIntegerInput(value).slice(0, 7)
      } else if (field === "pricePerUnit") {
        sanitized = sanitizeDecimalInput(value).slice(0, 8)
      } else if (field === "item") {
        sanitized = value.slice(0, 40)
      }

      const current = useOrgStore.getState().saafDraft ?? DEFAULT_SAAF_DRAFT
      useOrgStore.getState().patchSaafDraft({
        budgetItems: current.budgetItems.map((item) =>
          item.id === id ? { ...item, [field]: sanitized } : item
        ),
      })
    },
    []
  )

  const grandTotal = draft.budgetItems.reduce(
    (sum, item) => sum + calculateRowTotal(item.quantity, item.pricePerUnit),
    0
  )

  // Validates standard HTML5 constraints and specific custom form rules
  const validateForm = useCallback(
    (form: HTMLFormElement | null): boolean => {
      if (!form) return false
      if (!form.reportValidity()) return false

      // 1. Mandatory mission statement check
      const hasMission =
        Boolean(draft.mission1) || Boolean(draft.mission2) || Boolean(draft.mission3)
      if (!hasMission) {
        alert("Please select at least one Institutional Mission statement.")
        return false
      }

      // 2. Date buffer validation (at least 11 days after submission)
      const submissionDateStr =
        draft.proponents?.[0]?.dateOfSubmission ||
        new Date().toISOString().split("T")[0]
      const eventDateStr = draft.dateOfEvent

      if (submissionDateStr && eventDateStr) {
        const sDate = new Date(submissionDateStr)
        const eDate = new Date(eventDateStr)
        const diffTime = eDate.getTime() - sDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays <= 10) {
          alert(
            "The date of event must be at least 11 days after the date of submission."
          )
          return false
        }
      }

      // 3. Activity details minimum length validations
      if (draft.activityDescription && draft.activityDescription.trim().length < 100) {
        alert("Activity Description must be at least 100 characters.")
        return false
      }

      if (draft.activityObjectives && draft.activityObjectives.trim().length < 50) {
        alert("Activity Objectives must be at least 50 characters.")
        return false
      }

      if (draft.activityVenue && draft.activityVenue.trim().length < 5) {
        alert("Activity Venue must be at least 5 characters.")
        return false
      }

      // 4. Institutional alignment minimum length validations
      if (
        draft.coreValuesExplanation &&
        draft.coreValuesExplanation.trim().length < 30
      ) {
        alert("Core Values Explanation must be at least 30 characters.")
        return false
      }

      if (
        draft.peoExplanation &&
        draft.peoExplanation.trim().length > 0 &&
        draft.peoExplanation.trim().length < 30
      ) {
        alert("Program Educational Objectives must be at least 30 characters if provided.")
        return false
      }

      if (draft.sdgExplanation && draft.sdgExplanation.trim().length < 30) {
        alert("UN Sustainability Goals explanation must be at least 30 characters.")
        return false
      }

      // 5. Total Org Members length guard
      if (draft.totalOrgMembers && draft.totalOrgMembers.length > 5) {
        alert("Total number of class/org members cannot exceed 5 digits.")
        return false
      }

      return true
    },
    [
      draft.mission1,
      draft.mission2,
      draft.mission3,
      draft.proponents,
      draft.dateOfEvent,
      draft.activityDescription,
      draft.activityObjectives,
      draft.activityVenue,
      draft.coreValuesExplanation,
      draft.peoExplanation,
      draft.sdgExplanation,
      draft.totalOrgMembers,
    ]
  )

  const handleGoToReservation = useCallback(
    (form: HTMLFormElement | null) => {
      if (!validateForm(form)) return
      const query = searchParams.toString()
      navigate(`/students/submissions/saaf/reservations${query ? `?${query}` : ""}`)
    },
    [navigate, searchParams, validateForm]
  )

  const handleInitiateSubmit = useCallback(
    (e: MouseEvent, form: HTMLFormElement | null) => {
      e.preventDefault()
      if (validateForm(form)) {
        setShowConfirmModal(true)
      }
    },
    [validateForm]
  )

  const handleConfirmProceed = useCallback(
    (form: HTMLFormElement | null) => {
      if (form) fetcher.submit(form)
      setShowConfirmModal(false)
    },
    [fetcher]
  )

  const handleSavePdf = useCallback(() => {
    void saveProposalPdf({
      ...draft,
      proponents: draft.proponents.map((p) => ({
        ...p,
        department: draft.departmentValues[p.id] || p.department,
      })),
    })
  }, [draft])

  return {
    draft,
    fetcher,
    isSubmitting,
    showConfirmModal,
    showSuccessModal,
    submitError,
    grandTotal,
    reserveFacilities,
    updateField,
    handleAddProponent,
    handleRemoveProponent,
    handleUpdateProponent,
    handleDepartmentChange,
    handleAddBudgetItem,
    handleRemoveBudgetItem,
    handleUpdateBudgetItem,
    handleGoToReservation,
    handleInitiateSubmit,
    handleConfirmProceed,
    handleSavePdf,
    setShowConfirmModal,
    setSuccessDismissed,
  }
}