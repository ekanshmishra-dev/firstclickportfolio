import { MockFigure, PhoneFrame } from "./Frames";

/* A sample booking app screen. */
export default function AppMock({ className = "" }: { className?: string }) {
  const slots = ["10:00", "11:30", "1:00", "2:30", "4:30", "6:00"];
  return (
    <MockFigure label="Sample mobile booking app built by FIRST CLICK" className={className}>
      <PhoneFrame className="h-full">
        <div className="flex h-full flex-col px-4 pb-3 pt-9 text-ink">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted">Good evening</p>
              <p className="font-display text-[15px] font-semibold tracking-tight">Priya</p>
            </div>
            <span className="grid size-7 place-items-center rounded-full bg-violet/20 text-[10px] text-violet-soft">P</span>
          </div>

          <div className="mt-4 rounded-2xl bg-violet p-3.5 text-white">
            <p className="text-[9.5px] opacity-80">Upcoming</p>
            <p className="mt-0.5 text-[13px] font-semibold">Hair spa &amp; styling</p>
            <div className="mt-3 flex items-center justify-between text-[10px]">
              <span>Fri, 4:30 PM</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5">Confirmed</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] font-medium">Pick a time · Saturday</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {slots.map((s, i) => (
              <span
                key={s}
                className={`rounded-lg py-1.5 text-center text-[10px] ${
                  i === 2 ? "bg-ink text-ground" : i === 4 ? "bg-white/[0.03] text-muted line-through" : "bg-white/[0.06] text-soft"
                }`}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-1.5">
            {[
              ["Loyalty points", "320"],
              ["Visits this year", "7"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-[10.5px]">
                <span className="text-soft">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex justify-around border-t border-line pt-2.5 text-[9px] text-muted">
            <span className="text-violet-soft">Home</span>
            <span>Book</span>
            <span>Offers</span>
            <span>Profile</span>
          </div>
        </div>
      </PhoneFrame>
    </MockFigure>
  );
}
