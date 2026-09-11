import { useState } from "react"
import type { ActionFunctionArgs } from "react-router"
import { Form, useActionData, useNavigation, useNavigate } from "react-router"
import {
    PlusIcon,
    Trash2Icon,
    CheckCircle2Icon,
    AlertCircleIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

export type SubmissionActionData = {
    success?: boolean
    message?: string
    errors?: Record<string, string>
}

export async function action({
    request,
}: ActionFunctionArgs): Promise<SubmissionActionData> {
    const formData = await request.formData()
    const data = Object.fromEntries(formData.entries())
    console.log("Activity Proposal Submitted:", data)

    if (!formData.get("activityType")) {
        return {
            success: false,
            errors: { activityType: "Please select an activity classification" },
        }
    }

    return {
        success: true,
        message: "Your Student Activity Application has been submitted successfully!",
    }
}

interface Proponent {
    id: string
    position: string
    firstName: string
    middleName: string
    lastName: string
    suffix: string
    studentNumber: string
    programAndYear: string
    dateOfSubmission: string
    department: string
    positionOfApplicant: string
    orgOrCourseSection: string
    contactNumber: string
    emailAddress: string
    facebookLink: string
}

interface BudgetItem {
    id: string
    item: string
    unit: string
    quantity: number | string
    pricePerUnit: number | string
}

export function Submission() {
    const navigate = useNavigate()
    const actionData = useActionData<typeof action>()
    const navigation = useNavigation()
    const isSubmitting = navigation.state === "submitting"

    // Activity Classification state
    const [activityType, setActivityType] = useState<string>("co-curricular")

    // Proponents state
    const [proponents, setProponents] = useState<Proponent[]>([
        {
            id: "1",
            position: "",
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            studentNumber: "",
            programAndYear: "",
            dateOfSubmission: "",
            department: "",
            positionOfApplicant: "",
            orgOrCourseSection: "",
            contactNumber: "",
            emailAddress: "",
            facebookLink: "",
        },
    ])

    // Budget proposal items state
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
        { id: "1", item: "1", unit: "1", quantity: "1", pricePerUnit: "1" },
        { id: "2", item: "2", unit: "1", quantity: "1", pricePerUnit: "1" },
        { id: "3", item: "3", unit: "1", quantity: "1", pricePerUnit: "1" },
        { id: "4", item: "4", unit: "1", quantity: "1", pricePerUnit: "1" },
        { id: "5", item: "5", unit: "1", quantity: "1", pricePerUnit: "1" },
    ])

    // Mission checkboxes
    const [mission1, setMission1] = useState(false)
    const [mission2, setMission2] = useState(false)
    const [mission3, setMission3] = useState(false)

    // Day of event select
    const [dayOfEvent, setDayOfEvent] = useState("")
    const [departmentValues, setDepartmentValues] = useState<Record<string, string>>({})

    // Add proponent handler
    const handleAddProponent = () => {
        const newId = String(proponents.length + 1)
        setProponents([
            ...proponents,
            {
                id: newId,
                position: "",
                firstName: "",
                middleName: "",
                lastName: "",
                suffix: "",
                studentNumber: "",
                programAndYear: "",
                dateOfSubmission: "",
                department: "",
                positionOfApplicant: "",
                orgOrCourseSection: "",
                contactNumber: "",
                emailAddress: "",
                facebookLink: "",
            },
        ])
    }

    const handleRemoveProponent = (id: string) => {
        if (proponents.length === 1) return
        setProponents(proponents.filter((p) => p.id !== id))
    }

    // Budget calculations
    const calculateRowTotal = (qty: number | string, price: number | string) => {
        const q = Number(qty) || 0
        const p = Number(price) || 0
        return q * p
    }

    const grandTotal = budgetItems.reduce((sum, item) => {
        return sum + calculateRowTotal(item.quantity, item.pricePerUnit)
    }, 0)

    const handleAddBudgetItem = () => {
        const nextItemNum = String(budgetItems.length + 1)
        setBudgetItems([
            ...budgetItems,
            {
                id: String(Date.now()),
                item: nextItemNum,
                unit: "1",
                quantity: "1",
                pricePerUnit: "1",
            },
        ])
    }

    const handleRemoveBudgetItem = (id: string) => {
        if (budgetItems.length === 1) return
        setBudgetItems(budgetItems.filter((item) => item.id !== id))
    }

    const handleUpdateBudgetItem = (
        id: string,
        field: keyof BudgetItem,
        value: string,
    ) => {
        setBudgetItems(
            budgetItems.map((item) => {
                if (item.id === id) {
                    return { ...item, [field]: value }
                }
                return item
            }),
        )
    }

    return (
        <div className="w-full min-h-full bg-[#F3F4F6] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12">
            <div className="max-w-6xl mx-auto">
                {/* Success / Feedback Alert */}
                {actionData?.success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm">
                        <CheckCircle2Icon className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="font-medium text-sm">{actionData.message}</p>
                    </div>
                )}

                {actionData?.errors && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 shadow-sm">
                        <AlertCircleIcon className="w-5 h-5 text-red-600 shrink-0" />
                        <p className="font-medium text-sm">
                            Please check the required fields before submitting.
                        </p>
                    </div>
                )}

                <Form method="post" className="space-y-10">
                    {/* Header Section */}
                    <div className="border-b border-neutral-200 pb-5">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                            Student Activity Application Form
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
                            Academic Term: 2026 - 2027 • Unified Activity Proposal Application
                        </p>
                    </div>

                    {/* Activity Classification & Org Members */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-8 space-y-3">
                            <label className="block text-sm font-semibold text-neutral-800">
                                Select what type of activity:
                            </label>
                            <div className="flex flex-wrap items-center gap-6 pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-normal text-neutral-700 select-none">
                                    <input
                                        type="radio"
                                        name="activityType"
                                        value="co-curricular"
                                        checked={activityType === "co-curricular"}
                                        onChange={(e) => setActivityType(e.target.value)}
                                        className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                    />
                                    <span>Co-curricular Activity</span>
                                </label>

                                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-normal text-neutral-700 select-none">
                                    <input
                                        type="radio"
                                        name="activityType"
                                        value="extra-curricular"
                                        checked={activityType === "extra-curricular"}
                                        onChange={(e) => setActivityType(e.target.value)}
                                        className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                    />
                                    <span>Extra-curricular Activity</span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-4 space-y-2">
                            <label className="block text-sm font-medium text-neutral-800">
                                Total Number of Class / Org Members{" "}
                                <span className="text-red-500 font-bold">*</span>
                            </label>
                            <Input
                                name="totalOrgMembers"
                                placeholder="0"
                                style={{ color: "#171717" }}
                                className="bg-white border-neutral-300 rounded-lg h-10 !text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-red-800/20"
                                required
                            />
                        </div>
                    </div>

                    {/* Section 1: Proponents */}
                    <div className="space-y-8">
                        {proponents.map((proponent, index) => (
                            <div
                                key={proponent.id}
                                className="bg-white/60 p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6"
                            >
                                {/* Proponent Title with Position Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-neutral-300 pb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-base text-neutral-900 uppercase tracking-wider">
                                            PROPONENT {index + 1} -
                                        </span>
                                        <input
                                            type="text"
                                            name={`proponent_${index}_positionTitle`}
                                            placeholder="Position"
                                            defaultValue={proponent.position}
                                            style={{ color: "#171717" }}
                                            className="bg-neutral-100/90 text-sm px-3 py-1 rounded-md !text-neutral-900 border border-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-700"
                                        />
                                    </div>
                                    {proponents.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveProponent(proponent.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs gap-1 cursor-pointer"
                                        >
                                            <Trash2Icon className="w-3.5 h-3.5" />
                                            Remove
                                        </Button>
                                    )}
                                </div>

                                {/* Row 1: Name fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-4 space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_firstName`}
                                            placeholder="First Name"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Middle Name
                                        </label>
                                        <Input
                                            name={`proponent_${index}_middleName`}
                                            placeholder="Middle Name"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_lastName`}
                                            placeholder="Last Name"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-1 space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Suffix
                                        </label>
                                        <Input
                                            name={`proponent_${index}_suffix`}
                                            placeholder="Jr."
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Student Number, Program and Year, Date */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Student Number <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_studentNumber`}
                                            placeholder="202X-XXXXX"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Program and Year <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_programAndYear`}
                                            placeholder="BSCS - 3rd Year"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Date of Submission <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="date"
                                            name={`proponent_${index}_dateOfSubmission`}
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 px-3 !text-neutral-900 cursor-pointer"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Department, Position, Name of Org */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Department <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            value={departmentValues[proponent.id] ?? ""}
                                            onValueChange={(val) => {
                                                if (typeof val === "string") {
                                                    setDepartmentValues((prev) => ({
                                                        ...prev,
                                                        [proponent.id]: val,
                                                    }))
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="bg-white border-neutral-300 rounded-lg h-9.5 w-full !text-neutral-900 truncate">
                                                <SelectValue placeholder="Select Department">
                                                    {departmentValues[proponent.id] || "Select Department"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent
                                                className="bg-white text-neutral-900 rounded-xl p-1.5 z-50 animate-in fade-in-80 max-h-72"
                                                style={{
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "14px",
                                                    overflow: "hidden",
                                                    outline: "none",
                                                    boxShadow:
                                                        "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                                                }}
                                            >
                                                <SelectItem
                                                    value="School of Information Technology (SOIT)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    School of Information Technology (SOIT)
                                                </SelectItem>
                                                <SelectItem
                                                    value="School of EE-ECE-COE (SEECE)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    School of EE-ECE-COE (SEECE)
                                                </SelectItem>
                                                <SelectItem
                                                    value="School of Civil, Environmental & Geo Engineering (CEGE)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    School of Civil, Environmental & Geo Engineering (CEGE)
                                                </SelectItem>
                                                <SelectItem
                                                    value="School of Chemical, Biological & Materials Engineering (CBMES)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    School of Chemical, Biological & Materials Engineering (CBMES)
                                                </SelectItem>
                                                <SelectItem
                                                    value="School of Mechanical & Manufacturing Engineering (ME-MME)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    School of Mechanical & Manufacturing Engineering (ME-MME)
                                                </SelectItem>
                                                <SelectItem
                                                    value="School of Media Studies (SMS)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    School of Media Studies (SMS)
                                                </SelectItem>
                                                <SelectItem
                                                    value="School of Liberal Arts (SLA)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    School of Liberal Arts (SLA)
                                                </SelectItem>
                                                <SelectItem
                                                    value="E.T. Yuchengco School of Business (ETYSB)"
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    E.T. Yuchengco School of Business (ETYSB)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <input
                                            type="hidden"
                                            name={`proponent_${index}_department`}
                                            value={departmentValues[proponent.id] ?? ""}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Position of the Applicant <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_positionOfApplicant`}
                                            placeholder="President / Project Lead"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Name of Organization / Course and Section{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_orgOrCourseSection`}
                                            placeholder="Organization Name"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 4: Contact Number, Email Address, Facebook Link */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_contactNumber`}
                                            placeholder="09XXXXXXXXX"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="email"
                                            name={`proponent_${index}_emailAddress`}
                                            placeholder="student@mymail.mapua.edu.ph"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Facebook Link <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_facebookLink`}
                                            placeholder="https://facebook.com/username"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Proponent Button */}
                        <button
                            type="button"
                            onClick={handleAddProponent}
                            className="w-full py-3.5 border border-dashed border-neutral-300 hover:border-red-600 bg-white/40 hover:bg-red-50/30 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 hover:text-red-700 transition-all cursor-pointer shadow-xs"
                        >
                            <PlusIcon className="w-4 h-4 text-neutral-600" />
                            <span>Add Proponent</span>
                        </button>
                    </div>

                    {/* Section 2: Details of Activity */}
                    <div className="space-y-6 pt-4">
                        <div className="border-b border-neutral-200 pb-2">
                            <h2 className="text-lg font-bold text-neutral-900 tracking-wide uppercase">
                                DETAILS OF ACTIVITY
                            </h2>
                        </div>

                        <div className="space-y-5">
                            {/* Title and Nature */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Title and Nature of Activity applied for{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="activityTitle"
                                    placeholder="i.e. Seminar, Field Trip, Plant Visit, Outing, Socials, Assembly, Meeting, etc."
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg h-10 text-sm !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="activityDescription"
                                    placeholder="Provide a comprehensive summary of the activity..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm min-h-24 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            {/* Objectives */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Objectives of the Activity <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="activityObjectives"
                                    placeholder="State the primary targets and outcomes..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm min-h-24 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            {/* Venue */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Venue <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="activityVenue"
                                    placeholder="Write the complete room number or address for off-campus activity"
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg h-10 text-sm !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            {/* Date, Day, Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Date of Event <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        name="dateOfEvent"
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 px-3 !text-neutral-900 cursor-pointer"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Day of Event <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        value={dayOfEvent}
                                        onValueChange={(val) => {
                                            if (typeof val === "string") setDayOfEvent(val)
                                        }}
                                    >
                                        <SelectTrigger className="bg-white border-neutral-300 rounded-lg h-9.5 w-full !text-neutral-900">
                                            <SelectValue placeholder="Select Day" />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="bg-white text-neutral-900 rounded-xl p-1.5 z-50 animate-in fade-in-80"
                                            style={{
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "14px",
                                                overflow: "hidden",
                                                outline: "none",
                                                boxShadow:
                                                    "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                                            }}
                                        >
                                            {[
                                                "Monday",
                                                "Tuesday",
                                                "Wednesday",
                                                "Thursday",
                                                "Friday",
                                                "Saturday",
                                                "Sunday",
                                            ].map((day) => (
                                                <SelectItem
                                                    key={day}
                                                    value={day}
                                                    className="text-neutral-900 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-900 data-[state=checked]:font-semibold data-[state=checked]:text-neutral-900 cursor-pointer rounded-lg px-3 py-2 text-sm"
                                                >
                                                    {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="dayOfEvent" value={dayOfEvent} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Time of Event <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="time"
                                        name="timeOfEvent"
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 px-3 !text-neutral-900 cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Expected Participants, Contribution, Budget */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Number of Expected Participants{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        name="expectedParticipants"
                                        placeholder="0"
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Amount of Individual Contribution{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="individualContribution"
                                        placeholder="PHP 0.00"
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Proposed Budget for the Activity{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="proposedBudget"
                                        placeholder="PHP 0.00"
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Alignment with Vision, Mission and Formation Goals */}
                    <div className="space-y-6 pt-4">
                        <div className="border-b border-neutral-200 pb-2">
                            <h2 className="text-base font-bold text-neutral-900 tracking-wide uppercase">
                                ALIGNMENT WITH INSTITUTIONAL VISION, MISSION AND FORMATION GOALS:
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-neutral-800">
                                Check the mission statement(s) satisfied by the nature of your
                                activity.
                            </p>

                            <div className="space-y-3 pl-1">
                                <label className="flex items-start gap-3 cursor-pointer text-sm text-neutral-800 select-none leading-snug">
                                    <input
                                        type="checkbox"
                                        checked={mission1}
                                        onChange={(e) => setMission1(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 rounded border border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                    />
                                    <span>
                                        The University shall provide a learning environment in order
                                        for its students to acquire the attributes that will make
                                        them globally competitive.
                                    </span>
                                    <input
                                        type="hidden"
                                        name="mission_competitive"
                                        value={mission1 ? "true" : "false"}
                                    />
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer text-sm text-neutral-800 select-none leading-snug">
                                    <input
                                        type="checkbox"
                                        checked={mission2}
                                        onChange={(e) => setMission2(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 rounded border border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                    />
                                    <span>
                                        The Institute shall engage in economically viable research,
                                        development, and innovation.
                                    </span>
                                    <input
                                        type="hidden"
                                        name="mission_research"
                                        value={mission2 ? "true" : "false"}
                                    />
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer text-sm text-neutral-800 select-none leading-snug">
                                    <input
                                        type="checkbox"
                                        checked={mission3}
                                        onChange={(e) => setMission3(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 rounded border border-neutral-400 text-red-700 focus:ring-red-700 accent-red-700 cursor-pointer"
                                    />
                                    <span>
                                        The Institute shall provide state-of-the-art solutions to
                                        problems of industries and communities.
                                    </span>
                                    <input
                                        type="hidden"
                                        name="mission_solutions"
                                        value={mission3 ? "true" : "false"}
                                    />
                                </label>
                            </div>

                            {/* Mapua Core Values */}
                            <div className="space-y-1.5 pt-3">
                                <label className="block text-sm font-semibold text-neutral-900">
                                    Enumerate and briefly explain the applicable Mapua Core Values
                                    honed or formed by reason of your activity
                                </label>
                                <p className="text-xs text-neutral-500 font-normal">
                                    (Discipline, Excellence, Commitment, Integrity and Relevance){" "}
                                    <span className="text-red-500">*</span>
                                </p>
                                <Textarea
                                    name="coreValuesExplanation"
                                    placeholder="Discuss how the activity fosters these core values..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm mt-1 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            {/* PEO / PO */}
                            <div className="space-y-1.5 pt-2">
                                <label className="block text-sm font-semibold text-neutral-900">
                                    If and when applicable, enumerate the Program Educational
                                    Objectives (PEO) or Program Objectives (PO) Satisfied in this
                                    Activity <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="peoExplanation"
                                    placeholder="Indicate which academic objectives are satisfied..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm mt-1 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            {/* UN SDGs */}
                            <div className="space-y-1.5 pt-2">
                                <label className="block text-sm font-semibold text-neutral-900">
                                    Include the United Nation Sustainability Goals and How is the
                                    Organization going to implement, and Audit the impact{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="sdgExplanation"
                                    placeholder="Specify targeted SDGs and your audit methodology..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm mt-1 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Detailed Budget Proposal */}
                    <div className="space-y-4 pt-4">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">
                                Detailed Budget Proposal
                            </h2>
                            <p className="text-sm font-medium text-neutral-600 mt-0.5">
                                Include all the Budget Proposal Needed
                            </p>
                        </div>

                        {/* Table */}
                        <div className="bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-50/80 border-b border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider">
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-24">
                                                Item
                                            </th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-36">
                                                Unit
                                            </th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-32">
                                                Quantity
                                            </th>
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-36">
                                                Price per Unit
                                            </th>
                                            <th className="py-3 px-4 text-center w-36">Total</th>
                                            {budgetItems.length > 1 && (
                                                <th className="py-3 px-2 w-12 text-center"></th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {budgetItems.map((item, index) => {
                                            const rowTotal = calculateRowTotal(
                                                item.quantity,
                                                item.pricePerUnit,
                                            )
                                            return (
                                                <tr key={item.id} className="hover:bg-neutral-50/60">
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="text"
                                                            name={`budgetItem_${index}_name`}
                                                            value={item.item}
                                                            style={{ color: "#171717" }}
                                                            onChange={(e) =>
                                                                handleUpdateBudgetItem(
                                                                    item.id,
                                                                    "item",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="text"
                                                            name={`budgetItem_${index}_unit`}
                                                            value={item.unit}
                                                            style={{ color: "#171717" }}
                                                            onChange={(e) =>
                                                                handleUpdateBudgetItem(
                                                                    item.id,
                                                                    "unit",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="number"
                                                            name={`budgetItem_${index}_quantity`}
                                                            value={item.quantity}
                                                            style={{ color: "#171717" }}
                                                            onChange={(e) =>
                                                                handleUpdateBudgetItem(
                                                                    item.id,
                                                                    "quantity",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>
                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="number"
                                                            name={`budgetItem_${index}_pricePerUnit`}
                                                            value={item.pricePerUnit}
                                                            style={{ color: "#171717" }}
                                                            onChange={(e) =>
                                                                handleUpdateBudgetItem(
                                                                    item.id,
                                                                    "pricePerUnit",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center font-medium !text-neutral-900">
                                                        {rowTotal.toLocaleString()}
                                                    </td>
                                                    {budgetItems.length > 1 && (
                                                        <td className="p-1 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveBudgetItem(item.id)}
                                                                className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Trash2Icon className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            )
                                        })}
                                        {/* Grand Total Row */}
                                        <tr className="bg-neutral-50/90 font-semibold text-neutral-800 border-t border-neutral-300">
                                            <td
                                                colSpan={4}
                                                className="py-3 px-6 text-right border-r border-neutral-300 font-bold"
                                            >
                                                Grand Total
                                            </td>
                                            <td className="py-3 px-4 text-center font-bold !text-neutral-900">
                                                {grandTotal.toLocaleString()}
                                            </td>
                                            {budgetItems.length > 1 && <td></td>}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Add more item button */}
                        <button
                            type="button"
                            onClick={handleAddBudgetItem}
                            className="w-full py-3 border border-dashed border-neutral-300 hover:border-neutral-400 bg-white/40 hover:bg-neutral-100/50 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 transition-all cursor-pointer shadow-xs"
                        >
                            <PlusIcon className="w-4 h-4 text-neutral-600" />
                            <span>Add more Item</span>
                        </button>
                    </div>

                    {/* Section 5: Venue Reservation & Submit */}
                    <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-neutral-200">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-neutral-800">
                                Do you have Venue Reservation?{" "}
                                <span className="font-normal text-neutral-500">(optional)</span>
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/reservation")}
                                className="bg-[#242424] hover:bg-black text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-xs transition-colors cursor-pointer"
                            >
                                Click here to reserve a venue
                            </button>
                        </div>

                        <div className="w-full sm:w-auto flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#0B6623] hover:bg-[#084D1A] text-white font-semibold text-sm px-10 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer min-w-36 h-10"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
}