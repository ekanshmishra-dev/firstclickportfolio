import { useEffect, useRef, useState } from "react";
import { PROCESS } from "../../data/company";
import SectionHeading from "../ui/SectionHeading";

/* Four steps on one line; the rail fills and each step lights up as the section scrolls through. */
export default function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const reached = Math.floor(progress * PROCESS.length + 0.15);

  return (
    <section className="border-t border-line bg-raised/40 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading kicker="How we work" title="From idea to growth." intro="A simple process with clear check-ins. You always know what's happening and what comes next." />

        <ol ref={ref} className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          <div className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-line md:hidden" aria-hidden="true">
            <div className="h-full w-full origin-top bg-violet" style={{ transform: `scaleY(${progress})` }} />
          </div>
          <div className="absolute left-0 top-[15px] hidden h-px w-full bg-line md:block" aria-hidden="true">
            <div className="h-full w-full origin-left bg-violet" style={{ transform: `scaleX(${progress})` }} />
          </div>
          {PROCESS.map((step, i) => {
            const on = i < reached;
            return (
              <li key={step.title} className="relative pl-12 md:pl-0 md:pt-14">
                <span
                  className={`absolute left-0 top-0 grid size-[31px] place-items-center rounded-full border text-[13px] font-medium transition-colors duration-500 ${
                    on ? "border-violet bg-violet text-white" : "border-line-strong bg-ground text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className={`text-title transition-colors duration-500 ${on ? "text-ink" : "text-muted"}`}>{step.title}</h3>
                <p className="mt-3 text-soft">{step.desc}</p>
                <p className="mt-5 inline-flex rounded-full border border-line px-3 py-1 text-[14px] text-soft">{step.output}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
