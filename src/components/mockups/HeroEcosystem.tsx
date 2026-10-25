import { useRef, type CSSProperties, type PointerEvent } from "react";
import WebsiteMock from "./WebsiteMock";
import AppMock from "./AppMock";
import { Panel } from "./Frames";
import { WhatsAppIcon } from "../layout/WhatsAppFab";
import { useReducedMotion } from "../../lib/useReducedMotion";

/* Layer offset driven by --px/--py (-1..1) so moving the pointer never re-renders React. */
const depth = (d: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * ${d}px), calc(var(--py, 0) * ${d}px), 0)`,
  transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
});

/* Hero composition: website + app + automation alert + ad result, the four things a client buys. */
export default function HeroEcosystem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    ref.current.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label="A website, a mobile app, a WhatsApp lead alert and a Meta Ads result: the pieces FIRST CLICK builds and connects"
      data-ui
      className="relative mx-auto aspect-[1/0.86] w-full max-w-[620px] select-none"
    >
      <div className="absolute left-0 top-[6%] w-[84%]" style={depth(-8)}>
        <WebsiteMock />
      </div>

      <div className="absolute bottom-0 right-0 h-[74%] w-[35%] min-w-[150px]" style={depth(14)}>
        <div className="drift h-full">
          <AppMock className="h-full" />
        </div>
      </div>

      <div className="absolute right-[6%] top-0 w-[56%] max-w-[300px]" style={depth(20)}>
        <div className="notify-loop" style={{ animationDelay: "1.2s" }}>
          <Panel className="flex items-center gap-3 px-3.5 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-live/15">
              <WhatsAppIcon className="size-[18px] text-live" />
            </span>
            <span className="min-w-0 text-[12px] leading-snug">
              <span className="block font-medium text-ink">New enquiry from your website</span>
              <span className="block truncate text-soft">Auto-reply sent · Added to leads</span>
            </span>
          </Panel>
        </div>
      </div>

      <div className="absolute bottom-[8%] left-[4%] w-[44%] max-w-[240px]" style={depth(10)}>
        <Panel className="px-4 py-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-soft">Meta Ads · Leads this week</span>
            <span className="size-1.5 rounded-full bg-live" />
          </div>
          <div className="mt-1.5 flex items-end justify-between gap-3">
            <span className="font-display text-[26px] font-semibold leading-none tracking-tight text-ink">142</span>
            <span className="flex h-7 items-end gap-[3px]">
              {[30, 45, 38, 60, 55, 75, 100].map((h, i) => (
                <span key={i} className={`bar-grow w-[5px] rounded-[2px] ${i === 6 ? "bg-violet" : "bg-white/20"}`} style={{ height: `${h}%`, animationDelay: `${600 + i * 60}ms` }} />
              ))}
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
}
