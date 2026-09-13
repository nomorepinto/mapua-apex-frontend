import { useState, useEffect, useRef } from "react"
import type { ActionFunctionArgs } from "react-router"
import { useNavigation, useNavigate, useFetcher } from "react-router"
import { PlusIcon, Trash2Icon, CheckIcon, DownloadIcon } from "lucide-react"

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
import { generateProposalPdf } from "@/lib/pdf-generator"
import { useOrgStore } from "@/stores/org-store"

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
    console.log("Activity Proposal Submitted (Submission Only):", data)

    if (!formData.get("activityType")) {
        return {
            success: false,
            errors: { activityType: "Please select an activity classification" },
        }
    }

    // Push the submission to the shared Zustand store
    useOrgStore.getState().addSubmission({
        activity_classification: (data.activityType as string) || "co-curricular",
        current_signatory: "Adviser", // Initial sign-off step
        target_date: (data.dateOfEvent as string) || new Date().toISOString().split('T')[0],
        activity_details: {
            title: (data.activityTitle as string) || "Untitled Activity",
            description: (data.activityDescription as string) || "",
            venue: (data.activityVenue as string) || "",
            date: (data.dateOfEvent as string) || "",
        }
    });

    return {
        success: true,
        message: "Activity Application Submitted!",
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
    quantity: string
    pricePerUnit: string
}

const getSavedSaafDraft = () => {
    return useOrgStore.getState().saafDraft || null
}

