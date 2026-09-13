import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

import { FormPageHeader } from "@/components/forms/form-page-header"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  useSubmissionActions,
  useWizardStart,
} from "@/stores/submission-store"

export function SubmissionsStart() {
  const navigate = useNavigate()
  const wizard = useWizardStart()
  const { startWizard } = useSubmissionActions()
  const [eventName, setEventName] = useState("")
  const [reserveFacilities, setReserveFacilities] = useState<"yes" | "no" | "">(
    ""
  )
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!wizard.hasHydrated || ready) return
    if (wizard.eventName) {
      setEventName(wizard.eventName)
      setReserveFacilities(wizard.hasReservation ? "yes" : "no")
    }
    setReady(true)
  }, [ready, wizard.eventName, wizard.hasHydrated, wizard.hasReservation])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = eventName.trim()
    if (name.length === 0) {
      setError("Enter an event name to continue.")
      return
    }
    if (reserveFacilities !== "yes" && reserveFacilities !== "no") {
      setError("Choose whether you will reserve school facilities.")
      return
    }

    startWizard(name, reserveFacilities === "yes")
    navigate("/students/submissions/saaf")
  }

  if (!wizard.hasHydrated) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#F3F4F6]">
        <p className="text-sm text-neutral-500">Loading draft…</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-full w-full bg-[#F3F4F6] px-4 py-8 text-neutral-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-xl space-y-8">
        <FormPageHeader
          title="New submission"
          subtitle="Academic Term: 2026 - 2027 • Start your activity proposal"
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs"
        >
          <Field>
            <FieldLabel htmlFor="eventName">Event name</FieldLabel>
            <Input
              id="eventName"
              name="eventName"
              nativeInput
              placeholder="e.g. Tech Week 2026"
              required
              type="text"
              value={eventName}
              onChange={(e) => {
                setEventName(e.target.value)
                setError(null)
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="reserveFacilities">
              Are you going to reserve school facilities?
            </FieldLabel>
            <select
              id="reserveFacilities"
              name="reserveFacilities"
              required
              value={reserveFacilities}
              onChange={(e) => {
                setReserveFacilities(e.target.value as "yes" | "no" | "")
                setError(null)
              }}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/24"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="yes">Yes I want to</option>
              <option value="no">No I don&apos;t want to</option>
            </select>
          </Field>

          {error ? <FieldError>{error}</FieldError> : null}

          <div className="flex justify-end">
            <Button type="submit" className="min-w-36">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
