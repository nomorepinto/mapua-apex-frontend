import { create } from "zustand"
import type {
  Organization,
  Signatory,
  Submission,
  OrgAccountView,
  OrgStatus,
  Announcement,
  InstitutionMetrics,
} from "@/lib/types"

// ─── Audit Log Entry ─────────────────────────────────────────────────────────

export type AuditAction =
  | "submission_created"
  | "submission_approved"
  | "submission_denied"
  | "account_updated"
  | "announcement_created"
  | "status_changed"

export interface AuditLogEntry {
  id: string
  timestamp: string
  action: AuditAction
  actor: string
  description: string
  orgId?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractUuid(compositeKey: string): string {
  return compositeKey.split("#").slice(1).join("#")
}

function resolveAdviser(orgUuid: string, signatories: Signatory[]): string {
  const roleKey = `ROLE#ADVISER#ORG#${orgUuid}`
  const match = signatories.find((s) => s.GSI4PK === roleKey)
  return match?.name ?? "—"
}

function buildOrgViews(
  orgs: Organization[],
  signatories: Signatory[],
  reps: Record<string, string>,
  statuses: Record<string, OrgStatus>,
): OrgAccountView[] {
  return orgs.map((org) => {
    const uuid = extractUuid(org.PK)
    return {
      id: uuid,
      name: org.name,
      adviser: resolveAdviser(uuid, signatories),
      representative: reps[uuid] ?? "—",
      status: statuses[uuid] ?? "Inactive",
    }
  })
}

function computeMetrics(
  orgStatuses: Record<string, OrgStatus>,
  orgCount: number,
  submissionCount: number,
): InstitutionMetrics {
  const activeCount = Object.values(orgStatuses).filter((s) => s === "Active").length
  const newRegs = Object.values(orgStatuses).filter((s) => s === "Pending Registration").length

  return {
    activeOrganizations: orgCount > 0 ? activeCount + newRegs + (orgCount - activeCount - newRegs) : 0,
    activeOrganizationsChange: `+${newRegs} registrations this term`,
    totalActiveSubmissions: submissionCount > 0 ? 1420 : 0,
    totalActiveSubmissionsNote: "Currently queued across all stages",
    approvalSlaRate: 98.4,
    approvalSlaTurnaround: "Average decision turnaround inside 4.2 days",
  }
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_ORGANIZATIONS: Organization[] = [
  { PK: "ORGANIZATION#org-001", SK: "ORGANIZATION#org-001", name: "Alpha Student Org" },
  { PK: "ORGANIZATION#org-002", SK: "ORGANIZATION#org-002", name: "Beta Tech Guild" },
  { PK: "ORGANIZATION#org-003", SK: "ORGANIZATION#org-003", name: "Gamma Drama Club" },
  { PK: "ORGANIZATION#org-004", SK: "ORGANIZATION#org-004", name: "Delta Athletic Club" },
]

const MOCK_SIGNATORIES: Signatory[] = [
  { PK: "SIGNATORY#sig-010", SK: "SIGNATORY#sig-010", name: "Prof. Alan Vance", GSI4PK: "ROLE#ADVISER#ORG#org-001", GSI4SK: "sig-010" },
  { PK: "SIGNATORY#sig-011", SK: "SIGNATORY#sig-011", name: "Dr. Clara Miles", GSI4PK: "ROLE#ADVISER#ORG#org-002", GSI4SK: "sig-011" },
  { PK: "SIGNATORY#sig-012", SK: "SIGNATORY#sig-012", name: "Prof. Jack Geller", GSI4PK: "ROLE#ADVISER#ORG#org-003", GSI4SK: "sig-012" },
  { PK: "SIGNATORY#sig-013", SK: "SIGNATORY#sig-013", name: "Coach Mike Tyson", GSI4PK: "ROLE#ADVISER#ORG#org-004", GSI4SK: "sig-013" },
]

const MOCK_REPRESENTATIVES: Record<string, string> = {
  "org-001": "Kyle Rogers",
  "org-002": "Julia Seng",
  "org-003": "Marcus Aurelius",
  "org-004": "Sarah Jenkins",
}

const MOCK_ORG_STATUSES: Record<string, OrgStatus> = {
  "org-001": "Active",
  "org-002": "Active",
  "org-003": "Pending Registration",
  "org-004": "Inactive",
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    PK: "EVENT#evt-100",
    SK: "SUBMISSION#sub-200",
    submission_type: "saaf",
    sent_at: "2026-09-10T08:00:00Z",
    activity_classification: { activity_type: "co-curricular", total_org_members: 45 },
    proponents: [
      {
        id: "p-1", position_title: "President", first_name: "Kyle", middle_name: "", last_name: "Rogers", suffix: "",
        student_number: "2023-10001", program_and_year: "BSIT-4", date_of_submission: "2026-09-10",
        department: "CCIS", position_of_applicant: "President", org_or_course_section: "Alpha Student Org",
        contact_number: "09171234567", email_address: "kyle.rogers@mapua.edu.ph", facebook_link: "",
      },
    ],
    activity_details: {
      title_and_nature: "Annual Hackathon & Innovation Expo", description: "University-wide hackathon",
      objectives: "Foster innovation among students", venue: "Main Auditorium",
      date_of_event: "2026-10-15", day_of_event: "Thursday", time_of_event: "08:00",
      expected_participants: 200, individual_contribution: 150, proposed_budget: 50000,
    },
    institutional_alignment: {
      mission_statements: { competitive: true, research: true, solutions: true },
      core_values_explanation: "Promotes excellence and innovation",
      peo_explanation: "Aligns with PEO 1 and PEO 3",
      sdg_explanation: "Supports SDG 4 and SDG 9",
    },
    detailed_budget_proposal: {
      items: [
        { item_no: "1", unit: 1, quantity: 200, price_per_unit: 50, total: 10000 },
        { item_no: "2", unit: 1, quantity: 10, price_per_unit: 3000, total: 30000 },
      ],
      grand_total: 40000,
    },
    venue_reservation: {
      has_reservation: true,
      equipment_requested: {
        monoblock_chairs: true, whiteboards: false, tables: true, rostrum: true,
        flags_with_stand: false, panel_boards: false, others_specified: "",
      },
      general_facilities: { purpose: "Hackathon event", items: [] },
      function_rooms: { purpose: "", items: [] },
      audiovisual_equipment: { purpose: "", items: [] },
    },
    current_signatory: "sig-010",
    GSI2PK: "SIGNATORY#sig-010",
    GSI2SK: "2026-09-10T08:00:00Z",
  },
]

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", title: "AY 2026-2027 Registration Open", date: "Sep 01, 2026", time: "8:00 AM" },
  { id: "ann-2", title: "SAAF Submission Deadline Extended", date: "Sep 05, 2026", time: "12:00 PM" },
  { id: "ann-3", title: "New Venue Reservation Policy", date: "Sep 08, 2026", time: "3:30 PM" },
  { id: "ann-4", title: "Mid-term Activity Freeze Period", date: "Sep 12, 2026", time: "9:00 AM" },
]

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "log-001", timestamp: "2026-09-12T09:15:00Z", action: "submission_created", actor: "Kyle Rogers", description: "Submitted SAAF for 'Annual Hackathon & Innovation Expo'", orgId: "org-001" },
  { id: "log-002", timestamp: "2026-09-11T14:30:00Z", action: "submission_approved", actor: "Prof. Alan Vance", description: "Approved submission SUB-200 (Adviser sign-off)", orgId: "org-001" },
  { id: "log-003", timestamp: "2026-09-11T10:00:00Z", action: "status_changed", actor: "System Admin", description: "Organization status changed from 'Pending Registration' to 'Active'", orgId: "org-002" },
  { id: "log-004", timestamp: "2026-09-10T16:45:00Z", action: "submission_denied", actor: "Dr. Clara Miles", description: "Returned submission SUB-198 — missing budget breakdown", orgId: "org-002" },
  { id: "log-005", timestamp: "2026-09-10T11:20:00Z", action: "account_updated", actor: "System Admin", description: "Updated adviser assignment to Prof. Jack Geller", orgId: "org-003" },
  { id: "log-006", timestamp: "2026-09-09T08:00:00Z", action: "announcement_created", actor: "OSA Admin", description: "Created announcement: 'AY 2026-2027 Registration Open'" },
  { id: "log-007", timestamp: "2026-09-08T15:30:00Z", action: "submission_created", actor: "Marcus Aurelius", description: "Submitted SAAF for 'Drama Festival & Workshop Series'", orgId: "org-003" },
  { id: "log-008", timestamp: "2026-09-08T09:00:00Z", action: "status_changed", actor: "System Admin", description: "Organization status changed to 'Inactive' — no active officers", orgId: "org-004" },
  { id: "log-009", timestamp: "2026-09-07T13:00:00Z", action: "submission_approved", actor: "Dean Martinez", description: "Final approval for submission SUB-195 (Dean sign-off)", orgId: "org-001" },
  { id: "log-010", timestamp: "2026-09-06T10:15:00Z", action: "account_updated", actor: "Sarah Jenkins", description: "Updated organization profile and contact information", orgId: "org-004" },
]

