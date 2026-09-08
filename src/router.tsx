import { createBrowserRouter } from "react-router"

import { Home, loader as homeLoader } from "@/routes/home"
import { Login, action as loginAction } from "@/routes/login"
import { Root } from "@/routes/root"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      },
      {
        path: "login",
        Component: Login,
        action: loginAction,
      },
    ],
  },
])
