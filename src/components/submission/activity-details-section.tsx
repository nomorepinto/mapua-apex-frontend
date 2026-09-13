import {
  DAYS_OF_WEEK,
  FIELD_INPUT_CLASS,
  SELECT_CONTENT_STYLE,
  SELECT_ITEM_CLASS,
} from "@/components/submission/constants"
import type { SaafDraft } from "@/components/submission/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  | "dayOfEvent"
  | "timeOfEvent"
  | "expectedParticipants"
  | "individualContribution"
  | "proposedBudget"
>

export function ActivityDetailsSection({
  values,
  onChange,
}: {
  values: DetailsFields
  onChange: <K extends keyof SaafDraft>(key: K, value: SaafDraft[K]) => void
}) {
  return (
    <div className="space-y-6 pt-4">
      <div className="border-b border-neutral-200 pb-2">
        <h2 className="text-lg font-bold tracking-wide text-neutral-900 uppercase">
          DETAILS OF ACTIVITY
        </h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-800">
            Title and Nature of Activity applied for{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            name="activityTitle"
            value={values.activityTitle}
            onChange={(e) => onChange("activityTitle", e.target.value)}
            placeholder="i.e. Seminar, Field Trip, Plant Visit, Outing, Socials, Assembly, Meeting, etc."
            style={{ color: "#171717" }}
            className="h-10 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-800">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="activityDescription"
            value={values.activityDescription}
            onChange={(e) => onChange("activityDescription", e.target.value)}
            placeholder="Provide a comprehensive summary of the activity..."
            rows={4}
            style={{ color: "#171717" }}
            className="min-h-24 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-800">
            Objectives of the Activity <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="activityObjectives"
            value={values.activityObjectives}
            onChange={(e) => onChange("activityObjectives", e.target.value)}
            placeholder="State the primary targets and outcomes..."
            rows={4}
            style={{ color: "#171717" }}
            className="min-h-24 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-800">
            Venue <span className="text-red-500">*</span>
          </label>
          <Input
            name="activityVenue"
            value={values.activityVenue}
            onChange={(e) => onChange("activityVenue", e.target.value)}
            placeholder="Write the complete room number or address for off-campus activity"
            style={{ color: "#171717" }}
            className="h-10 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Date of Event <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="dateOfEvent"
              value={values.dateOfEvent}
              onChange={(e) => onChange("dateOfEvent", e.target.value)}
              style={{ color: "#171717" }}
              className={`${FIELD_INPUT_CLASS} cursor-pointer px-3`}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Day of Event <span className="text-red-500">*</span>
            </label>
            <Select
              value={values.dayOfEvent}
              onValueChange={(val) => {
                if (typeof val === "string") onChange("dayOfEvent", val)
              }}
            >
              <SelectTrigger className="h-9.5 w-full rounded-lg border-neutral-300 bg-white !text-neutral-900">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent
                className="animate-in fade-in-80 z-50 rounded-xl bg-white p-1.5 text-neutral-900"
                style={SELECT_CONTENT_STYLE}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day} className={SELECT_ITEM_CLASS}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="dayOfEvent" value={values.dayOfEvent} required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Time of Event <span className="text-red-500">*</span>
            </label>
            <Input
              type="time"
              name="timeOfEvent"
              value={values.timeOfEvent}
              onChange={(e) => onChange("timeOfEvent", e.target.value)}
              style={{ color: "#171717" }}
              className={`${FIELD_INPUT_CLASS} cursor-pointer px-3`}
              required
            />
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
              value={values.expectedParticipants}
              onKeyDown={blockNonIntegerKeys}
              onChange={(e) =>
                onChange("expectedParticipants", sanitizeIntegerInput(e.target.value))
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
              value={values.individualContribution}
              onKeyDown={blockNonDecimalKeys}
              onChange={(e) =>
                onChange(
                  "individualContribution",
                  sanitizeDecimalInput(e.target.value)
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
              value={values.proposedBudget}
              onKeyDown={blockNonDecimalKeys}
              onChange={(e) =>
                onChange("proposedBudget", sanitizeDecimalInput(e.target.value))
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
