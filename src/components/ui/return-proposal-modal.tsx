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
import type { Activity } from "./activity.types"

export interface ReturnProposalModalProps {
  activity: Activity | null
  open: boolean
  onClose: () => void
  onSubmit: (title: string, message: string) => void
}

const ReturnProposalModal = memo(function ReturnProposalModal({
  activity,
  open,
  onClose,
  onSubmit,
}: ReturnProposalModalProps) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

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
      <DialogPopup className="max-w-lg w-full">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="text-xl font-bold text-neutral-900">
            Return Proposal for Revision
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-xs mt-1">
            Specify the required revisions for <span className="font-semibold text-neutral-800">{activity?.title}</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Warning notification banner per Figma */}
        <div className="mx-6 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircleIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Reflected: From Office of the Dean</p>
            <p className="text-amber-800/90 text-[11px] mt-0.5">
              This message will be sent directly to the student organization representatives and advisers.
            </p>
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
                placeholder="Detail the specific corrections or documents required before approval..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full text-sm resize-none"
              />
            </div>
          </DialogPanel>

          <DialogFooter className="p-6 pt-3 flex items-center justify-end gap-2.5 border-t border-neutral-100">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="bg-neutral-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Return Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  )
})

export { ReturnProposalModal }
