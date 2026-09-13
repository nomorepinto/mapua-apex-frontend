import { useCallback, useState } from "react"

const UNAVAILABLE = "No event records are available yet."

export function useNewEventForm(defaultDate: Date | undefined, onClose: () => void) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(() =>
    defaultDate ? defaultDate.toISOString().split("T")[0] : ""
  )
  const [error, setError] = useState<string | null>(null)

  const canSubmit = Boolean(title.trim() && date)

  const handleSubmit = useCallback(
    (event?: { preventDefault: () => void }) => {
      event?.preventDefault()
      if (!title.trim() || !date) return
      setError(UNAVAILABLE)
    },
    [date, title]
  )

  const handleClose = useCallback(() => {
    setError(null)
    onClose()
  }, [onClose])

  return {
    title,
    setTitle,
    date,
    setDate,
    canSubmit,
    error,
    handleSubmit,
    handleClose,
  }
}
