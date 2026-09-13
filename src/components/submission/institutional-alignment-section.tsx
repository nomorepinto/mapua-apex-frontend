import { MISSION_STATEMENTS } from "@/components/submission/constants"
import type { SaafDraft } from "@/components/submission/types"
import { Textarea } from "@/components/ui/textarea"

type AlignmentFields = Pick<
  SaafDraft,
  | "mission1"
  | "mission2"
  | "mission3"
  | "coreValuesExplanation"
  | "peoExplanation"
  | "sdgExplanation"
>

export function InstitutionalAlignmentSection({
  values,
  onChange,
}: {
  values: AlignmentFields
  onChange: <K extends keyof SaafDraft>(key: K, value: SaafDraft[K]) => void
}) {
  return (
    <div className="space-y-6 pt-4">
      <div className="border-b border-neutral-200 pb-2">
        <h2 className="text-base font-bold tracking-wide text-neutral-900 uppercase">
          ALIGNMENT WITH INSTITUTIONAL VISION, MISSION AND FORMATION GOALS:
        </h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-neutral-800">
          Check the mission statement(s) satisfied by the nature of your activity.
        </p>

        <div className="space-y-3 pl-1">
          {MISSION_STATEMENTS.map((mission) => {
            const checked = values[mission.key]
            return (
              <label
                key={mission.key}
                className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-neutral-800 select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(mission.key, e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border border-neutral-400 text-red-700 accent-red-700 focus:ring-red-700"
                />
                <span>{mission.text}</span>
                <input
                  type="hidden"
                  name={mission.name}
                  value={checked ? "true" : "false"}
                />
              </label>
            )
          })}
        </div>

        <div className="space-y-1.5 pt-3">
          <label className="block text-sm font-semibold text-neutral-900">
            Enumerate and briefly explain the applicable Mapua Core Values honed
            or formed by reason of your activity
          </label>
          <p className="text-xs font-normal text-neutral-500">
            (Discipline, Excellence, Commitment, Integrity and Relevance){" "}
            <span className="text-red-500">*</span>
          </p>
          <Textarea
            name="coreValuesExplanation"
            value={values.coreValuesExplanation}
            onChange={(e) => onChange("coreValuesExplanation", e.target.value)}
            placeholder="Discuss how the activity fosters these core values..."
            rows={4}
            style={{ color: "#171717" }}
            className="mt-1 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="block text-sm font-semibold text-neutral-900">
            If and when applicable, enumerate the Program Educational Objectives
            (PEO) or Program Objectives (PO) Satisfied in this Activity{" "}
            <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="peoExplanation"
            value={values.peoExplanation}
            onChange={(e) => onChange("peoExplanation", e.target.value)}
            placeholder="Indicate which academic objectives are satisfied..."
            rows={4}
            style={{ color: "#171717" }}
            className="mt-1 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="block text-sm font-semibold text-neutral-900">
            Include the United Nation Sustainability Goals and How is the
            Organization going to implement, and Audit the impact{" "}
            <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="sdgExplanation"
            value={values.sdgExplanation}
            onChange={(e) => onChange("sdgExplanation", e.target.value)}
            placeholder="Specify targeted SDGs and your audit methodology..."
            rows={4}
            style={{ color: "#171717" }}
            className="mt-1 rounded-lg border-neutral-300 bg-white text-sm !text-neutral-900 placeholder:text-neutral-400"
            required
          />
        </div>
      </div>
    </div>
  )
}
