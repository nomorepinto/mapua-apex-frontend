import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SaafDraft } from '@/components/submission/types'
import type { ReservationDraft } from '@/components/reservation/types'

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'

export interface ChecklistItem {
  text: string;
  done: boolean;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
  ownerBgColor: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  responsible: string;
  dueDate: string;
  checklist: ChecklistItem[];
}

export interface Appeal {
  id: string;
  title: string;
  date: string;
  department: string;
  status: string;
  statusColor: string;
}

export type SubmissionStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Returned' | 'Completed';

// NOTE: This model is for the frontend prototype stage, acting as in-memory state until a real backend/API is implemented.
export interface Submission {
  id: string;
  activity_classification: string;
  current_signatory: string;
  target_date: string;
  activity_details: {
    title: string;
    description: string;
    venue: string;
    date: string;
  };
  status: SubmissionStatus;
  statusColor: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
}

interface OrgState {
  // Activity Feed
  activities: ActivityLog[];
  logActivity: (title: string, description: string, type: ActivityLog['type']) => void;

  // Calendar
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  calendarEvents: Record<string, { title: string; time?: string }[]>; // "YYYY-MM-DD" mapping
  addCalendarEvent: (date: Date, title: string, time?: string) => void;

  // Milestone Tasks
  milestoneTasks: Task[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  toggleTaskStatus: (id: string) => void;
  toggleChecklistItem: (taskId: string, index: number) => void;
  addMilestoneTask: (title: string, responsible: string, dueDate: string) => void;
  deleteMilestoneTask: (id: string) => void;
  addChecklistItem: (taskId: string) => void;
  updateChecklistItem: (taskId: string, index: number, field: keyof ChecklistItem, value: string | boolean) => void;
  removeChecklistItem: (taskId: string, index: number) => void;

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

  // Submissions wizard start
  eventName: string
  reserveFacilities: "yes" | "no" | null
  setSubmissionStart: (eventName: string, reserveFacilities: "yes" | "no") => void
  clearSubmissionStart: () => void

  // SAAF Draft
  saafDraft: SaafDraft | null;
  setSaafDraft: (draft: SaafDraft) => void;
  patchSaafDraft: (patch: Partial<SaafDraft>) => void;
  clearSaafDraft: () => void;

  // Reservation Draft
  reservationDraft: ReservationDraft | null;
  setReservationDraft: (draft: ReservationDraft) => void;
  patchReservationDraft: (patch: Partial<ReservationDraft>) => void;
  clearReservationDraft: () => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set, get) => ({
  // Activity Feed
  activities: [
    { id: "act-1", title: "Proposal APEX-0982 Approved", description: "Your honorarium appeal for the Tech Week Guest Speaker has been approved by the Commissioner.", type: "success", timestamp: new Date(Date.now() - 2 * 60000) },
    { id: "act-2", title: "Security Clearance Appeal Due", description: "Reminder: Submit additional fire & crowd safety documentation for Step 3 clearance.", type: "warning", timestamp: new Date(Date.now() - 24 * 3600000) },
    { id: "act-3", title: "AY 2026 Budget Guidelines", description: "The Commission on Student Services uploaded the updated budgetary guidelines for Fall 2026.", type: "error", timestamp: new Date(Date.now() - 48 * 3600000) },
  ],
  logActivity: (title, description, type) => set((state) => ({
    activities: [{ id: `act-${Date.now()}`, title, description, type, timestamp: new Date() }, ...state.activities]
  })),

  // Calendar
  selectedDate: undefined,
  setSelectedDate: (date) => set({ selectedDate: date }),
  calendarEvents: {
    "2026-08-14": [{ title: "Tech Week Presentation", time: "14:00" }],
    "2026-08-20": [{ title: "CSS Audit Submission", time: "09:00" }],
  },
  addCalendarEvent: (date, title, time) => {
    set((state) => {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const existing = state.calendarEvents[key] || [];
      return {
        calendarEvents: {
          ...state.calendarEvents,
          [key]: [...existing, { title, time }]
        }
      };
    });
    get().logActivity('Event added', `Added ${title} on ${date.toLocaleDateString()}`, 'info');
  },

  // Milestone Tasks
  activeTaskId: 'task-3',
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  milestoneTasks: [
    {
      id: 'task-1',
      title: 'Event proposal & venue booking',
      status: 'Completed',
      responsible: 'Benedict V. (Events Head)',
      dueDate: 'Jul 12',
      checklist: [
        { text: 'Draft event proposal', done: true, ownerName: 'Benedict V.', ownerInitials: 'B', ownerColor: 'text-[#047857]', ownerBgColor: 'bg-[#D1FAE5]' },
        { text: 'Secure venue permit', done: true, ownerName: 'Benedict V.', ownerInitials: 'B', ownerColor: 'text-[#047857]', ownerBgColor: 'bg-[#D1FAE5]' }
      ]
    },
    {
      id: 'task-2',
      title: 'Budget approval plan',
      status: 'Completed',
      responsible: 'Finance Committee',
      dueDate: 'Jul 21',
      checklist: [
        { text: 'Finalize cost estimates', done: true, ownerName: 'Finance team', ownerInitials: 'F', ownerColor: 'text-[#047857]', ownerBgColor: 'bg-[#D1FAE5]' },
        { text: 'Treasurer sign-off', done: true, ownerName: 'Finance team', ownerInitials: 'F', ownerColor: 'text-[#047857]', ownerBgColor: 'bg-[#D1FAE5]' }
      ]
    },
    {
      id: 'task-3',
      title: 'Security & CSS clearance',
      status: 'In Progress',
      responsible: 'Ryan L. (AVP Security)',
      dueDate: 'Aug 21',
      checklist: [
        { text: 'Complete security audit', done: true, ownerName: 'Ryan L.', ownerInitials: 'R', ownerColor: 'text-[#B45309]', ownerBgColor: 'bg-[#FEF3C7]' },
        { text: 'Get CIO sign-off', done: false, ownerName: 'Ryan L.', ownerInitials: 'R', ownerColor: 'text-[#B45309]', ownerBgColor: 'bg-[#FEF3C7]' },
        { text: 'Final walkthrough', done: false, ownerName: 'Benedict V.', ownerInitials: 'B', ownerColor: 'text-[#047857]', ownerBgColor: 'bg-[#D1FAE5]' }
      ]
    },
    {
      id: 'task-4',
      title: 'Marketing & promotion strategy',
      status: 'Pending',
      responsible: 'Marketing Dept.',
      dueDate: 'Sep 7',
      checklist: [
        { text: 'Draft social media plan', done: false, ownerName: 'Social team', ownerInitials: 'S', ownerColor: 'text-[#475569]', ownerBgColor: 'bg-neutral-100' },
        { text: 'Create poster assets', done: false, ownerName: 'Social team', ownerInitials: 'S', ownerColor: 'text-[#475569]', ownerBgColor: 'bg-neutral-100' }
      ]
    },
    {
      id: 'task-5',
      title: 'Guest speaker confirmation',
      status: 'Pending',
      responsible: 'Benedict V. (Events Head)',
      dueDate: 'Sep 17',
      checklist: [
        { text: 'Send invitations', done: false, ownerName: 'Benedict V.', ownerInitials: 'B', ownerColor: 'text-[#475569]', ownerBgColor: 'bg-neutral-100' },
        { text: 'Confirm travel arrangements', done: false, ownerName: 'Benedict V.', ownerInitials: 'B', ownerColor: 'text-[#475569]', ownerBgColor: 'bg-neutral-100' }
      ]
    },
  ],
  toggleTaskStatus: (id) => {
    set((state) => {
      let taskTitle = "";
      let statusResult = "";
      const newState = {
        milestoneTasks: state.milestoneTasks.map(task => {
          if (task.id === id) {
            taskTitle = task.title;
            const nextStatus: Record<TaskStatus, TaskStatus> = {
              'Pending': 'In Progress',
              'In Progress': 'Completed',
              'Completed': 'Pending'
            };
            statusResult = nextStatus[task.status];
            return { ...task, status: nextStatus[task.status] };
          }
          return task;
        })
      };
      if (taskTitle) {
        get().logActivity('Task status updated', `${taskTitle} marked as ${statusResult}`, statusResult === 'Completed' ? 'success' : 'info');
      }
      return newState;
    });
  },
  toggleChecklistItem: (taskId, index) => {
    set((state) => {
      let taskTitle = "";
      let itemName = "";
      let itemDone = false;
      let newStatus = "";
      let oldStatus = "";

      const newState = {
        milestoneTasks: state.milestoneTasks.map(task => {
          if (task.id === taskId) {
            taskTitle = task.title;
            oldStatus = task.status;
            const newChecklist = [...task.checklist];
            newChecklist[index].done = !newChecklist[index].done;
            itemName = newChecklist[index].text;
            itemDone = newChecklist[index].done;

            // Auto-complete task logic
            const allDone = newChecklist.length > 0 && newChecklist.every(item => item.done);
            newStatus = task.status;
            if (allDone) {
              newStatus = 'Completed';
            } else if (newChecklist.some(item => item.done) && task.status === 'Pending') {
              newStatus = 'In Progress';
            } else if (!allDone && task.status === 'Completed') {
              newStatus = 'In Progress';
            }

            return { ...task, checklist: newChecklist, status: newStatus as TaskStatus };
          }
          return task;
        })
      };

      if (taskTitle) {
        if (newStatus !== oldStatus) {
          get().logActivity(`Task ${newStatus.toLowerCase()}`, `${taskTitle} is now ${newStatus}`, newStatus === 'Completed' ? 'success' : 'info');
        } else {
          get().logActivity('Checklist updated', `${itemName} marked as ${itemDone ? 'done' : 'undone'} in ${taskTitle}`, 'info');
        }
      }

      return newState;
    });
  },
  addMilestoneTask: (title, responsible, dueDate) => {
    set((state) => {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        status: 'Pending',
        responsible: responsible || 'Unassigned',
        dueDate: dueDate || 'TBD',
        checklist: []
      };
      return { milestoneTasks: [...state.milestoneTasks, newTask] };
    });
    get().logActivity('New task added', title, 'info');
  },
  deleteMilestoneTask: (id) => set((state) => {
    const taskToDelete = state.milestoneTasks.find(t => t.id === id);
    if (taskToDelete) {
      get().logActivity('Task deleted', `Deleted task "${taskToDelete.title}"`, 'warning');
    }
    return {
      milestoneTasks: state.milestoneTasks.filter(t => t.id !== id),
      activeTaskId: state.activeTaskId === id ? (state.milestoneTasks.find(t => t.id !== id)?.id || null) : state.activeTaskId
    };
  }),
  addChecklistItem: (taskId) => set((state) => {
    let taskTitle = "";
    const newState = {
      milestoneTasks: state.milestoneTasks.map(task => {
        if (task.id === taskId) {
          taskTitle = task.title;
          const newItem: ChecklistItem = {
            text: '',
            done: false,
            ownerName: '',
            ownerInitials: '?',
            ownerColor: 'text-[#475569]',
            ownerBgColor: 'bg-neutral-100',
          };
          return { ...task, checklist: [...task.checklist, newItem] };
        }
        return task;
      })
    };
    if (taskTitle) {
      get().logActivity('Checklist item added', `Added new checklist item to "${taskTitle}"`, 'info');
    }
    return newState;
  }),
  updateChecklistItem: (taskId, index, field, value) => {
    set((state) => {
      let logged = false;
      let proponentName = "";
      let taskTitle = "";

      const newState = {
        milestoneTasks: state.milestoneTasks.map(task => {
          if (task.id === taskId) {
            taskTitle = task.title;
            const newChecklist = [...task.checklist];
            const oldName = newChecklist[index].ownerName;
            const updatedItem = { ...newChecklist[index], [field]: value };

            // Auto-update initials if name changes
            if (field === 'ownerName' && typeof value === 'string') {
              updatedItem.ownerInitials = value.trim() ? value.trim().charAt(0).toUpperCase() : '?';
              if (value.trim() && value !== oldName) {
                logged = true;
                proponentName = value.trim();
              }
            }

            newChecklist[index] = updatedItem;
            return { ...task, checklist: newChecklist };
          }
          return task;
        })
      };

      if (logged) {
        get().logActivity('Proponent assigned', `${proponentName} was assigned to a task in "${taskTitle}"`, 'info');
      }

      return newState;
    });
  },
  removeChecklistItem: (taskId, index) => set((state) => {
    let taskTitle = "";
    let itemText = "";
    const newState = {
      milestoneTasks: state.milestoneTasks.map(task => {
        if (task.id === taskId) {
          taskTitle = task.title;
          const newChecklist = [...task.checklist];
          itemText = newChecklist[index]?.text || 'item';
          newChecklist.splice(index, 1);

          // Re-evaluate task status if checklist changed
          const allDone = newChecklist.length > 0 && newChecklist.every(item => item.done);
          let newStatus = task.status;
          if (allDone) {
            newStatus = 'Completed';
          } else if (!allDone && task.status === 'Completed') {
            newStatus = newChecklist.some(item => item.done) ? 'In Progress' : 'Pending';
          }

          return { ...task, checklist: newChecklist, status: newStatus };
        }
        return task;
      })
    };
    if (taskTitle) {
      get().logActivity('Checklist item removed', `Removed "${itemText}" from "${taskTitle}"`, 'info');
    }
    return newState;
  }),

  // Appeals
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  statusFilter: 'All',
  setStatusFilter: (status) => set({ statusFilter: status }),
  departmentFilter: 'All',
  setDepartmentFilter: (dept) => set({ departmentFilter: dept }),
  appeals: [
    { id: "APE-0982", title: "Tech Week Guest Speaker Honorarium Appeal", date: "Aug 14, 2026", department: "Dean", status: "Approved", statusColor: "text-[#007A55]" },
    { id: "APE-0951", title: "Seminar Room Alternate Booking Appeal", date: "Aug 14, 2026", department: "OSAAR", status: "Under Review", statusColor: "text-[#1447E6]" },
    { id: "APE-0843", title: "Sponsorship Poster Guidelines Exemption", date: "Aug 14, 2026", department: "Adviser", status: "Pending", statusColor: "text-[#BB4D00]" },
    { id: "APE-0877", title: "Faculty Grant Application Review Appeal", date: "Aug 14, 2026", department: "Dean", status: "Approved", statusColor: "text-[#007A55]" },
    { id: "APE-0930", title: "Student Activity Fund Exemption", date: "Aug 14, 2026", department: "OSAAR", status: "Under Review", statusColor: "text-[#1447E6]" },
    { id: "APE-0918", title: "Student Activity Fund Exemption", date: "Aug 14, 2026", department: "Adviser", status: "Pending", statusColor: "text-[#BB4D00]" },
    { id: "APE-0895", title: "IT Hardware Procurement Request Appeal", date: "Aug 14, 2026", department: "Adviser", status: "Rejected", statusColor: "text-[#D9291C]" },
    { id: "APE-0899", title: "IT Hardware Procurement Request Appeal", date: "Aug 14, 2026", department: "HR", status: "Rejected", statusColor: "text-[#D9291C]" },
    { id: "APE-1001", title: "Late Submission Exemption for Final Project", date: "Aug 15, 2026", department: "Dean", status: "Pending", statusColor: "text-[#BB4D00]" },
    { id: "APE-1005", title: "Server Access Extension Request", date: "Aug 16, 2026", department: "IT", status: "Under Review", statusColor: "text-[#1447E6]" },
    { id: "APE-1012", title: "Staff Leave Adjustment Request", date: "Aug 17, 2026", department: "HR", status: "Approved", statusColor: "text-[#007A55]" },
  ],

  // Submissions (SAAF)
  submissions: [
    {
      id: "SAAF-2026-001",
      activity_classification: "co-curricular",
      current_signatory: "Dean",
      target_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 2 days
      activity_details: {
        title: "Tech Week Seminar",
        description: "Annual technology seminar for CCIS students.",
        venue: "Gymnasium",
        date: "2026-09-15",
      },
      status: "Under Review",
      statusColor: "text-[#1447E6]"
    },
    {
      id: "SAAF-2026-002",
      activity_classification: "extra-curricular",
      current_signatory: "Adviser",
      target_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 8 days
      activity_details: {
        title: "General Assembly",
        description: "Semester opening assembly for members.",
        venue: "Seminar Room 1",
        date: "2026-09-20",
      },
      status: "Submitted",
      statusColor: "text-[#475569]"
    },
    {
      id: "SAAF-2026-003",
      activity_classification: "co-curricular",
      current_signatory: "CSS",
      target_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
      activity_details: {
        title: "Programming Workshop",
        description: "Hands-on coding workshop.",
        venue: "Computer Lab 4",
        date: "2026-08-30",
      },
      status: "Completed",
      statusColor: "text-[#007A55]"
    }
  ],
  addSubmission: (submission) => {
    set((state) => {
      const newSubmission: Submission = {
        ...submission,
        id: `SAAF-${Date.now()}`,
        status: 'Submitted',
        statusColor: 'text-[#475569]'
      };
      get().logActivity('New Submission', `${submission.activity_details.title} was submitted.`, 'info');
      return { submissions: [newSubmission, ...state.submissions] };
    });
  },

  eventName: "",
  reserveFacilities: null,
  setSubmissionStart: (eventName, reserveFacilities) =>
    set({ eventName, reserveFacilities }),
  clearSubmissionStart: () => set({ eventName: "", reserveFacilities: null }),

  // SAAF Draft
  saafDraft: null,
  setSaafDraft: (draft) => set({ saafDraft: draft }),
  patchSaafDraft: (patch) =>
    set((state) => ({
      saafDraft: { ...(state.saafDraft ?? {}), ...patch } as SaafDraft,
    })),
  clearSaafDraft: () => set({ saafDraft: null }),

  // Reservation Draft
  reservationDraft: null,
  setReservationDraft: (draft) => set({ reservationDraft: draft }),
  patchReservationDraft: (patch) =>
    set((state) => ({
      reservationDraft: { ...(state.reservationDraft ?? {}), ...patch } as ReservationDraft,
    })),
  clearReservationDraft: () => set({ reservationDraft: null }),
}),
    {
      name: "apex_org_wizard_v1",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        eventName: state.eventName,
        reserveFacilities: state.reserveFacilities,
        saafDraft: state.saafDraft,
        reservationDraft: state.reservationDraft,
      }),
    }
  )
)
