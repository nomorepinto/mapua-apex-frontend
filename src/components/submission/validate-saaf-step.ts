import {
  clockFromDraft,
  clockMinutes,
  EVENT_WINDOW_END,
  EVENT_WINDOW_START,
  format24,
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

const GENERIC_STEP_ERROR =
  "Fill in every required field on this step before continuing."

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

function proponentIssue(proponent: Proponent, department: string): string | null {
  if (
    isBlank(proponent.firstName) ||
    isBlank(proponent.lastName) ||
    isBlank(proponent.studentNumber) ||
    isBlank(proponent.programAndYear) ||
    isBlank(proponent.positionOfApplicant) ||
    isBlank(proponent.orgOrCourseSection) ||
    isBlank(proponent.contactNumber) ||
    isBlank(proponent.emailAddress) ||
    isBlank(proponent.facebookLink) ||
    isBlank(department)
  ) {
    return GENERIC_STEP_ERROR
  }

  if (!EMAIL_PATTERN.test(proponent.emailAddress.trim())) {
    return "Enter a valid email address for every proponent."
  }

  if (!isValidAbsoluteUrl(proponent.facebookLink.trim())) {
    return "Enter a valid Facebook URL for every proponent."
  }

  return null
}

export function getSaafStepIssue(
  step: SaafStepIndex,
  draft: SaafDraft
): string | null {
  if (step === 0) {
    if (!draft.activityType) {
      return "Select an activity type."
    }
    if (isBlank(draft.totalOrgMembers)) {
      return GENERIC_STEP_ERROR
    }
    if (draft.totalOrgMembers.length > 5) {
      return "Total number of class/org members cannot exceed 5 digits."
    }
    return null
  }

  if (step === 1) {
    for (const proponent of draft.proponents) {
      const department =
        draft.departmentValues[proponent.id] || proponent.department
      const issue = proponentIssue(proponent, department)
      if (issue) return issue
    }
    return null
  }

  if (step === 2) {
    if (isBlank(draft.activityTitle)) return GENERIC_STEP_ERROR

    if ((draft.activityDescription || "").trim().length < 100) {
      return "Activity Description must be at least 100 characters."
    }
    if ((draft.activityObjectives || "").trim().length < 50) {
      return "Activity Objectives must be at least 50 characters."
    }
    if ((draft.activityVenue || "").trim().length < 5) {
      return "Activity Venue must be at least 5 characters."
    }

    const startDate = draft.dateOfEvent
    const endDate = draft.endDateOfEvent || draft.dateOfEvent
    if (isBlank(startDate) || isBlank(endDate)) return GENERIC_STEP_ERROR

    const { start, end } = eventTimes(draft)
    if (!start || !end) return GENERIC_STEP_ERROR
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
      endMinutes < startMinutes
    ) {
      return "End time cannot be earlier than the start time."
    }

    if (
      isBlank(draft.expectedParticipants) ||
      isBlank(draft.individualContribution) ||
      isBlank(draft.proposedBudget)
    ) {
      return GENERIC_STEP_ERROR
    }

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
