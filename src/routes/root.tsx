import { NavLink, Outlet } from "react-router"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { useSessionStore } from "@/stores/session-store"

export function Root() {
  const name = useSessionStore((state) => state.name)
  const signOut = useSessionStore((state) => state.signOut)

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <nav className="flex items-center gap-1">
          <Button
            className="aria-[current=page]:bg-accent"
            render={<NavLink to="/" end />}
            size="sm"
            variant="ghost"
          >
            Home
          </Button>
          <Button
            className="aria-[current=page]:bg-accent"
            render={<NavLink to="/dashboard" />}
            size="sm"
            variant="ghost"
          >
            Dashboard
          </Button>
          <Button
            className="aria-[current=page]:bg-accent"
            render={<NavLink to="/login" />}
            size="sm"
            variant="ghost"
          >
            Login
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          {name ? (
            <>
              <p className="text-muted-foreground text-sm">{name}</p>
              <Button onClick={signOut} size="sm" type="button" variant="outline">
                Sign out
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Signed out</p>
          )}
        </div>
      </header>
      <main className="flex flex-1 flex-col p-6">
        <Outlet />
      </main>
      <p className="px-6 pb-6 font-mono text-muted-foreground text-xs">
        Press <Kbd>d</Kbd> to toggle dark mode
      </p>
    </div>
  )
}
