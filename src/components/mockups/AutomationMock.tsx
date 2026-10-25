import { useEffect, useState } from "react";
import { MockFigure, Panel } from "./Frames";
import { useReducedMotion } from "../../lib/useReducedMotion";

const STEPS = [
  { title: "New lead", detail: "Instagram ad form · Rahul S.", tag: "Trigger" },
  { title: "Saved to CRM", detail: "Lead sheet · Source tagged", tag: "Action" },
  { title: "WhatsApp reply sent", detail: "“Thanks Rahul! Here's our price list…”", tag: "Action" },
  { title: "Team notified", detail: "Assigned to sales · Follow up in 24h", tag: "Action" },
];

/* A lead-handling workflow that lights up step by step. */
export default function AutomationMock({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(STEPS.length - 1);

  useEffect(() => {
    if (reduced) return;
    setActive(0);
    const id = window.setInterval(() => setActive((a) => (a + 1) % (STEPS.length + 1)), 1300);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <MockFigure label="Sample automation: a new lead is saved, answered on WhatsApp and assigned to the team automatically" className={className}>
      <Panel className="h-full p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[12px] font-medium text-ink">Lead follow-up workflow</p>
          <span className="flex items-center gap-1.5 text-[10.5px] text-live">
            <span className="size-1.5 rounded-full bg-live" /> Running
          </span>
        </div>
        <ol className="relative space-y-2.5">
          <svg className="absolute left-[15px] top-4 h-[calc(100%-2rem)] w-px overflow-visible" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="0" y2="100%" stroke="#33333f" strokeWidth="1.5" className="flow-line" />
          </svg>
          {STEPS.map((s, i) => {
            const on = i <= active;
            return (
              <li key={s.title} className="relative flex items-start gap-3">
                <span
                  className={`relative z-10 mt-0.5 grid size-[31px] shrink-0 place-items-center rounded-full border text-[11px] transition-colors duration-300 ${
                    on ? "border-violet bg-violet text-white" : "border-line-strong bg-[#101017] text-muted"
                  }`}
                >
                  {on ? "✓" : i + 1}
                </span>
                <div
                  className={`flex-1 rounded-xl border px-3 py-2 transition-[border-color,background-color,opacity] duration-300 ${
                    on ? "border-line-strong bg-white/[0.04] opacity-100" : "border-line bg-transparent opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-medium text-ink">{s.title}</p>
                    <span className="text-[9.5px] text-muted">{s.tag}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[10.5px] text-soft">{s.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Panel>
    </MockFigure>
  );
}
