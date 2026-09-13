import { useCallback, useState } from "react"

import type { AuditLogEntry } from "@/components/admin-osa/audit"
import type { Announcement, InstitutionMetrics, OrgAccountView } from "@/lib/types"

const UNAVAILABLE = "No records are available yet."

const EMPTY_METRICS: InstitutionMetrics = {
  activeOrganizations: 0,
  activeOrganizationsChange: "No data available",
  totalActiveSubmissions: 0,
  totalActiveSubmissionsNote: "No data available",
  approvalSlaRate: 0,
  approvalSlaTurnaround: "No data available",
}

export function useAdminOsaPanel() {
  const [actionError, setActionError] = useState<string | null>(null)
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
  const [auditLogOrgName, setAuditLogOrgName] = useState("")

  const handleOpenCreateModal = useCallback(() => {
    setAnnouncementModalMode("create")
    setEditingAnnouncementId(null)
    setEditInitialTitle("")
    setEditInitialMessage("")
    setShowAnnouncementModal(true)
    setActionError(null)
  }, [])

  const handleOpenEditModal = useCallback((announcement: Announcement) => {
    setAnnouncementModalMode("edit")
    setEditingAnnouncementId(announcement.id)
    setEditInitialTitle(announcement.title)
    setEditInitialMessage(announcement.title)
    setShowAnnouncementModal(true)
    setActionError(null)
  }, [])

  const handleAnnouncementSubmit = useCallback((_title: string) => {
    setShowAnnouncementModal(false)
    setActionError(UNAVAILABLE)
  }, [])

  const handleOpenAuditLog = useCallback((_orgId: string, orgName: string) => {
    setAuditLogOrgName(orgName)
    setShowAuditLogModal(true)
    setActionError(null)
  }, [])

  const handleExportAuditLog = useCallback(() => {
    setActionError(UNAVAILABLE)
  }, [])

  const deleteAnnouncement = useCallback((_id: string) => {
    setActionError(UNAVAILABLE)
  }, [])

  const filteredAuditLogs: AuditLogEntry[] = []
  const orgViews: OrgAccountView[] = []
  const announcements: Announcement[] = []

  return {
    orgViews,
    metrics: EMPTY_METRICS,
    announcements,
    actionError,
    deleteAnnouncement,
    showAnnouncementModal,
    setShowAnnouncementModal,
    announcementModalMode,
    editingAnnouncementId,
    editInitialTitle,
    editInitialMessage,
    showAuditLogModal,
    setShowAuditLogModal,
    auditLogOrgName,
    filteredAuditLogs,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleAnnouncementSubmit,
    handleOpenAuditLog,
    handleExportAuditLog,
  }
}
