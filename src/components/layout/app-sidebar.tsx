import type { LucideIcon } from "lucide-react"
import { LogOutIcon, SettingsIcon, XIcon } from "lucide-react"
import { Link, NavLink } from "react-router"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useDisclosure } from "@/hooks/use-disclosure"
import { useSignOut } from "@/hooks/use-sign-out"
import { useAuth } from "react-oidc-context"

export type AppSidebarItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

export function AppSidebar({
  homeTo,
  items,
  showSettings = false,
}: {
  homeTo: string
  items: AppSidebarItem[]
  showSettings?: boolean
}) {
  const auth = useAuth()
  const name = auth.user?.profile?.email || auth.user?.profile?.name || "Guest"
  const userGroups = (auth.user?.profile["cognito:groups"] as string[]) || []
  const displayRole = userGroups.length > 0 
    ? userGroups.map((g) => g.replace(/_/g, " ")).join(", ")
    : "No role assigned"

  const handleSignOut = useSignOut()
  const settings = useDisclosure()

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
        : "text-white/90 hover:bg-neutral-200/20 hover:text-white"
    }`

  return (
    <>
      <aside className="sticky top-0 z-20 flex h-screen min-h-screen w-64 shrink-0 flex-col justify-between bg-[#8B0000] p-4 text-white shadow-xl select-none">
        <div className="space-y-6">
          <div className="flex flex-col items-center pt-2 pb-2 text-center">
            <div className="relative mb-2.5 flex items-center justify-center">
              <Link
                to={homeTo}
                className="cursor-pointer transition-opacity hover:opacity-85 focus:outline-hidden"
                aria-label="Go to dashboard"
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
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navClassName}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-4.5 w-4.5 ${
                        isActive ? "text-red-800" : "text-white/80"
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            {showSettings ? (
              <button
                type="button"
                onClick={settings.open}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                <SettingsIcon className="h-4.5 w-4.5 text-white/80" />
                <span>Settings</span>
              </button>
            ) : null}

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
              {name}
            </p>
            <p className="mt-0.5 text-xs font-medium text-[#FBC02D]">
              {displayRole}
            </p>
          </div>
        </div>
      </aside>

      {showSettings && settings.isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={settings.close}
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
                onClick={settings.close}
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
                onClick={settings.close}
                className="rounded-xl bg-[#800000] px-4 py-2 text-sm font-semibold text-white hover:bg-[#660000]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
