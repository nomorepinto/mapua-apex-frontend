import { useCallback, useState } from "react"

import { exportAuditLogCsv } from "@/components/admin-osa/audit"
import type { Announcement } from "@/lib/types"
import { useAdminOsaStore } from "@/stores/admin-osa-store"

export function useAdminOsaPanel() {
  const orgViews = useAdminOsaStore((state) => state.orgViews)
  const metrics = useAdminOsaStore((state) => state.metrics)
  const announcements = useAdminOsaStore((state) => state.announcements)
  const createAnnouncement = useAdminOsaStore((state) => state.createAnnouncement)
  const updateAnnouncement = useAdminOsaStore((state) => state.updateAnnouncement)
  const deleteAnnouncement = useAdminOsaStore((state) => state.deleteAnnouncement)
  const getAuditLogsForOrg = useAdminOsaStore((state) => state.getAuditLogsForOrg)
  const getAllAuditLogs = useAdminOsaStore((state) => state.getAllAuditLogs)

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
    (title: string) => {
      if (announcementModalMode === "edit" && editingAnnouncementId) {
        updateAnnouncement(editingAnnouncementId, title)
      } else {
        createAnnouncement(title)
      }
      setShowAnnouncementModal(false)
    },
    [
      announcementModalMode,
      createAnnouncement,
      editingAnnouncementId,
      updateAnnouncement,
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
    const orgNameMap = new Map(orgViews.map((org) => [org.id, org.name]))
    exportAuditLogCsv(getAllAuditLogs(), orgNameMap)
  }, [getAllAuditLogs, orgViews])

  return {
    orgViews,
    metrics,
    announcements,
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
