export function PortfolioSection() {
  return (
    <div className="flex w-full flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm md:p-7 xl:col-span-2">
      <div>
        <h2 className="mb-1 text-xl font-bold text-[#1E293B] sm:text-2xl">
          Project & Event Portfolio
        </h2>
        <p className="mb-6 text-sm text-[#94A3B8]">
          Overall project health, upcoming events, and committee tasks.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 items-stretch gap-5 md:grid-cols-3">
        <div className="flex h-full flex-col justify-between gap-4 rounded-b-2xl border-t-4 border-[#3B82F6] bg-[#F8FAFC] p-5">
          <span className="text-sm font-extrabold tracking-wider text-[#3B82F6] uppercase">
            PLANNING
          </span>
          <div className="flex flex-1 flex-col justify-center gap-3 rounded-xl border border-neutral-100 bg-white p-6 shadow-2xs">
            <h3 className="text-xl leading-snug font-extrabold text-[#1E293B] sm:text-2xl">
              Charity Gala
            </h3>
            <div className="flex flex-col gap-1.5 text-sm text-[#64748B] sm:text-base">
              <p className="font-semibold">
                Health: <span className="font-bold text-[#10B981]">Green</span>
              </p>
              <p className="font-semibold">
                Tasks: <span className="font-bold text-[#1E293B]">5/10</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4 rounded-b-2xl border-t-4 border-[#F59E0B] bg-[#FFFBEB] p-5">
          <span className="text-sm font-extrabold tracking-wider text-[#F59E0B] uppercase">
            IN-PROGRESS
          </span>
          <div className="flex flex-1 flex-col justify-center gap-3 rounded-xl border border-neutral-100 bg-white p-6 shadow-2xs">
            <h3 className="text-xl leading-snug font-extrabold text-[#1E293B] sm:text-2xl">
              New Member Orientation
            </h3>
            <div className="flex flex-col gap-1.5 text-sm text-[#64748B] sm:text-base">
              <p className="font-semibold">
                Health: <span className="font-bold text-[#F59E0B]">Yellow</span>
              </p>
              <p className="font-semibold">
                Tasks: <span className="font-bold text-[#1E293B]">8/12</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-4 rounded-b-2xl border-t-4 border-[#10B981] bg-[#F0FDF4] p-5">
          <span className="text-sm font-extrabold tracking-wider text-[#10B981] uppercase">
            COMPLETED
          </span>
          <div className="flex flex-1 flex-col justify-center gap-3 rounded-xl border border-neutral-100 bg-white p-6 shadow-2xs">
            <h3 className="text-xl leading-snug font-extrabold text-[#1E293B] sm:text-2xl">
              Club Showcase
            </h3>
            <p className="pt-1 text-sm font-extrabold text-[#10B981] sm:text-base">
              Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
