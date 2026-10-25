import { MockFigure, Panel, SampleTag } from "./Frames";

const DAYS = [38, 52, 44, 61, 58, 72, 80];
const METRICS = [
  ["Leads", "142"],
  ["Cost / lead", "₹86"],
  ["Spend", "₹12,212"],
];

/* A Meta Ads results panel with sample numbers (142 × ₹86 ≈ ₹12,212). */
export default function AdsMock({ className = "" }: { className?: string }) {
  const max = Math.max(...DAYS);
  return (
    <MockFigure label="Sample Meta Ads dashboard showing leads, cost per lead and spend for a campaign" className={className}>
      <Panel className="h-full p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-medium text-ink">Lead campaign · Instagram + Facebook</p>
            <p className="mt-0.5 text-[10.5px] text-muted">Last 7 days</p>
          </div>
          <SampleTag />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {METRICS.map(([k, v]) => (
            <div key={k} className="rounded-lg bg-white/[0.04] px-2.5 py-2">
              <p className="text-[10px] text-muted">{k}</p>
              <p className="mt-0.5 font-display text-[16px] font-semibold tracking-tight text-ink">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-[92px] items-end gap-1.5">
          {DAYS.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`bar-grow w-full rounded-[4px] ${i === DAYS.length - 1 ? "bg-violet" : "bg-white/[0.12]"}`}
                style={{ height: `${(d / max) * 76}px`, animationDelay: `${i * 70}ms` }}
              />
              <span className="text-[9px] text-muted">{"MTWTFSS"[i]}</span>
            </div>
          ))}
        </div>
      </Panel>
    </MockFigure>
  );
}
