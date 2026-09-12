import { memo } from "react"
import type { StatItem } from "./activity.data"

// ─── StatCard ─────────────────────────────────────────────────────────────────
// memo() prevents re-renders when parent Dashboard re-renders (rerender-memo)

const badgeStyles = {
  amber: "bg-orange-50 text-orange-600 border-orange-200/60",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  rose: "bg-red-50 text-red-600 border-red-200/60",
  neutral: "bg-neutral-100 text-neutral-600 border-neutral-200/60",
} as const

const StatCard = memo(function StatCard({
  label,
  value,
  badgeText,
  badgeVariant,
}: StatItem) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4 transition-all hover:shadow-xs hover:border-neutral-300/80">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs sm:text-sm font-semibold text-neutral-600 leading-tight">
          {label}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border shrink-0 ${
            badgeStyles[badgeVariant]
          }`}
        >
          {badgeText}
        </span>
      </div>
      <div>
        <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight font-sans">
          {value}
        </span>
      </div>
    </div>
  )
})

export { StatCard }
