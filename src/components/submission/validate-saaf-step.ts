import {
  clockFromDraft,
  clockMinutes,
  EVENT_WINDOW_END,
  EVENT_WINDOW_START,
  format24,
  SAME_EVENT_TIME_MESSAGE,
  splitEventTime,
} from "@/components/submission/event-time"
import type { SaafStepIndex } from "@/components/submission/saaf-stepper"
import type { Proponent, SaafDraft } from "@/components/submission/types"
import {
  EVENT_DATE_TOO_SOON_MESSAGE,
  minEventDateKey,
} from "@/lib/date-key"

const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function isBlank(value: string | undefined): boolean {
  return !value || !value.trim()
}

function eventTimes(draft: SaafDraft): { start: string; end: string } {
  const split = splitEventTime(draft.timeOfEvent || "")
  const start = format24(
    clockFromDraft(
      draft.timeOfEventStartHour,
      draft.timeOfEventStartMinute,
      draft.timeOfEventStartPeriod,
      draft.timeOfEventStart || split.start
    )
  )
  const end = format24(
    clockFromDraft(
      draft.timeOfEventEndHour,
      draft.timeOfEventEndMinute,
      draft.timeOfEventEndPeriod,
      draft.timeOfEventEnd || split.end
    )
  )
  return { start, end }
}

function isInsideEventWindow(value: string): boolean {
  const total = clockMinutes(
    clockFromDraft(undefined, undefined, undefined, value)
  )
  return (
    total !== null && total >= EVENT_WINDOW_START && total <= EVENT_WINDOW_END
  )
}

function isValidAbsoluteUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function missingFieldsMessage(fields: string[]): string | null {
  if (fields.length === 0) return null
  return `Fill in: ${fields.join(", ")}.`
}

function proponentIssue(proponent: Proponent, department: string, index: number): string | null {
  const prefix = `Proponent ${index + 1}`
  const missing: string[] = []

  if (isBlank(proponent.firstName)) missing.push(`${prefix} first name`)
  if (isBlank(proponent.lastName)) missing.push(`${prefix} last name`)
  if (isBlank(proponent.studentNumber)) missing.push(`${prefix} student number`)
  if (isBlank(proponent.programAndYear)) missing.push(`${prefix} program and year`)
  if (isBlank(proponent.positionOfApplicant)) missing.push(`${prefix} position`)
  if (isBlank(proponent.orgOrCourseSection)) missing.push(`${prefix} organization or course section`)
  if (isBlank(proponent.contactNumber)) missing.push(`${prefix} contact number`)
  if (isBlank(proponent.emailAddress)) missing.push(`${prefix} email address`)
  if (isBlank(proponent.facebookLink)) missing.push(`${prefix} Facebook link`)
  if (isBlank(department)) missing.push(`${prefix} department`)

  const missingMessage = missingFieldsMessage(missing)
  if (missingMessage) return missingMessage

  if (!EMAIL_PATTERN.test(proponent.emailAddress.trim())) {
    return `Enter a valid email address for ${prefix}.`
  }

  if (!isValidAbsoluteUrl(proponent.facebookLink.trim())) {
    return `Enter a valid Facebook URL for ${prefix}.`
  }

  return null
}

