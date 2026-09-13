import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import {
  HomeIcon,
  CircleXIcon,
  SettingsIcon,
  UsersIcon,
  LogOutIcon,
  XIcon,
} from "lucide-react"

import { Logo } from "@/components/apex-sidebar"
import { useSessionStore } from "@/stores/session-store"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const navigate = useNavigate()
  const name = useSessionStore((state) => state.name)
  const signOut = useSessionStore((state) => state.signOut)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate("/login")
  }

  return (
    <>
      <aside className="sticky top-0 z-20 flex h-screen min-h-screen w-64 shrink-0 flex-col justify-between bg-[#8B0000] p-4 text-white shadow-xl select-none">
        {/* Top Brand Section */}
        <div className="space-y-6">
          <div className="flex flex-col items-center pt-2 pb-2 text-center">
            {/* Logo */}
            <div className="relative mb-2.5 flex items-center justify-center">
              <Logo className="h-[84px] w-[187px]" />
            </div>

            {/* APEX Title */}
            <h2
              className="font-audiowide text-white uppercase"
              style={{
                fontSize: "24px",
                letterSpacing: "17px",
                paddingLeft: "15px",
                lineHeight: 1,
                fontWeight: 400,
              }}
            >
              APEX
            </h2>

            {/* Subtitle */}
            <p
              className="font-sans antialiased"
              style={{
                color: "#FBC02D",
                fontSize: "9.6px",
                fontWeight: 300,
                letterSpacing: "0.05em",
                paddingLeft: "0.05em",
                marginTop: "8px",
                lineHeight: 1.2,
                opacity: 0.95,
                whiteSpace: "nowrap",
              }}
            >
              Administrative Portal For Events Exchange
            </p>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5 pt-2">
            {/* Dashboard */}
            <NavLink
              to="/admin-osa-panel"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <HomeIcon
                    className={`h-4.5 w-4.5 ${
                      isActive ? "text-neutral-900" : "text-white/80"
                    }`}
                  />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>

            {/* Submissions */}
            <NavLink
              to="/submission"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <CircleXIcon
                    className={`h-4.5 w-4.5 ${
                      isActive ? "text-neutral-900" : "text-white/80"
                    }`}
                  />
                  <span>Submissions</span>
                </>
              )}
            </NavLink>

            {/* Settings */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
            >
              <SettingsIcon className="h-4.5 w-4.5 text-white/80" />
              <span>Settings</span>
            </button>

            {/* About the Devs */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <UsersIcon
                    className={`h-4.5 w-4.5 ${
                      isActive ? "text-neutral-900" : "text-white/80"
                    }`}
                  />
                  <span>About the Devs</span>
                </>
              )}
            </NavLink>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
            >
              <LogOutIcon className="h-4.5 w-4.5 text-white/80" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Bottom User Card */}
        <div className="border-t border-red-900/60 pt-4">
          <div className="rounded-xl bg-[#2D2D2D] p-3.5 shadow-sm">
            <p className="text-sm font-bold tracking-wide text-white">
              {name || "Dr. Helen Carter"}
            </p>
            <p className="mt-0.5 text-xs font-medium text-[#FBC02D]">
              Office of the Dean
            </p>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="relative mx-4 w-full max-w-md space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-neutral-700" />
                <h3 className="text-base font-bold text-neutral-900">
                  Admin System Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="cursor-pointer rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-neutral-600">
              <p>
                Configure automated email notifications, SLA reminders, and
                academic term submission windows.
              </p>
              <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">
                    Academic Year
                  </span>
                  <span className="font-bold text-neutral-900">
                    2026 - 2027
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">
                    Audit Log Retention
                  </span>
                  <span className="font-bold text-neutral-900">365 Days</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">
                    Auto-Reminders
                  </span>
                  <span className="font-bold text-emerald-700">Enabled</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setShowSettingsModal(false)}
                className="rounded-xl bg-[#800000] px-4 py-2 text-sm font-semibold text-white hover:bg-[#660000]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
