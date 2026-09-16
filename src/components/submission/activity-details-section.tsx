import { FIELD_INPUT_CLASS } from "@/components/submission/constants"
import type { SaafDraft } from "@/components/submission/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  blockNonDecimalKeys,
  blockNonIntegerKeys,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
} from "@/lib/numeric-input"

type DetailsFields = Pick<
  SaafDraft,
  | "activityTitle"
  | "activityDescription"
  | "activityObjectives"
  | "activityVenue"
  | "dateOfEvent"
  | "timeOfEvent"
  | "expectedParticipants"
  | "individualContribution"
  | "proposedBudget"
> & {
  endDateOfEvent?: string
  timeOfEventStart?: string
  timeOfEventEnd?: string
  proponents?: Array<{ dateOfSubmission?: string }>
}

export function ActivityDetailsSection({
  values,
  onChange,
}: {
  values: DetailsFields
  onChange: (key: any, value: any) => void
}) {
  const getMinDateOfEvent = () => {
    const today = new Date().toISOString().split("T")[0]
    const submissionDate = values.proponents?.[0]?.dateOfSubmission || today
    const d = new Date(submissionDate)
    if (isNaN(d.getTime())) return ""
    d.setDate(d.getDate() + 11)
    return d.toISOString().split("T")[0]
  }

  const handleStartDateChange = (startVal: string) => {
    onChange("dateOfEvent", startVal)
    if (values.endDateOfEvent && values.endDateOfEvent < startVal) {
      onChange("endDateOfEvent", startVal)
    }
  }

  const timeStart =
    values.timeOfEventStart ||
    (values.timeOfEvent?.includes(" - ")
      ? values.timeOfEvent.split(" - ")[0]
      : values.timeOfEvent || "")

  const timeEnd =
    values.timeOfEventEnd ||
    (values.timeOfEvent?.includes(" - ")
      ? values.timeOfEvent.split(" - ")[1]
      : "")

  const handleStartTimeChange = (startVal: string) => {
    onChange("timeOfEventStart", startVal)
    onChange("timeOfEvent", timeEnd ? `${startVal} - ${timeEnd}` : startVal)
  }

  const handleEndTimeChange = (endVal: string) => {
    onChange("timeOfEventEnd", endVal)
    onChange("timeOfEvent", timeStart ? `${timeStart} - ${endVal}` : endVal)
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="border-b border-neutral-200 pb-2">
        <h2 className="text-lg font-bold tracking-wide text-neutral-900 uppercase">
          DETAILS OF ACTIVITY
        </h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-neutral-800">
              Title and Nature of Activity applied for{" "}
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-neutral-400">
              {values.activityTitle.length}/100
            </span>
          </div>
          <Input
            name="activityTitle"
            value={values.activityTitle}
            maxLength={100}
            onChange={(e) => onChange("activityTitle", e.target.value)}
            placeholder="i.e. Seminar, Field Trip, Plant Visit, Outing, Socials, Assembly, Meeting, etc."
            style={{ color: "#171717" }}
            className="h-10 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-neutral-800">
              Description <span className="text-red-500">*</span>
            </label>
            <span className={`text-[11px] ${values.activityDescription.length < 100 ? "text-amber-600 font-medium" : "text-neutral-400"}`}>
              {values.activityDescription.length}/100 min
            </span>
          </div>
          <Textarea
            name="activityDescription"
            value={values.activityDescription}
            minLength={100}
            onChange={(e) => onChange("activityDescription", e.target.value)}
            placeholder="Provide a comprehensive summary of the activity (minimum 100 characters required)..."
            rows={4}
            style={{ color: "#171717" }}
            className="min-h-24 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-neutral-800">
              Objectives of the Activity <span className="text-red-500">*</span>
            </label>
            <span className={`text-[11px] ${values.activityObjectives.length < 50 ? "text-amber-600 font-medium" : "text-neutral-400"}`}>
              {values.activityObjectives.length}/50 min
            </span>
          </div>
          <Textarea
            name="activityObjectives"
            value={values.activityObjectives}
            minLength={50}
            onChange={(e) => onChange("activityObjectives", e.target.value)}
            placeholder="State the primary targets and outcomes (minimum 50 characters required)..."
            rows={4}
            style={{ color: "#171717" }}
            className="min-h-24 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-neutral-800">
              Venue <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-neutral-400">
              {values.activityVenue.length}/40 (min 5)
            </span>
          </div>
          <Input
            name="activityVenue"
            value={values.activityVenue}
            minLength={5}
            maxLength={40}
            onChange={(e) => onChange("activityVenue", e.target.value)}
            placeholder="Complete room number or address (5 to 40 characters)"
            style={{ color: "#171717" }}
            className="h-10 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 items-start">
          <div className="space-y-1.5 sm:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800">
              Start Date of Event <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="dateOfEvent"
              min={getMinDateOfEvent()}
              value={values.dateOfEvent}
              onChange={(e) => handleStartDateChange(e.target.value)}
              style={{ color: "#171717" }}
              className={`${FIELD_INPUT_CLASS} cursor-pointer px-3`}
              required
            />
            <span className="text-[10px] text-neutral-500 block">
              &ge; 11 days after submission
            </span>
          </div>

          <div className="space-y-1.5 sm:col-span-3">
            <label className="block text-xs font-semibold text-neutral-800">
              End Date of Event <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="endDateOfEvent"
              min={values.dateOfEvent || getMinDateOfEvent()}
              value={values.endDateOfEvent || values.dateOfEvent || ""}
              onChange={(e) => onChange("endDateOfEvent", e.target.value)}
              style={{ color: "#171717" }}
              className={`${FIELD_INPUT_CLASS} cursor-pointer px-3`}
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-6">
            <label className="block text-xs font-semibold text-neutral-800">
              Time of Event (Start to End) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                name="timeOfEventStart"
                value={timeStart}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                style={{ color: "#171717" }}
                className={`${FIELD_INPUT_CLASS} cursor-pointer px-3 w-full`}
                required
              />
              <span className="text-xs text-neutral-500 font-medium">to</span>
              <Input
                type="time"
                name="timeOfEventEnd"
                value={timeEnd}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                style={{ color: "#171717" }}
                className={`${FIELD_INPUT_CLASS} cursor-pointer px-3 w-full`}
                required
              />
            </div>
            <input type="hidden" name="timeOfEvent" value={values.timeOfEvent} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Number of Expected Participants{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="expectedParticipants"
              placeholder="0"
              maxLength={5}
              value={values.expectedParticipants}
              onKeyDown={blockNonIntegerKeys}
              onChange={(e) =>
                onChange("expectedParticipants", sanitizeIntegerInput(e.target.value).slice(0, 5))
              }
              style={{ color: "#171717" }}
              className="no-spinner h-9.5 rounded-lg border-neutral-300 bg-white text-center !text-neutral-900 placeholder:text-neutral-400"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Amount of Individual Contribution{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              inputMode="decimal"
              name="individualContribution"
              placeholder="0.00"
              maxLength={10}
              value={values.individualContribution}
              onKeyDown={blockNonDecimalKeys}
              onChange={(e) =>
                onChange(
                  "individualContribution",
                  sanitizeDecimalInput(e.target.value).slice(0, 10)
                )
              }
              style={{ color: "#171717" }}
              className="no-spinner h-9.5 rounded-lg border-neutral-300 bg-white text-center !text-neutral-900 placeholder:text-neutral-400"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Proposed Budget for the Activity{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              inputMode="decimal"
              name="proposedBudget"
              placeholder="0.00"
              maxLength={10}
              value={values.proposedBudget}
              onKeyDown={blockNonDecimalKeys}
              onChange={(e) =>
                onChange("proposedBudget", sanitizeDecimalInput(e.target.value).slice(0, 10))
              }
              style={{ color: "#171717" }}
              className="no-spinner h-9.5 rounded-lg border-neutral-300 bg-white text-center !text-neutral-900 placeholder:text-neutral-400"
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}