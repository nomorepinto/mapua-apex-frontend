import { Building2Icon, HomeIcon, StampIcon, UsersIcon } from "lucide-react"
import { Outlet } from "react-router"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ForceLightMode } from "@/components/layout/force-light-mode"

const ADMIN_NAV = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: HomeIcon,
    end: true,
  },
  {
    label: "Organizations",
    to: "/admin/organizations",
    icon: Building2Icon,
  },
  {
    label: "Signatories",
    to: "/admin/signatories",
    icon: StampIcon,
  },
  {
    label: "About the Devs",
    to: "/admin/about",
    icon: UsersIcon,
  },
]

export function AdminLayout() {
  return (
    <AuthGuard allowedGroups={["admin", "osaar"]}>
      <ForceLightMode>
        <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground lg:flex-row">
          <AppSidebar homeTo="/admin/dashboard" items={ADMIN_NAV} showSettings />
          <main className="min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </ForceLightMode>
    </AuthGuard>
  )
}
