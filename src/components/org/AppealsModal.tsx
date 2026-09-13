import { X, Search, Filter } from "lucide-react"
import { useState } from "react"
import { useOrgStore } from "@/stores/org-store"

interface AppealsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppealsModal({ isOpen, onClose }: AppealsModalProps) {
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

  const activeBtnClass = "bg-[#D9291C] text-white text-xs font-bold rounded-full";
  const inactiveBtnClass = "bg-neutral-100 text-[#475569] text-xs font-semibold rounded-full hover:bg-neutral-200 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#F5F6F8] w-full max-w-6xl rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden">
        
        {/* Header & Search */}
        <div className="bg-white p-6 border-b border-neutral-200 shrink-0 flex items-center justify-between">
          <div className="relative w-[300px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Appeals, Forms..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-neutral-200 rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
            />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 min-h-full">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-8">Comprehensive Appeals Dashboard</h2>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-8 mb-8">
              <div>
                <span className="text-xs font-semibold text-[#64748B] mb-2 block">Status:</span>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(s => (
                    <button 
                      key={s} 
                      onClick={() => handleStatusChange(s)}
                      className={`px-4 py-1.5 ${statusFilter === s ? activeBtnClass : inactiveBtnClass}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-xs font-semibold text-[#64748B] mb-2 block">Department:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {departments.map(d => (
                    <button 
                      key={d}
                      onClick={() => handleDeptChange(d)}
                      className={`px-4 py-1.5 ${departmentFilter === d ? activeBtnClass : inactiveBtnClass}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider border-b border-neutral-100">
                    <th className="pb-4 pr-4">Appeal ID</th>
                    <th className="pb-4 pr-4">Purpose / Event Title</th>
                    <th className="pb-4 pr-4 text-right">Submitted Date</th>
                    <th className="pb-4 pr-4 pl-8">Department</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {paginatedAppeals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-[#94A3B8]">No appeals found matching your criteria.</td>
                    </tr>
                  ) : (
                    paginatedAppeals.map((a, i) => (
                      <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-5 pr-4 font-mono text-xs text-[#1E293B] font-bold whitespace-nowrap">{a.id}</td>
                        <td className="py-5 pr-4 text-xs text-[#475569] font-medium">{a.title}</td>
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
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-50 text-xs"
              >
                {"<"}
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs ${
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
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-50 text-xs"
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
