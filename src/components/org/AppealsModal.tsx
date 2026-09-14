import { X, Search, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { AppealRow } from "@/lib/dynamodb-adapters"

interface AppealsModalProps {
  isOpen: boolean
  onClose: () => void
  appeals: AppealRow[]
  isLoading?: boolean
  onSelectDocument?: (appeal: AppealRow) => void
}

export function AppealsModal({
  isOpen,
  onClose,
  appeals,
  isLoading = false,
  onSelectDocument,
}: AppealsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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
                    {isLoading
                      ? "Loading appeals…"
                      : appeals.length === 0
                        ? "No appeals found"
                        : "No appeals found matching your criteria."}
                      </td>
                    </tr>
                  ) : (
                    paginatedAppeals.map((a) => (
                      <tr 
                        key={a.appeal_id} 
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
