import { Outlet } from "react-router"
import { ApexSidebar } from "@/components/apex-sidebar"

export function Root() {
  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6]">
      {/* Persistent Left Sidebar */}
      <ApexSidebar />

      {/* Main Page Content */}
      <main className="flex-1 min-w-0 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
