/** Split CSV text into trimmed rows, honoring quoted commas and BOM. */
export function parseCsvRows(text: string): string[][] {
  const input = text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          cell += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        cell += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
      continue
    }

    if (ch === ",") {
      row.push(cell.trim())
      cell = ""
      continue
    }

    if (ch === "\n") {
      row.push(cell.trim())
      if (row.some((value) => value.length > 0)) {
        rows.push(row)
      }
      row = []
      cell = ""
      continue
    }

    cell += ch
  }

  row.push(cell.trim())
  if (row.some((value) => value.length > 0)) {
    rows.push(row)
  }

  return rows
}

function isHeaderCell(value: string, aliases: string[]): boolean {
  return aliases.includes(value.trim().toLowerCase())
}

/**
 * Read a one-column CSV of names. Skips a header row like `name` / `organization`.
 */
export function parseSingleColumnCsv(
  text: string,
  headerAliases: string[] = ["name", "organization", "organization_id", "org"]
): string[] {
  const rows = parseCsvRows(text)
  if (rows.length === 0) {
    return []
  }

  const start = isHeaderCell(rows[0][0] ?? "", headerAliases) ? 1 : 0
  const values: string[] = []
  const seen = new Set<string>()

  for (let i = start; i < rows.length; i++) {
    const value = rows[i][0]?.trim()
    if (!value) {
      continue
    }

    const key = value.toLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    values.push(value)
  }

  return values
}

export type SignatoryRole = "adviser" | "cdm" | "dean"

export type SignatoryCsvRow = {
  name: string
  role: SignatoryRole
  organization: string
}

const ROLE_ALIASES: Record<string, SignatoryRole> = {
  adviser: "adviser",
  advisor: "adviser",
  cdm: "cdm",
  dean: "dean",
}

export function parseSignatoryRole(value: string): SignatoryRole | null {
  return ROLE_ALIASES[value.trim().toLowerCase()] ?? null
}

function headerIndex(header: string[], aliases: string[]): number {
  return header.findIndex((cell) => isHeaderCell(cell, aliases))
}

/**
 * Parse a signatory CSV.
 * - 1 column: organization names/ids (caller supplies name + role)
 * - 3 columns: name, role, organization (header optional)
 */
export function parseSignatoryCsv(text: string): {
  mode: "organizations" | "records"
  organizations: string[]
  records: SignatoryCsvRow[]
  errors: string[]
} {
  const rows = parseCsvRows(text)
  const errors: string[] = []

  if (rows.length === 0) {
    return { mode: "organizations", organizations: [], records: [], errors: ["CSV is empty."] }
  }

  const maxColumns = Math.max(...rows.map((row) => row.length))

  if (maxColumns <= 1) {
    return {
      mode: "organizations",
      organizations: parseSingleColumnCsv(text),
      records: [],
      errors,
    }
  }

  const first = rows[0]
  const hasHeader =
    headerIndex(first, ["name"]) >= 0 ||
    headerIndex(first, ["role"]) >= 0 ||
    headerIndex(first, ["organization", "organization_id", "org"]) >= 0

  const header = hasHeader ? first : ["name", "role", "organization"]
  const start = hasHeader ? 1 : 0
  const nameIdx = Math.max(0, headerIndex(header, ["name"]))
  const roleIdx = headerIndex(header, ["role"]) >= 0 ? headerIndex(header, ["role"]) : 1
  const orgIdx =
    headerIndex(header, ["organization", "organization_id", "org"]) >= 0
      ? headerIndex(header, ["organization", "organization_id", "org"])
      : 2

  const records: SignatoryCsvRow[] = []

  for (let i = start; i < rows.length; i++) {
    const row = rows[i]
    const name = row[nameIdx]?.trim() ?? ""
    const roleRaw = row[roleIdx]?.trim() ?? ""
    const organization = row[orgIdx]?.trim() ?? ""
    const line = i + 1

    if (!name && !roleRaw && !organization) {
      continue
    }

    const role = parseSignatoryRole(roleRaw)
    if (!name || !role || !organization) {
      errors.push(
        `Row ${line}: expected name, role (adviser | cdm | dean), and organization.`
      )
      continue
    }

    records.push({ name, role, organization })
  }

  return { mode: "records", organizations: [], records, errors }
}

export function downloadCsvTemplate(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
