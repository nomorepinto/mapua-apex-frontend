/**
 * Shared page canvas, section cards, and spacing.
 * Matches the student dashboard: grey page, no section border, 1.5rem gaps.
 */
export const colors = {
  page: "#F5F6F8",
} as const

export const layout = {
  /** Full-page grey canvas + student-dashboard padding. */
  page: "min-h-full w-full bg-page p-6 sm:p-8 text-neutral-900",
  /** Sidebar shell behind <main>. */
  frame: "flex h-dvh w-full flex-col overflow-hidden bg-page lg:flex-row",
  fallback: "min-h-dvh w-full bg-page",
  center: "flex min-h-dvh w-full items-center justify-center bg-page",
  /** Space between page sections (student dashboard). */
  stack: "flex flex-col gap-4",
  gap: "gap-4",
  container: "mx-auto w-full max-w-6xl",
  containerNarrow: "mx-auto w-full max-w-xl",
  /** White section with no border. */
  section: "border-1 border-neutral-300 rounded-2xl bg-white p-6 shadow-xs md:p-7",
  /** White table/panel wrapper with no border and no inner padding. */
  sectionFlush: "border-1 border-neutral-300 overflow-hidden rounded-2xl bg-white shadow-xs",
  /** Override for shadcn Card (drops its default border). */
  card: "border-1 border-neutral-300 bg-white shadow-xs",
} as const
