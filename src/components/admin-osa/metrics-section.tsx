import {
  BuildingIcon,
  FileTextIcon,
  GaugeIcon,
} from "lucide-react"

import type { InstitutionMetrics } from "@/lib/types"

const REVIEW_STAT_CARDS = [
  {
    label: "Pending Review",
    value: "07",
    badge: "Action Required",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    label: "Total Approved",
    value: "42",
    badge: "Authorized",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    label: "Returned for Revision",
    value: "04",
    badge: "Needs Edits",
    badgeColor: "bg-red-100 text-red-800 border-red-300",
  },
  {
    label: "Total Reviewed",
    value: "53",
    badge: "Term Cumulative",
    badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-300",
  },
] as const

export function MetricsSection({ metrics }: { metrics: InstitutionMetrics }) {
  const statCards = [
    {
      label: "Active Organizations",
      value: String(metrics.activeOrganizations),
      change: metrics.activeOrganizationsChange,
      icon: BuildingIcon,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      changeColor: "text-emerald-600",
    },
    {
      label: "Total Active Submissions",
      value: metrics.totalActiveSubmissions.toLocaleString(),
      change: metrics.totalActiveSubmissionsNote,
      icon: FileTextIcon,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      changeColor: "text-neutral-500",
    },
    {
      label: "Approval SLA Rate",
      value: `${metrics.approvalSlaRate}%`,
      change: metrics.approvalSlaTurnaround,
      icon: GaugeIcon,
      color: "text-violet-600 bg-violet-50 border-violet-200",
      changeColor: "text-neutral-500",
    },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-neutral-900">
        Institution-wide Metrics & Performance
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  {stat.label}
                </span>
                <div className={`rounded-xl border p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-neutral-900">
                  {stat.value}
                </span>
                <p className={`mt-1 text-xs font-medium ${stat.changeColor}`}>
                  {stat.change}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {REVIEW_STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600">
                {stat.label}
              </span>
              <span
                className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${stat.badgeColor}`}
              >
                {stat.badge}
              </span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
