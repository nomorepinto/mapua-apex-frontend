import * as React from "react"
import {
  LayoutDashboard,
  FileCheck2,
  Settings,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Building2,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

import apexBrandLogo from "@/assets/apex-brand.svg"

type DepartmentData = {
  id: string
  name: string
  organizations: { id: string; name: string }[]
}

const DEPARTMENTS: DepartmentData[] = [
  {
    id: "soit",
    name: "School of Information Technology (SOIT)",
    organizations: [
      { id: "beta-tech", name: "Beta Tech Guild" },
      { id: "acm", name: "ACM Student Chapter" },
      { id: "cybersec", name: "Mapúa CyberSecurity Society" },
    ],
  },
  {
    id: "cas",
    name: "College of Arts and Sciences (CAS)",
    organizations: [
      { id: "alpha-org", name: "Alpha Student Org" },
      { id: "gamma-drama", name: "Gamma Drama Club" },
      { id: "glee-club", name: "Mapúa Concert Singers" },
    ],
  },
  {
    id: "soe",
    name: "School of Engineering (SOE)",
    organizations: [
      { id: "robotics", name: "Robotics and Automation Society" },
      { id: "pice", name: "Philippine Institute of Civil Engineers" },
      { id: "iiee", name: "Institute of Integrated Electrical Engineers" },
    ],
  },
]

type ActivitySubmission = {
  id: string
  organization: string
  representative: string
  departmentId: string
  activityName: string
  submittedDate: string
  priority: "High" | "Medium" | "Low"
  decision: "Review" | "Returned" | "Accepted"
  eventDateTime: string
  venue: string
  estimatedBudget: string
  participants: number
  advisorSignoff: "Verified" | "Pending"
  description: string
  objectives: string[]
  proponents: { role: string; name: string }[]
}

const mockSubmissions: ActivitySubmission[] = [
  {
    id: "sub-1",
    organization: "Alpha Student Org",
    representative: "Kyle Rogers",
    departmentId: "cas",
    activityName: "Fall Campus Concert Proposal",
    submittedDate: "Oct 12, 2025",
    priority: "High",
    decision: "Review",
    eventDateTime: "10:00 AM - 5:00 PM November 18, 2025",
    venue: "Grand Hall, Building D",
    estimatedBudget: "$4,500.00 USD",
    participants: 67,
    advisorSignoff: "Verified",
    description:
      "An inspiring onboarding journey designed to welcome incoming freshmen into the heart of Mapúa's student life while equipping organizational leaders with practical financial management skills. This series bridges the gap between new students and current leaders, showcasing how sound financial stewardship and active organizational involvement go hand in hand with academic success and personal growth. By transcending institutional boundaries, we empower freshmen to view their first steps in an organization not just as a campus activity, but as the foundation for future national-scale leadership grounded in accountability, integrity, and financial literacy.",
    objectives: [
      "Unlock Academic Thriving: Demonstrate how organizational involvement provides the support network, time-management skills, and peer mentorship essential for navigating the rigors of Mapúa's academic life.",
      "Cultivate Resilience: Provide incoming and current student leaders with the mental and strategic tools to navigate complex challenges, teaching them how to turn organizational obstacles into opportunities for growth.",
      "Ignite Organizational Passion: Introduce incoming students to a growth-oriented mindset and encourage them to engage in multisectoral advocacy and in national youth networks at Mapúa.",
      "Foster Collaboration: Showcase the power of cooperation and collaboration, helping new students find their “group” and understand their potential.",
    ],
    proponents: [
      { role: "Executive", name: "Alpha Student Org" },
      { role: "Executive", name: "Student Council" },
      { role: "Executive", name: "Events Committee" },
    ],
  },
  {
    id: "sub-2",
    organization: "Beta Tech Guild",
    representative: "Sarah Chen",
    departmentId: "soit",
    activityName: "AI Hackathon Hack-Fest",
    submittedDate: "Oct 14, 2025",
    priority: "Medium",
    decision: "Review",
    eventDateTime: "8:00 AM - 8:00 PM November 22, 2025",
    venue: "SOIT Innovation Lab, 4th Floor",
    estimatedBudget: "$2,800.00 USD",
    participants: 120,
    advisorSignoff: "Verified",
    description:
      "A 12-hour intensive collaborative hackathon uniting aspiring student software developers, data scientists, and UI/UX designers to solve real-world problems utilizing modern artificial intelligence and machine learning APIs.",
    objectives: [
      "Promote applied artificial intelligence literacy across the academic community.",
      "Encourage cross-discipline collaboration between engineering and computing students.",
      "Produce production-ready prototypes for campus sustainability and operational challenges.",
    ],
    proponents: [
      { role: "Executive", name: "Beta Tech Guild" },
      { role: "Executive", name: "AI Club" },
      { role: "Executive", name: "DevOps Circle" },
    ],
  },
  {
    id: "sub-3",
    organization: "Gamma Drama Club",
    representative: "Julian Rivera",
    departmentId: "cas",
    activityName: "Shakespeare Night Play",
    submittedDate: "Oct 15, 2025",
    priority: "Low",
    decision: "Review",
    eventDateTime: "6:00 PM - 9:30 PM December 02, 2025",
    venue: "Mapúa Gymnasium Stage",
    estimatedBudget: "$1,600.00 USD",
    participants: 250,
    advisorSignoff: "Verified",
    description:
      "An evening theatrical presentation of classic Renaissance theatre adapted for contemporary student issues, featuring live ensemble performances and technical stagecraft designed entirely by Mapúan students.",
    objectives: [
      "Foster artistic appreciation and performing arts engagement on campus.",
      "Provide student actors and crew members with professional theatre management experience.",
    ],
    proponents: [
      { role: "Executive", name: "Gamma Drama Club" },
      { role: "Executive", name: "CAS Student Council" },
    ],
  },
  {
    id: "sub-4",
    organization: "Mapúa CyberSecurity Society",
    representative: "Alex Mercado",
    departmentId: "soit",
    activityName: "Red vs Blue CTF Qualifier",
    submittedDate: "Oct 18, 2025",
    priority: "High",
    decision: "Returned",
    eventDateTime: "1:00 PM - 7:00 PM December 05, 2025",
    venue: "Virtual & Server Room Annex",
    estimatedBudget: "$1,200.00 USD",
    participants: 80,
    advisorSignoff: "Verified",
    description:
      "A competitive cybersecurity Capture the Flag tournament pitting red-team penetration attackers against blue-team system defenders across realistic enterprise cloud environments.",
    objectives: [
      "Sharpen offensive and defensive cybersecurity skillsets among undergraduates.",
      "Select Mapúa representatives for inter-collegiate CTF leagues.",
    ],
    proponents: [
      { role: "Executive", name: "CyberSecurity Society" },
      { role: "Executive", name: "SOIT Faculty Advisor" },
    ],
  },
  {
    id: "sub-5",
    organization: "Robotics and Automation Society",
    representative: "Gabriel Tan",
    departmentId: "soe",
    activityName: "Autonomous Sumo-Bot League",
    submittedDate: "Oct 20, 2025",
    priority: "Medium",
    decision: "Accepted",
    eventDateTime: "9:00 AM - 4:00 PM December 10, 2025",
    venue: "Student Activity Center",
    estimatedBudget: "$3,100.00 USD",
    participants: 140,
    advisorSignoff: "Verified",
    description:
      "An autonomous combat robotics tournament wherein custom-built student microcontrollers detect ring perimeters and opponent chassis using infrared and ultrasonic sensors.",
    objectives: [
      "Strengthen mechatronics and sensor telemetry integration among engineering cohorts.",
      "Build community excitement around hardware innovation and applied robotics.",
    ],
    proponents: [
      { role: "Executive", name: "Robotics Society" },
      { role: "Executive", name: "SOE Student Council" },
    ],
  },
]

export function Dashboard() {
  const [selectedNav, setSelectedNav] = React.useState<string>("dashboard")
  
  // Cascading filter states
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<string | null>(null)
  const [selectedOrgName, setSelectedOrgName] = React.useState<string | null>(null)

  // Selected Activity for Modal Details
  const [selectedActivity, setSelectedActivity] = React.useState<ActivitySubmission | null>(null)

  // Determine active department's organization list
  const activeDepartment = React.useMemo(() => {
    return DEPARTMENTS.find((d) => d.id === selectedDepartmentId) ?? null
  }, [selectedDepartmentId])

  // Filter submissions by department & organization
  const filteredSubmissions = React.useMemo(() => {
    return mockSubmissions.filter((sub) => {
      if (selectedDepartmentId && sub.departmentId !== selectedDepartmentId) {
        return false
      }
      if (selectedOrgName && sub.organization !== selectedOrgName) {
        return false
      }
      return true
    })
  }, [selectedDepartmentId, selectedOrgName])

  const clearFilters = () => {
    setSelectedDepartmentId(null)
    setSelectedOrgName(null)
    setIsDropdownOpen(false)
  }

  const getPriorityBadge = (priority: ActivitySubmission["priority"]) => {
    switch (priority) {
      case "High":
        return (
          <span className="inline-flex items-center rounded-full bg-[#E02424] px-2.5 py-0.5 text-[11px] font-semibold text-white">
            High
          </span>
        )
      case "Medium":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
            Medium
          </span>
        )
      case "Low":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200">
            Low
          </span>
        )
    }
  }

  const getDecisionBadge = (decision: ActivitySubmission["decision"]) => {
    switch (decision) {
      case "Review":
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            Review
          </span>
        )
      case "Returned":
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 border border-red-200">
            Returned
          </span>
        )
      case "Accepted":
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            Accepted
          </span>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#1A1A1A] antialiased">
      {/* Sidebar - Mapua Cardinal Red */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#8A0000] text-white shadow-xl">
        {/* APEX Brand Header */}
        <div className="flex flex-col items-center px-4 pt-6 pb-6 border-b border-red-900/40">
          <img
            src={apexBrandLogo}
            alt="APEX - Administrative Portal For Events Exchange"
            className="w-full max-w-[210px] h-auto object-contain"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          <button
            onClick={() => setSelectedNav("dashboard")}
            className={`flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
              selectedNav === "dashboard"
                ? "bg-white text-[#8A0000] shadow-sm font-bold"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </button>

          <button
            onClick={() => setSelectedNav("submissions")}
            className={`flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
              selectedNav === "submissions"
                ? "bg-white text-[#8A0000] shadow-sm font-bold"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FileCheck2 className="h-4 w-4 shrink-0" />
            Submissions
          </button>

          <button
            onClick={() => setSelectedNav("settings")}
            className={`flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
              selectedNav === "settings"
                ? "bg-white text-[#8A0000] shadow-sm font-bold"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </button>

          <button
            onClick={() => setSelectedNav("about")}
            className={`flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
              selectedNav === "about"
                ? "bg-white text-[#8A0000] shadow-sm font-bold"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4 shrink-0" />
            About the Devs
          </button>
        </nav>

        {/* User Profile Footer Card */}
        <div className="p-4">
          <div className="rounded-lg bg-[#272B30] p-3.5 text-left text-white shadow-md border border-neutral-700/40">
            <p className="text-sm font-bold text-neutral-100">Dr. Helen Carter</p>
            <p className="text-xs text-neutral-400">Office of the Dean</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Title Section */}
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900">
              [ROLE] Review Dashboard
            </h1>
            <p className="text-sm text-neutral-500 font-normal">
              Academic Term: 2026-2027 <span className="mx-1.5">•</span> Pending institutional approvals for student activities.
            </p>
          </div>

          {/* Metric KPI Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pending Review */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Pending Review
                </span>
                <span className="inline-flex rounded-sm bg-[#FFF4E5] px-2 py-0.5 text-[10px] font-medium text-[#B76E00]">
                  Action Required
                </span>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
                  07
                </span>
              </div>
            </div>

            {/* Total Approved */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Total Approved
                </span>
                <span className="inline-flex rounded-sm bg-[#E8F8F0] px-2 py-0.5 text-[10px] font-medium text-[#0E7A45]">
                  Authorized
                </span>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
                  42
                </span>
              </div>
            </div>

            {/* Returned for Revision */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Returned for Revision
                </span>
                <span className="inline-flex rounded-sm bg-[#FFEBEA] px-2 py-0.5 text-[10px] font-medium text-[#CF222E]">
                  Needs Edits
                </span>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
                  04
                </span>
              </div>
            </div>

            {/* Total Reviewed */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Total Reviewed
                </span>
                <span className="inline-flex rounded-sm bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                  Term Cumulative
                </span>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
                  53
                </span>
              </div>
            </div>
          </div>

          {/* Filtering Bar / Cascading Controls */}
          <div className="relative flex flex-col items-end gap-2.5">
            {/* Filter Toggle Buttons & Active Filters Display */}
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              {/* Active Filter Indicators */}
              <div className="flex flex-wrap items-center gap-2">
                {(selectedDepartmentId || selectedOrgName) ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                      <Filter className="h-3 w-3" />
                      Filtered by:
                    </span>
                    {selectedDepartmentId && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200/80 px-2.5 py-0.5 text-xs font-semibold text-neutral-800">
                        {DEPARTMENTS.find((d) => d.id === selectedDepartmentId)?.name.split("(")[0].trim()}
                        <button
                          onClick={() => {
                            setSelectedDepartmentId(null)
                            setSelectedOrgName(null)
                          }}
                          className="hover:text-red-600 ml-0.5"
                          title="Remove department filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedOrgName && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-900 border border-red-200 px-2.5 py-0.5 text-xs font-semibold">
                        {selectedOrgName}
                        <button
                          onClick={() => setSelectedOrgName(null)}
                          className="hover:text-red-700 ml-0.5"
                          title="Remove organization filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-xs text-neutral-500 hover:text-neutral-900 underline ml-1 cursor-pointer font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400">
                    Showing all activities ({filteredSubmissions.length})
                  </span>
                )}
              </div>

              {/* Single Cascading Filter Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all ${
                  isDropdownOpen
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : selectedDepartmentId || selectedOrgName
                      ? "bg-red-50 text-[#8A0000] border-red-200"
                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <Filter className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {selectedOrgName
                    ? selectedOrgName
                    : selectedDepartmentId
                      ? DEPARTMENTS.find((d) => d.id === selectedDepartmentId)?.name.split("(")[0].trim()
                      : "Filter by Department / Org"}
                </span>
                {isDropdownOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 ml-0.5 opacity-70" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 ml-0.5 opacity-70" />
                )}
              </button>
            </div>

            {/* Cascading Filter Dropdown Menu */}
            {isDropdownOpen && (
              <div className="z-20 w-full rounded-xl border border-neutral-200 bg-white p-4 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Column 1: Departments */}
                  <div className="space-y-2 border-b md:border-b-0 md:border-r border-neutral-100 pb-3 md:pb-0 md:pr-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        1. Select Department
                      </span>
                      {selectedDepartmentId && (
                        <button
                          onClick={() => {
                            setSelectedDepartmentId(null)
                            setSelectedOrgName(null)
                          }}
                          className="text-[11px] text-neutral-400 hover:text-neutral-700"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDepartmentId(null)
                          setSelectedOrgName(null)
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                          selectedDepartmentId === null
                            ? "bg-neutral-900 text-white font-semibold"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <span>All Departments</span>
                        {selectedDepartmentId === null && <Check className="h-3.5 w-3.5" />}
                      </button>

                      {DEPARTMENTS.map((dept) => {
                        const isSelected = selectedDepartmentId === dept.id
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => {
                              setSelectedDepartmentId(dept.id)
                              setSelectedOrgName(null) // Reset org filter when changing department
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors ${
                              isSelected
                                ? "bg-red-50 text-[#8A0000] border border-red-200 font-semibold"
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            <span className="truncate pr-2">{dept.name}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Column 2: Cascading Organizations inside Department */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        2. Select Organization {activeDepartment ? `(${activeDepartment.name.split("(")[1]?.replace(")", "") || ""})` : ""}
                      </span>
                      {selectedOrgName && (
                        <button
                          onClick={() => setSelectedOrgName(null)}
                          className="text-[11px] text-neutral-400 hover:text-neutral-700"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrgName(null)
                          setIsDropdownOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                          selectedOrgName === null
                            ? "bg-neutral-900 text-white font-semibold"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <span>All Organizations {selectedDepartmentId ? "in Department" : ""}</span>
                        {selectedOrgName === null && <Check className="h-3.5 w-3.5" />}
                      </button>

                      {/* Display orgs from active department, or all if none selected */}
                      {(activeDepartment
                        ? activeDepartment.organizations
                        : DEPARTMENTS.flatMap((d) => d.organizations)
                      ).map((org) => {
                        const isSelected = selectedOrgName === org.name
                        return (
                          <button
                            key={org.id}
                            type="button"
                            onClick={() => {
                              setSelectedOrgName(org.name)
                              setIsDropdownOpen(false)
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors ${
                              isSelected
                                ? "bg-red-50 text-[#8A0000] border border-red-200 font-semibold"
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            <span className="truncate pr-2">{org.name}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer dismiss button */}
                <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                  >
                    Clear Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="rounded-md bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800"
                  >
                    Apply & Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submissions Table Card */}
          <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[11px] font-bold tracking-wider text-neutral-500 uppercase">
                    <th scope="col" className="px-6 py-3.5">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Activity Name
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-center">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right">
                      Decision
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-normal text-neutral-800">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                        <Building2 className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                        <p className="text-sm font-medium text-neutral-600">No activity submissions found</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Try selecting a different department or organization filter.</p>
                        <button
                          onClick={clearFilters}
                          className="mt-3 inline-flex items-center text-xs font-semibold text-[#8A0000] hover:underline"
                        >
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((row) => {
                      const isRowSelected = selectedActivity?.id === row.id
                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedActivity(row)}
                          className={`group cursor-pointer select-none transition-all duration-150 border-l-4 ${
                            isRowSelected
                              ? "bg-red-100 border-l-[#8A0000]"
                              : "border-l-transparent hover:border-l-[#8A0000] hover:bg-neutral-100/90"
                          }`}
                        >
                          <td className="px-6 py-4.5 font-bold text-neutral-900 group-hover:text-[#8A0000] transition-colors">
                            {row.organization}
                          </td>
                          <td className="px-6 py-4.5 text-neutral-800 font-medium group-hover:text-neutral-950">
                            {row.activityName}
                          </td>
                          <td className="px-6 py-4.5 text-center text-xs text-neutral-500 font-medium">
                            {row.submittedDate}
                          </td>
                          <td className="px-6 py-4.5 text-center">
                            {getPriorityBadge(row.priority)}
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            {getDecisionBadge(row.decision)}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Full Area Activity Details Modal - Matches Figma Node 11849:2751 */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {/* Backdrop with subtle blur */}
          <div
            onClick={() => setSelectedActivity(null)}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Modal Card */}
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-200/90 animate-in zoom-in-95 duration-200">
            {/* Dark Hero Banner Header */}
            <div className="relative bg-[#2D2E32] px-8 py-6 text-white">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white transition-all"
                title="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded-sm bg-[#E02424] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Reviewing Target
                </span>
                <span className="inline-flex items-center rounded-sm bg-[#00897B] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Time Submitted
                </span>
              </div>

              {/* Activity Title */}
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                {selectedActivity.activityName}
              </h2>

              {/* Meta subtitle */}
              <p className="mt-1.5 text-xs lg:text-sm text-neutral-300">
                Submitted by:{" "}
                <span className="font-semibold text-white">{selectedActivity.organization}</span>
                {" • "}
                Representative:{" "}
                <span className="font-semibold text-white">{selectedActivity.representative}</span>
              </p>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-neutral-800">
              {/* Proponents Section */}
              <div className="space-y-3">
                <h3 className="text-center text-sm font-bold text-neutral-900 tracking-wide">
                  Proponents
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-24">
                  {selectedActivity.proponents.map((p, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <span className="text-xs text-neutral-400 font-medium">{p.role}</span>
                      <span className="text-xs font-semibold text-neutral-700 mt-0.5">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-100" />

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-8 text-sm">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-900">Event Date & Time</span>
                  <span className="text-neutral-700 font-medium">{selectedActivity.eventDateTime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-900">Venue</span>
                  <span className="text-neutral-700 font-medium">{selectedActivity.venue}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-900">Estimated Budget</span>
                  <span className="text-neutral-700 font-semibold">{selectedActivity.estimatedBudget}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-900">Number of Participants</span>
                  <span className="text-neutral-700 font-semibold">{selectedActivity.participants}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="font-bold text-neutral-900">Advisor Signoff</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00897B]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {selectedActivity.advisorSignoff}
                  </span>
                </div>
              </div>

              {/* Description of the Activity */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-neutral-900">Description of the Activity</h4>
                <p className="text-xs lg:text-sm leading-relaxed text-neutral-600 font-normal">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Objectives of the Activity */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-neutral-900">Objectives of the Activity</h4>
                <ul className="space-y-2 text-xs lg:text-sm text-neutral-600 list-disc pl-5 leading-relaxed">
                  {selectedActivity.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-8 py-4">
              <button
                type="button"
                onClick={() => {
                  alert(`Proposal Approved: ${selectedActivity.activityName}`)
                  setSelectedActivity(null)
                }}
                className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 shadow-2xs hover:bg-neutral-100 transition-all"
              >
                Approve Proposal
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Returned for Revision: ${selectedActivity.activityName}`)
                  setSelectedActivity(null)
                }}
                className="rounded-lg bg-[#272B30] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all"
              >
                Return Proposal
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Deferred Decision: ${selectedActivity.activityName}`)
                  setSelectedActivity(null)
                }}
                className="rounded-lg bg-[#990000] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-900 transition-all"
              >
                Defer Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
