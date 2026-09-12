import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// ---------------------------------------------------------------------------
// Types — mirrors the interfaces defined in reservation.tsx
// ---------------------------------------------------------------------------

export interface Equipment {
  monoblock: boolean
  whiteboards: boolean
  tables: boolean
  rostrum: boolean
  flags: boolean
  panelBoards: boolean
  others: boolean
}

export interface FacilityItem {
  id: string
  item: string
  dateOfUse: string
  timeOfUse: string
  location: string
}

export interface RoomItem {
  id: string
  dateNeeded: string
  timeNeeded: string
  roomNeeded: string
  remarks: string
}

export interface AVItem {
  id: string
  dateNeeded: string
  timeNeeded: string
  equipmentNeeded: string
  remarks: string
}

// ---------------------------------------------------------------------------
// Default values — hoisted as module-level constants so they are never
// re-created on render (vercel-react-best-practices §5.5 / §6.3)
// ---------------------------------------------------------------------------

const DEFAULT_EQUIPMENT: Equipment = {
  monoblock: false,
  whiteboards: false,
  tables: false,
  rostrum: false,
  flags: false,
  panelBoards: false,
  others: false,
}

const DEFAULT_FACILITY_ITEMS: FacilityItem[] = [
  { id: "1", item: "1", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "2", item: "2", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "3", item: "3", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "4", item: "4", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "5", item: "5", dateOfUse: "", timeOfUse: "", location: "" },
]

const DEFAULT_ROOM_ITEMS: RoomItem[] = [
  { id: "1", dateNeeded: "", timeNeeded: "", roomNeeded: "AV Room", remarks: "" },
  { id: "2", dateNeeded: "", timeNeeded: "", roomNeeded: "Seminar Room", remarks: "" },
  { id: "3", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
  { id: "4", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
  { id: "5", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
]

const DEFAULT_AV_ITEMS: AVItem[] = [
  { id: "1", dateNeeded: "", timeNeeded: "", equipmentNeeded: "LCD", remarks: "" },
  { id: "2", dateNeeded: "", timeNeeded: "", equipmentNeeded: "CPU", remarks: "" },
  { id: "3", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Laptop", remarks: "" },
  { id: "4", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Computer Speaker", remarks: "" },
  { id: "5", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Laser Pointer", remarks: "" },
  { id: "6", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Television", remarks: "" },
  { id: "7", dateNeeded: "", timeNeeded: "", equipmentNeeded: "DVD", remarks: "" },
  { id: "8", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Doc. Cam", remarks: "" },
  { id: "9", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Amplifier", remarks: "" },
  { id: "10", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Mixer", remarks: "" },
  { id: "11", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Speakers", remarks: "" },
  { id: "12", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Microphone", remarks: "" },
  { id: "13", dateNeeded: "", timeNeeded: "", equipmentNeeded: "Others", remarks: "" },
]

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface ReservationDraft {
  equipment: Equipment
  otherEquipmentText: string
  purpose: string
  functionRoomPurpose: string
  avPurpose: string
  facilityItems: FacilityItem[]
  roomItems: RoomItem[]
  avItems: AVItem[]
}

interface ReservationActions {
  // Equipment
  setEquipment: (patch: Partial<Equipment>) => void

  // Text fields
  setOtherEquipmentText: (value: string) => void
  setPurpose: (value: string) => void
  setFunctionRoomPurpose: (value: string) => void
  setAvPurpose: (value: string) => void

  // Facility items
  addFacilityItem: () => void
  removeFacilityItem: (id: string) => void
  updateFacilityItem: (id: string, field: keyof FacilityItem, value: string) => void

  // Room items
  removeRoomItem: (id: string) => void
  updateRoomItem: (id: string, field: keyof RoomItem, value: string) => void

  // AV items
  addAvItem: () => void
  removeAvItem: (id: string) => void
  updateAvItem: (id: string, field: keyof AVItem, value: string) => void

  // Reset entire draft
  resetDraft: () => void
}

type ReservationState = ReservationDraft & ReservationActions

// ---------------------------------------------------------------------------
// Initial state — separated so resetDraft can reference it without re-defining
// (vercel-react-best-practices §7.9: early return / clean resets)
// ---------------------------------------------------------------------------

const INITIAL_STATE: ReservationDraft = {
  equipment: DEFAULT_EQUIPMENT,
  otherEquipmentText: "",
  purpose: "",
  functionRoomPurpose: "",
  avPurpose: "",
  facilityItems: DEFAULT_FACILITY_ITEMS,
  roomItems: DEFAULT_ROOM_ITEMS,
  avItems: DEFAULT_AV_ITEMS,
}

// ---------------------------------------------------------------------------
// Store
//
// `persist` middleware backs the draft in sessionStorage so it survives page
// refreshes but clears when the tab is closed — matching the original
// sessionStorage.setItem("apex_reservation_draft") behaviour in reservation.tsx.
//
// The storage key is versioned ("_v1") so stale drafts with an incompatible
// shape are silently discarded on upgrade (vercel-react-best-practices §4.4).
// ---------------------------------------------------------------------------

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // --- Equipment ---
      // Functional update merges only the changed keys (vercel §5.11)
      setEquipment: (patch) =>
        set((state) => ({ equipment: { ...state.equipment, ...patch } })),

      // --- Text fields ---
      setOtherEquipmentText: (value) => set({ otherEquipmentText: value }),
      setPurpose: (value) => set({ purpose: value }),
      setFunctionRoomPurpose: (value) => set({ functionRoomPurpose: value }),
      setAvPurpose: (value) => set({ avPurpose: value }),

      // --- Facility items ---
      addFacilityItem: () =>
        set((state) => {
          const nextNum = String(state.facilityItems.length + 1)
          return {
            facilityItems: [
              ...state.facilityItems,
              { id: String(Date.now()), item: nextNum, dateOfUse: "", timeOfUse: "", location: "" },
            ],
          }
        }),

      removeFacilityItem: (id) => {
        // Guard: keep at least one row (vercel §7.9 early return)
        if (get().facilityItems.length === 1) return
        set((state) => ({
          facilityItems: state.facilityItems.filter((i) => i.id !== id),
        }))
      },

      updateFacilityItem: (id, field, value) =>
        set((state) => ({
          facilityItems: state.facilityItems.map((i) =>
            i.id === id ? { ...i, [field]: value } : i,
          ),
        })),

      // --- Room items ---
      removeRoomItem: (id) => {
        if (get().roomItems.length === 1) return
        set((state) => ({
          roomItems: state.roomItems.filter((i) => i.id !== id),
        }))
      },

      updateRoomItem: (id, field, value) =>
        set((state) => ({
          roomItems: state.roomItems.map((i) =>
            i.id === id ? { ...i, [field]: value } : i,
          ),
        })),

      // --- AV items ---
      addAvItem: () =>
        set((state) => ({
          avItems: [
            ...state.avItems,
            {
              id: String(Date.now()),
              dateNeeded: "",
              timeNeeded: "",
              equipmentNeeded: "Others",
              remarks: "",
            },
          ],
        })),

      removeAvItem: (id) => {
        if (get().avItems.length === 1) return
        set((state) => ({
          avItems: state.avItems.filter((i) => i.id !== id),
        }))
      },

      updateAvItem: (id, field, value) =>
        set((state) => ({
          avItems: state.avItems.map((i) =>
            i.id === id ? { ...i, [field]: value } : i,
          ),
        })),

      // --- Reset ---
      resetDraft: () => set(INITIAL_STATE),
    }),
    {
      name: "apex_reservation_draft_v1", // versioned key (vercel §4.4)
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
