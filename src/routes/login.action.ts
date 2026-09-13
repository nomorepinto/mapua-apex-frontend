import type { ActionFunctionArgs } from "react-router"
import { redirect } from "react-router"

import { useSessionStore, type AppRole } from "@/stores/session-store"

export type LoginActionData = {
  error: string
}

const ROLES: AppRole[] = ["students", "signatories", "admin"]

function isAppRole(value: string): value is AppRole {
  return ROLES.includes(value as AppRole)
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | LoginActionData> {
  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const role = String(formData.get("role") ?? "").trim()

  if (name.length === 0) {
    return { error: "Enter a name to continue." }
  }

  if (!isAppRole(role)) {
    return { error: "Select a role to continue." }
  }

  useSessionStore.getState().signIn(name, role)
  return redirect(`/${role}/dashboard`)
}

export type LoginAction = typeof action
