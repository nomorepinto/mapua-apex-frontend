import { Trash2Icon } from "lucide-react"

import {
  PRESET_ROOMS,
  PURPOSE_INPUT_CLASS,
  TABLE_INPUT_CLASS,
} from "@/components/reservation/constants"
import type { RoomItem } from "@/components/reservation/types"

export function RoomTable({
  purpose,
  items,
  onPurposeChange,
  onUpdate,
  onRemove,
}: {
  purpose: string
  items: RoomItem[]
  onPurposeChange: (value: string) => void
  onUpdate: (id: string, field: keyof RoomItem, value: string) => void
  onRemove: (id: string) => void
}) {
  const canRemove = items.length > 1

  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-neutral-800">
          Function Room <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => onPurposeChange(e.target.value)}
          placeholder="Write the title of Exhibit, Event, etc."
          style={{ color: "#171717" }}
          className={PURPOSE_INPUT_CLASS}
          required
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50/80 text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                <th className="w-48 border-r border-neutral-300 px-4 py-3 text-center">
                  Date Needed
                </th>
                <th className="w-40 border-r border-neutral-300 px-4 py-3 text-center">
                  Time Needed
                </th>
                <th className="w-56 border-r border-neutral-300 px-4 py-3 text-center">
                  Room Needed
                </th>
                <th className="px-4 py-3 text-center">Remarks</th>
                {canRemove ? <th className="w-12 px-2 py-3 text-center" /> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {items.map((item) => {
                const isDefaultPreset = PRESET_ROOMS.has(item.roomNeeded)
                return (
                  <tr key={item.id} className="hover:bg-neutral-50/60">
                    <td className="border-r border-neutral-300 p-2">
                      <input
                        type="date"
                        value={item.dateNeeded}
                        onChange={(e) =>
                          onUpdate(item.id, "dateNeeded", e.target.value)
                        }
                        style={{ color: "#171717" }}
                        className={`${TABLE_INPUT_CLASS} cursor-pointer`}
                      />
                    </td>
                    <td className="border-r border-neutral-300 p-2">
                      <input
                        type="time"
                        value={item.timeNeeded}
                        onChange={(e) =>
                          onUpdate(item.id, "timeNeeded", e.target.value)
                        }
                        style={{ color: "#171717" }}
                        className={`${TABLE_INPUT_CLASS} cursor-pointer`}
                      />
                    </td>
                    <td className="border-r border-neutral-300 p-2 text-center text-sm font-medium !text-neutral-900">
                      {isDefaultPreset ? (
                        <span>{item.roomNeeded}</span>
                      ) : (
                        <input
                          type="text"
                          value={item.roomNeeded}
                          placeholder="Specify room..."
                          onChange={(e) =>
                            onUpdate(item.id, "roomNeeded", e.target.value)
                          }
                          style={{ color: "#171717" }}
                          className={`${TABLE_INPUT_CLASS} font-medium`}
                        />
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.remarks}
                        placeholder="Enter remarks..."
                        onChange={(e) =>
                          onUpdate(item.id, "remarks", e.target.value)
                        }
                        style={{ color: "#171717" }}
                        className={`${TABLE_INPUT_CLASS} placeholder:text-neutral-400`}
                      />
                    </td>
                    {canRemove ? (
                      <td className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="cursor-pointer rounded p-1 text-neutral-400 transition-colors hover:text-red-600"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    ) : null}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
