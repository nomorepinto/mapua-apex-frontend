export const EVENT_MINUTES = ["00", "15", "30", "45"]

export const EVENT_WINDOW_START = 7 * 60
export const EVENT_WINDOW_END = 21 * 60

const AM_HOURS = ["7", "8", "9", "10", "11"]
const PM_HOURS = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const ALL_HOURS = ["7", "8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6"]

export type Period = "AM" | "PM"

export type ClockParts = {
  hour: string
  minute: string
  period: Period | ""
}

export const EMPTY_CLOCK: ClockParts = { hour: "", minute: "", period: "" }

export function hourOptions(period: Period | ""): string[] {
  if (period === "AM") return [...AM_HOURS]
  if (period === "PM") return [...PM_HOURS]
  return [...ALL_HOURS]
}

export function impliedPeriod(hour: string): Period | "" {
  const inAm = AM_HOURS.includes(hour)
  const inPm = PM_HOURS.includes(hour)
  if (inAm && !inPm) return "AM"
  if (inPm && !inAm) return "PM"
  return ""
}

function slotMinutes(hour12: string, minute: string, period: Period): number | null {
  const hour = Number(hour12)
  const mins = Number(minute)
  if (!Number.isInteger(hour) || !Number.isInteger(mins)) return null
  if (hour < 1 || hour > 12 || mins < 0 || mins > 59) return null
  let hours24 = hour % 12
  if (period === "PM") hours24 += 12
  return hours24 * 60 + mins
}

export function clockMinutes(parts: ClockParts): number | null {
  if (parts.period !== "AM" && parts.period !== "PM") return null
  return slotMinutes(parts.hour, parts.minute, parts.period)
}

export function format24(parts: ClockParts): string {
  const total = clockMinutes(parts)
  if (total === null) return ""
  const hours = Math.floor(total / 60)
  const mins = total % 60
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}

export function parse24(value: string): ClockParts {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return { ...EMPTY_CLOCK }
  const hours = Number(match[1])
  const minute = match[2]
  if (!Number.isInteger(hours) || hours > 23 || Number(minute) > 59) {
    return { ...EMPTY_CLOCK }
  }
  const period: Period = hours >= 12 ? "PM" : "AM"
  return { hour: String(hours % 12 || 12), minute, period }
}

export function splitEventTime(value: string): { start: string; end: string } {
  if (!value.includes(" - ")) return { start: value.trim(), end: "" }
  const [start, end] = value.split(" - ")
  return { start: (start ?? "").trim(), end: (end ?? "").trim() }
}

export function combineEventTime(start: string, end: string): string {
  if (start && end) return `${start} - ${end}`
  return start
}

export function clockFromDraft(
  hour: string | undefined,
  minute: string | undefined,
  period: string | undefined,
  fallback24: string
): ClockParts {
  if (hour === undefined && minute === undefined && period === undefined) {
    return parse24(fallback24)
  }
  return {
    hour: hour ?? "",
    minute: minute ?? "",
    period: period === "AM" || period === "PM" ? period : "",
  }
}

export function withHour(parts: ClockParts, hour: string): ClockParts {
  const implied = impliedPeriod(hour)
  const period = implied || parts.period
  const periodFits =
    period === "AM" || period === "PM" ? hourOptions(period).includes(hour) : true
  return {
    hour,
    minute: parts.minute,
    period: implied || (periodFits ? parts.period : ""),
  }
}

export function withPeriod(parts: ClockParts, period: Period): ClockParts {
  return {
    hour: hourOptions(period).includes(parts.hour) ? parts.hour : "",
    minute: parts.minute,
    period,
  }
}

function periodsFor(period: Period | ""): Period[] {
  if (period === "AM" || period === "PM") return [period]
  return ["AM", "PM"]
}

function openMinutes(hour: string, period: Period, earliest: number | null): string[] {
  return EVENT_MINUTES.filter((minute) => {
    const total = slotMinutes(hour, minute, period)
    if (total === null || total < EVENT_WINDOW_START || total > EVENT_WINDOW_END) {
      return false
    }
    return earliest === null || total >= earliest
  })
}

export function isHourBlocked(
  hour: string,
  period: Period | "",
  earliest: number | null
): boolean {
  return !periodsFor(period).some((candidate) => {
    if (!hourOptions(candidate).includes(hour)) return false
    return openMinutes(hour, candidate, earliest).length > 0
  })
}

export function isPeriodBlocked(period: Period, earliest: number | null): boolean {
  return hourOptions(period).every((hour) => isHourBlocked(hour, period, earliest))
}

export function isMinuteBlocked(
  minute: string,
  hour: string,
  period: Period | "",
  earliest: number | null
): boolean {
  if (!hour || (period !== "AM" && period !== "PM")) return false
  const total = slotMinutes(hour, minute, period)
  if (total === null) return true
  if (total < EVENT_WINDOW_START || total > EVENT_WINDOW_END) return true
  return earliest !== null && total < earliest
}

export function startPeriod(start: ClockParts): Period | "" {
  if (start.period === "AM" || start.period === "PM") return start.period
  if (!start.hour) return ""
  return impliedPeriod(start.hour) || "AM"
}

export function earliestEndMinutes(start: ClockParts): number | null {
  const period = startPeriod(start)
  if (!start.hour || !period) return null
  return slotMinutes(start.hour, start.minute || "00", period)
}

export function alignEndPeriod(start: ClockParts, end: ClockParts): ClockParts {
  const period = startPeriod(start)
  if (!period) return end
  const earliest = earliestEndMinutes(start)
  if (
    (end.period === "AM" || end.period === "PM") &&
    !isPeriodBlocked(end.period, earliest)
  ) {
    return end
  }
  return {
    ...end,
    period,
    hour: end.period && end.period !== period ? "" : end.hour,
  }
}

export function constrainClock(parts: ClockParts, earliest: number | null): ClockParts {
  const next: ClockParts = { ...parts }
  if (next.period && isPeriodBlocked(next.period, earliest)) next.period = ""
  if (next.hour && isHourBlocked(next.hour, next.period, earliest)) next.hour = ""
  if (next.minute && isMinuteBlocked(next.minute, next.hour, next.period, earliest)) {
    next.minute = ""
  }
  return next
}

export function minuteChoices(current: string): string[] {
  if (current && !EVENT_MINUTES.includes(current)) {
    return [...EVENT_MINUTES, current].sort()
  }
  return [...EVENT_MINUTES]
}

export function hourChoices(period: Period | "", current: string): string[] {
  const options = hourOptions(period)
  if (current && !options.includes(current)) return [...options, current]
  return options
}
