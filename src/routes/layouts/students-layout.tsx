import { HomeIcon, PlusCircleIcon, UsersIcon } from "lucide-react"
import { Outlet } from "react-router"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AuthGuard } from "@/components/auth/AuthGuard"

const STUDENT_NAV = [
  {
    label: "Dashboard",
    to: "/students/dashboard",
    icon: HomeIcon,
    end: true,
  },
  {
    label: "Submissions",
    to: "/students/submissions",
    icon: PlusCircleIcon,
  },
  {
    label: "About the Devs",
    to: "/students/about",
    icon: UsersIcon,
  },
]

export function StudentsLayout() {
  return (
    <AuthGuard allowedGroups={["admin", "org_adviser", "org_submitter"]}>
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#F5F6F8] lg:flex-row">
        <AppSidebar homeTo="/students/dashboard" items={STUDENT_NAV} />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
