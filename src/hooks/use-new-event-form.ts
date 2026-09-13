import { useCallback, useState } from "react"

import { useOrgStore } from "@/stores/org-store"

export function useNewEventForm(defaultDate: Date | undefined, onClose: () => void) {
  const addCalendarEvent = useOrgStore((state) => state.addCalendarEvent)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(() =>
    defaultDate ? defaultDate.toISOString().split("T")[0] : ""
  )

  const canSubmit = Boolean(title.trim() && date)

  const handleSubmit = useCallback(
    (event?: { preventDefault: () => void }) => {
      event?.preventDefault()
      if (!title.trim() || !date) return
      addCalendarEvent(new Date(date), title.trim())
      setTitle("")
      onClose()
    },
    [addCalendarEvent, date, onClose, title]
  )

  return { title, setTitle, date, setDate, canSubmit, handleSubmit }
}
