import { createBrowserRouter, Navigate, Outlet } from "react-router"

import { Login } from "@/routes/login"
import { action as loginAction } from "@/routes/login.action"
import { AdminLayout } from "@/routes/layouts/admin-layout"
import { SignatoriesLayout } from "@/routes/layouts/signatories-layout"
import { StudentsLayout } from "@/routes/layouts/students-layout"

function RouteFallback() {
  return <div className="min-h-screen w-full bg-[#F3F4F6]" />
}

function PassThroughLayout() {
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    action: loginAction,
  },
  {
    path: "students",
    Component: StudentsLayout,
    children: [
      {
        index: true,
        Component: () => <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { OrgDashboard } = await import("@/routes/students/dashboard")
          return { Component: OrgDashboard }
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
        path: "submissions",
        Component: PassThroughLayout,
        children: [
          {
            index: true,
            HydrateFallback: RouteFallback,
            lazy: async () => {
              const { SubmissionsStart } = await import(
                "@/routes/students/submissions"
              )
              return { Component: SubmissionsStart }
            },
          },
          {
            path: "saaf",
            Component: PassThroughLayout,
            children: [
              {
                index: true,
                HydrateFallback: RouteFallback,
                lazy: async () => {
                  const [{ Submission }, { action }] = await Promise.all([
                    import("@/routes/students/saaf"),
                    import("@/routes/students/saaf.action"),
                  ])
                  return { Component: Submission, action }
                },
              },
              {
                path: "reservations",
                HydrateFallback: RouteFallback,
                lazy: async () => {
                  const { Reservation } = await import(
                    "@/routes/students/reservations"
                  )
                  return { Component: Reservation }
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "signatories",
    Component: SignatoriesLayout,
    children: [
      {
        index: true,
        Component: () => <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { Dashboard } = await import("@/routes/signatories/dashboard")
          return { Component: Dashboard }
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
    ],
  },
  {
    path: "admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: () => <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        HydrateFallback: RouteFallback,
        lazy: async () => {
          const { AdminOsaPanel } = await import("@/routes/admin/dashboard")
          return { Component: AdminOsaPanel }
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
    ],
  },
])
