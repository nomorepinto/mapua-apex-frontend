import type { ActionFunctionArgs } from "react-router"
import { redirect } from "react-router"

import { useSessionStore } from "@/stores/session-store"

export type LoginActionData = {
  error: string
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | LoginActionData> {
  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()

  if (name.length === 0) {
    return { error: "Enter a name to continue." }
  }

  useSessionStore.getState().signIn(name)
  return redirect("/")
}

export type LoginAction = typeof action
