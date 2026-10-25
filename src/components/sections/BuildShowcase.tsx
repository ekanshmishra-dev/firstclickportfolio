import { useRef, useState, type KeyboardEvent } from "react";
import { SERVICES } from "../../data/services";
import ServiceMock from "../mockups/ServiceMock";
import Button, { Arrow } from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const TAB_LABEL: Record<string, string> = {
  "website-development": "Websites",
  "app-development": "Apps",
  "business-automation": "Automation",
  "social-media-management": "Social media",
  "content-and-reels": "Reels",
  "digital-marketing": "Marketing",
  "meta-ads": "Meta Ads",
};

/* One tab per service; each shows a working example of the deliverable. */
export default function BuildShowcase({ id = "services", headingAs = "h2" }: { id?: string; headingAs?: "h1" | "h2" }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SERVICES[active];

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + SERVICES.length) % SERVICES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id={id} className="scroll-mt-20 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          as={headingAs}
          kicker="What we build"
          title="Everything your business needs to grow online."
          intro="Pick a service to see the kind of work you get. Every example below is built in code, the same way we build for clients."
        />

        <Reveal>
          <div role="tablist" aria-label="Services" onKeyDown={onKey} className="mb-8 flex flex-wrap gap-2">
            {SERVICES.map((svc, i) => (
              <button
                key={svc.slug}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${svc.slug}`}
                aria-selected={i === active}
                aria-controls="build-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`h-11 shrink-0 cursor-pointer rounded-full border px-5 text-[15px] transition-colors duration-200 ${
                  i === active ? "border-ink bg-ink text-ground" : "border-line text-soft hover:border-line-strong hover:text-ink"
                }`}
              >
                {TAB_LABEL[svc.slug]}
              </button>
            ))}
          </div>

          <div
            id="build-panel"
            role="tabpanel"
            aria-labelledby={`tab-${s.slug}`}
            className="grid overflow-hidden rounded-[22px] border border-line bg-raised lg:grid-cols-12"
          >
            <div key={s.slug} className="rise flex flex-col p-7 md:p-10 lg:col-span-5">
              <h3 className="text-title text-ink">{s.title}</h3>
              <p className="mt-4 text-soft">{s.long}</p>
              <ul className="mt-7 space-y-2.5">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[15px] text-ink">
                    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-violet-soft" fill="none" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-10">
                <Button to={`/contact?service=${s.slug}`}>
                  Start with this <Arrow />
                </Button>
                <Button to={`/services#${s.slug}`} variant="link">
                  Service details
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center overflow-hidden border-t border-line bg-ground/60 p-6 md:p-10 lg:col-span-7 lg:border-l lg:border-t-0">
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
              <div key={s.slug} className="rise relative w-full max-w-[560px]">
                <ServiceMock kind={s.mock} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
