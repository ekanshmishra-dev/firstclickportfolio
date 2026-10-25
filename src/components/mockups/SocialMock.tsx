import { MockFigure, Panel } from "./Frames";

const WEEK = [
  { d: "Mon", type: "Reel", t: "Before / after", c: "#7c5cff" },
  { d: "Tue", type: "Post", t: "Offer of the week", c: "#d4a373" },
  { d: "Wed", type: "Story", t: "Behind the scenes", c: "#34d399" },
  { d: "Thu", type: "Reel", t: "Client question", c: "#7c5cff" },
  { d: "Fri", type: "Carousel", t: "5 tips", c: "#e879a6" },
  { d: "Sat", type: "Story", t: "Poll", c: "#34d399" },
];

const TILES = ["#2a2140", "#3b2a22", "#1d2b26", "#30202a", "#22223a", "#2f2a1d"];

/* A monthly content plan beside the profile grid it produces. */
export default function SocialMock({ className = "" }: { className?: string }) {
  return (
    <MockFigure label="Sample social media content calendar and Instagram profile grid" className={className}>
      <Panel className="grid h-full grid-cols-5 gap-4 p-4 sm:p-5">
        <div className="col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-medium text-ink">Content calendar · Week 2</p>
            <span className="text-[10.5px] text-muted">6 scheduled</span>
          </div>
          <ul className="space-y-1.5">
            {WEEK.map((w) => (
              <li key={w.d} className="flex items-center gap-2.5 rounded-lg bg-white/[0.035] px-2.5 py-1.5 text-[10.5px]">
                <span className="w-7 text-muted">{w.d}</span>
                <span className="h-4 w-1 rounded-full" style={{ background: w.c }} />
                <span className="flex-1 truncate text-ink">{w.t}</span>
                <span className="text-muted">{w.type}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-7 rounded-full bg-gradient-to-br from-[#d4a373] to-[#7c5cff] p-[2px]">
              <span className="block size-full rounded-full bg-[#101017]" />
            </span>
            <div className="text-[10px] leading-tight">
              <p className="font-medium text-ink">yourbrand</p>
              <p className="text-muted">Profile</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {TILES.concat(TILES.slice(0, 3)).map((c, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-[4px]" style={{ background: c }}>
                <span className="absolute bottom-1 left-1 h-1 w-1/2 rounded-full bg-white/25" />
                {i % 3 === 0 && (
                  <svg viewBox="0 0 10 10" className="absolute right-1 top-1 size-2.5 text-white/70" fill="currentColor">
                    <path d="M3 2l5 3-5 3z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </MockFigure>
  );
}
