import { Link } from "react-router"
import {
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSessionStore } from "@/stores/session-store"

export function Dashboard() {
  const name = useSessionStore((state) => state.name)

  const stats = [
    {
      label: "Pending Proposals",
      value: "4",
      change: "+2 this week",
      icon: ClockIcon,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      label: "Approved Activities",
      value: "18",
      change: "Active academic term",
      icon: CheckCircleIcon,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Needs Revision",
      value: "1",
      change: "Action required",
      icon: AlertTriangleIcon,
      color: "text-red-600 bg-red-50 border-red-200",
    },
    {
      label: "Total Submissions",
      value: "23",
      change: "AY 2026 - 2027",
      icon: FileTextIcon,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
  ]

  const recentActivities: Array<{
    id: string;
    title: string;
    org: string;
    date: string;
    type: string;
    status: string;
    statusColor: string;
  }> = []

  return (
    <div className="w-full min-h-full bg-[#F3F4F6] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-linear-to-r from-[#D9291C] to-[#991B1B] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {name || "Student Leader"}! 👋
            </h1>
            <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-xl">
              Mapúa Activity Proposal & Execution System (APEX) — Submit proposals, track signatory endorsements, and manage venue reservations.
            </p>
          </div>
          <Link
            to="/submission"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#D9291C] hover:bg-neutral-100 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create New SAAF</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">
                    {stat.label}
                  </span>
                  <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block">
                    {stat.value}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Submissions Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Recent Activity Proposals
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Overview of submitted applications for AY 2026-2027
              </p>
            </div>
            <Link
              to="/submission"
              className="text-xs font-semibold text-red-800 hover:text-red-900 flex items-center gap-1 hover:underline"
            >
              <span>Submit New</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Proposal ID</th>
                  <th className="py-3.5 px-6">Activity Title</th>
                  <th className="py-3.5 px-6">Organization</th>
                  <th className="py-3.5 px-6">Target Date</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {recentActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm font-semibold text-neutral-400">
                      No recent activity
                    </td>
                  </tr>
                ) : (
                  recentActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-xs font-medium text-neutral-600">
                        {activity.id}
                      </td>
                      <td className="py-4 px-6 font-semibold text-neutral-900">
                        {activity.title}
                      </td>
                      <td className="py-4 px-6 text-neutral-700 text-xs">
                        {activity.org}
                      </td>
                      <td className="py-4 px-6 text-neutral-600 text-xs flex items-center gap-1.5 pt-4">
                        <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{activity.date}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium">
                          {activity.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${activity.statusColor}`}
                        >
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
