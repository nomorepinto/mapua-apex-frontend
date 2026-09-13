import { DownloadIcon } from "lucide-react"

import { AnnouncementModal } from "@/components/admin-osa/announcement-modal"
import { AnnouncementsTable } from "@/components/admin-osa/announcements-table"
import { AuditLogModal } from "@/components/admin-osa/audit-log-modal"
import { MetricsSection } from "@/components/admin-osa/metrics-section"
import { OrgAccountsTable } from "@/components/admin-osa/org-accounts-table"
import { Button } from "@/components/ui/button"
import { useAdminOsaPanel } from "@/hooks/use-admin-osa-panel"

export function AdminOsaPanel() {
  const panel = useAdminOsaPanel()

  return (
    <div className="min-h-full w-full bg-[#F3F4F6] px-4 py-8 text-neutral-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
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
            onClick={panel.handleExportAuditLog}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#800000] px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-[#660000]"
          >
            <DownloadIcon className="h-4 w-4" />
            <span>Export System Audit Log</span>
          </Button>
        </div>

        {panel.actionError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {panel.actionError}
          </p>
        ) : null}

        <OrgAccountsTable
          orgs={panel.orgViews}
          onOpenAuditLog={panel.handleOpenAuditLog}
        />
        <MetricsSection metrics={panel.metrics} />
        <AnnouncementsTable
          announcements={panel.announcements}
          onCreate={panel.handleOpenCreateModal}
          onEdit={panel.handleOpenEditModal}
          onDelete={panel.deleteAnnouncement}
        />
      </div>

      {panel.showAnnouncementModal ? (
        <AnnouncementModal
          key={`${panel.announcementModalMode}-${panel.editingAnnouncementId ?? "new"}`}
          open
          onClose={() => panel.setShowAnnouncementModal(false)}
          onSubmit={(title) => panel.handleAnnouncementSubmit(title)}
          mode={panel.announcementModalMode}
          initialTitle={panel.editInitialTitle}
          initialMessage={panel.editInitialMessage}
        />
      ) : null}

      <AuditLogModal
        open={panel.showAuditLogModal}
        onClose={() => panel.setShowAuditLogModal(false)}
        orgName={panel.auditLogOrgName}
        logs={panel.filteredAuditLogs}
      />
    </div>
  )
}
