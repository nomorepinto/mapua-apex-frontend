import { useState, useEffect, useCallback } from "react"
import {
  DownloadIcon,
  BuildingIcon,
  FileTextIcon,
  GaugeIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ScrollTextIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAdminOsaStore, type AuditLogEntry } from "@/stores/admin-osa-store"
import type { OrgStatus, Announcement } from "@/lib/types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAuditTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

const AUDIT_ACTION_CONFIG: Record<
  AuditLogEntry["action"],
  { label: string; icon: typeof CheckCircleIcon; color: string }
> = {
  submission_created: {
    label: "Submission Created",
    icon: PlusIcon,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  submission_approved: {
    label: "Approved",
    icon: CheckCircleIcon,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  submission_denied: {
    label: "Denied / Returned",
    icon: AlertTriangleIcon,
    color: "text-red-600 bg-red-50 border-red-200",
  },
  account_updated: {
    label: "Account Updated",
    icon: PencilIcon,
    color: "text-violet-600 bg-violet-50 border-violet-200",
  },
  announcement_created: {
    label: "Announcement",
    icon: FileTextIcon,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  status_changed: {
    label: "Status Changed",
    icon: ClockIcon,
    color: "text-orange-600 bg-orange-50 border-orange-200",
  },
}

function exportAuditLogCsv(
  logs: AuditLogEntry[],
  orgNameMap: Map<string, string>
) {
  const header = "Timestamp,Action,Actor,Organization,Description"
  const rows = logs.map((log) => {
    const orgName = log.orgId
      ? (orgNameMap.get(log.orgId) ?? log.orgId)
      : "System"
    const escaped = (s: string) => `"${s.replace(/"/g, '""')}"`
    return [
      escaped(formatAuditTimestamp(log.timestamp)),
      escaped(AUDIT_ACTION_CONFIG[log.action].label),
      escaped(log.actor),
      escaped(orgName),
      escaped(log.description),
    ].join(",")
  })

  const csv = [header, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `apex_system_audit_log_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrgStatus }) {
  const colorMap: Record<OrgStatus, string> = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-300",
    "Pending Registration": "bg-amber-100 text-amber-800 border-amber-300",
    Inactive: "bg-neutral-100 text-neutral-600 border-neutral-300",
  }

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${colorMap[status]}`}
    >
      {status}
    </span>
  )
}

// ─── Announcement Modal (Create / Edit) ──────────────────────────────────────

function AnnouncementModal({
  open,
  onClose,
  onSubmit,
  mode,
  initialTitle,
  initialMessage,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (title: string, message: string) => void
  mode: "create" | "edit"
  initialTitle?: string
  initialMessage?: string
}) {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (open) {
      setTitle(initialTitle ?? "")
      setMessage(initialMessage ?? "")
    }
  }, [open, initialTitle, initialMessage])

  if (!open) return null

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) return
    onSubmit(title.trim(), message.trim())
    setTitle("")
    setMessage("")
  }

  const isEdit = mode === "edit"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 w-full max-w-[797px] overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* ── Dark Header ─────────────────────────────────────────── */}
        <div className="space-y-2 bg-[#2D2D2D] px-6 py-5">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? "Edit Announcement" : "Announcement"}
          </h3>
          <p className="text-sm font-medium text-[#FBC02D]">
            Reflected: From Office of the Student Affairs and Alumni Relations
          </p>
          <span className="inline-block rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            This will reflect to all Organizations and Student Council Dashboard
          </span>
        </div>

        {/* ── Form Body ───────────────────────────────────────────── */}
        <div className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">
              {isEdit ? "Edit Title" : "Create Title"}{" "}
              <span className="text-red-600">*</span>
            </label>
            <Input
              placeholder="Label"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border-neutral-300 focus:border-red-800 focus:ring-red-800/20 [&_input]:!text-neutral-900 [&_input]:placeholder:!text-neutral-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-900">
              {isEdit ? "Edit the Message" : "Encode the Message"}{" "}
              <span className="text-red-600">*</span>
            </label>
            <Textarea
              placeholder="Label"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-y rounded-lg border-neutral-300 focus:border-red-800 focus:ring-red-800/20 [&_textarea]:!text-neutral-900 [&_textarea]:placeholder:!text-neutral-400"
            />
          </div>
        </div>

        {/* ── Footer Buttons (stacked, right-aligned) ─────────────── */}
        <div className="flex flex-col items-end gap-2 px-6 pb-5">
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !message.trim()}
            className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEdit ? "Save Announcement" : "Post Announcement"}
          </Button>
          <Button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700"
          >
            Cancel Action
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Audit Log Modal ─────────────────────────────────────────────────────────

