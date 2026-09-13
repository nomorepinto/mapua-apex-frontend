import { memo } from "react"
import type { StatItem } from "./activity.data"

// ─── StatCard ─────────────────────────────────────────────────────────────────
// memo() prevents re-renders when parent Dashboard re-renders (rerender-memo)

const StatCard = memo(function StatCard({ label, value }: StatItem) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4 transition-all hover:shadow-xs hover:border-neutral-300/80">
      <span className="block text-xs sm:text-sm font-semibold text-neutral-600 leading-tight">
        {label}
      </span>
      <div>
        <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight font-sans">
          {value}
        </span>
      </div>
    </div>
  )
})

export { StatCard }
