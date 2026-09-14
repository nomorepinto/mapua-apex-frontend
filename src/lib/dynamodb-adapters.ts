import type { SaafDraft } from "@/components/submission/types"
import type { ReservationDraft } from "@/components/reservation/types"

/**
 * Backend API Submission shape returned by Laravel DynamoDB routes
 */
export interface ApiSubmission {
  event_id: string
  submission_id: string
  submission_type: string
  sent_at: string
  status: "pending" | "approved" | "denied"
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
  notif_type: "approved" | "fully approved" | "denied"
  comment?: string
}

export interface ApiAppeal {
  submission_id: string
  appeal_id: string
  event_id: string
  sent_at: string
  signatory_destination: string
  comment: string
  status: "open" | "resolved"
  resolution?: "upheld" | "overturned" | null
  resolved_at?: string | null
  resolved_comment?: string | null
}

export interface ApiDeadline {
  event_id: string
  deadline_id: string
  sent_at: string
  deadline: string
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
      return { label: "Returned", color: "bg-rose-500/10 text-rose-600 border-rose-200" }
    case "pending":
    default:
      return { label: "Under Review", color: "bg-amber-500/10 text-amber-600 border-amber-200" }
  }
}
