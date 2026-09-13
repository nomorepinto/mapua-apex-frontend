import { memo, useCallback, useState, useRef, useEffect } from "react"
import { SlidersHorizontalIcon, ChevronDownIcon, ChevronRightIcon, XIcon } from "lucide-react"
import type React from "react"

// ─── ActivityFilter ────────────────────────────────────────────────────────────
// Combined Department + Organization filter in a single dropdown panel.

export interface ActivityFilterProps {
  departments: string[]
  departmentOrgMap: Record<string, string[]>
  selectedDept: string | null
  selectedOrg: string | null
  onDeptSelect: (dept: string | null) => void
  onOrgSelect: (org: string | null) => void
}

const ActivityFilter = memo(function ActivityFilter({
  departments,
  departmentOrgMap,
  selectedDept,
  selectedOrg,
  onDeptSelect,
  onOrgSelect,
}: ActivityFilterProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => setOpen((o) => !o), [])
  const close = useCallback(() => setOpen(false), [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleDeptClick = useCallback(
    (dept: string) => {
      if (selectedDept === dept) {
        onDeptSelect(null)
        onOrgSelect(null)
      } else {
        onDeptSelect(dept)
        onOrgSelect(null)
      }
    },
    [selectedDept, onDeptSelect, onOrgSelect],
  )

  const handleOrgClick = useCallback(
    (org: string) => {
      onOrgSelect(selectedOrg === org ? null : org)
    },
    [selectedOrg, onOrgSelect],
  )

  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDeptSelect(null)
      onOrgSelect(null)
    },
    [onDeptSelect, onOrgSelect],
  )

  const hasFilters = selectedDept !== null || selectedOrg !== null
  const availableOrgs = selectedDept ? (departmentOrgMap[selectedDept] ?? []) : []

  // Build label summary
  let label = "Department & Organization"
  if (selectedDept && selectedOrg) label = `${selectedDept} / ${selectedOrg}`
  else if (selectedDept) label = selectedDept
  else if (selectedOrg) label = selectedOrg

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        id="activity-filter-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
      >
        <SlidersHorizontalIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="max-w-52 truncate text-neutral-700">{label}</span>
        {hasFilters ? (
          <XIcon
            className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-700 shrink-0 cursor-pointer"
            onClick={handleClearAll}
          />
        ) : (
          <ChevronDownIcon
            className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Filter by Department and Organization"
          className="absolute right-0 top-full mt-2 z-30 bg-white rounded-2xl border border-neutral-200 shadow-xl py-2 overflow-hidden"
          style={{ minWidth: "340px" }}
        >
          {/* Department section */}
          <div className="px-3 pt-1 pb-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1 mb-1">
              Department
            </p>
            <ul role="listbox" aria-label="Select department" className="space-y-0.5">
              {departments.map((dept) => {
                const isSelected = selectedDept === dept
                return (
                  <li
                    key={dept}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleDeptClick(dept)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#800000]/8 text-[#800000] font-semibold"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{dept}</span>
                    {isSelected && <ChevronRightIcon className="w-3 h-3 text-[#800000]" />}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Organization sub-section — shown when a dept is selected */}
          {selectedDept && availableOrgs.length > 0 && (
            <>
              <div className="my-2 border-t border-neutral-100" />
              <div className="px-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1 mb-1">
                  Organization
                </p>
                <ul role="listbox" aria-label="Select organization" className="space-y-0.5">
                  {availableOrgs.map((org) => {
                    const isSelected = selectedOrg === org
                    return (
                      <li
                        key={org}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleOrgClick(org)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#800000]/8 text-[#800000] font-semibold"
                            : "text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <span>{org}</span>
                        {isSelected && <XIcon className="w-3 h-3 text-[#800000]" />}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </>
          )}

          {/* Clear all footer */}
          {hasFilters && (
            <>
              <div className="my-1 border-t border-neutral-100" />
              <div className="px-4 py-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
})

export { ActivityFilter }
