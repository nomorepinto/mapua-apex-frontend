import { useCallback, useState } from "react"

import type { Activity } from "@/components/ui/activity.types"

export function useActivityDetail({
  activity,
  onClose,
  onAction,
}: {
  activity: Activity | null
  onClose: () => void
  onAction?: (
    action: "approve" | "return" | "defer",
    activityId: string,
    details?: { title: string; message: string }
  ) => void
}) {
  const [returnModalOpen, setReturnModalOpen] = useState(false)

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose()
    },
    [onClose]
  )

  const handleApprove = useCallback(() => {
    if (!activity) return
    onAction?.("approve", activity.id)
    onClose()
  }, [activity, onAction, onClose])

  const handleDefer = useCallback(() => {
    if (!activity) return
    onAction?.("defer", activity.id)
    onClose()
  }, [activity, onAction, onClose])

  const handleReturnSubmit = useCallback(
    (title: string, message: string) => {
      if (!activity) return
      onAction?.("return", activity.id, { title, message })
      setReturnModalOpen(false)
      onClose()
    },
    [activity, onAction, onClose]
  )

  return {
    returnModalOpen,
    setReturnModalOpen,
    handleOpenChange,
    handleApprove,
    handleDefer,
    handleReturnSubmit,
  }
}
