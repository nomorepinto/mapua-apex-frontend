import { memo, useCallback, useState } from "react"
import { BuildingIcon, ChevronDownIcon, XIcon } from "lucide-react"
import type React from "react"

// ─── DepartmentFilter ─────────────────────────────────────────────────────────

export interface DepartmentFilterProps {
  departments: string[]
  selected: string | null
  onSelect: (dept: string | null) => void
}

const DepartmentFilter = memo(function DepartmentFilter({
  departments,
  selected,
  onSelect,
}: DepartmentFilterProps) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])
  const clear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(null)
      setOpen(false)
    },
    [onSelect],
  )
  const close = useCallback(() => setOpen(false), [])

  return (
    <div className="relative">
      <button
        type="button"
        id="dept-filter-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs"
      >
        <BuildingIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="max-w-36 truncate">{selected ?? "Department"}</span>
        {selected ? (
          <XIcon
            className="w-3 h-3 text-neutral-400 hover:text-neutral-700 shrink-0"
            onClick={clear}
          />
        ) : (
          <ChevronDownIcon
            className={`w-3 h-3 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <ul
            role="listbox"
            aria-label="Select department"
            className="absolute left-0 top-full mt-1.5 z-20 min-w-72 bg-white rounded-xl border border-neutral-200 shadow-lg py-1 overflow-hidden"
          >
            {departments.map((dept) => (
              <li
                key={dept}
                role="option"
                aria-selected={selected === dept}
                onClick={() => { onSelect(dept); setOpen(false) }}
                className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                  selected === dept
                    ? "bg-[#800000]/8 text-[#800000] font-semibold"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {dept}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
})

export { DepartmentFilter }
