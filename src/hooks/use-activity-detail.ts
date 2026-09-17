import { useCallback, useState } from "react"

import type { Activity } from "@/components/ui/activity.types"

export type ActivityCommentAction = "return" | "reject"

export function useActivityDetail({
  activity,
  onClose,
  onAction,
}: {
  activity: Activity | null
  onClose: () => void
  onAction?: (
    action: "approve" | "return" | "reject" | "defer",
    activityId: string,
    details?: { title: string; message: string }
  ) => void | Promise<void>
}) {
  const [commentAction, setCommentAction] = useState<ActivityCommentAction | null>(null)
  const [confirmingApprove, setConfirmingApprove] = useState(false)

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setConfirmingApprove(false)
        onClose()
      }
    },
    [onClose]
  )

  const requestApprove = useCallback(() => {
    if (!activity) return
    setConfirmingApprove(true)
  }, [activity])

  const handleApprove = useCallback(async () => {
    if (!activity) return
    setConfirmingApprove(false)
    await onAction?.("approve", activity.id)
  }, [activity, onAction])

  const handleDefer = useCallback(async () => {
    if (!activity) return
    await onAction?.("defer", activity.id)
  }, [activity, onAction])

  const handleCommentSubmit = useCallback(
    async (title: string, message: string) => {
      if (!activity || !commentAction) return
      await onAction?.(commentAction, activity.id, { title, message })
      setCommentAction(null)
    },
    [activity, commentAction, onAction]
  )

  return {
    commentAction,
    setCommentAction,
    confirmingApprove,
    setConfirmingApprove,
    handleOpenChange,
    requestApprove,
    handleApprove,
    handleDefer,
    handleCommentSubmit,
  }
}
