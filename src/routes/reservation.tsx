import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { PlusIcon, Trash2Icon } from "lucide-react"

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

export function Reservation() {
    const navigate = useNavigate()

    // Always scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Equipment Requested Checkboxes
    const [equipment, setEquipment] = useState({
        monoblock: false,
        whiteboards: false,
        tables: false,
        rostrum: false,
        flags: false,
        panelBoards: false,
        others: false,
    })
    const [otherEquipmentText, setOtherEquipmentText] = useState("")

    // Form Inputs
    const [purpose, setPurpose] = useState("")
    const [functionRoomPurpose, setFunctionRoomPurpose] = useState("")
    const [avPurpose, setAvPurpose] = useState("")

    // Table 1: Facility Items
    const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([
        { id: "1", item: "1", dateOfUse: "1", timeOfUse: "1", location: "1" },
        { id: "2", item: "2", dateOfUse: "1", timeOfUse: "1", location: "1" },
        { id: "3", item: "3", dateOfUse: "1", timeOfUse: "1", location: "1" },
        { id: "4", item: "4", dateOfUse: "1", timeOfUse: "1", location: "1" },
        { id: "5", item: "5", dateOfUse: "1", timeOfUse: "1", location: "1" },
    ])

    // Table 2: Function Room Items
    const [roomItems, setRoomItems] = useState<RoomItem[]>([
        { id: "1", dateNeeded: "", timeNeeded: "1", roomNeeded: "AV Room", remarks: "1" },
        { id: "2", dateNeeded: "2", timeNeeded: "1", roomNeeded: "Seminar Room", remarks: "1" },
        { id: "3", dateNeeded: "3", timeNeeded: "1", roomNeeded: "Others", remarks: "1" },
        { id: "4", dateNeeded: "4", timeNeeded: "1", roomNeeded: "Others", remarks: "1" },
        { id: "5", dateNeeded: "5", timeNeeded: "1", roomNeeded: "Others", remarks: "1" },
    ])

    // Table 3: Audiovisual Equipment Items
    const [avItems, setAvItems] = useState<AVItem[]>([
        { id: "1", dateNeeded: "1", timeNeeded: "1", equipmentNeeded: "LCD", remarks: "1" },
        { id: "2", dateNeeded: "2", timeNeeded: "1", equipmentNeeded: "CPU", remarks: "1" },
        { id: "3", dateNeeded: "3", timeNeeded: "1", equipmentNeeded: "Laptop", remarks: "1" },
        { id: "4", dateNeeded: "4", timeNeeded: "1", equipmentNeeded: "Computer Speaker", remarks: "1" },
        { id: "5", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Laser Pointer", remarks: "1" },
        { id: "6", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Television", remarks: "1" },
        { id: "7", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "DVD", remarks: "1" },
        { id: "8", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Doc. Cam", remarks: "1" },
        { id: "9", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Amplifier", remarks: "1" },
        { id: "10", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Mixer", remarks: "1" },
        { id: "11", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Speakers", remarks: "1" },
        { id: "12", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Microphone", remarks: "1" },
        { id: "13", dateNeeded: "5", timeNeeded: "1", equipmentNeeded: "Others", remarks: "1" },
    ])

    // Facility handlers
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
            facilityItems.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        )
    }

    // Room handlers
    const handleRemoveRoomItem = (id: string) => {
        if (roomItems.length === 1) return
        setRoomItems(roomItems.filter((i) => i.id !== id))
    }

    const handleUpdateRoomItem = (id: string, field: keyof RoomItem, value: string) => {
        setRoomItems(
            roomItems.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        )
    }

    // AV handlers
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
            avItems.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Facility reservation submitted successfully!")
        navigate("/submission")
    }

    return (
        <div className="w-full min-h-full bg-[#F3F4F6] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-7">
                {/* Header Section without signing guidelines button */}
                <div className="border-b border-neutral-200 pb-5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                        Reservation of Facilities
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
                        Academic Term: 2026 - 2027 • Unified Activity Proposal Application
                    </p>
                </div>

                {/* Form Title */}
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                        APPLICATION FORM ON USE OF FACILITIES
                    </h2>
                    <p className="text-xs font-semibold text-neutral-800">
                        (North &amp; South Circle, Hallways, Pavilions, Ground, etc.)
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Equipment Requested Checkbox Grid */}
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

                        {/* Others Field */}
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

                    {/* Section 1: Purpose & Table 1 */}
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

                        {/* Table 1 */}
                        <div className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50/80 border-b border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Item</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Date of Use</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Time of Use</th>
                                            <th className="py-3 px-4 text-center w-1/4">Location</th>
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
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "item", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="text"
                                                        value={item.dateOfUse}
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "dateOfUse", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="text"
                                                        value={item.timeOfUse}
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "timeOfUse", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.location}
                                                        onChange={(e) => handleUpdateFacilityItem(item.id, "location", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
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

                    {/* Section 2: Function Room & Table 2 */}
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

                        {/* Table 2 */}
                        <div className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50/80 border-b border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Date Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Time Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">AV Room Needed</th>
                                            <th className="py-3 px-4 text-center w-1/4">Remarks</th>
                                            {roomItems.length > 1 && <th className="py-3 px-2 w-12 text-center"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {roomItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-neutral-50/60">
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="text"
                                                        value={item.dateNeeded}
                                                        onChange={(e) => handleUpdateRoomItem(item.id, "dateNeeded", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="text"
                                                        value={item.timeNeeded}
                                                        onChange={(e) => handleUpdateRoomItem(item.id, "timeNeeded", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300 text-center text-sm font-medium !text-neutral-900">
                                                    {item.roomNeeded}
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.remarks}
                                                        onChange={(e) => handleUpdateRoomItem(item.id, "remarks", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Audiovisual Equipment & Table 3 */}
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

                        {/* Table 3 */}
                        <div className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50/80 border-b border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Date Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Time Needed</th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-1/4">Equipment Needed</th>
                                            <th className="py-3 px-4 text-center w-1/4">Remarks</th>
                                            {avItems.length > 1 && <th className="py-3 px-2 w-12 text-center"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {avItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-neutral-50/60">
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="text"
                                                        value={item.dateNeeded}
                                                        onChange={(e) => handleUpdateAvItem(item.id, "dateNeeded", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300">
                                                    <input
                                                        type="text"
                                                        value={item.timeNeeded}
                                                        onChange={(e) => handleUpdateAvItem(item.id, "timeNeeded", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-neutral-300 text-center text-sm font-medium !text-neutral-900">
                                                    {item.equipmentNeeded}
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.remarks}
                                                        onChange={(e) => handleUpdateAvItem(item.id, "remarks", e.target.value)}
                                                        style={{ color: "#171717" }}
                                                        className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
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
                                        ))}
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

                    {/* Bottom Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="submit"
                            className="bg-[#0B6623] hover:bg-[#084D1A] text-white text-xs font-semibold px-8 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                window.scrollTo(0, 0)
                                navigate("/submission")
                            }}
                            className="bg-[#990000] hover:bg-[#7a0000] text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Go Back to Other Page
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}