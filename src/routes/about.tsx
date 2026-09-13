import { Building2Icon, Code2Icon, ShieldCheckIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import AgathaPhoto from "@/assets/Agatha.png"
import AvielPhoto from "@/assets/Aviel.png"
import BeaPhoto from "@/assets/Bea.png"
import BenedictPhoto from "@/assets/Benedict.png"
import JedrickPhoto from "@/assets/JEDRICK.png"
import JoelPhoto from "@/assets/Joel.png"
import KarinaPhoto from "@/assets/Karina.png"
import LunaPhoto from "@/assets/Luna.png"
import MicoPhoto from "@/assets/MICO.png"
import NigelPhoto from "@/assets/NIGEL.png"
import NicolePhoto from "@/assets/Nicole.png"
import RyanPhoto from "@/assets/Ryan.png"

type TeamMember = {
  name: string
  role: string
  photo: string
  initials: string
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: "Agatha", role: "CPO: 26-27", photo: AgathaPhoto, initials: "AG" },
  { name: "Aviel", role: "CERO: 26-27", photo: AvielPhoto, initials: "AV" },
  { name: "Bea", role: "CCO: 26-27", photo: BeaPhoto, initials: "BE" },
  { name: "Benedict", role: "CCRO: 26-27", photo: BenedictPhoto, initials: "BN" },
  { name: "Jedrick", role: "CEO: 26-27", photo: JedrickPhoto, initials: "JD" },
  { name: "Joel", role: "TC: 26-27", photo: JoelPhoto, initials: "JO" },
  { name: "Karina", role: "CAO: 26-27", photo: KarinaPhoto, initials: "KA" },
  { name: "Luna", role: "AM: 26-27", photo: LunaPhoto, initials: "LU" },
  { name: "Mico", role: "CS: 26-27", photo: MicoPhoto, initials: "MI" },
  { name: "Nigel", role: "COO: 26-27", photo: NigelPhoto, initials: "NI" },
  { name: "Nicole", role: "CFO: 26-27", photo: NicolePhoto, initials: "NC" },
  { name: "Ryan", role: "CTO: 26-27", photo: RyanPhoto, initials: "RY" },
]

function DevCard({ member }: { member: TeamMember }) {
  return (
    <Card className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
        <div className="-mt-10 mb-1">
          <Avatar className="size-14 ring-3 ring-white shadow-md">
            <AvatarImage src={member.photo} alt={member.name} />
            <AvatarFallback className="bg-red-800 text-sm font-bold text-white">
              {member.initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="text-sm font-bold tracking-tight text-neutral-900">
          {member.name}
        </h3>
        <p className="text-xs font-medium text-neutral-500">{member.role}</p>
      </CardContent>
    </Card>
  )
}

export function About() {
  return (
    <div className="min-h-full w-full bg-[#F3F4F6] px-4 py-8 text-neutral-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="border-b border-neutral-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            About the Developers &amp; APEX
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

        {/* Developer Cards Grid */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {TEAM_MEMBERS.map((member) => (
            <DevCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </div>
  )
}
