import { Building2Icon, Code2Icon, ShieldCheckIcon } from "lucide-react"

export function About() {
  return (
    <div className="w-full min-h-full bg-[#F3F4F6] text-neutral-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-neutral-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            About the Developers & APEX
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal">
            Administrative Portal For Events Exchange (APEX) — Mapúa University
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-800">
              <Building2Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">
              Mapúa APEX Portal
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              APEX streamlines the student activity proposal, review, and approval
              process across all academic departments, student councils, and
              organizations at Mapúa University.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">
              Unified Institutional Alignment
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Ensures that every co-curricular and extra-curricular activity
              meaningfully aligns with institutional vision, core values, Program
              Educational Objectives (PEO), and UN SDGs.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
            <Code2Icon className="w-5 h-5 text-neutral-700" />
            <h3 className="font-bold text-base text-neutral-900">
              Development Team
            </h3>
          </div>
          <p className="text-sm text-neutral-600">
            Designed and built with modern React, React Router Data Mode, Tailwind
            CSS, and Coss UI components.
          </p>
        </div>
      </div>
    </div>
  )
}
