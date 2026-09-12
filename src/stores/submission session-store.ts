import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface Proponent {
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

export interface BudgetItem {
    id: string
    item: string
    unit: string
    quantity: string
    pricePerUnit: string
}

export interface SubmissionFormData {
    activityType: string
    totalOrgMembers: string
    expectedParticipants: string
    individualContribution: string
    proposedBudget: string
    dayOfEvent: string
    departmentValues: Record<string, string>
    activityTitle: string
    activityDescription: string
    activityObjectives: string
    activityVenue: string
    dateOfEvent: string
    timeOfEvent: string
    mission1: boolean
    mission2: boolean
    mission3: boolean
    coreValuesExplanation: string
    peoExplanation: string
    sdgExplanation: string
    proponents: Proponent[]
    budgetItems: BudgetItem[]
}

export interface SubmissionActions {
    setActivityType: (activityType: string) => void
    setTotalOrgMembers: (totalOrgMembers: string) => void
    setExpectedParticipants: (expectedParticipants: string) => void
    setIndividualContribution: (individualContribution: string) => void
    setProposedBudget: (proposedBudget: string) => void
    setDayOfEvent: (dayOfEvent: string) => void
    setDepartmentValue: (proponentId: string, department: string) => void
    setDepartmentValues: (departmentValues: Record<string, string>) => void
    setActivityTitle: (activityTitle: string) => void
    setActivityDescription: (activityDescription: string) => void
    setActivityObjectives: (activityObjectives: string) => void
    setActivityVenue: (activityVenue: string) => void
    setDateOfEvent: (dateOfEvent: string) => void
    setTimeOfEvent: (timeOfEvent: string) => void
    setMission1: (mission1: boolean) => void
    setMission2: (mission2: boolean) => void
    setMission3: (mission3: boolean) => void
    setCoreValuesExplanation: (coreValuesExplanation: string) => void
    setPeoExplanation: (peoExplanation: string) => void
    setSdgExplanation: (sdgExplanation: string) => void
    setProponents: (proponents: Proponent[]) => void
    addProponent: () => void
    removeProponent: (id: string) => void
    updateProponent: (id: string, field: keyof Proponent, value: string) => void
    setBudgetItems: (budgetItems: BudgetItem[]) => void
    addBudgetItem: () => void
    removeBudgetItem: (id: string) => void
    updateBudgetItem: (id: string, field: keyof BudgetItem, value: string) => void
    setField: <K extends keyof SubmissionFormData>(field: K, value: SubmissionFormData[K]) => void
    resetForm: () => void
}

export type SubmissionSessionStore = SubmissionFormData & SubmissionActions

export const initialProponents: Proponent[] = [
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

export const initialBudgetItems: BudgetItem[] = [
    { id: "1", item: "1", unit: "1", quantity: "1", pricePerUnit: "0" },
    { id: "2", item: "2", unit: "1", quantity: "1", pricePerUnit: "0" },
    { id: "3", item: "3", unit: "1", quantity: "1", pricePerUnit: "0" },
    { id: "4", item: "4", unit: "1", quantity: "1", pricePerUnit: "0" },
    { id: "5", item: "5", unit: "1", quantity: "1", pricePerUnit: "0" },
]

export const initialSubmissionFormData: SubmissionFormData = {
    activityType: "co-curricular",
    totalOrgMembers: "",
    expectedParticipants: "",
    individualContribution: "",
    proposedBudget: "",
    dayOfEvent: "",
    departmentValues: {},
    activityTitle: "",
    activityDescription: "",
    activityObjectives: "",
    activityVenue: "",
    dateOfEvent: "",
    timeOfEvent: "",
    mission1: false,
    mission2: false,
    mission3: false,
    coreValuesExplanation: "",
    peoExplanation: "",
    sdgExplanation: "",
    proponents: initialProponents,
    budgetItems: initialBudgetItems,
}

const getInitialState = (): SubmissionFormData => {
    if (typeof window !== "undefined") {
        try {
            const savedLegacy = sessionStorage.getItem("apex_saaf_draft")
            if (savedLegacy) {
                const parsed = JSON.parse(savedLegacy)
                return {
                    ...initialSubmissionFormData,
                    ...parsed,
                }
            }
        } catch {
            // Ignore legacy parse errors
        }
    }
    return initialSubmissionFormData
}

export const useSubmissionSessionStore = create<SubmissionSessionStore>()(
    persist(
        (set) => ({
            ...getInitialState(),

            setActivityType: (activityType) => set({ activityType }),
            setTotalOrgMembers: (totalOrgMembers) => set({ totalOrgMembers }),
            setExpectedParticipants: (expectedParticipants) => set({ expectedParticipants }),
            setIndividualContribution: (individualContribution) => set({ individualContribution }),
            setProposedBudget: (proposedBudget) => set({ proposedBudget }),
            setDayOfEvent: (dayOfEvent) => set({ dayOfEvent }),
            setDepartmentValue: (proponentId, department) =>
                set((state) => ({
                    departmentValues: {
                        ...state.departmentValues,
                        [proponentId]: department,
                    },
                })),
            setDepartmentValues: (departmentValues) => set({ departmentValues }),
            setActivityTitle: (activityTitle) => set({ activityTitle }),
            setActivityDescription: (activityDescription) => set({ activityDescription }),
            setActivityObjectives: (activityObjectives) => set({ activityObjectives }),
            setActivityVenue: (activityVenue) => set({ activityVenue }),
            setDateOfEvent: (dateOfEvent) => set({ dateOfEvent }),
            setTimeOfEvent: (timeOfEvent) => set({ timeOfEvent }),
            setMission1: (mission1) => set({ mission1 }),
            setMission2: (mission2) => set({ mission2 }),
            setMission3: (mission3) => set({ mission3 }),
            setCoreValuesExplanation: (coreValuesExplanation) => set({ coreValuesExplanation }),
            setPeoExplanation: (peoExplanation) => set({ peoExplanation }),
            setSdgExplanation: (sdgExplanation) => set({ sdgExplanation }),

            setProponents: (proponents) => set({ proponents }),
            addProponent: () =>
                set((state) => ({
                    proponents: [
                        ...state.proponents,
                        {
                            id: String(Date.now()),
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
                    ],
                })),
            removeProponent: (id) =>
                set((state) => {
                    if (state.proponents.length <= 1) return state
                    return {
                        proponents: state.proponents.filter((p) => p.id !== id),
                    }
                }),
            updateProponent: (id, field, value) =>
                set((state) => ({
                    proponents: state.proponents.map((p) =>
                        p.id === id ? { ...p, [field]: value } : p
                    ),
                })),

            setBudgetItems: (budgetItems) => set({ budgetItems }),
            addBudgetItem: () =>
                set((state) => ({
                    budgetItems: [
                        ...state.budgetItems,
                        {
                            id: String(Date.now()),
                            item: String(state.budgetItems.length + 1),
                            unit: "1",
                            quantity: "1",
                            pricePerUnit: "0",
                        },
                    ],
                })),
            removeBudgetItem: (id) =>
                set((state) => {
                    if (state.budgetItems.length <= 1) return state
                    return {
                        budgetItems: state.budgetItems.filter((item) => item.id !== id),
                    }
                }),
            updateBudgetItem: (id, field, value) =>
                set((state) => ({
                    budgetItems: state.budgetItems.map((item) =>
                        item.id === id ? { ...item, [field]: value } : item
                    ),
                })),

            setField: (field, value) =>
                set((state) => ({
                    ...state,
                    [field]: value,
                })),

            resetForm: () => {
                if (typeof window !== "undefined") {
                    sessionStorage.removeItem("apex_saaf_draft")
                    sessionStorage.removeItem("apex_reservation_draft")
                }
                set(initialSubmissionFormData)
            },
        }),
        {
            name: "apex_saaf_submission_store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                activityType: state.activityType,
                totalOrgMembers: state.totalOrgMembers,
                expectedParticipants: state.expectedParticipants,
                individualContribution: state.individualContribution,
                proposedBudget: state.proposedBudget,
                dayOfEvent: state.dayOfEvent,
                departmentValues: state.departmentValues,
                activityTitle: state.activityTitle,
                activityDescription: state.activityDescription,
                activityObjectives: state.activityObjectives,
                activityVenue: state.activityVenue,
                dateOfEvent: state.dateOfEvent,
                timeOfEvent: state.timeOfEvent,
                mission1: state.mission1,
                mission2: state.mission2,
                mission3: state.mission3,
                coreValuesExplanation: state.coreValuesExplanation,
                peoExplanation: state.peoExplanation,
                sdgExplanation: state.sdgExplanation,
                proponents: state.proponents,
                budgetItems: state.budgetItems,
            }),
        }
    )
)

// Alias for flexibility
export const useSubmissionStore = useSubmissionSessionStore
