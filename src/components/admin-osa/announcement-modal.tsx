import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AnnouncementModal({
  open,
  onClose,
  onSubmit,
  mode,
  initialTitle = "",
  initialMessage = "",
}: {
  open: boolean
  onClose: () => void
  onSubmit: (title: string, message: string) => void
  mode: "create" | "edit"
  initialTitle?: string
  initialMessage?: string
}) {
  const [title, setTitle] = useState(initialTitle)
  const [message, setMessage] = useState(initialMessage)

  if (!open) return null

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) return
    onSubmit(title.trim(), message.trim())
    setTitle("")
    setMessage("")
  }

  const isEdit = mode === "edit"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 w-full max-w-[797px] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="space-y-2 bg-[#2D2D2D] px-6 py-5">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? "Edit Announcement" : "Announcement"}
          </h3>
          <p className="text-sm font-medium text-[#FBC02D]">
            Reflected: From Office of the Student Affairs and Alumni Relations
          </p>
          <span className="inline-block rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            This will reflect to all Organizations and Student Council Dashboard
          </span>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">
              {isEdit ? "Edit Title" : "Create Title"}{" "}
              <span className="text-red-600">*</span>
            </label>
            <Input
              placeholder="Label"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border-neutral-300 focus:border-red-800 focus:ring-red-800/20 [&_input]:!text-neutral-900 [&_input]:placeholder:!text-neutral-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">
              {isEdit ? "Edit the Message" : "Encode the Message"}{" "}
              <span className="text-red-600">*</span>
            </label>
            <Textarea
              placeholder="Label"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-y rounded-lg border-neutral-300 focus:border-red-800 focus:ring-red-800/20 [&_textarea]:!text-neutral-900 [&_textarea]:placeholder:!text-neutral-400"
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 px-6 pb-5">
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !message.trim()}
            className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEdit ? "Save Announcement" : "Post Announcement"}
          </Button>
          <Button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700"
          >
            Cancel Action
          </Button>
        </div>
      </div>
    </div>
  )
}
