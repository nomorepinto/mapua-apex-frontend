import { EQUIPMENT_OPTIONS } from "@/components/reservation/constants"
import type { EquipmentFlags } from "@/components/reservation/types"

export function EquipmentSection({
  equipment,
  otherEquipmentText,
  onToggle,
  onOtherTextChange,
}: {
  equipment: EquipmentFlags
  otherEquipmentText: string
  onToggle: (key: keyof EquipmentFlags, checked: boolean) => void
  onOtherTextChange: (value: string) => void
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-neutral-900">Equipment Requested:</p>
      <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-2.5 text-xs text-neutral-800 sm:grid-cols-2">
        {EQUIPMENT_OPTIONS.map((option) => (
          <label
            key={option.key}
            className="flex min-h-11 cursor-pointer items-center gap-2 select-none"
          >
            <input
              type="checkbox"
              checked={equipment[option.key]}
              onChange={(e) => onToggle(option.key, e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-neutral-400 text-red-700 accent-red-700 focus:ring-red-700"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-1 text-xs text-neutral-800 sm:flex-row sm:items-center">
        <label className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={equipment.others}
            onChange={(e) => onToggle("others", e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-neutral-400 text-red-700 accent-red-700 focus:ring-red-700"
          />
          <span>Others (please indicate):</span>
        </label>
        <input
          type="text"
          placeholder="Label"
          value={otherEquipmentText}
          onChange={(e) => onOtherTextChange(e.target.value)}
          style={{ color: "#171717" }}
          className="w-full max-w-md border-b border-dashed border-neutral-400 bg-transparent px-1 py-0.5 text-xs !text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-700 focus:outline-none"
        />
      </div>
    </div>
  )
}
