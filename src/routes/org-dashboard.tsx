import { useState } from "react"
import { Link, useLocation, Outlet } from "react-router"
import {
  Home,
  XCircle,
  Bell,
  HelpCircle,
  Settings,
  Users,
  Megaphone,
  AlertTriangle,
  FileText,
  Folder,
  Cloud,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Search,
  X,
  Check,
  CheckCircle2,
  Calendar,
  Bookmark,
  AlertCircle
} from "lucide-react"

import apexLogo from "@/assets/apex-brand.svg"
import { useOrgStore, getSignatorySequence, type Submission, type Announcement, type Appeal } from "@/stores/org-store"

// ============================================================================
// 1. ORG SIDEBAR COMPONENT
// ============================================================================
export function OrgSidebar() {
  const location = useLocation()
  
  const navLinks = [
    { name: "Dashboard", href: "/org-dashboard", icon: Home },
    { name: "Submissions", href: "/submissions", icon: XCircle },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Guidelines", href: "/guidelines", icon: HelpCircle },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About the Devs", href: "/about", icon: Users },
  ]

  return (
    <div className="w-64 bg-[#8B0000] text-white flex flex-col h-screen shrink-0 shadow-lg">
      <div className="p-6 flex flex-col gap-6 flex-1">
        
        {/* Brand Block */}
        <div className="flex flex-col items-center gap-4 mt-4 mb-2">
          <img src={apexLogo} alt="APEX Logo" className="w-40 h-auto object-contain" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-1 mt-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href || (location.pathname.startsWith(link.href) && link.href !== '/');
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold ${
                  isActive 
                    ? "bg-white text-[#1E293B]" 
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Workspace Anchor */}
      <div className="mt-auto">
        <div className="bg-[#333333] p-4 m-5 rounded-xl flex flex-col gap-1 border border-[#404040] shadow-md">
          <span className="text-sm font-bold text-white tracking-wide">Jedrick Darren Ocenar</span>
          <span className="text-xs text-[#EAB308] font-semibold">AWS-SBG Arcus President</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. DASHBOARD LAYOUT COMPONENT
// ============================================================================
export function DashboardLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F5F6F8]">
      <OrgSidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  )
}

// ============================================================================
// 3. APPEALS MODAL COMPONENT
// ============================================================================
interface AppealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument?: (appeal: Appeal) => void;
}

