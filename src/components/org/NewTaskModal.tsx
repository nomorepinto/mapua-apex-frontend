import { useNewTaskForm } from "@/hooks/use-new-task-form"

interface NewTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const {
    title,
    setTitle,
    responsible,
    setResponsible,
    dueDate,
    setDueDate,
    canSubmit,
    handleSubmit,
  } = useNewTaskForm(onClose)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-[#1E293B]">New Task</h2>
          <button 
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-[#1E293B] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Task Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Complete security audit"
              className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl text-sm text-[#1E293B] placeholder:text-neutral-400 px-4 py-2.5 focus:outline-none focus:border-[#D9291C] focus:ring-1 focus:ring-[#D9291C]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Responsible Person/Team</label>
            <input 
              type="text" 
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="E.g., Benedict V. (Events Head)"
              className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl text-sm text-[#1E293B] placeholder:text-neutral-400 px-4 py-2.5 focus:outline-none focus:border-[#D9291C] focus:ring-1 focus:ring-[#D9291C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Due Date (Optional)</label>
            <input 
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl text-sm text-[#1E293B] px-4 py-2.5 focus:outline-none focus:border-[#D9291C] focus:ring-1 focus:ring-[#D9291C]"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!canSubmit}
              className="bg-[#D9291C] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B91C1C] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
