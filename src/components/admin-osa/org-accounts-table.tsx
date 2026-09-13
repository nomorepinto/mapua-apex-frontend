import { StatusBadge } from "@/components/admin-osa/status-badge"
import type { OrgAccountView } from "@/lib/types"

export function OrgAccountsTable({
  orgs,
  onOpenAuditLog,
}: {
  orgs: OrgAccountView[]
  onOpenAuditLog: (orgId: string, orgName: string) => void
}) {
  return (
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
          <tbody className="divide-y divide-neutral-150">
            {orgs.map((org) => (
              <tr key={org.id} className="transition-colors hover:bg-neutral-50/70">
                <td className="px-6 py-4 font-semibold text-neutral-900">
                  {org.name}
                </td>
                <td className="px-6 py-4 text-xs text-neutral-700">{org.adviser}</td>
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
                      onClick={() => onOpenAuditLog(org.id, org.name)}
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
  )
}
