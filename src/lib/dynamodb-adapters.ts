import { DEFAULT_RESERVATION_DRAFT } from "@/components/reservation/constants"
import type { ReservationDraft } from "@/components/reservation/types"
import {
  createEmptyProponent,
  DEFAULT_BUDGET_ITEMS,
  DEFAULT_SAAF_DRAFT,
} from "@/components/submission/constants"
import type { SaafDraft } from "@/components/submission/types"
import type { Activity } from "@/components/ui/activity.types"

/**
 * Backend API Submission shape returned by Laravel DynamoDB routes
 */
export interface ApiSubmission {
  event_id: string
  submission_id: string
  submission_type: string
  sent_at: string
  status: "pending" | "approved" | "denied" | "returned"
  current_signatory?: string
  activity_classification?: {
    activity_type?: string
    total_org_members?: number
  }
  proponents?: Array<{
    id: string
    position_title?: string
    first_name?: string
    middle_name?: string
    last_name?: string
    suffix?: string
    student_number?: string
    program_and_year?: string
    date_of_submission?: string
    department?: string
    position_of_applicant?: string
    org_or_course_section?: string
    contact_number?: string
    email_address?: string
    facebook_link?: string
  }>
  activity_details?: {
    title_and_nature?: string
    description?: string
    objectives?: string
    venue?: string
    date_of_event?: string
    day_of_event?: string
    time_of_event?: string
    expected_participants?: number
    individual_contribution?: number
    proposed_budget?: number
  }
  institutional_alignment?: {
    mission_statements?: {
      competitive?: boolean
      research?: boolean
      solutions?: boolean
    }
    core_values_explanation?: string
    peo_explanation?: string
    sdg_explanation?: string
  }
  detailed_budget_proposal?: {
    items?: Array<{
      item_no: string
      unit: number
      quantity: number
      price_per_unit: number
      total: number
    }>
    grand_total: number
  }
  venue_reservation?: {
    has_reservation: boolean
    equipment_requested?: {
      monoblock_chairs?: boolean
      whiteboards?: boolean
      tables?: boolean
      rostrum?: boolean
      flags_with_stand?: boolean
      panel_boards?: boolean
      others_specified?: string
    }
    general_facilities?: {
      purpose?: string
      items?: Array<{
        item: string
        date_of_use: string
        time_of_use: string
        location: string
      }>
    }
    function_rooms?: {
      purpose?: string
      items?: Array<{
        date_needed: string
        time_needed: string
        room_needed: string
        remarks?: string
      }>
    }
    audiovisual_equipment?: {
      purpose?: string
      items?: Array<{
        date_needed: string
        time_needed: string
        equipment_needed: string
        remarks?: string
      }>
    }
  }
}

export interface ApiNotification {
  submission_id: string
  sent_at: string
  signatory: string
  notif_type: "approved" | "fully approved" | "denied" | "returned"
  comment?: string
}

export interface ApiDeadline {
  event_id: string
  deadline_id: string
  sent_at: string
  deadline: string
}

export interface ApiAnnouncement {
  sent_at: string
  content: string
}

export type ApiSignatoryRole =
  | "adviser"
  | "admin"
  | "cdm"
  | "dean"
  | "osaar"

export type OrganizationDeskRole = "adviser" | "admin" | "cdm" | "dean"
export type OrganizationAssignableDeskRole = "dean" | "adviser"
export type SharedSignatoryRole = "admin" | "cdm" | "osaar"

export interface ApiOrganizationSignatory {
  role: OrganizationDeskRole
  signatory_id: string
}

export interface ApiSignatory {
  signatory_id: string
  name: string
  role: ApiSignatoryRole
  department?: string
  organization_id?: string
}

export interface ApiOrganization {
  organization_id: string
  name: string
  signatories?: ApiOrganizationSignatory[]
}

export type CreateOrganizationPayload = {
  name: string
  signatories: ApiOrganizationSignatory[]
}

export type CreateSignatoryPayload = {
  name: string
  role: ApiSignatoryRole
  department?: string
}

