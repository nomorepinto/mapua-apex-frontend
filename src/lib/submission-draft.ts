import {
  DEFAULT_AV_ITEMS,
  DEFAULT_EQUIPMENT,
  DEFAULT_FACILITY_ITEMS,
  DEFAULT_ROOM_ITEMS,
} from "@/components/reservation/constants"
import {
  createEmptyProponent,
  DEFAULT_BUDGET_ITEMS as UI_DEFAULT_BUDGET_ITEMS,
} from "@/components/submission/constants"
import type { ReservationDraft } from "@/components/reservation/types"
import type { BudgetItem, Proponent, SaafDraft } from "@/components/submission/types"
import { calculateRowTotal } from "@/lib/numeric-input"
import type {
  ActivityType,
  AudiovisualItem,
  BudgetItem as SchemaBudgetItem,
  FunctionRoomItem,
  GeneralFacilityItem,
  Proponent as SchemaProponent,
  Submission,
} from "@/lib/types"

function parseNumber(value: string | number | undefined): number {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

function numberToInput(value: number): string {
  return value === 0 ? "" : String(value)
}

function asActivityType(value: string): ActivityType {
  return value === "extra-curricular" ? "extra-curricular" : "co-curricular"
}

function schemaProponent(proponent: Proponent, department: string): SchemaProponent {
  return {
    id: proponent.id,
    position_title: proponent.position,
    first_name: proponent.firstName,
    middle_name: proponent.middleName,
    last_name: proponent.lastName,
    suffix: proponent.suffix,
    student_number: proponent.studentNumber,
    program_and_year: proponent.programAndYear,
    date_of_submission: proponent.dateOfSubmission,
    department: department || proponent.department,
    position_of_applicant: proponent.positionOfApplicant,
    org_or_course_section: proponent.orgOrCourseSection,
    contact_number: proponent.contactNumber,
    email_address: proponent.emailAddress,
    facebook_link: proponent.facebookLink,
  }
}

function uiProponent(proponent: SchemaProponent): Proponent {
  return {
    id: proponent.id,
    position: proponent.position_title,
    firstName: proponent.first_name,
    middleName: proponent.middle_name,
    lastName: proponent.last_name,
    suffix: proponent.suffix,
    studentNumber: proponent.student_number,
    programAndYear: proponent.program_and_year,
    dateOfSubmission: proponent.date_of_submission,
    department: proponent.department,
    positionOfApplicant: proponent.position_of_applicant,
    orgOrCourseSection: proponent.org_or_course_section,
    contactNumber: proponent.contact_number,
    emailAddress: proponent.email_address,
    facebookLink: proponent.facebook_link,
  }
}

function schemaBudgetItem(item: BudgetItem): SchemaBudgetItem {
  const quantity = parseNumber(item.quantity)
  const price = parseNumber(item.pricePerUnit)
  return {
    item_no: item.item || item.id,
    unit: parseNumber(item.unit),
    quantity,
    price_per_unit: price,
    total: calculateRowTotal(item.quantity, item.pricePerUnit),
  }
}

function uiBudgetItem(item: SchemaBudgetItem, index: number): BudgetItem {
  return {
    id: item.item_no || String(index + 1),
    item: item.item_no || String(index + 1),
    unit: String(item.unit),
    quantity: String(item.quantity),
    pricePerUnit: String(item.price_per_unit),
  }
}

export function createEmptySubmission(): Submission {
  return {
    PK: "",
    SK: "",
    submission_type: "saaf",
    sent_at: "",
    current_signatory: "",
    GSI2PK: "",
    GSI2SK: "",
    activity_classification: {
      activity_type: "co-curricular",
      total_org_members: 0,
    },
    proponents: [schemaProponent(createEmptyProponent("1"), "")],
    activity_details: {
      title_and_nature: "",
      description: "",
      objectives: "",
      venue: "",
      date_of_event: "",
      day_of_event: "",
      time_of_event: "",
      expected_participants: 0,
      individual_contribution: 0,
      proposed_budget: 0,
    },
    institutional_alignment: {
      mission_statements: {
        competitive: false,
        research: false,
        solutions: false,
      },
      core_values_explanation: "",
      peo_explanation: "",
      sdg_explanation: "",
    },
    detailed_budget_proposal: {
      items: UI_DEFAULT_BUDGET_ITEMS.map(schemaBudgetItem),
      grand_total: 0,
    },
    venue_reservation: {
      has_reservation: false,
      equipment_requested: {
        monoblock_chairs: DEFAULT_EQUIPMENT.monoblock,
        whiteboards: DEFAULT_EQUIPMENT.whiteboards,
        tables: DEFAULT_EQUIPMENT.tables,
        rostrum: DEFAULT_EQUIPMENT.rostrum,
        flags_with_stand: DEFAULT_EQUIPMENT.flags,
        panel_boards: DEFAULT_EQUIPMENT.panelBoards,
        others_specified: "",
      },
      general_facilities: {
        purpose: "",
        items: DEFAULT_FACILITY_ITEMS.map(
          ({ item, dateOfUse, timeOfUse, location }): GeneralFacilityItem => ({
            item,
            date_of_use: dateOfUse,
            time_of_use: timeOfUse,
            location,
          })
        ),
      },
      function_rooms: {
        purpose: "",
        items: DEFAULT_ROOM_ITEMS.map(
          ({ dateNeeded, timeNeeded, roomNeeded, remarks }): FunctionRoomItem => ({
            date_needed: dateNeeded,
            time_needed: timeNeeded,
            room_needed: roomNeeded,
            remarks,
          })
        ),
      },
      audiovisual_equipment: {
        purpose: "",
        items: DEFAULT_AV_ITEMS.map(
          ({
            dateNeeded,
            timeNeeded,
            equipmentNeeded,
            remarks,
          }): AudiovisualItem => ({
            date_needed: dateNeeded,
            time_needed: timeNeeded,
            equipment_needed: equipmentNeeded,
            remarks,
          })
        ),
      },
    },
  }
}

export function submissionToSaaf(draft: Submission): SaafDraft {
  const proponents = draft.proponents.map(uiProponent)
  return {
    activityType: draft.activity_classification.activity_type,
    totalOrgMembers: numberToInput(draft.activity_classification.total_org_members),
    expectedParticipants: numberToInput(draft.activity_details.expected_participants),
    individualContribution: numberToInput(
      draft.activity_details.individual_contribution
    ),
    proposedBudget: numberToInput(draft.activity_details.proposed_budget),
    dayOfEvent: draft.activity_details.day_of_event,
    departmentValues: Object.fromEntries(
      proponents.map((proponent) => [proponent.id, proponent.department])
    ),
    activityTitle: draft.activity_details.title_and_nature,
    activityDescription: draft.activity_details.description,
    activityObjectives: draft.activity_details.objectives,
    activityVenue: draft.activity_details.venue,
    dateOfEvent: draft.activity_details.date_of_event,
    timeOfEvent: draft.activity_details.time_of_event,
    mission1: draft.institutional_alignment.mission_statements.competitive,
    mission2: draft.institutional_alignment.mission_statements.research,
    mission3: draft.institutional_alignment.mission_statements.solutions,
    coreValuesExplanation: draft.institutional_alignment.core_values_explanation,
    peoExplanation: draft.institutional_alignment.peo_explanation,
    sdgExplanation: draft.institutional_alignment.sdg_explanation,
    proponents,
    budgetItems: draft.detailed_budget_proposal.items.map(uiBudgetItem),
  }
}

export function applySaafToSubmission(draft: Submission, saaf: SaafDraft): Submission {
  const items = saaf.budgetItems.map(schemaBudgetItem)
  return {
    ...draft,
    activity_classification: {
      activity_type: asActivityType(saaf.activityType),
      total_org_members: parseNumber(saaf.totalOrgMembers),
    },
    proponents: saaf.proponents.map((proponent) =>
      schemaProponent(proponent, saaf.departmentValues[proponent.id] || "")
    ),
    activity_details: {
      title_and_nature: saaf.activityTitle,
      description: saaf.activityDescription,
      objectives: saaf.activityObjectives,
      venue: saaf.activityVenue,
      date_of_event: saaf.dateOfEvent,
      day_of_event: saaf.dayOfEvent,
      time_of_event: saaf.timeOfEvent,
      expected_participants: parseNumber(saaf.expectedParticipants),
      individual_contribution: parseNumber(saaf.individualContribution),
      proposed_budget: parseNumber(saaf.proposedBudget),
    },
    institutional_alignment: {
      mission_statements: {
        competitive: saaf.mission1,
        research: saaf.mission2,
        solutions: saaf.mission3,
      },
      core_values_explanation: saaf.coreValuesExplanation,
      peo_explanation: saaf.peoExplanation,
      sdg_explanation: saaf.sdgExplanation,
    },
    detailed_budget_proposal: {
      items,
      grand_total: items.reduce((sum, item) => sum + item.total, 0),
    },
  }
}

export function submissionToReservation(draft: Submission): ReservationDraft {
  const venue = draft.venue_reservation
  return {
    equipment: {
      monoblock: venue.equipment_requested.monoblock_chairs,
      whiteboards: venue.equipment_requested.whiteboards,
      tables: venue.equipment_requested.tables,
      rostrum: venue.equipment_requested.rostrum,
      flags: venue.equipment_requested.flags_with_stand,
      panelBoards: venue.equipment_requested.panel_boards,
      others: Boolean(venue.equipment_requested.others_specified),
    },
    otherEquipmentText: venue.equipment_requested.others_specified,
    purpose: venue.general_facilities.purpose,
    functionRoomPurpose: venue.function_rooms.purpose,
    avPurpose: venue.audiovisual_equipment.purpose,
    facilityItems: venue.general_facilities.items.map((item, index) => ({
      id: String(index + 1),
      item: item.item,
      dateOfUse: item.date_of_use,
      timeOfUse: item.time_of_use,
      location: item.location,
    })),
    roomItems: venue.function_rooms.items.map((item, index) => ({
      id: String(index + 1),
      dateNeeded: item.date_needed,
      timeNeeded: item.time_needed,
      roomNeeded: item.room_needed,
      remarks: item.remarks,
    })),
    avItems: venue.audiovisual_equipment.items.map((item, index) => ({
      id: String(index + 1),
      dateNeeded: item.date_needed,
      timeNeeded: item.time_needed,
      equipmentNeeded: item.equipment_needed,
      remarks: item.remarks,
    })),
  }
}

export function applyReservationToSubmission(
  draft: Submission,
  reservation: ReservationDraft
): Submission {
  return {
    ...draft,
    venue_reservation: {
      ...draft.venue_reservation,
      equipment_requested: {
        monoblock_chairs: reservation.equipment.monoblock,
        whiteboards: reservation.equipment.whiteboards,
        tables: reservation.equipment.tables,
        rostrum: reservation.equipment.rostrum,
        flags_with_stand: reservation.equipment.flags,
        panel_boards: reservation.equipment.panelBoards,
        others_specified: reservation.otherEquipmentText,
      },
      general_facilities: {
        purpose: reservation.purpose,
        items: reservation.facilityItems.map((item) => ({
          item: item.item,
          date_of_use: item.dateOfUse,
          time_of_use: item.timeOfUse,
          location: item.location,
        })),
      },
      function_rooms: {
        purpose: reservation.functionRoomPurpose,
        items: reservation.roomItems.map((item) => ({
          date_needed: item.dateNeeded,
          time_needed: item.timeNeeded,
          room_needed: item.roomNeeded,
          remarks: item.remarks,
        })),
      },
      audiovisual_equipment: {
        purpose: reservation.avPurpose,
        items: reservation.avItems.map((item) => ({
          date_needed: item.dateNeeded,
          time_needed: item.timeNeeded,
          equipment_needed: item.equipmentNeeded,
          remarks: item.remarks,
        })),
      },
    },
  }
}

export function assignDraftKeys(draft: Submission): Submission {
  if (draft.PK && draft.SK) return draft
  const eventId = crypto.randomUUID()
  const submissionId = crypto.randomUUID()
  return {
    ...draft,
    PK: `EVENT#${eventId}`,
    SK: `SUBMISSION#${submissionId}`,
  }
}

export function stampSubmission(draft: Submission): Submission {
  const sentAt = new Date().toISOString()
  return {
    ...assignDraftKeys(draft),
    sent_at: sentAt,
    GSI2SK: sentAt,
  }
}
