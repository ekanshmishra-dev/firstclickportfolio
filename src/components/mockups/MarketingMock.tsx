import { MockFigure, Panel, SampleTag } from "./Frames";

const SOURCES = [
  { name: "Google search", visits: 1240, enquiries: 38, color: "#7c5cff" },
  { name: "Instagram", visits: 980, enquiries: 29, color: "#e879a6" },
  { name: "Google Maps", visits: 610, enquiries: 24, color: "#34d399" },
  { name: "Direct", visits: 370, enquiries: 9, color: "#d4a373" },
];

const LINE = [22, 30, 27, 38, 44, 41, 52, 58, 55, 64, 70, 76];

/* Where enquiries come from: the tracking every campaign starts with. Totals add up: 3,200 visits, 100 enquiries. */
export default function MarketingMock({ className = "" }: { className?: string }) {
  const totalVisits = SOURCES.reduce((a, s) => a + s.visits, 0);
  const totalEnq = SOURCES.reduce((a, s) => a + s.enquiries, 0);
  const pts = LINE.map((v, i) => `${(i / (LINE.length - 1)) * 100},${100 - v}`).join(" ");
  return (
    <MockFigure label="Sample marketing analytics showing website visits and enquiries by traffic source" className={className}>
      <Panel className="h-full p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-ink">Enquiries by source · This month</p>
            <p className="mt-1 font-display text-[22px] font-semibold tracking-tight text-ink">
              {totalEnq} <span className="text-[12px] font-normal text-muted">from {totalVisits.toLocaleString("en-IN")} visits</span>
            </p>
          </div>
          <SampleTag />
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-[70px] w-full">
          <polyline points={`0,100 ${pts} 100,100`} fill="rgb(124 92 255 / 0.12)" stroke="none" />
          <polyline points={pts} fill="none" stroke="#7c5cff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <ul className="mt-3 space-y-1.5">
          {SOURCES.map((s) => (
            <li key={s.name} className="flex items-center gap-2.5 text-[10.5px]">
              <span className="size-2 rounded-full" style={{ background: s.color }} />
              <span className="w-24 text-soft">{s.name}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <span className="block h-full rounded-full" style={{ width: `${(s.enquiries / 38) * 100}%`, background: s.color }} />
              </span>
              <span className="w-6 text-right text-ink">{s.enquiries}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </MockFigure>
  );
}
