import { useCallback, useState, type FormEvent } from "react"

const UNAVAILABLE = "No milestone records are available yet."

export function useNewTaskForm(onClose: () => void) {
  const [title, setTitle] = useState("")
  const [responsible, setResponsible] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState<string | null>(null)

  const canSubmit = Boolean(title.trim())

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    setError(UNAVAILABLE)
  }, [title])

  const handleClose = useCallback(() => {
    setError(null)
    onClose()
  }, [onClose])

  return {
    title,
    setTitle,
    responsible,
    setResponsible,
    dueDate,
    setDueDate,
    canSubmit,
    error,
    handleSubmit,
    handleClose,
  }
}