function AuditLogModal({
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
                <h3 className="text-lg font-bold text-neutral-900">
                  Audit Logs
                </h3>
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
                No audit log entries for this organization.
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

// ─── Main Component ──────────────────────────────────────────────────────────

export function AdminOsaPanel() {
  // ── Pull everything from the Zustand store ──
  const orgViews = useAdminOsaStore((s) => s.orgViews)
  const metrics = useAdminOsaStore((s) => s.metrics)
  const announcements = useAdminOsaStore((s) => s.announcements)
  const createAnnouncement = useAdminOsaStore((s) => s.createAnnouncement)
  const updateAnnouncement = useAdminOsaStore((s) => s.updateAnnouncement)
  const deleteAnnouncement = useAdminOsaStore((s) => s.deleteAnnouncement)
  const getAuditLogsForOrg = useAdminOsaStore((s) => s.getAuditLogsForOrg)
  const getAllAuditLogs = useAdminOsaStore((s) => s.getAllAuditLogs)

  // ── Local UI state (modal visibility, not business data) ──
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementModalMode, setAnnouncementModalMode] = useState<
    "create" | "edit"
  >("create")
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<
    string | null
  >(null)
  const [editInitialTitle, setEditInitialTitle] = useState("")
  const [editInitialMessage, setEditInitialMessage] = useState("")

  const [showAuditLogModal, setShowAuditLogModal] = useState(false)
  const [auditLogOrgId, setAuditLogOrgId] = useState<string | null>(null)
  const [auditLogOrgName, setAuditLogOrgName] = useState("")

  // ── Handlers ──

  const handleOpenCreateModal = useCallback(() => {
    setAnnouncementModalMode("create")
    setEditingAnnouncementId(null)
    setEditInitialTitle("")
    setEditInitialMessage("")
    setShowAnnouncementModal(true)
  }, [])

  const handleOpenEditModal = useCallback((announcement: Announcement) => {
    setAnnouncementModalMode("edit")
    setEditingAnnouncementId(announcement.id)
    setEditInitialTitle(announcement.title)
    setEditInitialMessage(announcement.title)
    setShowAnnouncementModal(true)
  }, [])

  const handleAnnouncementSubmit = useCallback(
    (title: string, _message: string) => {
      if (announcementModalMode === "edit" && editingAnnouncementId) {
        updateAnnouncement(editingAnnouncementId, title)
      } else {
        createAnnouncement(title)
      }
      setShowAnnouncementModal(false)
    },
    [
      announcementModalMode,
      editingAnnouncementId,
      updateAnnouncement,
      createAnnouncement,
    ]
  )

  const handleOpenAuditLog = useCallback((orgId: string, orgName: string) => {
    setAuditLogOrgId(orgId)
    setAuditLogOrgName(orgName)
    setShowAuditLogModal(true)
  }, [])

  const filteredAuditLogs = auditLogOrgId
    ? getAuditLogsForOrg(auditLogOrgId)
    : []

  const handleExportAuditLog = useCallback(() => {
    const orgNameMap = new Map(orgViews.map((o) => [o.id, o.name]))
    exportAuditLogCsv(getAllAuditLogs(), orgNameMap)
  }, [orgViews, getAllAuditLogs])

  const statCards = [
    {
      label: "Active Organizations",
      value: String(metrics.activeOrganizations),
      change: metrics.activeOrganizationsChange,
      icon: BuildingIcon,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      changeColor: "text-emerald-600",
    },
    {
      label: "Total Active Submissions",
      value: metrics.totalActiveSubmissions.toLocaleString(),
      change: metrics.totalActiveSubmissionsNote,
      icon: FileTextIcon,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      changeColor: "text-neutral-500",
    },
    {
      label: "Approval SLA Rate",
      value: `${metrics.approvalSlaRate}%`,
      change: metrics.approvalSlaTurnaround,
      icon: GaugeIcon,
      color: "text-violet-600 bg-violet-50 border-violet-200",
      changeColor: "text-neutral-500",
    },
  ]

  const reviewStatCards = [
    {
      label: "Pending Review",
      value: "07",
      badge: "Action Required",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    },
    {
      label: "Total Approved",
      value: "42",
      badge: "Authorized",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      label: "Returned for Revision",
      value: "04",
      badge: "Needs Edits",
      badgeColor: "bg-red-100 text-red-800 border-red-300",
    },
    {
      label: "Total Reviewed",
      value: "53",
      badge: "Term Cumulative",
      badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-300",
    },
  ]

  return (
    <div className="min-h-full w-full bg-[#F3F4F6] px-4 py-8 text-neutral-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Admin Panel — Office of Student Affairs
            </h1>
            <p className="mt-1 text-xs font-normal text-neutral-500 sm:text-sm">
              Global administration console for student organizations, activity
              audit logs, and status triggers.
            </p>
          </div>

          <Button
            onClick={handleExportAuditLog}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#800000] px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-[#660000]"
          >
            <DownloadIcon className="h-4 w-4" />
            <span>Export System Audit Log</span>
          </Button>
        </div>

        {/* ── Registered Student Organization Accounts ────────────── */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xs">
          <div className="border-b border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900">
              Registered Student Organization Accounts
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                  <th className="px-6 py-3.5">Organization Name</th>
                  <th className="px-6 py-3.5">Adviser</th>
                  <th className="px-6 py-3.5">Representative</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-150 divide-y">
                {orgViews.map((org) => (
                  <tr
                    key={org.id}
                    className="transition-colors hover:bg-neutral-50/70"
                  >
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      {org.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-700">
                      {org.adviser}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-700">
                      {org.representative}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={org.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="cursor-pointer rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
                        >
                          Manage Account
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAuditLog(org.id, org.name)}
                          className="cursor-pointer rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
                        >
                          Audit Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Institution-wide Metrics & Performance ──────────────── */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-neutral-900">
            Institution-wide Metrics & Performance
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statCards.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                      {stat.label}
                    </span>
                    <div className={`rounded-xl border p-2 ${stat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-neutral-900">
                      {stat.value}
                    </span>
                    <p
                      className={`mt-1 text-xs font-medium ${stat.changeColor}`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {reviewStatCards.map((stat, i) => (
              <div
                key={i}
                className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-600">
                    {stat.label}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${stat.badgeColor}`}
                  >
                    {stat.badge}
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Current Announcements ───────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xs">
          <div className="border-b border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900">
              Current Announcements
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Time</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-neutral-150 divide-y">
                {announcements.map((announcement) => (
                  <tr
                    key={announcement.id}
                    className="transition-colors hover:bg-neutral-50/70"
                  >
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      {announcement.title}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-700">
                      {announcement.date}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-700">
                      {announcement.time}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(announcement)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          <PencilIcon className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                        >
                          <Trash2Icon className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-neutral-200 p-6">
            <Button
              onClick={handleOpenCreateModal}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#800000] px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-[#660000]"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Create Announcement</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────── */}
      <AnnouncementModal
        open={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        onSubmit={handleAnnouncementSubmit}
        mode={announcementModalMode}
        initialTitle={editInitialTitle}
        initialMessage={editInitialMessage}
      />

      <AuditLogModal
        open={showAuditLogModal}
        onClose={() => setShowAuditLogModal(false)}
        orgName={auditLogOrgName}
        logs={filteredAuditLogs}
      />
    </div>
  )
}