export function Submission() {
    const navigate = useNavigate()
    const navigation = useNavigation()
    const fetcher = useFetcher<SubmissionActionData>()
    const isSubmitting = navigation.state === "submitting" || fetcher.state === "submitting"

    const formRef = useRef<HTMLFormElement>(null)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Lazy initialize state directly from sessionStorage
    const [activityType, setActivityType] = useState<string>(() => getSavedSaafDraft()?.activityType || "co-curricular")
    const [totalOrgMembers, setTotalOrgMembers] = useState(() => getSavedSaafDraft()?.totalOrgMembers || "")
    const [expectedParticipants, setExpectedParticipants] = useState(() => getSavedSaafDraft()?.expectedParticipants || "")
    const [individualContribution, setIndividualContribution] = useState(() => getSavedSaafDraft()?.individualContribution || "")
    const [proposedBudget, setProposedBudget] = useState(() => getSavedSaafDraft()?.proposedBudget || "")
    const [dayOfEvent, setDayOfEvent] = useState(() => getSavedSaafDraft()?.dayOfEvent || "")
    const [departmentValues, setDepartmentValues] = useState<Record<string, string>>(() => getSavedSaafDraft()?.departmentValues || {})

    const [activityTitle, setActivityTitle] = useState(() => getSavedSaafDraft()?.activityTitle || "")
    const [activityDescription, setActivityDescription] = useState(() => getSavedSaafDraft()?.activityDescription || "")
    const [activityObjectives, setActivityObjectives] = useState(() => getSavedSaafDraft()?.activityObjectives || "")
    const [activityVenue, setActivityVenue] = useState(() => getSavedSaafDraft()?.activityVenue || "")
    const [dateOfEvent, setDateOfEvent] = useState(() => getSavedSaafDraft()?.dateOfEvent || "")
    const [timeOfEvent, setTimeOfEvent] = useState(() => getSavedSaafDraft()?.timeOfEvent || "")

    const [mission1, setMission1] = useState(() => getSavedSaafDraft()?.mission1 ?? false)
    const [mission2, setMission2] = useState(() => getSavedSaafDraft()?.mission2 ?? false)
    const [mission3, setMission3] = useState(() => getSavedSaafDraft()?.mission3 ?? false)
    const [coreValuesExplanation, setCoreValuesExplanation] = useState(() => getSavedSaafDraft()?.coreValuesExplanation || "")
    const [peoExplanation, setPeoExplanation] = useState(() => getSavedSaafDraft()?.peoExplanation || "")
    const [sdgExplanation, setSdgExplanation] = useState(() => getSavedSaafDraft()?.sdgExplanation || "")

    const [proponents, setProponents] = useState<Proponent[]>(() => {
        return (
            getSavedSaafDraft()?.proponents || [
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
            ]
        )
    })

    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
        return (
            getSavedSaafDraft()?.budgetItems || [
                { id: "1", item: "1", unit: "1", quantity: "1", pricePerUnit: "0" },
                { id: "2", item: "2", unit: "1", quantity: "1", pricePerUnit: "0" },
                { id: "3", item: "3", unit: "1", quantity: "1", pricePerUnit: "0" },
                { id: "4", item: "4", unit: "1", quantity: "1", pricePerUnit: "0" },
                { id: "5", item: "5", unit: "1", quantity: "1", pricePerUnit: "0" },
            ]
        )
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Auto-sync entire SAAF state to sessionStorage
    useEffect(() => {
        const draft = {
            activityType,
            totalOrgMembers,
            expectedParticipants,
            individualContribution,
            proposedBudget,
            dayOfEvent,
            departmentValues,
            activityTitle,
            activityDescription,
            activityObjectives,
            activityVenue,
            dateOfEvent,
            timeOfEvent,
            mission1,
            mission2,
            mission3,
            coreValuesExplanation,
            peoExplanation,
            sdgExplanation,
            proponents,
            budgetItems,
        }
        useOrgStore.getState().setSaafDraft(draft)
    }, [
        activityType,
        totalOrgMembers,
        expectedParticipants,
        individualContribution,
        proposedBudget,
        dayOfEvent,
        departmentValues,
        activityTitle,
        activityDescription,
        activityObjectives,
        activityVenue,
        dateOfEvent,
        timeOfEvent,
        mission1,
        mission2,
        mission3,
        coreValuesExplanation,
        peoExplanation,
        sdgExplanation,
        proponents,
        budgetItems,
    ])

    useEffect(() => {
        if (fetcher.data?.success) {
            useOrgStore.getState().clearSaafDraft()
            useOrgStore.getState().clearReservationDraft()
            setShowConfirmModal(false)
            setShowSuccessModal(true)
        }
    }, [fetcher.data])

    const blockNonIntegerKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            ["e", "E", "+", "-", ".", ","].includes(e.key) &&
            !e.ctrlKey &&
            !e.metaKey
        ) {
            e.preventDefault()
        }
    }

    const blockNonDecimalKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["e", "E", "+", "-"].includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault()
        }
        if (e.key === "." && e.currentTarget.value.includes(".")) {
            e.preventDefault()
        }
    }

    const sanitizeIntegerInput = (val: string) => val.replace(/\D/g, "")

    const sanitizeDecimalInput = (val: string) => {
        const clean = val.replace(/[^0-9.]/g, "")
        const parts = clean.split(".")
        return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : clean
    }

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

    const handleUpdateProponent = (
        id: string,
        field: keyof Proponent,
        value: string,
    ) => {
        setProponents(
            proponents.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
        )
    }

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
                pricePerUnit: "0",
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
        let sanitized = value
        if (field === "unit" || field === "quantity") {
            sanitized = sanitizeIntegerInput(value)
        } else if (field === "pricePerUnit") {
            sanitized = sanitizeDecimalInput(value)
        }
        setBudgetItems(
            budgetItems.map((item) => {
                if (item.id === id) {
                    return { ...item, [field]: sanitized }
                }
                return item
            }),
        )
    }

    const handleGoToReservation = () => {
        if (formRef.current) {
            if (!formRef.current.reportValidity()) {
                return
            }
        }
        navigate("/reservation")
    }

    const handleInitiateSubmit = (e: React.MouseEvent) => {
        e.preventDefault()
        if (formRef.current && formRef.current.reportValidity()) {
            setShowConfirmModal(true)
        }
    }

    const handleConfirmProceed = () => {
        if (formRef.current) {
            fetcher.submit(formRef.current)
        }
    }

    const handleSavePdf = () => {
        generateProposalPdf({
            activityType,
            totalOrgMembers,
            activityTitle,
            activityDescription,
            activityObjectives,
            activityVenue,
            dateOfEvent,
            dayOfEvent,
            timeOfEvent,
            expectedParticipants,
            individualContribution,
            proposedBudget,
            mission1,
            mission2,
            mission3,
            coreValuesExplanation,
            peoExplanation,
            sdgExplanation,
            proponents: proponents.map((p) => ({
                ...p,
                department: departmentValues[p.id] || p.department,
            })),
            budgetItems,
        })
    }

    return (
        <div className="w-full min-h-full bg-[#F3F4F6] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12 relative">
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

            <div className="max-w-6xl mx-auto">
                <fetcher.Form ref={formRef} method="post" className="space-y-10">
                    <div className="border-b border-neutral-200 pb-5">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                            Student Activity Application Form
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
                            Academic Term: 2026 - 2027 • Unified Activity Proposal Application
                        </p>
                    </div>

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
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                name="totalOrgMembers"
                                placeholder="0"
                                value={totalOrgMembers}
                                onKeyDown={blockNonIntegerKeys}
                                onChange={(e) => setTotalOrgMembers(sanitizeIntegerInput(e.target.value))}
                                style={{ color: "#171717" }}
                                className="bg-white border-neutral-300 rounded-lg h-10 !text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-red-800/20 no-spinner"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {proponents.map((proponent, index) => (
                            <div
                                key={proponent.id}
                                className="bg-white/60 p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-neutral-300 pb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-base text-neutral-900 uppercase tracking-wider">
                                            PROPONENT {index + 1} -
                                        </span>
                                        <input
                                            type="text"
                                            name={`proponent_${index}_positionTitle`}
                                            placeholder="Position"
                                            value={proponent.position}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "position", e.target.value)}
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-4 space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_firstName`}
                                            value={proponent.firstName}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "firstName", e.target.value)}
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
                                            value={proponent.middleName}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "middleName", e.target.value)}
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
                                            value={proponent.lastName}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "lastName", e.target.value)}
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
                                            value={proponent.suffix}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "suffix", e.target.value)}
                                            placeholder="Jr."
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Student Number <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            name={`proponent_${index}_studentNumber`}
                                            placeholder="202XXXXXXX"
                                            value={proponent.studentNumber}
                                            onKeyDown={blockNonIntegerKeys}
                                            onChange={(e) =>
                                                handleUpdateProponent(
                                                    proponent.id,
                                                    "studentNumber",
                                                    sanitizeIntegerInput(e.target.value),
                                                )
                                            }
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
                                            value={proponent.programAndYear}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "programAndYear", e.target.value)}
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
                                            value={proponent.dateOfSubmission}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "dateOfSubmission", e.target.value)}
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 px-3 !text-neutral-900 cursor-pointer"
                                            required
                                        />
                                    </div>
                                </div>

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
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Position of the Applicant <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name={`proponent_${index}_positionOfApplicant`}
                                            value={proponent.positionOfApplicant}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "positionOfApplicant", e.target.value)}
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
                                            value={proponent.orgOrCourseSection}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "orgOrCourseSection", e.target.value)}
                                            placeholder="Organization Name"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-700">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            name={`proponent_${index}_contactNumber`}
                                            placeholder="09XXXXXXXXX"
                                            value={proponent.contactNumber}
                                            onKeyDown={blockNonIntegerKeys}
                                            onChange={(e) =>
                                                handleUpdateProponent(
                                                    proponent.id,
                                                    "contactNumber",
                                                    sanitizeIntegerInput(e.target.value),
                                                )
                                            }
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
                                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                            title="Please enter a valid email address with an '@' and domain (e.g., student@mymail.mapua.edu.ph)"
                                            name={`proponent_${index}_emailAddress`}
                                            value={proponent.emailAddress}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "emailAddress", e.target.value)}
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
                                            type="url"
                                            name={`proponent_${index}_facebookLink`}
                                            value={proponent.facebookLink}
                                            onChange={(e) => handleUpdateProponent(proponent.id, "facebookLink", e.target.value)}
                                            placeholder="https://facebook.com/username"
                                            style={{ color: "#171717" }}
                                            className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddProponent}
                            className="w-full py-3.5 border border-dashed border-neutral-300 hover:border-red-600 bg-white/40 hover:bg-red-50/30 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 hover:text-red-700 transition-all cursor-pointer shadow-xs"
                        >
                            <PlusIcon className="w-4 h-4 text-neutral-600" />
                            <span>Add Proponent</span>
                        </button>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="border-b border-neutral-200 pb-2">
                            <h2 className="text-lg font-bold text-neutral-900 tracking-wide uppercase">
                                DETAILS OF ACTIVITY
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Title and Nature of Activity applied for{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="activityTitle"
                                    value={activityTitle}
                                    onChange={(e) => setActivityTitle(e.target.value)}
                                    placeholder="i.e. Seminar, Field Trip, Plant Visit, Outing, Socials, Assembly, Meeting, etc."
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg h-10 text-sm !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="activityDescription"
                                    value={activityDescription}
                                    onChange={(e) => setActivityDescription(e.target.value)}
                                    placeholder="Provide a comprehensive summary of the activity..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm min-h-24 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Objectives of the Activity <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="activityObjectives"
                                    value={activityObjectives}
                                    onChange={(e) => setActivityObjectives(e.target.value)}
                                    placeholder="State the primary targets and outcomes..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm min-h-24 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-800">
                                    Venue <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="activityVenue"
                                    value={activityVenue}
                                    onChange={(e) => setActivityVenue(e.target.value)}
                                    placeholder="Write the complete room number or address for off-campus activity"
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg h-10 text-sm !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Date of Event <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        name="dateOfEvent"
                                        value={dateOfEvent}
                                        onChange={(e) => setDateOfEvent(e.target.value)}
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
                                    <input type="hidden" name="dayOfEvent" value={dayOfEvent} required />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Time of Event <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="time"
                                        name="timeOfEvent"
                                        value={timeOfEvent}
                                        onChange={(e) => setTimeOfEvent(e.target.value)}
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 px-3 !text-neutral-900 cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Number of Expected Participants{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        name="expectedParticipants"
                                        placeholder="0"
                                        value={expectedParticipants}
                                        onKeyDown={blockNonIntegerKeys}
                                        onChange={(e) =>
                                            setExpectedParticipants(sanitizeIntegerInput(e.target.value))
                                        }
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400 no-spinner text-center"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Amount of Individual Contribution{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        name="individualContribution"
                                        placeholder="0.00"
                                        value={individualContribution}
                                        onKeyDown={blockNonDecimalKeys}
                                        onChange={(e) =>
                                            setIndividualContribution(sanitizeDecimalInput(e.target.value))
                                        }
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400 no-spinner text-center"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-800">
                                        Proposed Budget for the Activity{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        name="proposedBudget"
                                        placeholder="0.00"
                                        value={proposedBudget}
                                        onKeyDown={blockNonDecimalKeys}
                                        onChange={(e) =>
                                            setProposedBudget(sanitizeDecimalInput(e.target.value))
                                        }
                                        style={{ color: "#171717" }}
                                        className="bg-white border-neutral-300 rounded-lg h-9.5 !text-neutral-900 placeholder:text-neutral-400 no-spinner text-center"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

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
                                    value={coreValuesExplanation}
                                    onChange={(e) => setCoreValuesExplanation(e.target.value)}
                                    placeholder="Discuss how the activity fosters these core values..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm mt-1 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="block text-sm font-semibold text-neutral-900">
                                    If and when applicable, enumerate the Program Educational
                                    Objectives (PEO) or Program Objectives (PO) Satisfied in this
                                    Activity <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="peoExplanation"
                                    value={peoExplanation}
                                    onChange={(e) => setPeoExplanation(e.target.value)}
                                    placeholder="Indicate which academic objectives are satisfied..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm mt-1 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="block text-sm font-semibold text-neutral-900">
                                    Include the United Nation Sustainability Goals and How is the
                                    Organization going to implement, and Audit the impact{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    name="sdgExplanation"
                                    value={sdgExplanation}
                                    onChange={(e) => setSdgExplanation(e.target.value)}
                                    placeholder="Specify targeted SDGs and your audit methodology..."
                                    rows={4}
                                    style={{ color: "#171717" }}
                                    className="bg-white border-neutral-300 rounded-lg text-sm mt-1 !text-neutral-900 placeholder:text-neutral-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">
                                Detailed Budget Proposal
                            </h2>
                            <p className="text-sm font-medium text-neutral-600 mt-0.5">
                                Include all the Budget Proposal Needed
                            </p>
                        </div>

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
                                            <th className="py-3 px-4 border-r border-neutral-300 text-center w-44">
                                                Price per Unit (₱)
                                            </th>
                                            <th className="py-3 px-4 text-center w-40">Total (₱)</th>
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
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            inputMode="numeric"
                                                            name={`budgetItem_${index}_unit`}
                                                            value={item.unit}
                                                            onKeyDown={blockNonIntegerKeys}
                                                            onChange={(e) =>
                                                                handleUpdateBudgetItem(
                                                                    item.id,
                                                                    "unit",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>

                                                    <td className="p-2 border-r border-neutral-300">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            inputMode="numeric"
                                                            name={`budgetItem_${index}_quantity`}
                                                            value={item.quantity}
                                                            onKeyDown={blockNonIntegerKeys}
                                                            onChange={(e) =>
                                                                handleUpdateBudgetItem(
                                                                    item.id,
                                                                    "quantity",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            style={{ color: "#171717" }}
                                                            className="w-full text-center bg-transparent py-1 px-2 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                        />
                                                    </td>

                                                    <td className="p-2 border-r border-neutral-300">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span className="text-neutral-500 font-semibold select-none">
                                                                ₱
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                                inputMode="decimal"
                                                                name={`budgetItem_${index}_pricePerUnit`}
                                                                value={item.pricePerUnit}
                                                                onKeyDown={blockNonDecimalKeys}
                                                                onChange={(e) =>
                                                                    handleUpdateBudgetItem(
                                                                        item.id,
                                                                        "pricePerUnit",
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                style={{ color: "#171717" }}
                                                                className="w-28 text-center bg-transparent py-1 px-1 !text-neutral-900 focus:outline-none focus:bg-white rounded border border-transparent focus:border-neutral-300"
                                                            />
                                                        </div>
                                                    </td>

                                                    <td className="p-2 text-center font-medium !text-neutral-900">
                                                        ₱{rowTotal.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
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

                                        <tr className="bg-neutral-50/90 font-semibold text-neutral-800 border-t border-neutral-300">
                                            <td
                                                colSpan={4}
                                                className="py-3 px-6 text-right border-r border-neutral-300 font-bold"
                                            >
                                                Grand Total
                                            </td>
                                            <td className="py-3 px-4 text-center font-bold !text-neutral-900">
                                                ₱{grandTotal.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            {budgetItems.length > 1 && <td></td>}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddBudgetItem}
                            className="w-full py-3 border border-dashed border-neutral-300 hover:border-neutral-400 bg-white/40 hover:bg-neutral-100/50 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 transition-all cursor-pointer shadow-xs"
                        >
                            <PlusIcon className="w-4 h-4 text-neutral-600" />
                            <span>Add more Item</span>
                        </button>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-neutral-200">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-neutral-800">
                                Do you have Venue Reservation?{" "}
                                <span className="font-normal text-neutral-500">(optional)</span>
                            </p>
                            <button
                                type="button"
                                onClick={handleGoToReservation}
                                className="bg-[#242424] hover:bg-black text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-xs transition-colors cursor-pointer"
                            >
                                Click here to reserve a venue
                            </button>
                        </div>

                        <div className="w-full sm:w-auto flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleSavePdf}
                                className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer h-10"
                            >
                                <DownloadIcon className="w-3.5 h-3.5" />
                                Save as PDF
                            </button>
                            <Button
                                type="button"
                                onClick={handleInitiateSubmit}
                                disabled={isSubmitting}
                                className="bg-[#0B6623] hover:bg-[#084D1A] text-white font-semibold text-sm px-10 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer min-w-36 h-10"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </div>
                </fetcher.Form>
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
                                This action will submit your student activity form with the data you
                                have inputted.{" "}
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
                                    disabled={isSubmitting}
                                    className="w-40 py-2.5 px-4 bg-[#4E9B26] hover:bg-[#438721] text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                                >
                                    {isSubmitting ? "Submitting..." : "Proceed"}
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
                                Activity Application Submitted!
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSuccessModal(false)
                                    window.location.reload()
                                }}
                                className="w-full py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}