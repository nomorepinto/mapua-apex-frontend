import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { PlusIcon, Trash2Icon, CheckIcon, DownloadIcon } from "lucide-react"
import { generateProposalPdf } from "@/lib/pdf-generator"

interface FacilityItem {
    id: string
    item: string
    dateOfUse: string
    timeOfUse: string
    location: string
}

interface RoomItem {
    id: string
    dateNeeded: string
    timeNeeded: string
    roomNeeded: string
    remarks: string
}

interface AVItem {
    id: string
    dateNeeded: string
    timeNeeded: string
    equipmentNeeded: string
    remarks: string
}

const getSavedReservationDraft = () => {
    if (typeof window === "undefined") return null
    const saved = sessionStorage.getItem("apex_reservation_draft")
    return saved ? JSON.parse(saved) : null
}

export function Reservation() {
    const navigate = useNavigate()
    const formRef = useRef<HTMLFormElement>(null)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Lazy initialize state directly from sessionStorage
    const [equipment, setEquipment] = useState(() => {
        return (
            getSavedReservationDraft()?.equipment || {
                monoblock: false,
                whiteboards: false,
                tables: false,
                rostrum: false,
                flags: false,
                panelBoards: false,
                others: false,
            }
        )
    })

    const [otherEquipmentText, setOtherEquipmentText] = useState(() => getSavedReservationDraft()?.otherEquipmentText || "")
    const [purpose, setPurpose] = useState(() => getSavedReservationDraft()?.purpose || "")
    const [functionRoomPurpose, setFunctionRoomPurpose] = useState(() => getSavedReservationDraft()?.functionRoomPurpose || "")
    const [avPurpose, setAvPurpose] = useState(() => getSavedReservationDraft()?.avPurpose || "")

    const [facilityItems, setFacilityItems] = useState<FacilityItem[]>(() => {
        return (
            getSavedReservationDraft()?.facilityItems || [
                { id: "1", item: "1", dateOfUse: "", timeOfUse: "", location: "" },
                { id: "2", item: "2", dateOfUse: "", timeOfUse: "", location: "" },
                { id: "3", item: "3", dateOfUse: "", timeOfUse: "", location: "" },
                { id: "4", item: "4", dateOfUse: "", timeOfUse: "", location: "" },
                { id: "5", item: "5", dateOfUse: "", timeOfUse: "", location: "" },
            ]
        )
    })

    const [roomItems, setRoomItems] = useState<RoomItem[]>(() => {
        return (
            getSavedReservationDraft()?.roomItems || [
                { id: "1", dateNeeded: "", timeNeeded: "", roomNeeded: "AV Room", remarks: "" },
                { id: "2", dateNeeded: "", timeNeeded: "", roomNeeded: "Seminar Room", remarks: "" },
                { id: "3", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
                { id: "4", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
                { id: "5", dateNeeded: "", timeNeeded: "", roomNeeded: "Others", remarks: "" },
            ]
        )
    })

    const [avItems, setAvItems] = useState<AVItem[]>(() => {
        return (
            getSavedReservationDraft()?.avItems || [
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
        )
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Auto-sync reservation draft to sessionStorage whenever fields change
    useEffect(() => {
        const draft = {
            equipment,
            otherEquipmentText,
            purpose,
            functionRoomPurpose,
            avPurpose,
            facilityItems,
            roomItems,
            avItems,
        }
        sessionStorage.setItem("apex_reservation_draft", JSON.stringify(draft))
    }, [
        equipment,
        otherEquipmentText,
        purpose,
        functionRoomPurpose,
        avPurpose,
        facilityItems,
        roomItems,
        avItems,
    ])

    const handleAddFacilityItem = () => {
        const nextNum = String(facilityItems.length + 1)
        setFacilityItems([
            ...facilityItems,
            { id: String(Date.now()), item: nextNum, dateOfUse: "", timeOfUse: "", location: "" },
        ])
    }

    const handleRemoveFacilityItem = (id: string) => {
        if (facilityItems.length === 1) return
        setFacilityItems(facilityItems.filter((i) => i.id !== id))
    }

    const handleUpdateFacilityItem = (id: string, field: keyof FacilityItem, value: string) => {
        setFacilityItems(
            facilityItems.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
        )
    }

    const handleRemoveRoomItem = (id: string) => {
        if (roomItems.length === 1) return
        setRoomItems(roomItems.filter((i) => i.id !== id))
    }

    const handleUpdateRoomItem = (id: string, field: keyof RoomItem, value: string) => {
        setRoomItems(
            roomItems.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
        )
    }

    const handleAddAvItem = () => {
        setAvItems([
            ...avItems,
            { id: String(Date.now()), dateNeeded: "", timeNeeded: "", equipmentNeeded: "Others", remarks: "" },
        ])
    }

    const handleRemoveAvItem = (id: string) => {
        if (avItems.length === 1) return
        setAvItems(avItems.filter((i) => i.id !== id))
    }

    const handleUpdateAvItem = (id: string, field: keyof AVItem, value: string) => {
        setAvItems(
            avItems.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
        )
    }

    const handleGoBack = () => {
        window.scrollTo(0, 0)
        navigate("/submission")
    }

    const handleInitiateSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formRef.current && formRef.current.reportValidity()) {
            setShowConfirmModal(true)
        }
    }

    const handleConfirmProceed = () => {
        setShowConfirmModal(false)

        const saafRaw = sessionStorage.getItem("apex_saaf_draft")
        const saafDraft = saafRaw ? JSON.parse(saafRaw) : null

        const finalProposalPayload = {
            PK: "EVENTuuid",
            SK: "SUBMISSIONuuid",
            submission_type: "saaf",
            sent_at: "timestamp",

            activity_classification: {
                activity_type: saafDraft?.activityType || "co-curricular",
                total_org_members: Number(saafDraft?.totalOrgMembers) || 0,
            },

            proponents: (saafDraft?.proponents || []).map((p: any) => ({
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
                items: (saafDraft?.budgetItems || []).map((b: any) => ({
                    item_no: b.item,
                    unit: Number(b.unit) || 0,
                    quantity: Number(b.quantity) || 0,
                    price_per_unit: Number(b.pricePerUnit) || 0,
                    total: (Number(b.quantity) || 0) * (Number(b.pricePerUnit) || 0),
                })),
                grand_total: (saafDraft?.budgetItems || []).reduce(
                    (sum: number, b: any) =>
                        sum + (Number(b.quantity) || 0) * (Number(b.pricePerUnit) || 0),
                    0
                ),
            },

            venue_reservation: {
                has_reservation: true,
                equipment_requested: {
                    monoblock_chairs: equipment.monoblock,
                    whiteboards: equipment.whiteboards,
                    tables: equipment.tables,
                    rostrum: equipment.rostrum,
                    flags_with_stand: equipment.flags,
                    panel_boards: equipment.panelBoards,
                    others_specified: otherEquipmentText,
                },
                general_facilities: {
                    purpose: purpose,
                    items: facilityItems.map((f) => ({
                        item: f.item,
                        date_of_use: f.dateOfUse,
                        time_of_use: f.timeOfUse,
                        location: f.location,
                    })),
                },
                function_rooms: {
                    purpose: functionRoomPurpose,
                    items: roomItems.map((r) => ({
                        date_needed: r.dateNeeded,
                        time_needed: r.timeNeeded,
                        room_needed: r.roomNeeded,
                        remarks: r.remarks,
                    })),
                },
                audiovisual_equipment: {
                    purpose: avPurpose,
                    items: avItems.map((a) => ({
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

        console.log("Submitting Combined Proposal (SAAF + Reservation):", finalProposalPayload)

        sessionStorage.removeItem("apex_saaf_draft")
        sessionStorage.removeItem("apex_reservation_draft")
        setShowSuccessModal(true)
    }

    const handleSavePdf = () => {
        const saafRaw = sessionStorage.getItem("apex_saaf_draft")
        const saafDraft = saafRaw ? JSON.parse(saafRaw) : {}

        generateProposalPdf(
            {
                activityType: saafDraft.activityType,
                totalOrgMembers: saafDraft.totalOrgMembers,
                activityTitle: saafDraft.activityTitle,
                activityDescription: saafDraft.activityDescription,
                activityObjectives: saafDraft.activityObjectives,
                activityVenue: saafDraft.activityVenue,
                dateOfEvent: saafDraft.dateOfEvent,
                dayOfEvent: saafDraft.dayOfEvent,
                timeOfEvent: saafDraft.timeOfEvent,
                expectedParticipants: saafDraft.expectedParticipants,
                individualContribution: saafDraft.individualContribution,
                proposedBudget: saafDraft.proposedBudget,
                mission1: saafDraft.mission1,
                mission2: saafDraft.mission2,
                mission3: saafDraft.mission3,
                coreValuesExplanation: saafDraft.coreValuesExplanation,
                peoExplanation: saafDraft.peoExplanation,
                sdgExplanation: saafDraft.sdgExplanation,
                proponents: saafDraft.proponents || [],
                budgetItems: saafDraft.budgetItems || [],
            },
            {
                equipment,
                otherEquipmentText,
                purpose,
                facilityItems,
                functionRoomPurpose,
                roomItems,
                avPurpose,
                avItems,
            }
        )
    }

    return (
        <div className="w-full min-h-full bg-[#F3F4F6] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12 font-sans relative">
            <style>{`
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
            <div className="max-w-6xl mx-auto space-y-7">
                <div className="border-b border-neutral-200 pb-5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                        Reservation of Facilities
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
                        Academic Term: 2026 - 2027 • Unified Activity Proposal Application
                    </p>
                </div>

                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                        APPLICATION FORM ON USE OF FACILITIES
                    </h2>
                    <p className="text-xs font-semibold text-neutral-800">
                        (North &amp; South Circle, Hallways, Pavilions, Ground, etc.)
                    </p>
                </div>

                <form ref={formRef} onSubmit={handleInitiateSubmit} className="space-y-8">
                    <div className="space-y-2.5">
                        <p className="text-xs font-bold text-neutral-900">
                            Equipment Requested:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-xl text-xs text-neutral-800">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={equipment.monoblock}
                                    onChange={(e) => setEquipment({ ...equipment, monoblock: e.target.checked })}
                                    className="w-4 h-4 rounded border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                />
                                <span>Monoblock Chairs</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={equipment.whiteboards}
                                    onChange={(e) => setEquipment({ ...equipment, whiteboards: e.target.checked })}
                                    className="w-4 h-4 rounded border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                />
                                <span>White Boards</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={equipment.tables}
                                    onChange={(e) => setEquipment({ ...equipment, tables: e.target.checked })}
                                    className="w-4 h-4 rounded border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                />
                                <span>Tables</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={equipment.rostrum}
                                    onChange={(e) => setEquipment({ ...equipment, rostrum: e.target.checked })}
                                    className="w-4 h-4 rounded border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                />
                                <span>Rostrum</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={equipment.flags}
                                    onChange={(e) => setEquipment({ ...equipment, flags: e.target.checked })}
                                    className="w-4 h-4 rounded border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                />
                                <span>Flags (w/ Poles &amp; Stand)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={equipment.panelBoards}
                                    onChange={(e) => setEquipment({ ...equipment, panelBoards: e.target.checked })}
                                    className="w-4 h-4 rounded border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                />
                                <span>Panel Boards</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-2 pt-1 text-xs text-neutral-800">
                            <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                                <input
                                    type="checkbox"
                                    checked={equipment.others}
                                    onChange={(e) => setEquipment({ ...equipment, others: e.target.checked })}
                                    className="w-4 h-4 rounded border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                />
                                <span>Others (please indicate):</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Label"
                                value={otherEquipmentText}
                                onChange={(e) => setOtherEquipmentText(e.target.value)}
                                style={{ color: "#171717" }}
                                className="w-full max-w-md bg-transparent border-b border-dashed border-neutral-400 focus:outline-none focus:border-neutral-700 px-1 py-0.5 text-xs !text-neutral-900 placeholder:text-neutral-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-neutral-800">
                                Purpose <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="Write the title of Exhibit, Event, etc."
                                style={{ color: "#171717" }}
                                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-700"
                                required
                            />
                        </div>

                        <div className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50/80 border-b border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-72">Item</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-48">Date of Use</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-40">Time of Use</th>
                                            <th className="py-3 px-4 text-center w-60">Location</th>
                                            {facilityItems.length > 1 && <th className="py-3 px-2 w-12 text-center"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {facilityItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-neutral-50/60">
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="text"
                                                        value={item.item}
                                                        placeholder="Item name"
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "item", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-3 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="date"
                                                        value={item.dateOfUse}
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "dateOfUse", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="time"
                                                        value={item.timeOfUse}
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "timeOfUse", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.location}
                                                        placeholder="Location name"
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "location", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                {facilityItems.length > 1 && (
                                                    <td className="p-1 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFacilityItem(item.id)}
                                                            className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                                        >
                                                            <Trash2Icon className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddFacilityItem}
                            className="w-full py-3 border border-dashed border-neutral-300 hover:border-neutral-400 bg-white/40 hover:bg-neutral-100/50 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 transition-all cursor-pointer shadow-xs"
                        >
                            <PlusIcon className="w-4 h-4 text-neutral-600" />
                            <span>Add more Item</span>
                        </button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-neutral-800">
                                Function Room <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={functionRoomPurpose}
                                onChange={(e) => setFunctionRoomPurpose(e.target.value)}
                                placeholder="Write the title of Exhibit, Event, etc."
                                style={{ color: "#171717" }}
                                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-700"
                                required
                            />
                        </div>

                        <div className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50/80 border-b border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-48">Date Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-40">Time Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-56">Room Needed</th>
                                            <th className="py-3 px-4 text-center">Remarks</th>
                                            {roomItems.length > 1 && <th className="py-3 px-2 w-12 text-center"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {roomItems.map((item) => {
                                            const isDefaultPreset = item.roomNeeded === "AV Room" || item.roomNeeded === "Seminar Room"
                                            return (
                                                <tr key={item.id} className="hover:bg-neutral-50/60">
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="date"
                                                            value={item.dateNeeded}
                                                            onChange={(e) => handleUpdateRoomItem(item.id, "dateNeeded", e.target.value)}
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300 cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="time"
                                                            value={item.timeNeeded}
                                                            onChange={(e) => handleUpdateRoomItem(item.id, "timeNeeded", e.target.value)}
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300 cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-neutral-300 text-center text-sm font-medium !text-neutral-900">
                                                        {isDefaultPreset ? (
                                                            <span>{item.roomNeeded}</span>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={item.roomNeeded}
                                                                placeholder="Specify room..."
                                                                onChange={(e) => handleUpdateRoomItem(item.id, "roomNeeded", e.target.value)}
                                                                style={{ color: "#171717" }}
                                                                className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 font-medium focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="text"
                                                            value={item.remarks}
                                                            placeholder="Enter remarks..."
                                                            onChange={(e) => handleUpdateRoomItem(item.id, "remarks", e.target.value)}
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>
                                                    {roomItems.length > 1 && (
                                                        <td className="p-1 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveRoomItem(item.id)}
                                                                className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Trash2Icon className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-neutral-800">
                                Audiovisual Equipment <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={avPurpose}
                                onChange={(e) => setAvPurpose(e.target.value)}
                                placeholder="Write the title of Exhibit, Event, etc."
                                style={{ color: "#171717" }}
                                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-700"
                                required
                            />
                        </div>

                        <div className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50/80 border-b border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-48">Date Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-40">Time Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-56">Equipment Needed</th>
                                            <th className="py-3 px-4 text-center">Remarks</th>
                                            {avItems.length > 1 && <th className="py-3 px-2 w-12 text-center"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {avItems.map((item) => {
                                            const fixedEquipments = [
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
                                            ]
                                            const isFixedItem = fixedEquipments.includes(item.equipmentNeeded)

                                            return (
                                                <tr key={item.id} className="hover:bg-neutral-50/60">
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="date"
                                                            value={item.dateNeeded}
                                                            onChange={(e) => handleUpdateAvItem(item.id, "dateNeeded", e.target.value)}
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300 cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="time"
                                                            value={item.timeNeeded}
                                                            onChange={(e) => handleUpdateAvItem(item.id, "timeNeeded", e.target.value)}
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300 cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-neutral-300 text-center text-sm font-medium !text-neutral-900">
                                                        {isFixedItem ? (
                                                            <span>{item.equipmentNeeded}</span>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={item.equipmentNeeded}
                                                                placeholder="Specify equipment..."
                                                                onChange={(e) => handleUpdateAvItem(item.id, "equipmentNeeded", e.target.value)}
                                                                style={{ color: "#171717" }}
                                                                className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 font-medium focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="text"
                                                            value={item.remarks}
                                                            placeholder="Enter remarks..."
                                                            onChange={(e) => handleUpdateAvItem(item.id, "remarks", e.target.value)}
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>
                                                    {avItems.length > 1 && (
                                                        <td className="p-1 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAvItem(item.id)}
                                                                className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Trash2Icon className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddAvItem}
                            className="w-full py-3 border border-dashed border-neutral-300 hover:border-neutral-400 bg-white/40 hover:bg-neutral-100/50 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 transition-all cursor-pointer shadow-xs"
                        >
                            <PlusIcon className="w-4 h-4 text-neutral-600" />
                            <span>Add more Item</span>
                        </button>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleSavePdf}
                            className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <DownloadIcon className="w-3.5 h-3.5" />
                            Save as PDF
                        </button>
                        <button
                            type="submit"
                            className="bg-[#0B6623] hover:bg-[#084D1A] text-white text-xs font-semibold px-8 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="bg-[#990000] hover:bg-[#7a0000] text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Go Back to Other Page
                        </button>
                    </div>
                </form>
            </div>

            {showConfirmModal && (
                <div
                    onClick={() => setShowConfirmModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-[560px] min-h-[200px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-150"
                    >
                        <div className="bg-[#333333] px-6 py-4 text-center">
                            <h3 className="text-white text-base sm:text-lg font-bold tracking-normal">
                                Are you sure you want to submit?
                            </h3>
                        </div>

                        <div className="px-8 py-5 text-center flex-1 flex flex-col justify-center space-y-5">
                            <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                                This action will submit your facility reservation form with the data
                                you have inputted.{" "}
                                <strong className="font-bold text-neutral-900">
                                    This action cannot be undone.
                                </strong>
                            </p>

                            <div className="flex items-center justify-center gap-4 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmModal(false)}
                                    className="w-40 py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-medium rounded-xl border border-neutral-300 shadow-sm transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmProceed}
                                    className="w-40 py-2.5 px-4 bg-[#4E9B26] hover:bg-[#438721] text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div
                    onClick={() => setShowSuccessModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-[380px] min-h-[190px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-150"
                    >
                        <div className="bg-[#333333] py-6 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-[#52A41C] flex items-center justify-center shadow-md">
                                <CheckIcon className="w-8 h-8 text-white stroke-[3.5]" />
                            </div>
                        </div>

                        <div className="px-6 py-4 text-center space-y-3">
                            <h3 className="text-base font-bold text-neutral-900">
                                Facility Reservation Submitted!
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSuccessModal(false)
                                    navigate("/submission")
                                }}
                                className="w-full py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                            >
                                Back to Submission
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}