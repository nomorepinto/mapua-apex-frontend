import { useCallback, useEffect, useState, type MouseEvent } from "react"
import { useFetcher, useNavigate, useNavigation } from "react-router"

import { useScrollToTop } from "@/hooks/use-scroll-to-top"

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

function getSavedSaafDraft(): SaafDraft {
  const saved = useOrgStore.getState().saafDraft
  if (!saved) return DEFAULT_SAAF_DRAFT
  return { ...DEFAULT_SAAF_DRAFT, ...saved }
}

export function useSaafForm() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const fetcher = useFetcher<SubmissionActionData>()
  const reserveFacilities = useOrgStore((state) => state.reserveFacilities)
  const isSubmitting =
    navigation.state === "submitting" || fetcher.state === "submitting"

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [successDismissed, setSuccessDismissed] = useState(false)
  const [draft, setDraft] = useState<SaafDraft>(getSavedSaafDraft)
  const showSuccessModal = Boolean(fetcher.data?.success) && !successDismissed

  useScrollToTop()

  useEffect(() => {
    if (fetcher.data?.success) return
    useOrgStore.getState().setSaafDraft(draft)
  }, [draft, fetcher.data])

  const updateField = useCallback(
    <K extends keyof SaafDraft>(key: K, value: SaafDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const handleAddProponent = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      proponents: [
        ...prev.proponents,
        createEmptyProponent(String(Date.now())),
      ],
    }))
  }, [])

  const handleRemoveProponent = useCallback((id: string) => {
    setDraft((prev) => {
      if (prev.proponents.length === 1) return prev
      return {
        ...prev,
        proponents: prev.proponents.filter((p) => p.id !== id),
      }
    })
  }, [])

  const handleUpdateProponent = useCallback(
    (id: string, field: keyof Proponent, value: string) => {
      setDraft((prev) => ({
        ...prev,
        proponents: prev.proponents.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      }))
    },
    []
  )

  const handleDepartmentChange = useCallback((id: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      departmentValues: { ...prev.departmentValues, [id]: value },
    }))
  }, [])

  const handleAddBudgetItem = useCallback(() => {
    setDraft((prev) => ({
      ...prev,
      budgetItems: [
        ...prev.budgetItems,
        {
          id: String(Date.now()),
          item: String(prev.budgetItems.length + 1),
          unit: "1",
          quantity: "1",
          pricePerUnit: "0",
        },
      ],
    }))
  }, [])

  const handleRemoveBudgetItem = useCallback((id: string) => {
    setDraft((prev) => {
      if (prev.budgetItems.length === 1) return prev
      return {
        ...prev,
        budgetItems: prev.budgetItems.filter((item) => item.id !== id),
      }
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

      setDraft((prev) => ({
        ...prev,
        budgetItems: prev.budgetItems.map((item) =>
          item.id === id ? { ...item, [field]: sanitized } : item
        ),
      }))
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
