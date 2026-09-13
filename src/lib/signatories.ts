//import { getIdToken } from "@/lib/auth"
export interface DynamoDBMetadata {
  PK?: string
  SK?: string
  GSI1PK?: string
  GSI1SK?: string
  createdAt?: string
  updatedAt?: string
  version?: number
}

export type SignatoryActivityClassification =
  | "Co-curricular"
  | "Extra-curricular"
  | "Institutional"

export type ActivityStatus =
  | "Approved"
  | "Under Review"
  | "Pending Dean Approval"
  | "Needs Revision"
  | "Rejected"

export interface ActivityProposal extends DynamoDBMetadata {
  id: string
  title: string
  org: string
  date: string
  type: SignatoryActivityClassification | string
  status: ActivityStatus
  statusColor: string
  venue?: string
  description?: string
  targetParticipants?: number | string
  budget?: number | string
  submittedBy?: string
  proponentEmail?: string
  contactNumber?: string
  deanRemarks?: string
  reviewedAt?: string
  reviewedBy?: string
}

const BASE_URL = ""
async function getIdToken(): Promise<string> {
    return ""
}

async function authedFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await getIdToken()
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    })

    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message ?? `Request failed: ${res.status}`)
    }

    return res.json()
}

/** GET /signatories/submissions — "my queue" for the signed-in signatory */
export function fetchMyQueue(): Promise<ActivityProposal[]> {
    return authedFetch<ActivityProposal[]>("/signatories/submissions")
}

/** GET /signatories/submissions/:submissionId */
export function fetchActivityDetail(id: string): Promise<ActivityProposal> {
    return authedFetch<ActivityProposal>(`/signatories/submissions/${id}`)
}

/** POST /signatories/submissions/:submissionId/approve */
export function approveActivity(id: string): Promise<ActivityProposal> {
    return authedFetch<ActivityProposal>(`/signatories/submissions/${id}/approve`, {
        method: "POST",
    })
}

/** POST /signatories/submissions/:submissionId/deny */
export function denyActivity(id: string): Promise<ActivityProposal> {
    return authedFetch<ActivityProposal>(`/signatories/submissions/${id}/deny`, {
        method: "POST",
    })
}