export function buildSignatoryPayload(
  name: string,
  role: ApiSignatoryRole,
  department?: string | null
): CreateSignatoryPayload {
  const payload: CreateSignatoryPayload = { name, role }
  if (role === "dean") {
    const normalized = department?.trim().toUpperCase()
    if (normalized) {
      payload.department = normalized
    }
  }
  return payload
}

/**
 * Transforms frontend SAAF + Reservation draft states into the exact JSON
 * payload expected by POST /api/v1/students/submissions
 */
export function buildSaafApiPayload(
  saafDraft: SaafDraft,
  reservationDraft?: ReservationDraft | null,
  existingEventId?: string
) {
  const event_id = existingEventId || crypto.randomUUID()
  const hasReservation = Boolean(
    reservationDraft &&
      (reservationDraft.facilityItems.length > 0 ||
        reservationDraft.roomItems.length > 0 ||
        reservationDraft.avItems.length > 0 ||
        Object.values(reservationDraft.equipment).some(Boolean))
  )

  return {
    event_id,
    submission_type: "saaf",
    activity_classification: {
      activity_type: saafDraft.activityType || "extra-curricular",
      total_org_members: Number(saafDraft.totalOrgMembers) || 0,
    },
    proponents: (saafDraft.proponents || []).map((p) => ({
      id: p.id || crypto.randomUUID(),
      position_title: p.position || "",
      first_name: p.firstName || "",
      middle_name: p.middleName || "",
      last_name: p.lastName || "",
      suffix: p.suffix || "",
      student_number: p.studentNumber || "",
      program_and_year: p.programAndYear || "",
      date_of_submission: p.dateOfSubmission || new Date().toISOString().split("T")[0],
      department: saafDraft.departmentValues?.[p.id] || p.department || "",
      position_of_applicant: p.positionOfApplicant || p.position || "",
      org_or_course_section: p.orgOrCourseSection || "",
      contact_number: p.contactNumber || "",
      email_address: p.emailAddress || "",
      facebook_link: p.facebookLink || "",
    })),
    activity_details: {
      title_and_nature: saafDraft.activityTitle || "",
      description: saafDraft.activityDescription || "",
      objectives: saafDraft.activityObjectives || "",
      venue: saafDraft.activityVenue || "",
      date_of_event: saafDraft.dateOfEvent || "",
      day_of_event: saafDraft.dayOfEvent || "",
      time_of_event: saafDraft.timeOfEvent || "",
      expected_participants: Number(saafDraft.expectedParticipants) || 0,
      individual_contribution: Number(saafDraft.individualContribution) || 0,
      proposed_budget: Number(saafDraft.proposedBudget) || 0,
    },
    institutional_alignment: {
      mission_statements: {
        competitive: Boolean(saafDraft.mission1),
        research: Boolean(saafDraft.mission2),
        solutions: Boolean(saafDraft.mission3),
      },
      core_values_explanation: saafDraft.coreValuesExplanation || "",
      peo_explanation: saafDraft.peoExplanation || "",
      sdg_explanation: saafDraft.sdgExplanation || "",
    },
    detailed_budget_proposal: {
      items: (saafDraft.budgetItems || []).map((b, idx) => ({
        item_no: b.item || String(idx + 1),
        unit: Number(b.unit) || 1,
        quantity: Number(b.quantity) || 0,
        price_per_unit: Number(b.pricePerUnit) || 0,
        total: (Number(b.quantity) || 0) * (Number(b.pricePerUnit) || 0),
      })),
      grand_total: (saafDraft.budgetItems || []).reduce(
        (sum, b) => sum + (Number(b.quantity) || 0) * (Number(b.pricePerUnit) || 0),
        0
      ),
    },
    venue_reservation: {
      has_reservation: hasReservation,
      equipment_requested: {
        monoblock_chairs: Boolean(reservationDraft?.equipment?.monoblock),
        whiteboards: Boolean(reservationDraft?.equipment?.whiteboards),
        tables: Boolean(reservationDraft?.equipment?.tables),
        rostrum: Boolean(reservationDraft?.equipment?.rostrum),
        flags_with_stand: Boolean(reservationDraft?.equipment?.flags),
        panel_boards: Boolean(reservationDraft?.equipment?.panelBoards),
        others_specified: reservationDraft?.otherEquipmentText || "",
      },
      general_facilities: {
        purpose: reservationDraft?.purpose || "",
        items: (reservationDraft?.facilityItems || []).map((f) => ({
          item: f.item,
          date_of_use: f.dateOfUse,
          time_of_use: f.timeOfUse,
          location: f.location,
        })),
      },
      function_rooms: {
        purpose: reservationDraft?.functionRoomPurpose || "",
        items: (reservationDraft?.roomItems || []).map((r) => ({
          date_needed: r.dateNeeded,
          time_needed: r.timeNeeded,
          room_needed: r.roomNeeded,
          remarks: r.remarks || "",
        })),
      },
      audiovisual_equipment: {
        purpose: reservationDraft?.avPurpose || "",
        items: (reservationDraft?.avItems || []).map((a) => ({
          date_needed: a.dateNeeded,
          time_needed: a.timeNeeded,
          equipment_needed: a.equipmentNeeded,
          remarks: a.remarks || "",
        })),
      },
    },
  }
}

