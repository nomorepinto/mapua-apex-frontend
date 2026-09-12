import { Outlet, useLocation } from "react-router"
import { ApexSidebar, AdminSidebar } from "@/components/apex-sidebar"

export function Root() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith("/admin")

  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6]">
      {/* Persistent Left Sidebar */}
      {isAdmin ? <AdminSidebar /> : <ApexSidebar />}

      {/* Main Page Content */}
      <main className="min-h-screen min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
