import type { ReservationDraft } from "@/components/reservation/types"
import { useOrgStore } from "@/stores/org-store"

export function buildCombinedProposalPayload(draft: ReservationDraft) {
  const saafDraft = useOrgStore.getState().saafDraft

  return {
    PK: "EVENTuuid",
    SK: "SUBMISSIONuuid",
    submission_type: "saaf",
    sent_at: "timestamp",
    activity_classification: {
      activity_type: saafDraft?.activityType || "co-curricular",
      total_org_members: Number(saafDraft?.totalOrgMembers) || 0,
    },
    proponents: (saafDraft?.proponents || []).map((p: Record<string, string>) => ({
      id: p.id,
      position_title: p.position || "",
      first_name: p.firstName || "",
      middle_name: p.middleName || "",
      last_name: p.lastName || "",
      suffix: p.suffix || "",
      student_number: p.studentNumber || "",
      program_and_year: p.programAndYear || "",
      date_of_submission: p.dateOfSubmission || "",
      department: saafDraft?.departmentValues?.[p.id] || p.department || "",
      position_of_applicant: p.positionOfApplicant || "",
      org_or_course_section: p.orgOrCourseSection || "",
      contact_number: p.contactNumber || "",
      email_address: p.emailAddress || "",
      facebook_link: p.facebookLink || "",
    })),
    activity_details: {
      title_and_nature: saafDraft?.activityTitle || "",
      description: saafDraft?.activityDescription || "",
      objectives: saafDraft?.activityObjectives || "",
      venue: saafDraft?.activityVenue || "",
      date_of_event: saafDraft?.dateOfEvent || "",
      day_of_event: saafDraft?.dayOfEvent || "",
      time_of_event: saafDraft?.timeOfEvent || "",
      expected_participants: Number(saafDraft?.expectedParticipants) || 0,
      individual_contribution: Number(saafDraft?.individualContribution) || 0,
      proposed_budget: Number(saafDraft?.proposedBudget) || 0,
    },
    institutional_alignment: {
      mission_statements: {
        competitive: Boolean(saafDraft?.mission1),
        research: Boolean(saafDraft?.mission2),
        solutions: Boolean(saafDraft?.mission3),
      },
      core_values_explanation: saafDraft?.coreValuesExplanation || "",
      peo_explanation: saafDraft?.peoExplanation || "",
      sdg_explanation: saafDraft?.sdgExplanation || "",
    },
    detailed_budget_proposal: {
      items: (saafDraft?.budgetItems || []).map((b: Record<string, string>) => ({
        item_no: b.item,
        unit: Number(b.unit) || 0,
        quantity: Number(b.quantity) || 0,
        price_per_unit: Number(b.pricePerUnit) || 0,
        total: (Number(b.quantity) || 0) * (Number(b.pricePerUnit) || 0),
      })),
      grand_total: (saafDraft?.budgetItems || []).reduce(
        (sum: number, b: Record<string, string>) =>
          sum + (Number(b.quantity) || 0) * (Number(b.pricePerUnit) || 0),
        0
      ),
    },
    venue_reservation: {
      has_reservation: true,
      equipment_requested: {
        monoblock_chairs: draft.equipment.monoblock,
        whiteboards: draft.equipment.whiteboards,
        tables: draft.equipment.tables,
        rostrum: draft.equipment.rostrum,
        flags_with_stand: draft.equipment.flags,
        panel_boards: draft.equipment.panelBoards,
        others_specified: draft.otherEquipmentText,
      },
      general_facilities: {
        purpose: draft.purpose,
        items: draft.facilityItems.map((f) => ({
          item: f.item,
          date_of_use: f.dateOfUse,
          time_of_use: f.timeOfUse,
          location: f.location,
        })),
      },
      function_rooms: {
        purpose: draft.functionRoomPurpose,
        items: draft.roomItems.map((r) => ({
          date_needed: r.dateNeeded,
          time_needed: r.timeNeeded,
          room_needed: r.roomNeeded,
          remarks: r.remarks,
        })),
      },
      audiovisual_equipment: {
        purpose: draft.avPurpose,
        items: draft.avItems.map((a) => ({
          date_needed: a.dateNeeded,
          time_needed: a.timeNeeded,
          equipment_needed: a.equipmentNeeded,
          remarks: a.remarks,
        })),
      },
    },
    current_signatory: "SIGNATORYuuid",
    GSI2PK: "SIGNATORYuuid",
    GSI2SK: "timestamp",
    past_signatories: [],
  }
}