/**
 * Formats API submission status to frontend badge colors
 */
export function getSubmissionStatusMeta(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return { label: "Approved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" }
    case "denied":
      return { label: "Denied", color: "bg-rose-500/10 text-rose-600 border-rose-200" }
    case "returned":
      return { label: "Returned", color: "bg-amber-500/10 text-amber-600 border-amber-200" }
    case "pending":
    default:
      return { label: "Under Review", color: "bg-amber-500/10 text-amber-600 border-amber-200" }
  }
}

export type DashboardSubmissionStatus = "Under Review" | "Approved" | "Returned" | "Denied"

export interface DashboardSubmissionRow {
  event_id: string
  submission_id: string
  id: string
  activity_classification: string
  current_signatory: string
  target_date: string
  requires_venue: boolean
  submitted_date: string
  api_status: "pending" | "approved" | "denied" | "returned"
  activity_details: {
    title: string
    description: string
    venue: string
    date: string
    time?: string
    expected_attendees?: number
    budget?: string
    proponent?: string
    requirements?: string[]
  }
  status: DashboardSubmissionStatus
  statusColor: string
}

export interface TrackerAssignee {
  role: string
  name: string
  statusText: string
  state: "completed" | "current" | "queued"
}

export interface TrackerStepper {
  fullSteps: string[]
  currentStepIdx: number
  isAllApproved: boolean
  progressPercent: number
  remainingSteps: number
  assigneesList: TrackerAssignee[]
}

export interface DeadlineReminder {
  id: string
  section: "Important" | "Upcoming"
  dateStr: string
  title: string
  code: string
  statusText: string
  dueDateText: string
  isUrgent: boolean
}

