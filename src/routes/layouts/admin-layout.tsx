import { HomeIcon, UsersIcon } from "lucide-react"
import { Outlet } from "react-router"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AuthGuard } from "@/components/auth/AuthGuard"

const ADMIN_NAV = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: HomeIcon,
    end: true,
  },
  {
    label: "About the Devs",
    to: "/admin/about",
    icon: UsersIcon,
  },
]

export function AdminLayout() {
  return (
    <AuthGuard allowedGroups={["Admin", "OSAAR"]}>
      <div className="flex h-screen w-full overflow-hidden bg-[#F3F4F6]">
        <AppSidebar homeTo="/admin/dashboard" items={ADMIN_NAV} showSettings />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
