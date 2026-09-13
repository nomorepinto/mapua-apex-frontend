import { getStatusTextColor } from "@/lib/progress-color"
import type { Appeal } from "@/components/org-dashboard/types"

export function ProjectStatusTable({
  appeals,
  onViewAll,
}: {
  appeals: Appeal[]
  onViewAll: () => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm md:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1E293B]">Project Status</h2>
        <button
          onClick={onViewAll}
          className="cursor-pointer text-xs font-bold text-[#D9291C] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-xs font-bold tracking-wider text-[#94A3B8] uppercase">
              <th className="pr-6 pb-3 font-bold">APPEAL ID</th>
              <th className="pr-6 pb-3 font-bold">PURPOSE / EVENT TITLE</th>
              <th className="pr-6 pb-3 text-right font-bold">SUBMITTED DATE</th>
              <th className="pr-6 pb-3 font-bold">DEPARTMENT</th>
              <th className="pb-3 font-bold">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {appeals.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm text-[#94A3B8]"
                >
                  No project status records are available yet.
                </td>
              </tr>
            ) : (
            appeals.slice(0, 3).map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer transition-colors hover:bg-neutral-50/50"
                onClick={onViewAll}
              >
                <td className="py-3.5 pr-6 font-mono text-sm font-bold whitespace-nowrap text-[#1E293B]">
                  {item.id}
                </td>
                <td className="py-3.5 pr-6 text-sm font-medium text-[#64748B]">
                  {item.title}
                </td>
                <td className="py-3.5 pr-6 text-right text-sm whitespace-nowrap text-[#64748B]">
                  {item.date}
                </td>
                <td className="py-3.5 pr-6 text-sm text-[#64748B]">
                  {item.department}
                </td>
                <td className="py-3.5 whitespace-nowrap">
                  <span
                    className={`text-xs font-bold ${getStatusTextColor(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
