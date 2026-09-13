import { HomeIcon, PlusCircleIcon, UsersIcon } from "lucide-react"
import { Outlet } from "react-router"

import { AppSidebar } from "@/components/layout/app-sidebar"

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
    <div className="flex h-screen w-full overflow-hidden bg-[#F5F6F8]">
      <AppSidebar homeTo="/students/dashboard" items={STUDENT_NAV} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
