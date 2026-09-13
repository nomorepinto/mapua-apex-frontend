import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router/dom"
import { AuthProvider } from "react-oidc-context"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import { router } from "@/router.tsx"
import { oidcConfig } from "@/auth-config.ts"

import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)
