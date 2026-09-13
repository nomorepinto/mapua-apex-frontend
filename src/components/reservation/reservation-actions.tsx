import { DownloadIcon } from "lucide-react"

export function ReservationActions({
  onSavePdf,
  onGoBack,
}: {
  onSavePdf: () => void
  onGoBack: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onSavePdf}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 shadow-xs transition-colors hover:bg-neutral-50"
      >
        <DownloadIcon className="h-3.5 w-3.5" />
        Save as PDF
      </button>
      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-[#0B6623] px-8 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#084D1A]"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={onGoBack}
        className="cursor-pointer rounded-lg bg-[#990000] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#7a0000]"
      >
        Go Back to Other Page
      </button>
    </div>
  )
}
