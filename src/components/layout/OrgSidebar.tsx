import { Link, useLocation } from "react-router"
import {
  Home,
  XCircle,
  Bell,
  HelpCircle,
  Settings,
  Users
} from "lucide-react"

// Import the apex brand SVG logo
import apexLogo from "@/assets/apex-brand.svg"

export function OrgSidebar() {
  const location = useLocation()
  
  const navLinks = [
    { name: "Dashboard", href: "/org-dashboard", icon: Home },
    { name: "Submissions", href: "/submissions", icon: XCircle },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Guidelines", href: "/guidelines", icon: HelpCircle },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About the Devs", href: "/about", icon: Users },
  ]

  return (
    <div className="w-64 bg-[#8B0000] text-white flex flex-col h-screen shrink-0 shadow-lg">
      <div className="p-6 flex flex-col gap-6 flex-1">
        
        {/* Brand Block */}
        <div className="flex flex-col items-center gap-4 mt-4 mb-2">
          <img src={apexLogo} alt="APEX Logo" className="w-40 h-auto object-contain" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-1 mt-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href || (location.pathname.startsWith(link.href) && link.href !== '/');
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold ${
                  isActive 
                    ? "bg-white text-[#1E293B]" 
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Workspace Anchor */}
      <div className="mt-auto">
        <div className="bg-[#333333] p-4 m-5 rounded-xl flex flex-col gap-1 border border-[#404040] shadow-md">
          <span className="text-sm font-bold text-white tracking-wide">Jedrick Darren Ocenar</span>
          <span className="text-xs text-[#EAB308] font-semibold">AWS-SBG Arcus President</span>
        </div>
      </div>
    </div>
  )
}
