import { Building2Icon, Code2Icon, ShieldCheckIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { layout } from "@/config"
import { cn } from "@/lib/utils"

import AgathaPhoto from "@/assets/Agatha.png"
import AvielPhoto from "@/assets/Aviel.png"
import BeaPhoto from "@/assets/Bea.png"
import BenedictPhoto from "@/assets/Benedict.png"
import JedrickPhoto from "@/assets/Jedrick.png"
import JoelPhoto from "@/assets/Joel.png"
import KarinaPhoto from "@/assets/Karina.png"
import LunaPhoto from "@/assets/Luna.png"
import MicoPhoto from "@/assets/Mico.png"
import NigelPhoto from "@/assets/Nigel.png"
import NicolePhoto from "@/assets/Nicole.png"
import RyanPhoto from "@/assets/Ryan.png"

type TeamMember = {
  name: string
  coorole: string
  awsrole: string
  photo: string
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: "Jedrick", coorole: "Council of Organizations: Organization's Welfare and Advocacy Committee 25-26", awsrole: "AWS-SBG Arcus: Chief Executive Officer 26-27", photo: JedrickPhoto },
  { name: "Nigel", coorole: "Council of Organizations: External Relations Co-Head 25-26", awsrole: "Chief Operations Officer: 26-27", photo: NigelPhoto },
  { name: "Mico", coorole: "", awsrole: "Corporate Secretary: 26-27", photo: MicoPhoto },
  { name: "Ryan", coorole: "Council of Organizations: Organization's Welfare and Advocacy Head 25-26", awsrole: "Chief Technology Officer: 26-27", photo: RyanPhoto },
  { name: "Agatha", coorole: "", awsrole: "Chief People Officer: 26-27", photo: AgathaPhoto },
  { name: "Bea", coorole: "Council of Organizations: Creatives Committee 25-26", awsrole: "Chief Communications Officer: 26-27", photo: BeaPhoto },
  { name: "Nicole", coorole: "Council of Organizations: Organization's Welfare and Advocacy Co-Head 25-26", awsrole: "Chief Finance Officer: 26-27", photo: NicolePhoto },
  { name: "Karina", coorole: "Council of Organizations: External Relations Co-Head 25-26",awsrole: "Chief Auditing Officer: 26-27", photo: KarinaPhoto },
  { name: "Aviel", coorole: "Council of Organizations: External Relations Head 25-26", awsrole: "Chief External Relations Officer: 26-27", photo: AvielPhoto },
  { name: "Benedict", coorole: "Council of Organizations: Supreme Overlord 25-26", awsrole: "Chief Community Relations Officer: 26-27", photo: BenedictPhoto },
  { name: "Joel", coorole: "", awsrole: "Technology Committee: 26-27", photo: JoelPhoto },
  { name: "Luna", coorole: "", awsrole: "Organization Mascot: 26-27", photo: LunaPhoto },
]

function DevCard({ member }: { member: TeamMember }) {
  return (
    <Card className={cn(layout.card, "group overflow-hidden transition-shadow duration-300 hover:shadow-lg")}>
      <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
        <h3 className="text-sm font-bold tracking-tight text-neutral-900">
          {member.name}
        </h3>
        <p className="text-xs font-bold text-red-800">{member.coorole}</p>
        <p className="text-xs font-medium text-amber-600">{member.awsrole}</p>
      </CardContent>
    </Card>
  )
}

export function About() {
  return (
    <div className={layout.page}>
      <div className={cn(layout.container, layout.stack)}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            About the Developers &amp; APEX
          </h1>
          <p className="mt-1 text-xs font-normal text-neutral-500 sm:text-sm">
            Administrative Portal For Events Exchange (APEX) — Mapúa University
          </p>
        </div>

        <div className={cn("grid grid-cols-1 md:grid-cols-2", layout.gap)}>
          <div className={cn(layout.section, "space-y-3")}>
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

          <div className={cn(layout.section, "space-y-3")}>
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

        <div className={cn(layout.section, "space-y-4")}>
          <div className="flex items-center gap-3 pb-3">
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
        <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", layout.gap)}>
          {TEAM_MEMBERS.map((member) => (
            <DevCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </div>
  )
}
