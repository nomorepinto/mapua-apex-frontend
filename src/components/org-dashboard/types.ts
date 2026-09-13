export type TaskStatus = "Pending" | "In Progress" | "Completed"

export interface ChecklistItem {
  text: string
  done: boolean
  ownerName: string
  ownerInitials: string
  ownerColor: string
  ownerBgColor: string
}

export interface Task {
  id: string
  title: string
  status: TaskStatus
  responsible: string
  dueDate: string
  checklist: ChecklistItem[]
}

export interface Appeal {
  id: string
  title: string
  date: string
  department: string
  status: string
  statusColor: string
}

export type SubmissionStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Returned"
  | "Completed"

export interface TrackedSubmission {
  id: string
  activity_classification: string
  current_signatory: string
  target_date: string
  activity_details: {
    title: string
    description: string
    venue: string
    date: string
  }
  status: SubmissionStatus
  statusColor: string
}

export interface ActivityLog {
  id: string
  title: string
  description: string
  type: "success" | "warning" | "error" | "info"
  timestamp: Date
}
