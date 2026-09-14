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
  ) => void | Promise<void>
}) {
  const [returnModalOpen, setReturnModalOpen] = useState(false)

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose()
    },
    [onClose]
  )

  const handleApprove = useCallback(async () => {
    if (!activity) return
    await onAction?.("approve", activity.id)
  }, [activity, onAction])

  const handleDefer = useCallback(async () => {
    if (!activity) return
    await onAction?.("defer", activity.id)
  }, [activity, onAction])

  const handleReturnSubmit = useCallback(
    async (title: string, message: string) => {
      if (!activity) return
      await onAction?.("return", activity.id, { title, message })
      setReturnModalOpen(false)
    },
    [activity, onAction]
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
