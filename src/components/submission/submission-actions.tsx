import { DownloadIcon } from "lucide-react"
import type { MouseEvent } from "react"

import { Button } from "@/components/ui/button"

export function SubmissionActions({
  isSubmitting,
  showNextPage,
  onNextPage,
  onSavePdf,
  onSubmit,
}: {
  isSubmitting: boolean
  showNextPage: boolean
  onNextPage: () => void
  onSavePdf: () => void
  onSubmit: (e: MouseEvent) => void
}) {
  return (
    <div className="flex flex-col items-start justify-end gap-6 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center">
      <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
        <button
          type="button"
          onClick={onSavePdf}
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 shadow-xs transition-colors hover:bg-neutral-50"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          Save as PDF
        </button>
        {showNextPage ? (
          <Button
            type="button"
            onClick={onNextPage}
            className="h-10 min-w-36 cursor-pointer rounded-lg bg-[#242424] px-10 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black"
          >
            Next page
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-10 min-w-36 cursor-pointer rounded-lg bg-[#0B6623] px-10 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#084D1A]"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  )
}
