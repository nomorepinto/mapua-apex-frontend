import { createBrowserRouter, Navigate } from "react-router"

import { Root } from "@/routes/root"
import { Dashboard } from "@/routes/dashboard"
import { Submission, action as submissionAction } from "@/routes/submission"
import { Reservation } from "@/routes/reservation"
import { About } from "@/routes/about"
import { Login, action as loginAction } from "@/routes/login"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: () => <Navigate to="/dashboard" replace />,
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
])