import type { ApiSignatory } from "@/lib/dynamodb-adapters"

export const SIGNATORY_ROLE_ITEMS = [
  { label: "Adviser", value: "adviser" },
  { label: "CDM", value: "cdm" },
  { label: "Dean", value: "dean" },
] as const

export type SignatoryRoleValue = ApiSignatory["role"]

export function signatoryRoleLabel(role: string): string {
  const match = SIGNATORY_ROLE_ITEMS.find((item) => item.value === role)
  return match?.label ?? role
}
