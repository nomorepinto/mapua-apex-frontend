import type { Activity } from "./activity.types"

// ─── Static data hoisted at module level (server-hoist-static-io) ─────────────

export interface StatItem {
  label: string
  value: string
  badgeText: string
  badgeVariant: "amber" | "emerald" | "rose" | "neutral"
}

export const STATS: StatItem[] = [
  {
    label: "Pending Review",
    value: "07",
    badgeText: "Action Required",
    badgeVariant: "amber",
  },
  {
    label: "Total Approved",
    value: "42",
    badgeText: "Authorized",
    badgeVariant: "emerald",
  },
  {
    label: "Returned for Revision",
    value: "04",
    badgeText: "Needs Edits",
    badgeVariant: "rose",
  },
  {
    label: "Total Reviewed",
    value: "53",
    badgeText: "Term Cumulative",
    badgeVariant: "neutral",
  },
]

export const ACTIVITIES: Activity[] = [
  {
    id: "ACT-2026-001",
    title: "Fall Campus Concert",
    org: "Alpha Student Org",
    representative: "Kyle Rogers",
    department: "Student Affairs & Organizations",
    date: "November 18, 2025",
    time: "10:00 AM - 5:00 PM",
    submittedDate: "Oct 12, 2025",
    priority: "High",
    decision: "Review",
    type: "Extra-curricular",
    status: "Review",
    venue: "Grand Hall, Building D",
    expectedParticipants: 67,
    proposedBudget: "$4,500.00 USD",
    advisorSignoff: "Verified",
    description:
      "An inspiring onboarding journey designed to welcome incoming freshmen into the heart of Mapúa's student life while equipping organizational leaders with practical financial management skills. This series bridges the gap between new students and current leaders, showcasing how sound financial stewardship and active organizational involvement go hand in hand with academic success and personal growth. By transcending institutional boundaries, we empower freshmen to view their first steps in an organization not just as a campus activity, but as the foundation for future national-scale leadership grounded in accountability, integrity, and financial literacy.",
    proponents: [
      { role: "Executive", name: "Kyle Rogers" },
      { role: "Executive", name: "Sophia Chen" },
      { role: "Executive", name: "Marcus Vance" },
    ],
    objectives: [
      {
        title: "Unlock Academic Thriving",
        description:
          "Demonstrate how organizational involvement provides the support network, time-management skills, and peer mentorship essential for navigating the rigors of Mapúa's academic life.",
      },
      {
        title: "Cultivate Resilience",
        description:
          "Provide incoming and current student leaders with the mental and strategic tools to navigate complex challenges, teaching them how to turn organizational obstacles into opportunities for growth.",
      },
      {
        title: "Ignite Organizational Passion",
        description:
          "Introduce incoming students to a growth-oriented mindset and encourage them to engage in multisectoral advocacy and in national youth networks at Mapúa.",
      },
      {
        title: "Foster Collaboration",
        description:
          "Showcase the power of cooperation and collaboration, helping new students find their \"group\" and understand their potential.",
      },
    ],
  },
  {
    id: "ACT-2026-002",
    title: "AI Hackathon Hack-Fest",
    org: "Beta Tech Guild",
    representative: "Alicia Tanaka",
    department: "School of Information Technology",
    date: "November 24, 2025",
    time: "8:00 AM - 8:00 PM",
    submittedDate: "Oct 14, 2025",
    priority: "Medium",
    decision: "Review",
    type: "Co-curricular",
    status: "Review",
    venue: "Innovation Hub, 4th Floor",
    expectedParticipants: 120,
    proposedBudget: "$3,200.00 USD",
    advisorSignoff: "Verified",
    description:
      "A 24-hour rapid prototyping hackathon focusing on generative AI for civic and sustainability solutions. Students collaborate in multidisciplinary teams mentored by technology industry practitioners.",
    proponents: [
      { role: "Lead Organizer", name: "Alicia Tanaka" },
      { role: "Technical Chair", name: "David Kim" },
      { role: "Logistics Head", name: "Elena Rostova" },
    ],
    objectives: [
      {
        title: "Accelerate Practical AI Skills",
        description:
          "Enable participants to build functional software agents and AI integrations within strict time constraints.",
      },
      {
        title: "Foster Cross-Discipline Collaboration",
        description:
          "Pair software engineers with domain designers and business planners to solve realistic campus challenges.",
      },
      {
        title: "Promote Ethical Computing",
        description:
          "Mandate bias and safety testing criteria in every submitted software prototype.",
      },
      {
        title: "Bridge University to Industry",
        description:
          "Connect outstanding students directly with participating technology sponsor talent scouts.",
      },
    ],
  },
  {
    id: "ACT-2026-003",
    title: "Shakespeare Night Play",
    org: "Gamma Drama Club",
    representative: "Julian Rivera",
    department: "School of Arts & Social Sciences",
    date: "December 02, 2025",
    time: "6:00 PM - 9:30 PM",
    submittedDate: "Oct 15, 2025",
    priority: "Low",
    decision: "Review",
    type: "Extra-curricular",
    status: "Review",
    venue: "Main Auditorium, Arts Wing",
    expectedParticipants: 250,
    proposedBudget: "$1,800.00 USD",
    advisorSignoff: "Verified",
    description:
      "A contemporary theatrical adaptation of Shakespeare's classic plays, featuring student actors, costume designers, and technical crew from diverse university faculties.",
    proponents: [
      { role: "Artistic Director", name: "Julian Rivera" },
      { role: "Stage Manager", name: "Camila Gomez" },
      { role: "Production Head", name: "Leo Santos" },
    ],
    objectives: [
      {
        title: "Enrich Cultural Expression",
        description:
          "Offer students an artistic platform to explore timeless classical drama through modernized theatrical themes.",
      },
      {
        title: "Cultivate Performing Arts Confidence",
        description:
          "Enhance public speaking, creative poise, and stagecraft discipline for participating performers.",
      },
      {
        title: "Engage the University Community",
        description:
          "Provide an accessible, inspiring cultural evening for the faculty, staff, and student body.",
      },
      {
        title: "Strengthen Technical Theatre Skills",
        description:
          "Equip backstage crew members with hands-on lighting, acoustics, and stage coordination expertise.",
      },
    ],
  },
  {
    id: "ACT-2026-004",
    title: "Autonomous Drone Expo & Trials",
    org: "Delta Robotics Society",
    representative: "Miguel Alvarez",
    department: "School of Electrical & Electronics Engineering",
    date: "December 10, 2025",
    time: "9:00 AM - 4:00 PM",
    submittedDate: "Oct 16, 2025",
    priority: "High",
    decision: "Return",
    type: "Co-curricular",
    status: "Returned",
    venue: "University Quadrangle Field",
    expectedParticipants: 180,
    proposedBudget: "$5,100.00 USD",
    advisorSignoff: "Pending",
    description:
      "Indoor and outdoor flight exhibition demonstrating custom-built autonomous navigation drones and vision sensor pipelines. Returned to proponents for additional safety perimeter clearance documentation.",
    proponents: [
      { role: "Executive", name: "Miguel Alvarez" },
      { role: "Executive", name: "Nadine Cruz" },
      { role: "Executive", name: "Patrick Zhao" },
    ],
    objectives: [
      {
        title: "Showcase Mechatronics Innovation",
        description:
          "Demonstrate proprietary flight controller algorithms and sensor payload telemetry in real-time test runs.",
      },
      {
        title: "Institutional Safety Compliance",
        description:
          "Establish rigorous UAV testing guidelines and emergency shutdown protocols for open campus spaces.",
      },
    ],
  },
  {
    id: "ACT-2026-005",
    title: "Annual Student Art Fair",
    org: "Epsilon Arts Circle",
    representative: "Hannah Reyes",
    department: "School of Architecture & Design",
    date: "December 15, 2025",
    time: "1:00 PM - 7:00 PM",
    submittedDate: "Oct 18, 2025",
    priority: "Low",
    decision: "Reject",
    type: "Extra-curricular",
    status: "Returned",
    venue: "Design Gallery & Atrium",
    expectedParticipants: 90,
    proposedBudget: "$1,200.00 USD",
    advisorSignoff: "Pending",
    description:
      "Student visual arts exhibition and crafts booth. Rejected due to scheduling conflict with final examination week facility maintenance regulations.",
    proponents: [
      { role: "Executive", name: "Hannah Reyes" },
      { role: "Executive", name: "Oliver Bautista" },
      { role: "Executive", name: "Claire Delgado" },
    ],
    objectives: [
      {
        title: "Promote Student Artists",
        description:
          "Provide exposure and portfolio presentation opportunities for aspiring university visual artists.",
      },
    ],
  },
]

// Build dept → org lookup once at module level (js-index-maps)
export const DEPARTMENT_ORG_MAP: Record<string, string[]> = {}
for (const a of ACTIVITIES) {
  if (!DEPARTMENT_ORG_MAP[a.department]) DEPARTMENT_ORG_MAP[a.department] = []
  if (!DEPARTMENT_ORG_MAP[a.department].includes(a.org))
    DEPARTMENT_ORG_MAP[a.department].push(a.org)
}

export const DEPARTMENTS = Object.keys(DEPARTMENT_ORG_MAP)
