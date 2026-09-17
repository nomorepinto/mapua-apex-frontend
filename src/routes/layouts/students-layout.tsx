import { HomeIcon, PlusCircleIcon, UsersIcon } from "lucide-react"
import { Outlet } from "react-router"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { layout } from "@/config"

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
      <div className={layout.frame}>
        <AppSidebar homeTo="/students/dashboard" items={STUDENT_NAV} />
        <main className={layout.main}>
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  )
}
