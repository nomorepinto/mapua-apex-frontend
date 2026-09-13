import type { OrgStatus } from "@/lib/types"

const COLOR_MAP: Record<OrgStatus, string> = {
  Active: "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Pending Registration": "bg-amber-100 text-amber-800 border-amber-300",
  Inactive: "bg-neutral-100 text-neutral-600 border-neutral-300",
}

export function StatusBadge({ status }: { status: OrgStatus }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${COLOR_MAP[status]}`}
    >
      {status}
    </span>
  )
}
