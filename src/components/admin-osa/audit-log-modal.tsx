import { ScrollTextIcon, XIcon } from "lucide-react"

import {
  AUDIT_ACTION_CONFIG,
  formatAuditTimestamp,
} from "@/components/admin-osa/audit"
import { Button } from "@/components/ui/button"
import type { AuditLogEntry } from "@/components/admin-osa/audit"

export function AuditLogModal({
  open,
  onClose,
  orgName,
  logs,
}: {
  open: boolean
  onClose: () => void
  orgName: string
  logs: AuditLogEntry[]
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="shrink-0 border-b border-neutral-200 px-6 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-2">
                <ScrollTextIcon className="h-4 w-4 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Audit Logs</h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {orgName} — Activity history
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {logs.length === 0 ? (
            <div className="py-12 text-center">
              <ScrollTextIcon className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
              <p className="text-sm text-neutral-500">
                No audit records are available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const config = AUDIT_ACTION_CONFIG[log.action]
                const Icon = config.icon
                return (
                  <div
                    key={log.id}
                    className="flex gap-3 rounded-xl border border-neutral-100 p-3 transition-colors hover:border-neutral-200 hover:bg-neutral-50/50"
                  >
                    <div
                      className={`h-fit shrink-0 rounded-lg border p-2 ${config.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-neutral-900">
                          {config.label}
                        </span>
                        <span className="text-[11px] font-medium whitespace-nowrap text-neutral-400">
                          {formatAuditTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-600">
                        {log.description}
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-400">
                        by {log.actor}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t border-neutral-200 px-6 py-4">
          <Button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-100 px-5 py-2.5 font-semibold text-neutral-700 transition-all hover:bg-neutral-200"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
