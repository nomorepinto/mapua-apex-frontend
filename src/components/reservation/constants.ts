import type {
  AVItem,
  EquipmentFlags,
  FacilityItem,
  ReservationDraft,
  RoomItem,
} from "@/components/reservation/types"

export const EQUIPMENT_OPTIONS: { key: keyof Omit<EquipmentFlags, "others">; label: string }[] =
  [
    { key: "monoblock", label: "Monoblock Chairs" },
    { key: "whiteboards", label: "White Boards" },
    { key: "tables", label: "Tables" },
    { key: "rostrum", label: "Rostrum" },
    { key: "flags", label: "Flags (w/ Poles & Stand)" },
    { key: "panelBoards", label: "Panel Boards" },
  ]

export const FIXED_AV_EQUIPMENT = new Set([
  "LCD",
  "CPU",
  "Laptop",
  "Computer Speaker",
  "Laser Pointer",
  "Television",
  "DVD",
  "Doc. Cam",
  "Amplifier",
  "Mixer",
  "Speakers",
  "Microphone",
])

export const PRESET_ROOMS = new Set(["AV Room", "Seminar Room"])

export const TABLE_INPUT_CLASS =
  "w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"

export const PURPOSE_INPUT_CLASS =
  "w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-700"

export const DEFAULT_EQUIPMENT: EquipmentFlags = {
  monoblock: false,
  whiteboards: false,
  tables: false,
  rostrum: false,
  flags: false,
  panelBoards: false,
  others: false,
}

export const DEFAULT_FACILITY_ITEMS: FacilityItem[] = [
  { id: "1", item: "1", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "2", item: "2", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "3", item: "3", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "4", item: "4", dateOfUse: "", timeOfUse: "", location: "" },
  { id: "5", item: "5", dateOfUse: "", timeOfUse: "", location: "" },
]

export const DEFAULT_ROOM_ITEMS: RoomItem[] = [
  { id: "1", dateNeeded: "", timeNeeded: "", roomNeeded: "AV Room", remarks: "" },
  { id: "2", dateNeeded: "", timeNeeded: "", roomNeeded: "Seminar Room", remarks: "" },
  { id: "3", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
  { id: "4", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
  { id: "5", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
]

export const DEFAULT_AV_ITEMS: AVItem[] = [
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

export const DEFAULT_RESERVATION_DRAFT: ReservationDraft = {
  equipment: DEFAULT_EQUIPMENT,
  otherEquipmentText: "",
  purpose: "",
  functionRoomPurpose: "",
  avPurpose: "",
  facilityItems: DEFAULT_FACILITY_ITEMS,
  roomItems: DEFAULT_ROOM_ITEMS,
  avItems: DEFAULT_AV_ITEMS,
}
