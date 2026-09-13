import { createBrowserRouter, Navigate } from "react-router"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Root } from "@/routes/root"

function RouteFallback() {
  return <div className="min-h-screen w-full bg-[#F3F4F6]" />
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: () => <Navigate to="/org-dashboard" replace />,
      },
      {
        path: "dashboard",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { Dashboard } = await import("@/routes/dashboard")
          return { Component: Dashboard }
        },
      },
      {
        path: "submission",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const [{ Submission }, { action }] = await Promise.all([
            import("@/routes/submission"),
            import("@/routes/submission.action"),
          ])
          return { Component: Submission, action }
        },
      },
      {
        path: "reservation",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { Reservation } = await import("@/routes/reservation")
          return { Component: Reservation }
        },
      },
      {
        path: "about",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { About } = await import("@/routes/about")
          return { Component: About }
        },
      },
      {
        path: "login",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const [{ Login }, { action }] = await Promise.all([
            import("@/routes/login"),
            import("@/routes/login.action"),
          ])
          return { Component: Login, action }
        },
      },
      {
        path: "admin-osa-panel",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { AdminOsaPanel } = await import("@/routes/admin-osa-panel")
          return { Component: AdminOsaPanel }
        },
      },
    ],
  },
  {
    path: "/org-dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { OrgDashboard } = await import("@/routes/org-dashboard")
          return { Component: OrgDashboard }
        },
      },
    ],
  },
])
