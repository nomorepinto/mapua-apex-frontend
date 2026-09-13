import { create } from 'zustand'

export interface Appeal {
  id: string;
  title: string;
  date: string;
  department: string;
  status: string;
  statusColor: string;
}

export type SubmissionStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Returned' | 'Completed';
export type ActivityClassification = 'academic' | 'extracurricular' | 'co-curricular';

export interface SignatoryInfo {
  role: string;          // 'Adviser' | 'Dean' | 'OSAAR' | 'CDM'
  title: string;         // e.g. "Faculty Adviser", "College Dean", "OSAAR Director", "CDM Operations"
  assignee: string;      // e.g. "Dr. Santos", "Dean Alipio", "Prof. Cruz", "Engr. Mendoza"
  status: 'Approved' | 'Under Review' | 'Queued' | 'Returned';
  updatedAt?: string;
  notes?: string;
}

export interface Submission {
  id: string;
  activity_classification: ActivityClassification;
  requires_venue: boolean;
  current_signatory: string;
  target_date: string;
  submitted_date: string;
  activity_details: {
    title: string;
    description: string;
    venue: string;
    date: string;
    time?: string;
    expected_attendees?: number | string;
    budget?: string;
    proponent?: string;
    requirements?: string[];
  };
  status: SubmissionStatus;
  statusColor: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'System' | 'Policy' | 'Deadline' | 'General';
  dateRange: string;
  memoNumber?: string;
  content: string;
  author: string;
  authorRole: string;
  isImportant?: boolean;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
}

export function getSignatorySequence(submission: Submission): string[] {
  const isAcademic = submission.activity_classification === 'academic';
  const sequence: string[] = [];

  if (isAcademic) {
    sequence.push('Dean');
  } else {
    sequence.push('Adviser');
  }

  sequence.push('OSAAR');

  if (submission.requires_venue) {
    sequence.push('CDM');
  }

  return sequence;
}

export function getSignatoryDetails(submission: Submission): SignatoryInfo[] {
  const sequence = getSignatorySequence(submission);
  const currentIndex = sequence.indexOf(submission.current_signatory);

  const roleTitles: Record<string, { title: string; defaultAssignee: string }> = {
    'Adviser': { title: 'Faculty Adviser', defaultAssignee: 'Dr. Roberto Santos (Adviser)' },
    'Dean': { title: 'College Dean', defaultAssignee: 'Dean Ma. Elena Reyes (CCIS)' },
    'OSAAR': { title: 'Office of Student Affairs & Services', defaultAssignee: 'Prof. Arnold Cruz (Director)' },
    'CDM': { title: 'Campus Development & Management', defaultAssignee: 'Engr. Fernando Mendoza (Facilities)' },
  };

  return sequence.map((role, idx) => {
    const info = roleTitles[role] || { title: role, defaultAssignee: `${role} Signatory` };
    let status: SignatoryInfo['status'] = 'Queued';
    let notes: string | undefined;

    if (submission.status === 'Completed' || submission.status === 'Approved') {
      status = 'Approved';
      notes = 'Signature recorded.';
    } else if (submission.status === 'Returned' && idx === Math.max(0, currentIndex)) {
      status = 'Returned';
      notes = 'Returned for revision / additional requirements.';
    } else if (currentIndex === -1) {
      status = idx === 0 ? 'Under Review' : 'Queued';
    } else if (idx < currentIndex) {
      status = 'Approved';
      notes = 'Approved and signed.';
    } else if (idx === currentIndex) {
      status = 'Under Review';
      notes = 'Currently awaiting action.';
    } else {
      status = 'Queued';
      notes = 'Waiting for previous signatory approval.';
    }

    return {
      role,
      title: info.title,
      assignee: info.defaultAssignee,
      status,
      notes,
    };
  });
}

interface OrgState {
  // Activity Feed
  activities: ActivityLog[];
  logActivity: (title: string, description: string, type: ActivityLog['type']) => void;

  // Announcements / Bulletins
  announcements: Announcement[];

  // Appeals
  appeals: Appeal[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (dept: string) => void;

  // Submissions (SAAF)
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'status' | 'statusColor'>) => void;

  // SAAF Draft
  saafDraft: Record<string, any> | null;
  setSaafDraft: (draft: Record<string, any>) => void;
  clearSaafDraft: () => void;

  // Reservation Draft
  reservationDraft: Record<string, any> | null;
  setReservationDraft: (draft: Record<string, any>) => void;
  clearReservationDraft: () => void;
}

export const useOrgStore = create<OrgState>((set, get) => ({
  // Activity Feed
  activities: [],
  logActivity: (title, description, type) => set((state) => ({
    activities: [{ id: `act-${Date.now()}`, title, description, type, timestamp: new Date() }, ...state.activities]
  })),

  // Institutional Bulletins & Announcements
  announcements: [],

  // Appeals
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  statusFilter: 'All',
  setStatusFilter: (status) => set({ statusFilter: status }),
  departmentFilter: 'All',
  setDepartmentFilter: (dept: string) => set({ departmentFilter: dept }),
  appeals: [],

  // Submissions (SAAF)
  submissions: [],
  addSubmission: (submission) => {
    set((state) => {
      const newSubmission: Submission = {
        ...submission,
        id: `SAAF-${Date.now()}`,
        submitted_date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        statusColor: 'text-[#64748B]'
      };
      get().logActivity('New Submission', `${submission.activity_details.title} was submitted.`, 'info');
      return { submissions: [newSubmission, ...state.submissions] };
    });
  },

  // SAAF Draft
  saafDraft: null,
  setSaafDraft: (draft) => set({ saafDraft: draft }),
  clearSaafDraft: () => set({ saafDraft: null }),

  // Reservation Draft
  reservationDraft: null,
  setReservationDraft: (draft) => set({ reservationDraft: draft }),
  clearReservationDraft: () => set({ reservationDraft: null }),
}));
