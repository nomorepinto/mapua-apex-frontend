import {
  Building2Icon,
  Code2Icon,
  GraduationCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"
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
  { name: "Jedrick", coorole: "Organization's Welfare and Advocacy Committee 25-26", awsrole: "Chief Executive Officer 26-27", photo: JedrickPhoto },
  { name: "Nigel", coorole: "External Relations Co-Head 25-26", awsrole: "Chief Operations Officer: 26-27", photo: NigelPhoto },
  { name: "Mico", coorole: "", awsrole: "Corporate Secretary: 26-27", photo: MicoPhoto },
  { name: "Ryan", coorole: "Organization's Welfare and Advocacy Head 25-26", awsrole: "Chief Technology Officer: 26-27", photo: RyanPhoto },
  { name: "Agatha", coorole: "", awsrole: "Chief People Officer: 26-27", photo: AgathaPhoto },
  { name: "Bea", coorole: "Creatives Committee 25-26", awsrole: "Chief Communications Officer: 26-27", photo: BeaPhoto },
  { name: "Nicole", coorole: "Organization's Welfare and Advocacy Co-Head 25-26", awsrole: "Chief Finance Officer: 26-27", photo: NicolePhoto },
  { name: "Karina", coorole: "External Relations Co-Head 25-26",awsrole: "Chief Auditing Officer: 26-27", photo: KarinaPhoto },
  { name: "Aviel", coorole: "External Relations Head 25-26", awsrole: "Chief External Relations Officer: 26-27", photo: AvielPhoto },
  { name: "Benedict", coorole: "His Imperial Majesty, the Supreme Overlord 25-26", awsrole: "Chief Community Relations Officer: 26-27", photo: BenedictPhoto },
  { name: "Joel", coorole: "", awsrole: "Technology Committee: 26-27", photo: JoelPhoto },
  { name: "Luna", coorole: "", awsrole: "President of the World: 26-27", photo: LunaPhoto },
]

const TECH_STACK = [
  { name: "React", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { name: "TypeScript", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "React Router (Data Mode)", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { name: "Tailwind CSS", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { name: "Coss UI", color: "bg-neutral-100 text-neutral-700 border-neutral-300" },
  { name: "Zustand", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "AWS SES", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "AWS Cognito", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { name: "AWS DynamoDB", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { name: "AWS Lambda", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
]

function DevCard({ member }: { member: TeamMember }) {
  return (
    <div className={cn(layout.section, "group overflow-hidden !p-0 transition-shadow duration-300 hover:shadow-lg")}>
      {/* Photo */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2.5">
        <h3 className="text-lg font-extrabold tracking-tight text-[#1E293B]">
          {member.name}
        </h3>

        <div className="space-y-1.5 min-h-[3.5rem]">
          {/* Primary role: COO role — visually dominant */}
          {member.coorole && (
            <div className="flex items-start gap-2">
              <div className="mt-0.5 w-1 self-stretch shrink-0 rounded-full bg-[#D9291C]" />
              <p className="text-xs font-bold leading-snug text-[#8B0000]">
                {member.coorole}
              </p>
            </div>
          )}

          {/* Secondary role: AWS role — visually subordinate */}
          {member.awsrole && (
            <div className="flex items-start gap-2">
              <div className={cn(
                "mt-0.5 w-1 self-stretch shrink-0 rounded-full",
                member.coorole ? "bg-amber-300" : "bg-amber-400"
              )} />
              <p className={cn(
                "leading-snug",
                member.coorole
                  ? "text-[11px] font-medium text-amber-700"
                  : "text-xs font-semibold text-amber-700"
              )}>
                {member.awsrole}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <div className={layout.page}>
      <div className={cn(layout.container, layout.stack)}>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            About APEX
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Administrative Portal For Events Exchange — Mapúa University
          </p>
        </div>

        {/* System Description + Institutional Alignment */}
        <div className={cn("grid grid-cols-1 md:grid-cols-2", layout.gap)}>
          <div className={cn(layout.section, "space-y-3")}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#D9291C]">
                <Building2Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">
                  System Description
                </h2>
                <p className="text-[11px] text-[#94A3B8]">What APEX does</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#475569]">
              APEX streamlines the student activity proposal, review, and
              approval process across all academic departments, student
              councils, and organizations at Mapúa University. From drafting the
              Student Activity Approval Form (SAAF) to tracking multi-level
              signatory routing, APEX replaces manual paper workflows with a
              real-time digital pipeline.
            </p>
          </div>

          <div className={cn(layout.section, "space-y-3")}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <ShieldCheckIcon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">
                  Unified Institutional Alignment
                </h2>
                <p className="text-[11px] text-[#94A3B8]">Why it matters</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#475569]">
              Every co-curricular and extra-curricular activity submitted
              through APEX is validated against the institution's vision, core
              values, Program Educational Objectives (PEO), and the United
              Nations Sustainable Development Goals (SDGs) — ensuring purposeful
              student engagement and transparent governance at every level.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className={layout.section}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Code2Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">
                Tech Stack
              </h2>
              <p className="text-[11px] text-[#94A3B8]">Built with modern, production-grade tooling</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech.name}
                className={cn(
                  "inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-bold",
                  tech.color
                )}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Development Team Section */}
        <div className={layout.section}>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <UsersIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">
                Development Team
              </h2>
              <p className="text-[11px] text-[#94A3B8]">The people behind the portal</p>
            </div>
          </div>

          {/* Role legend */}
          <div className="flex flex-wrap items-center gap-4 mt-3 mb-5 pl-0.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D9291C]" />
              <span className="text-[11px] font-semibold text-[#64748B]">Council of Organizations Role</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-[11px] font-semibold text-[#64748B]">AWS-SBG Arcus Role</span>
            </div>
          </div>
        </div>

        {/* Developer Cards Grid */}
        <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", layout.gap)}>
          {TEAM_MEMBERS.map((member) => (
            <DevCard key={member.name} member={member} />
          ))}
        </div>

        {/* Footer accent */}
        <div className="flex items-center justify-center gap-2 py-4 text-[#94A3B8]">
          <SparklesIcon className="h-3.5 w-3.5" />
          <p className="text-[11px] font-semibold tracking-wide">
            Crafted with passion at Mapúa University
          </p>
          <GraduationCapIcon className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}
