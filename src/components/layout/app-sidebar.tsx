import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { LogOutIcon, MenuIcon, SettingsIcon, XIcon } from "lucide-react"
import { Link, NavLink } from "react-router"
import { useAuth } from "react-oidc-context"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetPopup, SheetTitle } from "@/components/ui/sheet"
import { useDisclosure } from "@/hooks/use-disclosure"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSignOut } from "@/hooks/use-sign-out"
import { cn } from "@/lib/utils"

export type AppSidebarItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

function navClassName({ isActive }: { isActive: boolean }) {
  return cn(
    "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
    isActive
      ? "bg-white font-bold text-neutral-900 shadow-md shadow-black/10"
      : "text-white/90 hover:bg-neutral-200/20 hover:text-white",
  )
}

function SidebarBrand({
  homeTo,
  onNavigate,
}: {
  homeTo: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col items-center pt-2 pb-2 text-center">
      <div className="relative mb-2.5 flex items-center justify-center">
        <Link
          to={homeTo}
          onClick={onNavigate}
          className="cursor-pointer transition-opacity hover:opacity-85 focus:outline-hidden"
          aria-label="Go to dashboard"
        >
          <Logo className="h-auto w-[min(11.7rem,100%)] max-w-full" />
        </Link>
      </div>

      <h2 className="font-audiowide text-[clamp(1.25rem,5cqi,1.5rem)] leading-none font-normal tracking-[0.6em] ps-[0.6em] text-white uppercase">
        APEX
      </h2>

      <p className="mt-2 max-w-[14rem] px-1 font-sans text-[0.6rem] leading-snug font-light tracking-wide text-[#FBC02D] antialiased opacity-95">
        Administrative Portal For Events Exchange
      </p>
    </div>
  )
}

function SidebarNav({
  items,
  showSettings,
  onNavigate,
  onOpenSettings,
  onSignOut,
}: {
  items: AppSidebarItem[]
  showSettings: boolean
  onNavigate?: () => void
  onOpenSettings: () => void
  onSignOut: () => void
}) {
  return (
    <nav className="space-y-1.5 pt-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={navClassName}
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  isActive ? "text-red-800" : "text-white/80",
                )}
              />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}

      {showSettings ? (
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
        >
          <SettingsIcon className="h-4.5 w-4.5 text-white/80" />
          <span>Settings</span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={onSignOut}
        className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-white/90 transition-all hover:bg-neutral-200/20 hover:text-white"
      >
        <LogOutIcon className="h-4.5 w-4.5 text-white/80" />
        <span>Sign Out</span>
      </button>
    </nav>
  )
}

function SidebarUser({ name, displayRole }: { name: string; displayRole: string }) {
  return (
    <div className="border-t border-red-900/60 pt-4">
      <div className="rounded-xl border border-red-900/50 bg-[#6b0000]/90 p-3.5 shadow-sm">
        <p className="truncate text-sm font-semibold tracking-wide text-white">
          {name}
        </p>
        <p className="mt-0.5 text-xs font-medium break-words text-[#FBC02D]">
          {displayRole}
        </p>
      </div>
    </div>
  )
}

function SidebarPanel({
  homeTo,
  items,
  showSettings,
  name,
  displayRole,
  onNavigate,
  onOpenSettings,
  onSignOut,
  onClose,
}: {
  homeTo: string
  items: AppSidebarItem[]
  showSettings: boolean
  name: string
  displayRole: string
  onNavigate?: () => void
  onOpenSettings: () => void
  onSignOut: () => void
  onClose?: () => void
}) {
  return (
    <div className="@container flex h-full min-h-0 flex-col justify-between overflow-y-auto bg-[#8B0000] p-4 text-white select-none">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <SidebarBrand homeTo={homeTo} onNavigate={onNavigate} />
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-white/90 transition-colors hover:bg-white/10"
              aria-label="Close navigation"
            >
              <XIcon className="size-5" />
            </button>
          ) : null}
        </div>
        <SidebarNav
          items={items}
          showSettings={showSettings}
          onNavigate={onNavigate}
          onOpenSettings={onOpenSettings}
          onSignOut={onSignOut}
        />
      </div>
      <SidebarUser name={name} displayRole={displayRole} />
    </div>
  )
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
  const displayRole =
    userGroups.length > 0
      ? userGroups.map((g) => g.replace(/_/g, " ")).join(", ")
      : "No role assigned"

  const handleSignOut = useSignOut()
  const settings = useDisclosure()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isDesktop = useMediaQuery("lg")

  useEffect(() => {
    if (isDesktop) setMobileOpen(false)
  }, [isDesktop])

  const panelProps = {
    homeTo,
    items,
    showSettings,
    name,
    displayRole,
    onOpenSettings: () => {
      setMobileOpen(false)
      settings.open()
    },
    onSignOut: handleSignOut,
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-2 bg-[#8B0000] px-2 pt-[env(safe-area-inset-top)] text-white lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <MenuIcon className="size-5" />
        </button>
        <Link
          to={homeTo}
          className="flex min-w-0 items-center gap-2"
          aria-label="Go to dashboard"
        >
          <Logo className="h-8 w-auto shrink-0" />
          <span className="font-audiowide text-sm tracking-[0.35em] ps-[0.35em] uppercase">
            APEX
          </span>
        </Link>
      </header>

      <aside className="sticky top-0 z-20 hidden h-dvh w-64 shrink-0 shadow-xl lg:flex lg:flex-col">
        <SidebarPanel {...panelProps} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetPopup
          side="left"
          showCloseButton={false}
          className="h-full max-h-dvh w-[min(18rem,calc(100%-2.5rem))] max-w-72 border-0 bg-[#8B0000] p-0 text-white shadow-xl before:hidden"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div id="mobile-nav" className="h-full min-h-0">
            <SidebarPanel
              {...panelProps}
              onNavigate={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </SheetPopup>
      </Sheet>

      {showSettings && settings.isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={settings.close}
          />
          <div className="relative w-full max-w-md space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div className="flex min-w-0 items-center gap-2">
                <SettingsIcon className="h-5 w-5 shrink-0 text-neutral-700" />
                <h3 className="text-base font-bold text-neutral-900">
                  Admin System Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={settings.close}
                className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close settings"
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
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-neutral-700">
                    Academic Year
                  </span>
                  <span className="font-bold text-neutral-900">
                    2026 - 2027
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-neutral-700">
                    Audit Log Retention
                  </span>
                  <span className="font-bold text-neutral-900">365 Days</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
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
                className="min-h-11 rounded-xl bg-[#800000] px-4 py-2 text-sm font-semibold text-white hover:bg-[#660000]"
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