export function getSaafStepIssue(
  step: SaafStepIndex,
  draft: SaafDraft
): string | null {
  if (step === 0) {
    const missing: string[] = []
    if (!draft.activityType) missing.push("Activity type")
    if (isBlank(draft.totalOrgMembers)) missing.push("Total number of class/org members")
    const missingMessage = missingFieldsMessage(missing)
    if (missingMessage) return missingMessage
    if (draft.totalOrgMembers.length > 5) {
      return "Total number of class/org members cannot exceed 5 digits."
    }
    return null
  }

  if (step === 1) {
    for (const [index, proponent] of draft.proponents.entries()) {
      const department =
        draft.departmentValues[proponent.id] || proponent.department
      const issue = proponentIssue(proponent, department, index)
      if (issue) return issue
    }
    return null
  }

  if (step === 2) {
    const missing: string[] = []
    if (isBlank(draft.activityTitle)) missing.push("Activity title")
    if (isBlank(draft.activityDescription)) missing.push("Activity description")
    if (isBlank(draft.activityObjectives)) missing.push("Activity objectives")
    if (isBlank(draft.activityVenue)) missing.push("Activity venue")
    if (isBlank(draft.dateOfEvent)) missing.push("Start date")
    if (isBlank(draft.endDateOfEvent || draft.dateOfEvent)) missing.push("End date")

    const { start, end } = eventTimes(draft)
    if (!start) missing.push("Start time")
    if (!end) missing.push("End time")
    if (isBlank(draft.expectedParticipants)) missing.push("Expected participants")
    if (isBlank(draft.individualContribution)) missing.push("Individual contribution")
    if (isBlank(draft.proposedBudget)) missing.push("Proposed budget")

    const missingMessage = missingFieldsMessage(missing)
    if (missingMessage) return missingMessage

    if ((draft.activityDescription || "").trim().length < 100) {
      return "Activity description must be at least 100 characters."
    }
    if ((draft.activityObjectives || "").trim().length < 50) {
      return "Activity objectives must be at least 50 characters."
    }
    if ((draft.activityVenue || "").trim().length < 5) {
      return "Activity venue must be at least 5 characters."
    }
    if (!isInsideEventWindow(start) || !isInsideEventWindow(end)) {
      return "Event time must be between 7:00 AM and 9:00 PM."
    }
    const startMinutes = clockMinutes(
      clockFromDraft(undefined, undefined, undefined, start)
    )
    const endMinutes = clockMinutes(
      clockFromDraft(undefined, undefined, undefined, end)
    )
    if (
      startMinutes !== null &&
      endMinutes !== null &&
      startMinutes === endMinutes
    ) {
      return SAME_EVENT_TIME_MESSAGE
    }
    if (
      startMinutes !== null &&
      endMinutes !== null &&
      endMinutes < startMinutes
    ) {
      return "End time cannot be earlier than the start time."
    }

    const startDate = draft.dateOfEvent
    const endDate = draft.endDateOfEvent || draft.dateOfEvent
    const minStart = minEventDateKey()
    if (startDate < minStart) {
      return EVENT_DATE_TOO_SOON_MESSAGE
    }

    if (endDate < startDate) {
      return "End date cannot be earlier than the start date."
    }

    return null
  }

  const hasMission =
    Boolean(draft.mission1) || Boolean(draft.mission2) || Boolean(draft.mission3)
  if (!hasMission) {
    return "Select at least one mission statement."
  }
  if ((draft.coreValuesExplanation || "").trim().length < 30) {
    return "Core Values Explanation must be at least 30 characters."
  }
  if (
    (draft.peoExplanation || "").trim().length > 0 &&
    (draft.peoExplanation || "").trim().length < 30
  ) {
    return "Program Educational Objectives must be at least 30 characters if provided."
  }
  if ((draft.sdgExplanation || "").trim().length < 30) {
    return "UN Sustainability Goals explanation must be at least 30 characters."
  }

  return null
}

export function isSaafStepComplete(step: SaafStepIndex, draft: SaafDraft): boolean {
  return getSaafStepIssue(step, draft) === null
}

export function isSaafDraftComplete(draft: SaafDraft): boolean {
  return ([0, 1, 2, 3] as const).every((step) => isSaafStepComplete(step, draft))
}

export function isStepHtmlValid(panel: HTMLElement): boolean {
  const fields = panel.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >("input, textarea, select")

  for (const field of fields) {
    if (field.disabled) continue
    if (!field.checkValidity()) return false
  }

  return true
}

export const STEP_INVALID_FOCUS_SELECTOR =
  'input:invalid:not([type="hidden"]), textarea:invalid, select:invalid, .saaf-glow-invalid'
