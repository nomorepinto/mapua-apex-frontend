import { layout } from "@/config"
import { cn } from "@/lib/utils"

export const SAAF_STEPS = [
  { id: "classification", label: "Classification" },
  { id: "people", label: "People" },
  { id: "activity", label: "Activity" },
  { id: "alignment", label: "Alignment & budget" },
] as const

export type SaafStepIndex = 0 | 1 | 2 | 3

export function SaafStepper({
  step,
  eventTitle,
}: {
  step: SaafStepIndex
  eventTitle?: string
}) {
  return (
    <div className="space-y-3">
      {eventTitle ? (
        <p className="text-sm font-semibold text-neutral-800">
          {eventTitle}
        </p>
      ) : null}
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SAAF_STEPS.map((item, index) => {
          const active = index === step
          const done = index < step
          return (
            <li key={item.id}>
              <div
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2",
                  active && "border-[#8B0000] bg-[#8B0000] text-white",
                  done && "border-[#8B0000]/30 bg-[#8B0000]/5 text-[#8B0000]",
                  !active && !done && "border-neutral-200 bg-white text-neutral-600",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    active && "bg-white text-[#8B0000]",
                    done && "bg-[#8B0000] text-white",
                    !active && !done && "bg-neutral-100 text-neutral-600",
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-semibold leading-tight">
                  {item.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
      <p className={layout.pageSubtitle}>
        Step {step + 1} of {SAAF_STEPS.length} · {SAAF_STEPS[step].label}
      </p>
    </div>
  )
}
