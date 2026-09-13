import { Outlet } from "react-router"
import { OrgSidebar } from "./OrgSidebar"

export function DashboardLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F5F6F8]">
      <OrgSidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
