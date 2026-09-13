import { useCallback, useMemo, useState, type MouseEvent } from "react"
import { useFetcher, useNavigate, useNavigation } from "react-router"

import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { createEmptyProponent } from "@/components/submission/constants"
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
import { submissionToSaaf } from "@/lib/submission-draft"
import {
  useHasReservation,
  useSubmissionActions,
  useSubmissionStore,
} from "@/stores/submission-store"

export function useSaafForm() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const fetcher = useFetcher<SubmissionActionData>()
  const hasReservation = useHasReservation()
  const submission = useSubmissionStore((state) => state.draft)
  const { updateFromSaaf } = useSubmissionActions()
  const draft = useMemo(() => submissionToSaaf(submission), [submission])
  const isSubmitting =
    navigation.state === "submitting" || fetcher.state === "submitting"

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [successDismissed, setSuccessDismissed] = useState(false)
  const showSuccessModal = Boolean(fetcher.data?.success) && !successDismissed

  useScrollToTop()

  const commit = useCallback(
    (next: SaafDraft) => {
      updateFromSaaf(next)
    },
    [updateFromSaaf]
  )

  const updateField = useCallback(
    <K extends keyof SaafDraft>(key: K, value: SaafDraft[K]) => {
      commit({ ...draft, [key]: value })
    },
    [commit, draft]
  )

  const handleAddProponent = useCallback(() => {
    commit({
      ...draft,
      proponents: [...draft.proponents, createEmptyProponent(String(Date.now()))],
    })
  }, [commit, draft])

  const handleRemoveProponent = useCallback(
    (id: string) => {
      if (draft.proponents.length === 1) return
      commit({
        ...draft,
        proponents: draft.proponents.filter((proponent) => proponent.id !== id),
      })
    },
    [commit, draft]
  )

  const handleUpdateProponent = useCallback(
    (id: string, field: keyof Proponent, value: string) => {
      commit({
        ...draft,
        proponents: draft.proponents.map((proponent) =>
          proponent.id === id ? { ...proponent, [field]: value } : proponent
        ),
      })
    },
    [commit, draft]
  )

  const handleDepartmentChange = useCallback(
    (id: string, value: string) => {
      commit({
        ...draft,
        departmentValues: { ...draft.departmentValues, [id]: value },
        proponents: draft.proponents.map((proponent) =>
          proponent.id === id ? { ...proponent, department: value } : proponent
        ),
      })
    },
    [commit, draft]
  )

  const handleAddBudgetItem = useCallback(() => {
    commit({
      ...draft,
      budgetItems: [
        ...draft.budgetItems,
        {
          id: String(Date.now()),
          item: String(draft.budgetItems.length + 1),
          unit: "1",
          quantity: "1",
          pricePerUnit: "0",
        },
      ],
    })
  }, [commit, draft])

  const handleRemoveBudgetItem = useCallback(
    (id: string) => {
      if (draft.budgetItems.length === 1) return
      commit({
        ...draft,
        budgetItems: draft.budgetItems.filter((item) => item.id !== id),
      })
    },
    [commit, draft]
  )

  const handleUpdateBudgetItem = useCallback(
    (id: string, field: keyof BudgetItem, value: string) => {
      let sanitized = value
      if (field === "unit" || field === "quantity") {
        sanitized = sanitizeIntegerInput(value)
      } else if (field === "pricePerUnit") {
        sanitized = sanitizeDecimalInput(value)
      }

      commit({
        ...draft,
        budgetItems: draft.budgetItems.map((item) =>
          item.id === id ? { ...item, [field]: sanitized } : item
        ),
      })
    },
    [commit, draft]
  )

  const grandTotal = draft.budgetItems.reduce(
    (sum, item) => sum + calculateRowTotal(item.quantity, item.pricePerUnit),
    0
  )

  const handleGoToReservation = useCallback(
    (form: HTMLFormElement | null) => {
      if (form && !form.reportValidity()) return
      navigate("/students/submissions/saaf/reservations")
    },
    [navigate]
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
      proponents: draft.proponents.map((proponent) => ({
        ...proponent,
        department: draft.departmentValues[proponent.id] || proponent.department,
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
    reserveFacilities: hasReservation ? "yes" : "no",
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
