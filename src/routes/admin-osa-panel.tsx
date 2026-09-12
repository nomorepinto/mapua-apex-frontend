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

const AUDIT_ACTION_CONFIG: Record<AuditLogEntry["action"], { label: string; icon: typeof CheckCircleIcon; color: string }> = {
  submission_created: { label: "Submission Created", icon: PlusIcon, color: "text-blue-600 bg-blue-50 border-blue-200" },
  submission_approved: { label: "Approved", icon: CheckCircleIcon, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  submission_denied: { label: "Denied / Returned", icon: AlertTriangleIcon, color: "text-red-600 bg-red-50 border-red-200" },
  account_updated: { label: "Account Updated", icon: PencilIcon, color: "text-violet-600 bg-violet-50 border-violet-200" },
  announcement_created: { label: "Announcement", icon: FileTextIcon, color: "text-amber-600 bg-amber-50 border-amber-200" },
  status_changed: { label: "Status Changed", icon: ClockIcon, color: "text-orange-600 bg-orange-50 border-orange-200" },
}

function exportAuditLogCsv(logs: AuditLogEntry[], orgNameMap: Map<string, string>) {
  const header = "Timestamp,Action,Actor,Organization,Description"
  const rows = logs.map((log) => {
    const orgName = log.orgId ? orgNameMap.get(log.orgId) ?? log.orgId : "System"
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
      className={`text-xs px-2.5 py-1 rounded-full border font-semibold whitespace-nowrap ${colorMap[status]}`}
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[797px] mx-4 overflow-hidden">
        {/* ── Dark Header ─────────────────────────────────────────── */}
        <div className="bg-[#2D2D2D] px-6 py-5 space-y-2">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? "Edit Announcement" : "Announcement"}
          </h3>
          <p className="text-sm text-[#FBC02D] font-medium">
            Reflected: From Office of the Student Affairs and Alumni Relations
          </p>
          <span className="inline-block text-xs font-semibold text-white bg-red-600 px-2.5 py-1 rounded">
            This will reflect to all Organizations and Student Council Dashboard
          </span>
        </div>

        {/* ── Form Body ───────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-4">
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
              className="rounded-lg border-neutral-300 focus:border-red-800 focus:ring-red-800/20 resize-y [&_textarea]:!text-neutral-900 [&_textarea]:placeholder:!text-neutral-400"
            />
          </div>
        </div>

        {/* ── Footer Buttons (stacked, right-aligned) ─────────────── */}
        <div className="px-6 pb-5 flex flex-col items-end gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !message.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isEdit ? "Save Announcement" : "Post Announcement"}
          </Button>
          <Button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer text-sm"
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[80vh] flex flex-col">
        <div className="px-6 pt-5 pb-4 border-b border-neutral-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200">
                <ScrollTextIcon className="w-4 h-4 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Audit Logs</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {orgName} — Activity history
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <ScrollTextIcon className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
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
                    className="flex gap-3 p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg border shrink-0 h-fit ${config.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-neutral-900">{config.label}</span>
                        <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">
                          {formatAuditTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5">{log.description}</p>
                      <p className="text-[11px] text-neutral-400 mt-1">by {log.actor}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-neutral-200 shrink-0 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer border border-neutral-200"
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
  const [announcementModalMode, setAnnouncementModalMode] = useState<"create" | "edit">("create")
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null)
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
    [announcementModalMode, editingAnnouncementId, updateAnnouncement, createAnnouncement],
  )

  const handleOpenAuditLog = useCallback((orgId: string, orgName: string) => {
    setAuditLogOrgId(orgId)
    setAuditLogOrgName(orgName)
    setShowAuditLogModal(true)
  }, [])

  const filteredAuditLogs = auditLogOrgId ? getAuditLogsForOrg(auditLogOrgId) : []

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

  return (
    <div className="w-full min-h-full bg-[#F3F4F6] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Admin Panel — Office of Student Affairs
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
              Global administration console for student organizations, activity
              audit logs, and status triggers.
            </p>
          </div>

          <Button
            onClick={handleExportAuditLog}
            className="bg-[#800000] hover:bg-[#660000] text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer h-10"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Export System Audit Log</span>
          </Button>
        </div>

        {/* ── Registered Student Organization Accounts ────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900">
              Registered Student Organization Accounts
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Organization Name</th>
                  <th className="py-3.5 px-6">Adviser</th>
                  <th className="py-3.5 px-6">Representative</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {orgViews.map((org) => (
                  <tr key={org.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">{org.name}</td>
                    <td className="py-4 px-6 text-neutral-700 text-xs">{org.adviser}</td>
                    <td className="py-4 px-6 text-neutral-700 text-xs">{org.representative}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={org.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Manage Account
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAuditLog(org.id, org.name)}
                          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
          <h2 className="text-lg font-bold text-neutral-900 mb-4">
            Institution-wide Metrics & Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      {stat.label}
                    </span>
                    <div className={`p-2 rounded-xl border ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-neutral-900">{stat.value}</span>
                    <p className={`text-xs mt-1 font-medium ${stat.changeColor}`}>{stat.change}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Current Announcements ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900">Current Announcements</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Time</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">{announcement.title}</td>
                    <td className="py-4 px-6 text-neutral-700 text-xs">{announcement.date}</td>
                    <td className="py-4 px-6 text-neutral-700 text-xs">{announcement.time}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(announcement)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <PencilIcon className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2Icon className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-neutral-200">
            <Button
              onClick={handleOpenCreateModal}
              className="bg-[#800000] hover:bg-[#660000] text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer h-10"
            >
              <PlusIcon className="w-4 h-4" />
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
