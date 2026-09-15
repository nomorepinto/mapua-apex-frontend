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
    handleOpenChange,
    handleApprove,
    handleDefer,
    handleCommentSubmit,
  }
}
