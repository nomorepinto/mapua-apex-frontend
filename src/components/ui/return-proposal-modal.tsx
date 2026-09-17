import { memo, useState, useCallback } from "react"
import { AlertCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { layout, modal } from "@/config"
import { cn } from "@/lib/utils"
import type { Activity } from "./activity.types"

export interface ReturnProposalModalProps {
  activity: Activity | null
  variant: "return" | "reject"
  open: boolean
  onClose: () => void
  onSubmit: (title: string, message: string) => void
}

const COPY = {
  return: {
    title: "Return Proposal for Revision",
    description: "Specify the required revisions",
    warningTitle: "This paper stays on your desk",
    warningBody:
      "The student can edit and resubmit. You will still see this submission with a Returned status.",
    submit: "Return Proposal",
  },
  reject: {
    title: "Reject Proposal",
    description: "Explain why this submission is denied",
    warningTitle: "This decision is final",
    warningBody:
      "The submission will be marked Denied. The student cannot edit it, and it will leave your queue.",
    submit: "Reject Proposal",
  },
} as const

const ReturnProposalModal = memo(function ReturnProposalModal({
  activity,
  variant,
  open,
  onClose,
  onSubmit,
}: ReturnProposalModalProps) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const copy = COPY[variant]

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) onClose()
    },
    [onClose],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim()) return
      onSubmit(title, message)
      setTitle("")
      setMessage("")
      onClose()
    },
    [title, message, onSubmit, onClose],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup className={modal.dialogMd}>
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="text-xl font-bold text-neutral-900">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-xs mt-1">
            {copy.description} for <span className="font-semibold text-neutral-800">{activity?.title}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="mx-6 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircleIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{copy.warningTitle}</p>
            <p className="text-amber-800/90 text-[11px] mt-0.5">{copy.warningBody}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contents">
          <DialogPanel className="p-6 pt-4 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="return-title" className="text-xs font-semibold text-neutral-700">
                Create Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="return-title"
                placeholder="e.g. Incomplete Safety Guidelines & Budget Breakdown"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="return-message" className="text-xs font-semibold text-neutral-700">
                Encode the Message
              </label>
              <Textarea
                id="return-message"
                placeholder="Detail the specific corrections or documents required..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full text-sm resize-none"
              />
            </div>
          </DialogPanel>

          <DialogFooter className={cn(layout.actions, "border-t border-neutral-100 p-4 pt-3 sm:p-6")}>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="bg-neutral-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {copy.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  )
})

export { ReturnProposalModal }
