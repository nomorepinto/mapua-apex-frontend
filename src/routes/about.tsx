import { Building2Icon, Code2Icon, ShieldCheckIcon } from "lucide-react"

export function About() {
  return (
    <div className="min-h-full w-full bg-[#F3F4F6] px-4 py-8 text-neutral-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-neutral-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            About the Developers & APEX
          </h1>
          <p className="mt-1 text-xs font-normal text-neutral-500 sm:text-sm">
            Administrative Portal For Events Exchange (APEX) — Mapúa University
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-800">
              <Building2Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Mapúa APEX Portal
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              APEX streamlines the student activity proposal, review, and
              approval process across all academic departments, student
              councils, and organizations at Mapúa University.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Unified Institutional Alignment
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              Ensures that every co-curricular and extra-curricular activity
              meaningfully aligns with institutional vision, core values,
              Program Educational Objectives (PEO), and UN SDGs.
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <Code2Icon className="h-5 w-5 text-neutral-700" />
            <h3 className="text-base font-bold text-neutral-900">
              Development Team
            </h3>
          </div>
          <p className="text-sm text-neutral-600">
            Designed and built with modern React, React Router Data Mode,
            Tailwind CSS, and Coss UI components.
          </p>
        </div>
      </div>
    </div>
  )
}