// ─── Store Shape ─────────────────────────────────────────────────────────────

type AdminOsaState = {
  // Raw entities (would come from API in production)
  organizations: Organization[]
  signatories: Signatory[]
  submissions: Submission[]
  representatives: Record<string, string>
  orgStatuses: Record<string, OrgStatus>

  // Derived view-models (computed from raw entities)
  orgViews: OrgAccountView[]
  metrics: InstitutionMetrics

  // Announcements
  announcements: Announcement[]
  createAnnouncement: (title: string) => void
  updateAnnouncement: (id: string, title: string) => void
  deleteAnnouncement: (id: string) => void

  // Audit logs
  auditLogs: AuditLogEntry[]
  getAuditLogsForOrg: (orgId: string) => AuditLogEntry[]
  getAllAuditLogs: () => AuditLogEntry[]
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAdminOsaStore = create<AdminOsaState>((set, get) => {
  // Compute initial derived data
  const initialOrgViews = buildOrgViews(
    MOCK_ORGANIZATIONS,
    MOCK_SIGNATORIES,
    MOCK_REPRESENTATIVES,
    MOCK_ORG_STATUSES,
  )
  const initialMetrics = computeMetrics(
    MOCK_ORG_STATUSES,
    MOCK_ORGANIZATIONS.length,
    MOCK_SUBMISSIONS.length,
  )

  return {
    // Raw entities
    organizations: MOCK_ORGANIZATIONS,
    signatories: MOCK_SIGNATORIES,
    submissions: MOCK_SUBMISSIONS,
    representatives: MOCK_REPRESENTATIVES,
    orgStatuses: MOCK_ORG_STATUSES,

    // Derived
    orgViews: initialOrgViews,
    metrics: initialMetrics,

    // Announcements
    announcements: MOCK_ANNOUNCEMENTS,

    createAnnouncement: (title) => {
      const now = new Date()
      const newAnnouncement: Announcement = {
        id: `ann-${Date.now()}`,
        title,
        date: now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      }
      set((state) => ({
        announcements: [...state.announcements, newAnnouncement],
      }))
    },

    updateAnnouncement: (id, title) => {
      set((state) => ({
        announcements: state.announcements.map((a) =>
          a.id === id ? { ...a, title } : a,
        ),
      }))
    },

    deleteAnnouncement: (id) => {
      set((state) => ({
        announcements: state.announcements.filter((a) => a.id !== id),
      }))
    },

    // Audit logs
    auditLogs: MOCK_AUDIT_LOGS,

    getAuditLogsForOrg: (orgId) => {
      return get()
        .auditLogs.filter((log) => log.orgId === orgId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    },

    getAllAuditLogs: () => {
      return get()
        .auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    },
  }
})
