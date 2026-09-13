import { CheckIcon } from "lucide-react"

export function SuccessModal({
  open,
  title,
  actionLabel,
  onAction,
}: {
  open: boolean
  title: string
  actionLabel: string
  onAction: () => void
}) {
  if (!open) return null

  return (
    <div
      onClick={onAction}
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in zoom-in-95 flex min-h-[190px] w-[380px] flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-2xl duration-150"
      >
        <div className="flex items-center justify-center bg-[#333333] py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#52A41C] shadow-md">
            <CheckIcon className="h-8 w-8 stroke-[3.5] text-white" />
          </div>
        </div>

        <div className="space-y-3 px-6 py-4 text-center">
          <h3 className="text-base font-bold text-neutral-900">{title}</h3>
          <button
            type="button"
            onClick={onAction}
            className="w-full cursor-pointer rounded-xl bg-neutral-900 py-2 text-xs font-semibold text-white transition-all hover:bg-black"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
