import { CheckCircle } from "lucide-react"

import { useMilestoneStats } from "@/hooks/use-milestone-stats"
import type { Task } from "@/components/org-dashboard/types"

export function MilestonePreview({
  tasks,
  onViewAll,
}: {
  tasks: Task[]
  onViewAll: () => void
}) {
  const { progressPercent, progressColor } = useMilestoneStats(tasks)

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm md:p-7">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1E293B]">
          APEX Tech Semestral Milestone
        </h2>
        <div className="flex items-center gap-3">
          <div className="h-2 w-36 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
          <span
            className="text-xs font-bold transition-colors duration-500 sm:text-sm"
            style={{ color: progressColor }}
          >
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">
            No milestone tasks are available yet.
          </p>
        ) : (
        tasks.slice(0, 3).map((task, index) => {
          const isCompleted = task.status === "Completed"
          const isInProgress = task.status === "In Progress"

          return (
            <div key={task.id} className="flex items-center gap-3.5">
              {isCompleted ? (
                <CheckCircle className="h-5.5 w-5.5 shrink-0 fill-[#10B981] stroke-white text-[#10B981]" />
              ) : (
                <div
                  className={`h-5.5 w-5.5 flex shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    isInProgress
                      ? "border-[#F59E0B] text-[#F59E0B]"
                      : "border-neutral-300 text-neutral-400"
                  }`}
                >
                  {index + 1}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-sm font-bold ${
                      isInProgress ? "text-[#F59E0B]" : "text-[#1E293B]"
                    }`}
                  >
                    {task.title}
                  </h4>
                  {isInProgress ? (
                    <span className="rounded bg-[#FFFBEB] px-1.5 py-0.5 text-[10px] font-bold text-[#F59E0B]">
                      In Review
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-[#94A3B8]">
                  {isCompleted
                    ? `Completed ${task.dueDate}`
                    : `Due ${task.dueDate}`}
                </p>
              </div>
            </div>
          )
        })
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onViewAll}
          className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#D9291C] hover:underline sm:text-sm"
        >
          View all &rarr;
        </button>
      </div>
    </div>
  )
}
