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
    <AuthGuard allowedGroups={["Admin", "OSAAR", "CDM_Reviewer", "ORG_Adviser", "Dean"]}>
      <div className="flex h-screen w-full overflow-hidden bg-[#F3F4F6]">
        <AppSidebar homeTo="/signatories/dashboard" items={SIGNATORY_NAV} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