export function AppealsModal({ isOpen, onClose, onSelectDocument }: AppealsModalProps) {
  const { 
    appeals, 
    searchQuery, setSearchQuery, 
    statusFilter, setStatusFilter, 
    departmentFilter, setDepartmentFilter 
  } = useOrgStore()

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  const statuses = ['All', 'Approved', 'Under Review', 'Pending', 'Rejected'];
  const departments = ['All', 'Dean', 'OSAAR', 'Adviser', 'HR', 'IT'];

  // Apply filters
  const filteredAppeals = appeals.filter(appeal => {
    const matchesSearch = appeal.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appeal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || appeal.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || appeal.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredAppeals.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppeals = filteredAppeals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  // Reset page when filters change
  const handleStatusChange = (s: string) => { setStatusFilter(s); setCurrentPage(1); }
  const handleDeptChange = (d: string) => { setDepartmentFilter(d); setCurrentPage(1); }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F6F8] w-full max-w-6xl rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden">
        
        {/* Header & Search */}
        <div className="bg-white p-6 border-b border-neutral-200 shrink-0 flex items-center justify-between">
          <div className="relative w-[300px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Appeals, Documents..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-neutral-200 rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
            />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-2xl shadow-xs border border-neutral-200 p-8 min-h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1E293B]">Comprehensive Appeals & Documents Dashboard</h2>
                <p className="text-xs text-[#64748B] mt-1">Select any document row to open its detailed tracker and progress workflow</p>
              </div>
            </div>
            
            {/* Labeled Dropdown Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 mb-8">
              {/* Status Filter */}
              <div className="flex items-center gap-2.5">
                <label htmlFor="status-filter" className="text-xs font-bold text-[#64748B] whitespace-nowrap">
                  Status:
                </label>
                <div className="relative">
                  <select 
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`appearance-none rounded-xl px-3.5 py-2 pr-9 text-xs font-bold shadow-2xs focus:outline-none transition-all cursor-pointer min-w-[140px] border ${
                      statusFilter !== 'All' 
                        ? 'border-[#D9291C] bg-red-50/40 text-[#D9291C]' 
                        : 'border-neutral-200 bg-white text-[#1E293B] hover:border-neutral-300'
                    }`}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s} className="bg-white text-[#1E293B] font-semibold">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    statusFilter !== 'All' ? 'text-[#D9291C]' : 'text-neutral-400'
                  }`} />
                </div>
              </div>
              
              {/* Department Filter */}
              <div className="flex items-center gap-2.5">
                <label htmlFor="department-filter" className="text-xs font-bold text-[#64748B] whitespace-nowrap">
                  Department:
                </label>
                <div className="relative">
                  <select 
                    id="department-filter"
                    value={departmentFilter}
                    onChange={(e) => handleDeptChange(e.target.value)}
                    className={`appearance-none rounded-xl px-3.5 py-2 pr-9 text-xs font-bold shadow-2xs focus:outline-none transition-all cursor-pointer min-w-[140px] border ${
                      departmentFilter !== 'All' 
                        ? 'border-[#D9291C] bg-red-50/40 text-[#D9291C]' 
                        : 'border-neutral-200 bg-white text-[#1E293B] hover:border-neutral-300'
                    }`}
                  >
                    {departments.map(d => (
                      <option key={d} value={d} className="bg-white text-[#1E293B] font-semibold">{d}</option>
                    ))}
                  </select>
                  <ChevronDown className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    departmentFilter !== 'All' ? 'text-[#D9291C]' : 'text-neutral-400'
                  }`} />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider border-b border-neutral-100">
                    <th className="pb-4 pr-4">Document ID</th>
                    <th className="pb-4 pr-4">Purpose / Event Title</th>
                    <th className="pb-4 pr-4 text-right">Submitted Date</th>
                    <th className="pb-4 pr-4 pl-8">Department</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {paginatedAppeals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm font-semibold text-[#94A3B8]">
                        {appeals.length === 0 ? "No appeals found" : "No appeals found matching your criteria."}
                      </td>
                    </tr>
                  ) : (
                    paginatedAppeals.map((a, i) => (
                      <tr 
                        key={i} 
                        onClick={() => {
                          if (onSelectDocument) {
                            onSelectDocument(a);
                          }
                        }}
                        className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-5 pr-4 font-mono text-xs text-[#1E293B] font-bold whitespace-nowrap group-hover:text-[#D9291C]">{a.id}</td>
                        <td className="py-5 pr-4 text-xs text-[#1E293B] font-semibold">{a.title}</td>
                        <td className="py-5 pr-4 text-xs text-[#64748B] whitespace-nowrap text-right">{a.date}</td>
                        <td className="py-5 pr-4 pl-8 text-xs text-[#64748B]">{a.department}</td>
                        <td className="py-5 whitespace-nowrap">
                          <span className={`text-[10px] font-bold ${a.statusColor}`}>{a.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 gap-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-50 text-xs cursor-pointer"
              >
                {"<"}
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs cursor-pointer ${
                    currentPage === page 
                      ? 'bg-[#D9291C] text-white font-bold' 
                      : 'text-[#475569] border border-neutral-200 bg-white hover:bg-neutral-50 font-semibold'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-50 text-xs cursor-pointer"
              >
                {">"}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}

// ============================================================================
// 4. SUBMISSION TRACKER MODAL COMPONENT
// ============================================================================
interface SubmissionTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  submission: Submission | null
}

export function SubmissionTrackerModal({ isOpen, onClose, submission }: SubmissionTrackerModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'progress'>('details')

  if (!isOpen || !submission) return null

  // Dynamic signatory steps ending with 'Approved'
  const signatoryRoles = getSignatorySequence(submission) // e.g. ["Dean", "OSAAR", "CDM"] or ["Adviser", "OSAAR"]
  const fullSteps = [...signatoryRoles, "Approved"]

  // Determine current step index
  const isAllApproved = submission.status === 'Approved' || submission.status === 'Completed'
  let currentStepIdx = signatoryRoles.indexOf(submission.current_signatory)
  if (currentStepIdx === -1) currentStepIdx = 0
  if (isAllApproved) currentStepIdx = signatoryRoles.length

  // Compute progress percentage
  const totalSignatories = signatoryRoles.length
  const completedCount = isAllApproved ? totalSignatories : Math.max(0, currentStepIdx)
  const progressPercent = Math.round((completedCount / totalSignatories) * 100)
  const remainingSteps = totalSignatories - completedCount

  // Assignees list
  const assigneeInfo: Record<string, { name: string; roleLabel: string }> = {
    'Adviser': { name: 'Prof. Reynilda Layno', roleLabel: 'Faculty Adviser' },
    'Dean': { name: 'Alan S. Mercado', roleLabel: 'College Dean' },
    'OSAAR': { name: 'Director of Student Affairs', roleLabel: 'OSAAR' },
    'CDM': { name: 'Campus Development & Management', roleLabel: 'CDM' },
  }

  const assigneesList = signatoryRoles.map((role, idx) => {
    const info = assigneeInfo[role] || { name: `${role} Officer`, roleLabel: role }
    let statusText = ""
    let state: 'completed' | 'current' | 'queued' = 'queued'

    if (isAllApproved || idx < currentStepIdx) {
      state = 'completed'
      statusText = idx === 0 ? `Endorsed (${submission.submitted_date})` : `Approved (${submission.submitted_date})`
    } else if (idx === currentStepIdx && submission.status !== 'Returned') {
      state = 'current'
      statusText = "Pending Signature (In Review)"
    } else if (submission.status === 'Returned' && idx === currentStepIdx) {
      state = 'current'
      statusText = "Returned for Revision"
    } else {
      state = 'queued'
      const prevRole = signatoryRoles[idx - 1] || 'Previous Step'
      statusText = `Queued (Awaiting ${prevRole})`
    }

    return {
      role,
      name: info.name,
      statusText,
      state
    }
  })

  assigneesList.push({
    role: 'System',
    name: 'System Sign-off',
    statusText: isAllApproved ? 'Approved' : 'Queued (Pending All Signatures)',
    state: isAllApproved ? 'completed' : 'queued'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-8 pt-7 pb-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#D9291C] bg-red-50 px-2 py-0.5 rounded-md">
                {submission.id}
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#475569] bg-neutral-100 px-2 py-0.5 rounded-md">
                {submission.activity_classification}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight">
              {submission.activity_details.title}
            </h2>
            <p className="text-xs font-medium text-[#64748B] mt-0.5">
              Submitted by {submission.activity_details.proponent || 'John Benedict Vida'}
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            {/* Polished Segmented Control Pill Switcher */}
            <div className="bg-slate-100/90 p-1 rounded-xl relative flex items-center w-84 h-10 border border-slate-200/80 shadow-inner">
              {/* Animated Sliding Background Pill */}
              <div
                className="absolute top-1 bottom-1 rounded-lg bg-white shadow-xs border border-slate-200/60 transition-all duration-200 ease-in-out z-0"
                style={{
                  left: activeTab === 'details' ? '4px' : 'calc(50% + 2px)',
                  width: 'calc(50% - 6px)',
                }}
              ></div>

              <button
                onClick={() => setActiveTab('details')}
                className={`relative z-10 w-1/2 h-full text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === 'details'
                    ? 'text-[#D9291C] font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'details' ? 'text-[#D9291C]' : 'text-slate-400'}`} />
                <span>Document Details</span>
              </button>

              <button
                onClick={() => setActiveTab('progress')}
                className={`relative z-10 w-1/2 h-full text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === 'progress'
                    ? 'text-[#D9291C] font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'progress' ? 'text-[#D9291C]' : 'text-slate-400'}`} />
                <span>Milestone & Progress</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-neutral-50/40">

          {/* LEFT TAB: Document Details View */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Document Details Table */}
                <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <h3 className="text-lg font-extrabold text-[#1E293B] mb-4">
                    Document Specification & Details
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100 text-xs font-bold text-[#94A3B8] tracking-wider">
                          <th className="pb-3 pr-4 w-1/3">Field</th>
                          <th className="pb-3">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Document / Event Name</td>
                          <td className="py-3 font-bold text-[#1E293B]">{submission.activity_details.title}</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Classification</td>
                          <td className="py-3 font-bold text-[#1E293B] capitalize">{submission.activity_classification}</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Requested Venue</td>
                          <td className="py-3 font-medium text-[#1E293B]">{submission.activity_details.venue}</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Proposed Date & Time</td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.date} {submission.activity_details.time ? `| ${submission.activity_details.time}` : '| 2:00 PM - 5:00 PM'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Expected Attendees</td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.expected_attendees || 100} students
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-semibold text-[#64748B]">Estimated Budget</td>
                          <td className="py-3 font-medium text-[#1E293B]">
                            {submission.activity_details.budget || 'PHP 5,000.00'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Proponent & Requirements Info */}
                <div className="space-y-4">
                  <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 shadow-xs">
                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Description & Objective</h4>
                    <p className="text-sm text-[#1E293B] leading-relaxed">
                      {submission.activity_details.description}
                    </p>
                  </div>

                  <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 shadow-xs">
                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Proponent & Requirements</h4>
                    <p className="text-xs text-[#64748B] mb-3">
                      Organized by <span className="font-bold text-[#1E293B]">{submission.activity_details.proponent || 'John Benedict Vida'}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {submission.activity_details.requirements?.map((req, i) => (
                        <span key={i} className="text-xs font-semibold text-[#475569] bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200/60">
                          ✓ {req}
                        </span>
                      )) || (
                        <span className="text-xs text-neutral-400 italic">No special requirements listed</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* RIGHT TAB: Milestone & Progress Tracker View */}
          {activeTab === 'progress' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Progress Stepper Card */}
              <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-extrabold text-[#1E293B]">Progress</h3>
                  <span className="text-xs text-[#94A3B8] font-medium">Updated 2h ago</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B] mb-6">
                  <span>
                    {submission.id} • Submitted {submission.submitted_date} • {isAllApproved ? 'All steps completed' : `${remainingSteps} tasks remaining before final approval`}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#64748B] font-medium">Overall progress</span>
                    <span className="text-base font-extrabold text-[#1E293B]">{progressPercent}%</span>
                  </div>
                </div>

                {/* Stepper Bar */}
                <div className="relative py-4 px-3">
                  <div className="absolute top-1/2 left-8 right-8 -translate-y-4 h-1 bg-neutral-200 rounded-full z-0">
                    <div
                      className="h-full bg-[#4ADE80] rounded-full transition-all duration-500"
                      style={{
                        width: `${fullSteps.length > 1 ? (Math.min(currentStepIdx, fullSteps.length - 1) / (fullSteps.length - 1)) * 100 : 0}%`
                      }}
                    ></div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between w-full">
                    {fullSteps.map((stepName, idx) => {
                      const isCompleted = isAllApproved || idx < currentStepIdx
                      const isCurrent = !isAllApproved && idx === currentStepIdx

                      let nodeBg = "bg-neutral-200 border-neutral-200 text-neutral-400"
                      if (isCompleted) {
                        nodeBg = "bg-[#6EE7B7] border-[#4ADE80] text-emerald-900"
                      } else if (isCurrent) {
                        nodeBg = "bg-[#FCD34D] border-[#F59E0B] text-amber-900"
                      }

                      return (
                        <div key={stepName} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all shadow-xs ${nodeBg}`}>
                            {isCompleted ? (
                              <Check className="w-5 h-5 stroke-[3] text-emerald-900" />
                            ) : (
                              <span className="w-3 h-3 rounded-full bg-current opacity-60"></span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#1E293B] mt-3">{stepName}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Pending Approval (Assignees List) */}
              <div className="bg-white border border-neutral-100/90 rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-extrabold text-[#1E293B]">Pending approval</h3>
                  <span className="text-xs text-[#94A3B8] font-medium">Updated 2h ago</span>
                </div>

                <p className="text-xs font-bold text-[#64748B] mb-4">Assignees</p>

                <div className="space-y-4">
                  {assigneesList.map((item, idx) => {
                    let iconBg = "bg-neutral-200 text-neutral-400"

                    if (item.state === 'completed') {
                      iconBg = "bg-[#10B981] text-white"
                    } else if (item.state === 'current') {
                      iconBg = "bg-[#FBBF24] text-white"
                    }

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                          {item.state === 'completed' ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>

                        <div className="text-xs sm:text-sm font-medium text-[#1E293B]">
                          <span className="font-bold">{item.name}</span>
                          <span className="text-[#64748B]"> — {item.statusText}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

// ============================================================================
// 5. ANNOUNCEMENT MODAL COMPONENT
// ============================================================================
interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  selectedAnnouncement?: Announcement | null
}

export function AnnouncementModal({ isOpen, onClose, selectedAnnouncement }: AnnouncementModalProps) {
  const { announcements } = useOrgStore()

  if (!isOpen) return null

  // If a specific announcement was selected, put it first in the array
  const displayAnnouncements = selectedAnnouncement
    ? [selectedAnnouncement, ...announcements.filter(a => a.id !== selectedAnnouncement.id)]
    : announcements;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[90vh]">
        
        {/* Institutional Bulletin Header */}
        <div className="px-8 pt-7 pb-5 border-b border-neutral-200/80 bg-[#F8FAFC] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9291C] text-white flex items-center justify-center shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1E293B]">Institutional Bulletin Board</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D9291C] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                  Official Memos
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Administrative notices, SAAF policy timelines, and facility maintenance updates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 rounded-full hover:bg-neutral-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Bulletin Board Posts */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F1F3F7] space-y-6">
          {displayAnnouncements.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-[#94A3B8] border border-neutral-200 shadow-xs flex flex-col items-center justify-center">
              <Megaphone className="w-8 h-8 text-neutral-300 mb-3" />
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">No announcements at this time</h3>
              <p className="text-xs text-[#64748B]">Official administrative notices and memorandums will appear here.</p>
            </div>
          ) : (
            displayAnnouncements.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-xs border border-neutral-200/90 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Post Header Line */}
                <div className="px-7 pt-5 pb-3 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${
                      post.category === 'Policy'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : post.category === 'System'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}>
                      {post.category} Notice
                    </span>

                    {post.memoNumber && (
                      <span className="text-xs font-mono text-[#64748B] font-semibold bg-neutral-100 px-2.5 py-0.5 rounded-md">
                        {post.memoNumber}
                      </span>
                    )}

                    {post.isImportant && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> High Priority
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Effective: {post.dateRange}</span>
                  </div>
                </div>

                {/* Headline Title */}
                <div className="px-7 pt-5 pb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] leading-snug">
                    {post.title}
                  </h3>
                </div>

                {/* Formatted Memo Body Text Container (Internal Scroll for Long Content) */}
                <div className="mx-7 mb-5 p-5 sm:p-6 bg-[#F8FAFC] rounded-xl border border-neutral-200/80 max-h-[250px] overflow-y-auto pr-3 scrollbar-thin shadow-inner">
                  <p className="text-xs sm:text-sm text-[#334155] font-sans leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Post Footer / Author Sign-off */}
                <div className="px-7 py-3.5 bg-[#F8FAFC] border-t border-neutral-100 flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#D9291C]" />
                    <span className="font-semibold text-[#1E293B]">{post.author}</span>
                    <span className="text-[#94A3B8]">• {post.authorRole}</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] font-medium">APEX Institutional Bulletin</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white border-t border-neutral-200/80 shrink-0 flex justify-between items-center">
          <span className="text-xs text-[#94A3B8]">
            Showing {displayAnnouncements.length} official memorandum posts
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1E293B] text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close Bulletin Board
          </button>
        </div>

      </div>
    </div>
  )
}

// ============================================================================
// 6. MAIN ORG DASHBOARD PAGE COMPONENT
// ============================================================================
export function OrgDashboard() {
  const [isAppealsOpen, setIsAppealsOpen] = useState(false)
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(true)
  const [dismissedReminderIds, setDismissedReminderIds] = useState<string[]>([])

  const { announcements, appeals, submissions, logActivity } = useOrgStore()

  // Timeline Reminders Data (Initializes empty for production)
  const initialTimelineReminders: Array<{
    id: string;
    section: 'Important' | 'Upcoming';
    dateStr: string;
    title: string;
    code: string;
    statusText: string;
    dueDateText: string;
    isUrgent: boolean;
  }> = [];

  const activeReminders = initialTimelineReminders.filter(r => !dismissedReminderIds.includes(r.id));
  const importantReminders = activeReminders.filter(r => r.section === 'Important');
  const upcomingReminders = activeReminders.filter(r => r.section === 'Upcoming');

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'text-[#10B981] bg-emerald-50';
      case 'under review':
        return 'text-[#3B82F6] bg-blue-50';
      case 'submitted':
      case 'pending':
        return 'text-[#F59E0B] bg-amber-50';
      case 'rejected':
      case 'returned':
        return 'text-[#D9291C] bg-red-50';
      default:
        return 'text-[#64748B] bg-neutral-100';
    }
  };

  // Convert an Appeal into a Submission structure for the details/tracker modal
  const handleSelectDocumentFromAppeals = (appeal: Appeal) => {
    const matchingSub = submissions.find(s => s.id === appeal.id);
    if (matchingSub) {
      setSelectedSubmission(matchingSub);
    } else {
      setSelectedSubmission({
        id: appeal.id,
        activity_classification: 'academic',
        requires_venue: false,
        current_signatory: appeal.department,
        target_date: appeal.date,
        submitted_date: appeal.date,
        activity_details: {
          title: appeal.title,
          description: `Official document appeal for ${appeal.title} under ${appeal.department} review.`,
          venue: 'N/A',
          date: appeal.date,
          time: 'N/A',
          expected_attendees: 50,
          budget: 'N/A',
          proponent: 'Jedrick Darren Ocenar',
          requirements: ['Appeal Request Form', 'Department Endorsement']
        },
        status: appeal.status as any,
        statusColor: appeal.statusColor
      });
    }
    setIsTrackerOpen(true);
  };

  return (
    <div className="w-full min-h-full bg-[#F5F6F8] p-6 sm:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Organization Dashboard
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Overview of active submittals, official announcements, and reminders timeline
          </p>
        </div>

        <Link
          to="/submission"
          className="bg-[#1E293B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <span>Create Project/Event</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* LEFT COLUMN (2/3 Width): Announcements, Project Status Table & Resource Quick Links */}
        <div className="xl:col-span-2 space-y-6">

          {/* Announcement / Bulletin Section */}
          <div className="bg-white p-6 md:p-7 rounded-2xl shadow-xs border border-neutral-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#D9291C] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">Announcements & Bulletins</h2>
                  <p className="text-xs text-[#94A3B8]">Important notices and policy updates from administration</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAnnouncement(null);
                  setIsAnnouncementOpen(true);
                }}
                className="text-[#D9291C] font-bold text-xs hover:underline cursor-pointer flex items-center gap-1"
              >
                View All &rarr;
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="bg-[#F8FAFC] border border-neutral-100 rounded-xl p-8 text-center text-[#94A3B8] text-xs font-semibold">
                No announcements at this time
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {announcements.slice(0, 3).map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => {
                      setSelectedAnnouncement(ann);
                      setIsAnnouncementOpen(true);
                    }}
                    className="bg-[#F8FAFC] border border-neutral-100 rounded-xl p-4 flex flex-col justify-between hover:bg-neutral-100/60 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          ann.isImportant ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">{ann.dateRange}</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#1E293B] group-hover:text-[#D9291C] transition-colors leading-snug line-clamp-2 mb-1.5">
                        {ann.title}
                      </h3>
                      <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed mb-3">
                        {ann.content.split('\n')[0]}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-[#94A3B8] block border-t border-neutral-200/50 pt-2">
                      — {ann.author}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Status Table (Real Submissions Data) */}
          <div className="bg-white p-6 md:p-7 rounded-2xl shadow-xs border border-neutral-100 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">Project Status & Submissions</h2>
                <p className="text-xs text-[#94A3B8]">Track current signatory routing and approval statuses</p>
              </div>

              <button
                onClick={() => setIsAppealsOpen(true)}
                className="text-[#D9291C] font-bold text-xs hover:underline cursor-pointer"
              >
                View Appeals &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider border-b border-neutral-100">
                    <th className="pb-3 pr-4 font-bold">DOCUMENT ID</th>
                    <th className="pb-3 pr-6 font-bold">EVENT TITLE</th>
                    <th className="pb-3 pr-4 font-bold">CLASSIFICATION</th>
                    <th className="pb-3 pr-4 font-bold">CURRENT SIGNATORY</th>
                    <th className="pb-3 font-bold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p className="text-sm font-bold text-[#1E293B]">No submissions yet</p>
                          <p className="text-xs text-[#94A3B8] mb-2">Create your first activity proposal to start tracking approvals.</p>
                          <Link
                            to="/submission"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D9291C] hover:bg-[#B81F14] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                          >
                            <span>+ Create Project / Event</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setIsTrackerOpen(true);
                        }}
                      >
                        <td className="py-3.5 pr-4 font-mono text-xs text-[#1E293B] font-bold whitespace-nowrap group-hover:text-[#D9291C]">
                          {sub.id}
                        </td>
                        <td className="py-3.5 pr-6 text-xs text-[#1E293B] font-semibold">
                          {sub.activity_details.title}
                          {sub.requires_venue && (
                            <span className="ml-2 text-[10px] text-[#3B82F6] font-normal">({sub.activity_details.venue})</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-[#64748B] capitalize">
                          {sub.activity_classification}
                        </td>
                        <td className="py-3.5 pr-4 text-xs font-medium text-[#475569]">
                          {sub.current_signatory}
                        </td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getStatusTextColor(sub.status)}`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resource Quick Links */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-neutral-100">
            <h2 className="text-base font-bold text-[#1E293B] mb-4">Resource Quick Links</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  logActivity('Resource accessed', 'Opened Official Templates directory.', 'info');
                  alert('Official Templates directory coming soon');
                }}
                className="flex items-center gap-3 text-left cursor-pointer group hover:bg-neutral-50 p-2 rounded-xl transition-colors"
              >
                <FileText className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#3B82F6] transition-colors" />
                <span className="text-xs sm:text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Official Templates</span>
              </button>

              <button
                onClick={() => {
                  logActivity('Resource accessed', 'Opened Governance and Documentation.', 'info');
                  alert('Governance & Documentation directory coming soon');
                }}
                className="flex items-center gap-3 text-left cursor-pointer group hover:bg-neutral-50 p-2 rounded-xl transition-colors"
              >
                <Folder className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#F59E0B] transition-colors" />
                <span className="text-xs sm:text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Governance and Documentation</span>
              </button>

              <button
                onClick={() => {
                  logActivity('Resource accessed', 'Opened Shared Drive.', 'info');
                  alert('Shared Drive coming soon');
                }}
                className="flex items-center gap-3 text-left cursor-pointer group hover:bg-neutral-50 p-2 rounded-xl transition-colors"
              >
                <Cloud className="w-5 h-5 text-neutral-400 shrink-0 group-hover:text-[#10B981] transition-colors" />
                <span className="text-xs sm:text-sm font-semibold text-[#64748B] group-hover:text-[#1E293B] transition-colors">Shared Drive</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 Width): Expandable Reminders Timeline Panel */}
        <div className="xl:col-span-1 space-y-6">

          {/* Expandable Reminders Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-neutral-100">
            
            {/* Clickable Header / Icon to Expand/Collapse Timeline */}
            <div
              onClick={() => setIsRemindersExpanded(!isRemindersExpanded)}
              className="flex items-center justify-between cursor-pointer group select-none pb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-red-50 text-[#D9291C] flex items-center justify-center group-hover:bg-red-100 transition-colors shadow-xs">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1E293B] group-hover:text-[#D9291C] transition-colors">
                    Reminders
                  </h2>
                  <p className="text-[11px] text-[#94A3B8]">Institutional action items timeline</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeReminders.length > 0 ? (
                  <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                    {activeReminders.length} Active
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                    0 Active
                  </span>
                )}
                {isRemindersExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-[#1E293B] transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#1E293B] transition-colors" />
                )}
              </div>
            </div>

            {/* Collapsed State Summary Line */}
            {!isRemindersExpanded && (
              <p className="text-xs text-[#64748B] mt-2 bg-[#F8FAFC] p-3 rounded-xl border border-neutral-100">
                {activeReminders.length === 0
                  ? "No active reminders right now. Click to expand timeline."
                  : `${importantReminders.length} Important & ${upcomingReminders.length} Upcoming reminders active.`}
              </p>
            )}

            {/* Expanded Timeline Content */}
            {isRemindersExpanded && (
              <div className="mt-4 pt-3 border-t border-neutral-100 max-h-[560px] overflow-y-auto pr-2 scrollbar-thin space-y-6">
                
                {activeReminders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#94A3B8] bg-[#F8FAFC] rounded-xl border border-neutral-100 flex flex-col items-center justify-center gap-1.5">
                    <Bell className="w-6 h-6 text-neutral-300 mb-1" />
                    <p className="font-bold text-[#1E293B]">No reminders at this time</p>
                    <p className="text-[11px] text-[#64748B]">Upcoming action items and deadline alerts will appear here.</p>
                  </div>
                ) : (
                  <>
                    {/* 1. IMPORTANT SECTION */}
                    {importantReminders.length > 0 && (
                      <div>
                        {/* Section Title */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          <h3 className="text-lg font-light text-[#D9291C] font-sans tracking-wide">
                            Important
                          </h3>
                        </div>

                        {/* Important Timeline Items */}
                        <div className="border-l-2 border-red-300 ml-1.5 pl-4 space-y-6">
                          {importantReminders.map((item) => (
                            <div key={item.id} className="relative flex items-start justify-between gap-3 group">
                              
                              {/* Left Timeline Icon Node */}
                              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-md bg-white border border-red-300 flex items-center justify-center text-red-600 shadow-2xs">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>

                              {/* Main Entry Info */}
                              <div className="min-w-0 flex-1 pl-1">
                                <span className="text-[11px] text-[#64748B] italic block mb-0.5 font-sans">
                                  {item.dateStr}
                                </span>
                                <h4 className="text-xs font-bold text-[#1E293B] leading-tight tracking-tight uppercase">
                                  {item.title} <span className="text-neutral-500 font-semibold font-mono">({item.code})</span>
                                </h4>
                                <p className="text-xs text-red-600 font-semibold mt-1 leading-snug">
                                  {item.statusText}
                                </p>
                                <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                                  Due Date: {item.dueDateText}
                                </p>
                              </div>

                              {/* Dismiss Button */}
                              <button
                                onClick={() => {
                                  setDismissedReminderIds(prev => [...prev, item.id]);
                                  logActivity('Reminder dismissed', `Dismissed timeline reminder for ${item.code}`, 'info');
                                }}
                                className="bg-neutral-200/80 hover:bg-neutral-300 text-[#475569] font-bold text-[11px] px-3 py-1 rounded transition-all cursor-pointer shrink-0 mt-1"
                              >
                                Dismiss
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. UPCOMING SECTION */}
                    {upcomingReminders.length > 0 && (
                      <div className="pt-2">
                        {/* Section Title */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full border-2 border-neutral-400 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div>
                          </div>
                          <h3 className="text-lg font-light text-[#475569] font-sans tracking-wide">
                            Upcoming
                          </h3>
                        </div>

                        {/* Upcoming Timeline Items */}
                        <div className="border-l-2 border-neutral-200 ml-1.5 pl-4 space-y-6">
                          {upcomingReminders.map((item) => (
                            <div key={item.id} className="relative flex items-start justify-between gap-3 group">
                              
                              {/* Left Timeline Icon Node */}
                              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-md bg-white border border-neutral-300 flex items-center justify-center text-[#64748B] shadow-2xs">
                                <CheckSquare className="w-3.5 h-3.5" />
                              </div>

                              {/* Main Entry Info */}
                              <div className="min-w-0 flex-1 pl-1">
                                <span className="text-[11px] text-[#64748B] italic block mb-0.5 font-sans">
                                  {item.dateStr}
                                </span>
                                <h4 className="text-xs font-bold text-[#1E293B] leading-tight tracking-tight uppercase">
                                  {item.title} <span className="text-neutral-500 font-semibold font-mono">({item.code})</span>
                                </h4>
                                <p className="text-xs text-[#334155] font-semibold mt-1 leading-snug">
                                  {item.statusText}
                                </p>
                                <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                                  Due Date: {item.dueDateText}
                                </p>
                              </div>

                              {/* Dismiss Button */}
                              <button
                                onClick={() => {
                                  setDismissedReminderIds(prev => [...prev, item.id]);
                                  logActivity('Reminder dismissed', `Dismissed timeline reminder for ${item.code}`, 'info');
                                }}
                                className="bg-neutral-200/80 hover:bg-neutral-300 text-[#475569] font-bold text-[11px] px-3 py-1 rounded transition-all cursor-pointer shrink-0 mt-1"
                              >
                                Dismiss
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Modals */}
      <AppealsModal
        isOpen={isAppealsOpen}
        onClose={() => setIsAppealsOpen(false)}
        onSelectDocument={handleSelectDocumentFromAppeals}
      />

      <SubmissionTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setSelectedSubmission(null);
        }}
        submission={selectedSubmission}
      />

      <AnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => {
          setIsAnnouncementOpen(false);
          setSelectedAnnouncement(null);
        }}
        selectedAnnouncement={selectedAnnouncement}
      />

    </div>
  )
}

export default OrgDashboard
