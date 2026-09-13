import { NavLink, useLocation, Link } from "react-router"
import { HomeIcon, PlusCircleIcon, UsersIcon, LogOutIcon } from "lucide-react"

import { Logo } from "@/components/logo"
import { useSignOut } from "@/hooks/use-sign-out"
import { useSessionStore } from "@/stores/session-store"

export { AdminSidebar } from "./admin-sidebar"
export { Logo } from "./logo"

export function ApexSidebar() {
  const location = useLocation()
  const name = useSessionStore((state) => state.name)
  const handleSignOut = useSignOut()

  const isSubmissionActive =
    location.pathname === "/submission" || location.pathname === "/reservation"

  return (
    <aside className="sticky top-0 z-20 flex h-screen min-h-screen w-64 shrink-0 flex-col justify-between bg-[#990000] p-4 text-white shadow-xl select-none">
      <div className="space-y-6">
        <div className="flex flex-col items-center pt-2 pb-2 text-center">
          <div className="relative mb-2.5 flex items-center justify-center">
            <Link
              to="/dean-dashboard"
              className="cursor-pointer transition-opacity hover:opacity-85 focus:outline-hidden"
              aria-label="Go to Dean Dashboard"
            >
              <Logo className="h-[84px] w-[187px]" />
            </Link>
          </div>

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

        <nav className="space-y-1.5 pt-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
                  : "text-white/90 hover:bg-neutral-200/20 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <HomeIcon
                  className={`h-4.5 w-4.5 ${
                    isActive ? "text-red-800" : "text-white/80"
                  }`}
                />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/submission"
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              isSubmissionActive
                ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
                : "text-white/90 hover:bg-neutral-200/20 hover:text-white"
            }`}
          >
            <PlusCircleIcon
              className={`h-4.5 w-4.5 ${
                isSubmissionActive ? "text-red-800" : "text-white/80"
              }`}
            />
            <span>Submission</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
                  : "text-white/90 hover:bg-neutral-200/20 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <UsersIcon
                  className={`h-4.5 w-4.5 ${
                    isActive ? "text-red-800" : "text-white/80"
                  }`}
                />
                <span>About the Devs</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-white/90 transition-all hover:bg-neutral-200/20 hover:text-white"
          >
            <LogOutIcon className="h-4.5 w-4.5 text-white/80" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      <div className="border-t border-red-900/60 pt-4">
        <div className="rounded-xl border border-red-900/50 bg-[#6b0000]/90 p-3.5 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-white">
            {name || "Jedrick Darren Ocenar"}
          </p>
          <p className="mt-0.5 text-xs font-medium text-[#FBC02D]">
            AWS-SBG Arcus President
          </p>
        </div>
      </div>
    </aside>
  )
}
