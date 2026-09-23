import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { BookOpen, Sparkles } from "lucide-react"

import { FormPageHeader } from "@/components/forms/form-page-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DEFAULT_SAAF_DRAFT } from "@/components/submission/constants"
import { HowItWorks } from "@/components/submission/how-it-works"
import { useOrgStore } from "@/stores/org-store"
import { layout, modal } from "@/config"
import { cn } from "@/lib/utils"

export function SubmissionsStart() {
  const navigate = useNavigate()
  const savedName = useOrgStore((state) => state.eventName)
  const savedChoice = useOrgStore((state) => state.reserveFacilities)
  const [eventName, setEventName] = useState(savedName)
  const [reserveFacilities, setReserveFacilities] = useState<"yes" | "no" | "">(
    savedChoice ?? ""
  )
  const [error, setError] = useState<string | null>(null)
  const [isGuideOpen, setIsGuideOpen] = useState(false)

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

    const existingDraft = useOrgStore.getState().saafDraft
    const wasEditing = Boolean(useOrgStore.getState().editingEventId)
    useOrgStore.getState().clearEditingSubmission()
    if (wasEditing) {
      useOrgStore.getState().clearSaafDraft()
      useOrgStore.getState().clearReservationDraft()
    }
    useOrgStore.getState().setSubmissionStart(name, reserveFacilities)
    useOrgStore.getState().setSaafDraft({
      ...DEFAULT_SAAF_DRAFT,
      ...(wasEditing ? {} : existingDraft ?? {}),
      activityTitle: name,
    })
    navigate("/students/submissions/saaf")
  }

  return (
    <div className={cn("relative flex min-h-full flex-col items-center justify-center py-10 sm:py-14", layout.page)}>
      <div className={cn(layout.containerNarrow, layout.stack, "!gap-5")}>
        {/* Event Setup Form Section */}
        <div
          id="submission-start-form"
          className={cn(layout.stack, "w-full")}
        >
          <FormPageHeader
            title="Create your Activity Proposal"
            subtitle="Academic Term: 2026 - 2027 • Enter your event title and facility reservation preference"
          />

          <form
            onSubmit={handleSubmit}
            className={cn(layout.section, "space-y-6")}
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
                <option value="yes">Yes, reserve school facilities</option>
                <option value="no">No, do not reserve facilities</option>
              </select>
            </Field>

            {error ? <FieldError>{error}</FieldError> : null}

            <div className="flex justify-center pt-2">
              <Button type="submit" className="min-w-40 sm:min-w-48">
                Continue
              </Button>
            </div>
          </form>
        </div>

        {/* Guide Trigger Button below the section (75% transparency) */}
        <div className="flex flex-col items-center justify-center gap-2 pt-1 text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsGuideOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-xs hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-[#FBC02D]" />
            Guide
          </Button>
          <p className="text-xs text-neutral-600">
            Need help? Learn how to submit an event activity application
          </p>
        </div>
      </div>

      {/* Guide Modal Showcase */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogPopup
          className={cn(modal.dialogLg, "overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-2xl")}
        >
          <DialogHeader className="shrink-0 border-b border-neutral-200/80 bg-white px-4 py-5 sm:px-6">
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8B0000]/10 px-2.5 py-0.5 text-xs font-semibold text-[#8B0000] border border-[#8B0000]/20 dark:bg-[#8B0000]/30 dark:text-[#FBC02D] dark:border-[#8B0000]/40">
                  <Sparkles className="h-3.5 w-3.5 text-[#FBC02D]" />
                  Submission Guide
                </span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                How to submit an event activity application?
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                A seamless 3-step workflow to prepare and submit your event proposal for official Mapúa approval.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogPanel className="flex-1 overflow-y-auto bg-neutral-50/50 px-4 py-6 sm:px-8">
            <HowItWorks hideHeader className="py-2" />
          </DialogPanel>

          <DialogFooter className="shrink-0 flex-row items-center justify-between border-t border-neutral-200/80 bg-white px-4 py-3.5 sm:px-6">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:block">
              Follow these 3 steps to successfully submit your activity proposal
            </p>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </div>
  )
}

