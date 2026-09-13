import { HomeIcon, UsersIcon } from "lucide-react"
import { Outlet } from "react-router"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AuthGuard } from "@/components/auth/AuthGuard"

const SIGNATORY_NAV = [
  {
    label: "Dashboard",
    to: "/signatories/dashboard",
    icon: HomeIcon,
    end: true,
  },
  {
    label: "About the Devs",
    to: "/signatories/about",
    icon: UsersIcon,
  },
]

export function SignatoriesLayout() {
  return (
    <AuthGuard allowedGroups={["admin", "osaar", "cdm_reviewer", "org_adviser", "dean"]}>
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#F3F4F6] lg:flex-row">
        <AppSidebar homeTo="/signatories/dashboard" items={SIGNATORY_NAV} />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
