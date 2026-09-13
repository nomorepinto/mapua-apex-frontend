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
    <div className="flex flex-col items-stretch justify-end gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center">
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onSavePdf}
          className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 shadow-xs transition-colors hover:bg-neutral-50 sm:h-10 sm:w-auto"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          Save as PDF
        </button>
        {showNextPage ? (
          <Button
            type="button"
            onClick={onNextPage}
            className="h-11 w-full min-w-36 cursor-pointer rounded-lg bg-[#242424] px-10 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black sm:h-10 sm:w-auto"
          >
            Next page
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-11 w-full min-w-36 cursor-pointer rounded-lg bg-[#0B6623] px-10 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#084D1A] sm:h-10 sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  )
}
