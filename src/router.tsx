import { createBrowserRouter, Navigate } from "react-router"

import { Root } from "@/routes/root"
import { Dashboard } from "@/routes/dashboard"
import { Submission, action as submissionAction } from "@/routes/submission"
import { Reservation } from "@/routes/reservation"
import { About } from "@/routes/about"
import { Login, action as loginAction } from "@/routes/login"
import { OrgDashboard } from "@/routes/org-dashboard"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

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
        Component: Dashboard,
      },
      {
        path: "submission",
        Component: Submission,
        action: submissionAction,
      },
      {
        path: "reservation",
        Component: Reservation,
      },
      {
        path: "about",
        Component: About,
      },

      {
        path: "login",
        Component: Login,
        action: loginAction,
      },
    ],
  },
  {
    path: "/org-dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: OrgDashboard,
      }
    ]
  },
])