export function formatDisplayDate(value?: string | null): string {
  if (!value) return "—"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDisplayDateTime(value?: string | null): string {
  if (!value) return "—"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function announcementPath(sentAt: string): string {
  return `/admins/announcements/${encodeURIComponent(sentAt)}`
}

function formatProponentName(
  proponent?: NonNullable<ApiSubmission["proponents"]>[number]
): string {
  if (!proponent) return ""
  return [proponent.first_name, proponent.middle_name, proponent.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()
}

export function apiSubmissionToDashboardRow(submission: ApiSubmission): DashboardSubmissionRow {
  const meta = getSubmissionStatusMeta(submission.status)
  const firstProponent = submission.proponents?.[0]
  const title = submission.activity_details?.title_and_nature || "Untitled activity"
  const budget = submission.activity_details?.proposed_budget

  return {
    event_id: submission.event_id,
    submission_id: submission.submission_id,
    id: submission.submission_id,
    activity_classification: submission.activity_classification?.activity_type || "extra-curricular",
    current_signatory: submission.current_signatory || "—",
    target_date: submission.activity_details?.date_of_event || submission.sent_at,
    requires_venue: Boolean(submission.venue_reservation?.has_reservation),
    submitted_date: formatDisplayDate(submission.sent_at),
    api_status: submission.status,
    activity_details: {
      title,
      description: submission.activity_details?.description || "",
      venue: submission.activity_details?.venue || "—",
      date: formatDisplayDate(submission.activity_details?.date_of_event),
      time: submission.activity_details?.time_of_event || "",
      expected_attendees: submission.activity_details?.expected_participants,
      budget: typeof budget === "number" ? `₱${budget.toLocaleString("en-PH")}` : "—",
      proponent: formatProponentName(firstProponent) || firstProponent?.org_or_course_section || "",
      requirements: [],
    },
    status: meta.label as DashboardSubmissionStatus,
    statusColor: meta.color,
  }
}

export function apiSubmissionToActivity(submission: ApiSubmission): Activity {
  const firstProponent = submission.proponents?.[0]
  const title = submission.activity_details?.title_and_nature || "Untitled activity"
  const budget = submission.activity_details?.proposed_budget
  const objectivesText = submission.activity_details?.objectives || ""
  const objectives = objectivesText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(":")
      if (separator > 0) {
        return {
          title: line.slice(0, separator).trim(),
          description: line.slice(separator + 1).trim(),
        }
      }
      return { title: "Objective", description: line }
    })

  const decision: Activity["decision"] =
    submission.status === "denied"
      ? "Reject"
      : submission.status === "returned"
        ? "Return"
        : "Review"

  const status: Activity["status"] =
    submission.status === "approved"
      ? "Accepted"
      : submission.status === "denied"
        ? "Rejected"
        : submission.status === "returned"
          ? "Returned"
          : "Review"

  return {
    id: `${submission.event_id}:${submission.submission_id}`,
    eventId: submission.event_id,
    submissionId: submission.submission_id,
    title,
    org: firstProponent?.org_or_course_section || "Organization",
    department: firstProponent?.department || "—",
    date: formatDisplayDate(submission.activity_details?.date_of_event),
    time: submission.activity_details?.time_of_event || "",
    submittedDate: formatDisplayDate(submission.sent_at),
    representative: formatProponentName(firstProponent) || "—",
    type: submission.activity_classification?.activity_type || "extra-curricular",
    decision,
    status,
    description: submission.activity_details?.description || "No description provided.",
    venue: submission.activity_details?.venue || "—",
    expectedParticipants: submission.activity_details?.expected_participants || 0,
    proposedBudget:
      typeof budget === "number" ? `₱${budget.toLocaleString("en-PH")}` : "—",
    proponents: (submission.proponents || []).map((proponent) => ({
      role: proponent.position_title || proponent.position_of_applicant || "Proponent",
      name: formatProponentName(proponent) || proponent.student_number || "—",
    })),
    objectives:
      objectives.length > 0
        ? objectives
        : [{ title: "Objective", description: "No objectives listed." }],
  }
}

export function apiNotificationsToStepper(
  notifications: ApiNotification[],
  currentSignatory?: string,
  apiStatus?: ApiSubmission["status"]
): TrackerStepper {
  const sorted = [...notifications].sort((a, b) => a.sent_at.localeCompare(b.sent_at))
  const fullyApproved = sorted.some((item) => item.notif_type === "fully approved")
  const isAllApproved = fullyApproved || apiStatus === "approved"

  const roles: string[] = []
  for (const item of sorted) {
    if (item.signatory && !roles.includes(item.signatory)) {
      roles.push(item.signatory)
    }
  }
  if (currentSignatory && currentSignatory !== "—" && !roles.includes(currentSignatory)) {
    roles.push(currentSignatory)
  }
  if (roles.length === 0) {
    roles.push("Adviser")
  }

  const fullSteps = [...roles, "Approved"]
  const latestBySignatory = new Map<string, ApiNotification>()
  for (const item of sorted) {
    latestBySignatory.set(item.signatory, item)
  }

  let currentStepIdx = roles.findIndex((role) => role === currentSignatory)
  if (isAllApproved) {
    currentStepIdx = roles.length
  } else if (currentStepIdx === -1) {
    const blocked = [...sorted].reverse().find(
      (item) => item.notif_type === "denied" || item.notif_type === "returned"
    )
    currentStepIdx = blocked ? Math.max(0, roles.indexOf(blocked.signatory)) : 0
  }

  const assigneesList: TrackerAssignee[] = roles.map((role, idx) => {
    const latest = latestBySignatory.get(role)
    let state: TrackerAssignee["state"] = "queued"
    let statusText = idx === 0 ? "Queued" : `Queued (Awaiting ${roles[idx - 1]})`

    if (isAllApproved || idx < currentStepIdx) {
      state = "completed"
      statusText = latest
        ? `${latest.notif_type} (${formatDisplayDate(latest.sent_at)})`
        : "Approved"
    } else if (idx === currentStepIdx) {
      state = "current"
      if (latest?.notif_type === "denied" || apiStatus === "denied") {
        statusText = latest?.comment
          ? `Denied — ${latest.comment}`
          : "Denied"
      } else if (latest?.notif_type === "returned" || apiStatus === "returned") {
        statusText = latest?.comment
          ? `Returned for revision — ${latest.comment}`
          : "Returned for revision"
      } else {
        statusText = "Pending signature (in review)"
      }
    }

    return { role, name: role, statusText, state }
  })

  assigneesList.push({
    role: "System",
    name: "System sign-off",
    statusText: isAllApproved ? "Approved" : "Queued (pending all signatures)",
    state: isAllApproved ? "completed" : "queued",
  })

  const completedCount = isAllApproved ? roles.length : Math.max(0, currentStepIdx)
  const remainingSteps = Math.max(0, roles.length - completedCount)

  return {
    fullSteps,
    currentStepIdx: isAllApproved ? roles.length : currentStepIdx,
    isAllApproved,
    progressPercent: Math.round((completedCount / roles.length) * 100),
    remainingSteps,
    assigneesList,
  }
}

export function apiDeadlinesToReminders(
  deadlines: ApiDeadline[],
  submissions: ApiSubmission[]
): DeadlineReminder[] {
  const titleByEvent = new Map(
    submissions.map((submission) => [
      submission.event_id,
      submission.activity_details?.title_and_nature || submission.submission_id,
    ])
  )
  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000

  return deadlines.map((deadline) => {
    const due = new Date(deadline.deadline)
    const dueMs = due.getTime()
    const isUrgent = !Number.isNaN(dueMs) && dueMs - now <= weekMs
    return {
      id: deadline.deadline_id,
      section: isUrgent ? "Important" : "Upcoming",
      dateStr: formatDisplayDate(deadline.sent_at),
      title: titleByEvent.get(deadline.event_id) || "Upcoming deadline",
      code: deadline.event_id,
      statusText: isUrgent ? "Action needed before the deadline" : "Scheduled deadline",
      dueDateText: formatDisplayDate(deadline.deadline),
      isUrgent,
    }
  })
}

export function apiSubmissionToDrafts(submission: ApiSubmission): {
  saaf: SaafDraft
  reservation: ReservationDraft
  hasReservation: boolean
} {
  const proponents = (submission.proponents || []).map((proponent, index) => ({
    id: proponent.id || String(index + 1),
    position: proponent.position_title || "",
    firstName: proponent.first_name || "",
    middleName: proponent.middle_name || "",
    lastName: proponent.last_name || "",
    suffix: proponent.suffix || "",
    studentNumber: proponent.student_number || "",
    programAndYear: proponent.program_and_year || "",
    dateOfSubmission: proponent.date_of_submission || "",
    department: proponent.department || "",
    positionOfApplicant: proponent.position_of_applicant || "",
    orgOrCourseSection: proponent.org_or_course_section || "",
    contactNumber: proponent.contact_number || "",
    emailAddress: proponent.email_address || "",
    facebookLink: proponent.facebook_link || "",
  }))

  const departmentValues = Object.fromEntries(
    proponents.map((proponent) => [proponent.id, proponent.department])
  )

  const budgetItems =
    submission.detailed_budget_proposal?.items?.map((item, index) => ({
      id: String(index + 1),
      item: item.item_no || String(index + 1),
      unit: String(item.unit ?? 1),
      quantity: String(item.quantity ?? 0),
      pricePerUnit: String(item.price_per_unit ?? 0),
    })) || DEFAULT_BUDGET_ITEMS

  const reservationSource = submission.venue_reservation
  const equipment = reservationSource?.equipment_requested
  const reservation: ReservationDraft = {
    equipment: {
      monoblock: Boolean(equipment?.monoblock_chairs),
      whiteboards: Boolean(equipment?.whiteboards),
      tables: Boolean(equipment?.tables),
      rostrum: Boolean(equipment?.rostrum),
      flags: Boolean(equipment?.flags_with_stand),
      panelBoards: Boolean(equipment?.panel_boards),
      others: Boolean(equipment?.others_specified),
    },
    otherEquipmentText: equipment?.others_specified || "",
    purpose: reservationSource?.general_facilities?.purpose || "",
    functionRoomPurpose: reservationSource?.function_rooms?.purpose || "",
    avPurpose: reservationSource?.audiovisual_equipment?.purpose || "",
    facilityItems: reservationSource?.general_facilities?.items?.length
      ? reservationSource.general_facilities.items.map((item, index) => ({
          id: String(index + 1),
          item: item.item,
          dateOfUse: item.date_of_use,
          timeOfUse: item.time_of_use,
          location: item.location,
        }))
      : DEFAULT_RESERVATION_DRAFT.facilityItems,
    roomItems: reservationSource?.function_rooms?.items?.length
      ? reservationSource.function_rooms.items.map((item, index) => ({
          id: String(index + 1),
          dateNeeded: item.date_needed,
          timeNeeded: item.time_needed,
          roomNeeded: item.room_needed,
          remarks: item.remarks || "",
        }))
      : DEFAULT_RESERVATION_DRAFT.roomItems,
    avItems: reservationSource?.audiovisual_equipment?.items?.length
      ? reservationSource.audiovisual_equipment.items.map((item, index) => ({
          id: String(index + 1),
          dateNeeded: item.date_needed,
          timeNeeded: item.time_needed,
          equipmentNeeded: item.equipment_needed,
          remarks: item.remarks || "",
        }))
      : DEFAULT_RESERVATION_DRAFT.avItems,
  }

  return {
    saaf: {
      ...DEFAULT_SAAF_DRAFT,
      activityType: submission.activity_classification?.activity_type || DEFAULT_SAAF_DRAFT.activityType,
      totalOrgMembers: String(submission.activity_classification?.total_org_members ?? ""),
      expectedParticipants: String(submission.activity_details?.expected_participants ?? ""),
      individualContribution: String(submission.activity_details?.individual_contribution ?? ""),
      proposedBudget: String(submission.activity_details?.proposed_budget ?? ""),
      dayOfEvent: submission.activity_details?.day_of_event || "",
      departmentValues,
      activityTitle: submission.activity_details?.title_and_nature || "",
      activityDescription: submission.activity_details?.description || "",
      activityObjectives: submission.activity_details?.objectives || "",
      activityVenue: submission.activity_details?.venue || "",
      dateOfEvent: submission.activity_details?.date_of_event || "",
      timeOfEvent: submission.activity_details?.time_of_event || "",
      mission1: Boolean(submission.institutional_alignment?.mission_statements?.competitive),
      mission2: Boolean(submission.institutional_alignment?.mission_statements?.research),
      mission3: Boolean(submission.institutional_alignment?.mission_statements?.solutions),
      coreValuesExplanation: submission.institutional_alignment?.core_values_explanation || "",
      peoExplanation: submission.institutional_alignment?.peo_explanation || "",
      sdgExplanation: submission.institutional_alignment?.sdg_explanation || "",
      proponents: proponents.length > 0 ? proponents : [createEmptyProponent("1")],
      budgetItems,
    },
    reservation,
    hasReservation: Boolean(reservationSource?.has_reservation),
  }
}

export function omitEventIdFromPayload<T extends { event_id?: string }>(payload: T) {
  const rest = { ...payload }
  delete rest.event_id
  return rest
}
