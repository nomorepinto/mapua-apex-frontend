import { useNewEventForm } from "@/hooks/use-new-event-form"

interface NewEventModalProps {
  isOpen: boolean
  onClose: () => void
  defaultDate?: Date
}

export function NewEventModal({ isOpen, onClose, defaultDate }: NewEventModalProps) {
  const { title, setTitle, date, setDate, canSubmit, handleSubmit } =
    useNewEventForm(defaultDate, onClose)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6 bg-black/40 backdrop-blur-sm font-sans">
      <div className="bg-[#F2F2F7] w-full sm:max-w-md h-[90vh] sm:h-auto sm:rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-200 flex flex-col rounded-t-2xl">
        
        <div className="flex items-center justify-between p-4 bg-white border-b border-neutral-200/60 sticky top-0 z-10">
          <button 
            onClick={onClose}
            type="button"
            className="text-[17px] text-[#D9291C] hover:opacity-70 transition-opacity"
          >
            Cancel
          </button>
          <h2 className="text-[17px] font-semibold text-black">New Event</h2>
          <button 
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="text-[17px] font-semibold text-[#D9291C] hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl overflow-hidden">
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-[17px] text-black placeholder:text-neutral-400 px-4 py-3 focus:outline-none border-b border-neutral-100"
              autoFocus
            />
          </div>

          <div className="bg-white rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[17px] text-black">Date</span>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-neutral-100 rounded-md text-[17px] text-black px-3 py-1.5 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
