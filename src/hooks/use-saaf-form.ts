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

  // Directly select draft from Zustand with fallback to default
  const saafDraft = useOrgStore((state) => state.saafDraft)
  const draft: SaafDraft = saafDraft ?? DEFAULT_SAAF_DRAFT

  useScrollToTop()

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
    useOrgStore.getState().patchSaafDraft({
      proponents: [
        ...current.proponents,
        createEmptyProponent(String(Date.now())),
      ],
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
          item: String(current.budgetItems.length + 1),
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
        sanitized = sanitizeIntegerInput(value)
      } else if (field === "pricePerUnit") {
        sanitized = sanitizeDecimalInput(value)
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

  const handleGoToReservation = useCallback(
    (form: HTMLFormElement | null) => {
      if (form && !form.reportValidity()) return
      useOrgStore.getState().setSaafValidated(true)
      const query = searchParams.toString()
      navigate(`/students/submissions/saaf/reservations${query ? `?${query}` : ""}`)
    },
    [navigate, searchParams]
  )

  const handleInitiateSubmit = useCallback(
    (e: MouseEvent, form: HTMLFormElement | null) => {
      e.preventDefault()
      if (form && form.reportValidity()) {
        setShowConfirmModal(true)
      }
    },
    []
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
