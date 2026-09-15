import { X, Megaphone, Calendar, AlertCircle, Bookmark } from "lucide-react"
import { useOrgStore, type Announcement } from "@/stores/org-store"
import { layout } from "@/config"
import { cn } from "@/lib/utils"

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  selectedAnnouncement?: Announcement | null
}

export function AnnouncementModal({ isOpen, onClose, selectedAnnouncement }: AnnouncementModalProps) {
  const { announcements } = useOrgStore()

  if (!isOpen) return null

  // If a specific announcement was selected, put it first in the array
  const displayAnnouncements = selectedAnnouncement
    ? [selectedAnnouncement, ...announcements.filter(a => a.id !== selectedAnnouncement.id)]
    : announcements;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[90vh]">
        
        {/* Institutional Bulletin Header */}
        <div className="px-8 pt-7 pb-5 border-b border-neutral-200/80 bg-[#F8FAFC] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9291C] text-white flex items-center justify-center shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1E293B]">Institutional Bulletin Board</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D9291C] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                  Official Memos
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Administrative notices, SAAF policy timelines, and facility maintenance updates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 rounded-full hover:bg-neutral-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Bulletin Board Posts */}
        <div className={cn("flex-1 overflow-y-auto bg-page p-6 sm:p-8", layout.stack)}>
          {displayAnnouncements.length === 0 ? (
            <div className={cn(layout.section, "flex flex-col items-center justify-center p-12 text-center text-[#94A3B8]")}>
              <Megaphone className="w-8 h-8 text-neutral-300 mb-3" />
              <h3 className="text-sm font-bold text-[#1E293B] mb-1">No announcements at this time</h3>
              <p className="text-xs text-[#64748B]">Official administrative notices and memorandums will appear here.</p>
            </div>
          ) : (
            displayAnnouncements.map((post) => (
              <div
                key={post.id}
                className={cn(layout.sectionFlush, "transition-all hover:shadow-md")}
              >
                {/* Post Header Line */}
                <div className="px-7 pt-5 pb-3 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${
                      post.category === 'Policy'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : post.category === 'System'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}>
                      {post.category} Notice
                    </span>

                    {post.memoNumber && (
                      <span className="text-xs font-mono text-[#64748B] font-semibold bg-neutral-100 px-2.5 py-0.5 rounded-md">
                        {post.memoNumber}
                      </span>
                    )}

                    {post.isImportant && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> High Priority
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Effective: {post.dateRange}</span>
                  </div>
                </div>

                {/* Headline Title */}
                <div className="px-7 pt-5 pb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] leading-snug">
                    {post.title}
                  </h3>
                </div>

                {/* Formatted Memo Body Text Container (Internal Scroll for Long Content) */}
                <div className="mx-7 mb-5 p-5 sm:p-6 bg-[#F8FAFC] rounded-xl border border-neutral-200/80 max-h-[250px] overflow-y-auto pr-3 scrollbar-thin shadow-inner">
                  <p className="text-xs sm:text-sm text-[#334155] font-sans leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Post Footer / Author Sign-off */}
                <div className="px-7 py-3.5 bg-[#F8FAFC] border-t border-neutral-100 flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#D9291C]" />
                    <span className="font-semibold text-[#1E293B]">{post.author}</span>
                    <span className="text-[#94A3B8]">• {post.authorRole}</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] font-medium">APEX Institutional Bulletin</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white border-t border-neutral-200/80 shrink-0 flex justify-between items-center">
          <span className="text-xs text-[#94A3B8]">
            Showing {displayAnnouncements.length} official memorandum posts
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1E293B] text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close Bulletin Board
          </button>
        </div>

      </div>
    </div>
  )
}
