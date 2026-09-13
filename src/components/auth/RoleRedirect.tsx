import { useAuth } from "react-oidc-context"
import { Navigate } from "react-router"

export function RoleRedirect() {
  const auth = useAuth()

  if (auth.isLoading || auth.activeNavigator) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F3F4F6]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B0000] border-t-transparent" />
          <p className="text-sm font-medium text-neutral-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    // AuthGuard at the root layout usually handles this, but just in case
    return <Navigate to="/students/dashboard" replace />
  }

  const userGroups = (auth.user?.profile["cognito:groups"] as string[]) || []

  if (userGroups.includes("Admin") || userGroups.includes("OSAAR")) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (
    userGroups.includes("CDM_Reviewer") ||
    userGroups.includes("Dean") ||
    userGroups.includes("ORG_Adviser")
  ) {
    return <Navigate to="/signatories/dashboard" replace />
  }

  if (userGroups.includes("ORG_Submitter")) {
    return <Navigate to="/students/dashboard" replace />
  }

  // Fallback
  return <Navigate to="/students/dashboard" replace />
}
