import { Link } from "react-router-dom";
import { INDUSTRIES } from "../../data/company";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const STAGES = [
  { stage: "Get noticed", line: "People discover you.", items: [["Social media", "social-media-management"], ["Content & reels", "content-and-reels"], ["Meta Ads", "meta-ads"]] },
  { stage: "Win trust", line: "They check you out.", items: [["Website", "website-development"], ["App", "app-development"]] },
  { stage: "Never miss a lead", line: "They reach out.", items: [["Automation", "business-automation"]] },
  { stage: "Grow what works", line: "You see what's working.", items: [["Digital marketing", "digital-marketing"]] },
];

/* How the services connect: one path from first view to paying customer. */
export default function Ecosystem() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          kicker="How it fits together"
          title="One growth system, not seven separate jobs."
          intro="Each service does its own job, and they work best connected: the ad sends people to the page, the page captures the lead, automation follows up, and tracking shows what to do next."
        />

        <ol className="grid gap-3 md:grid-cols-4">
          {STAGES.map((s, i) => (
            <Reveal as="li" key={s.stage} delay={i * 90} className="relative flex flex-col rounded-[18px] border border-line bg-raised p-6">
              <span className="text-[14px] text-muted">Step {i + 1}</span>
              <h3 className="mt-3 text-title text-ink">{s.stage}</h3>
              <p className="mt-2 text-soft">{s.line}</p>
              <ul className="mt-6 flex flex-wrap gap-2 pt-2">
                {s.items.map(([label, slug]) => (
                  <li key={slug}>
                    <Link
                      to={`/services#${slug}`}
                      className="inline-flex h-9 items-center rounded-full border border-line-strong px-3.5 text-[14px] text-ink transition-colors hover:border-violet hover:text-violet-soft"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              {i < STAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-[15px] left-1/2 z-10 grid size-7 -translate-x-1/2 rotate-90 place-items-center rounded-full border border-line bg-ground text-[13px] text-violet-soft md:-right-[17px] md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:rotate-0"
                >
                  →
                </span>
              )}
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 flex flex-col gap-5 md:flex-row md:items-center">
          <p className="shrink-0 text-[15px] text-muted">Built for businesses like</p>
          <ul className="flex flex-wrap gap-2">
            {INDUSTRIES.map((b) => (
              <li key={b} className="rounded-full bg-raised-2 px-3.5 py-1.5 text-[14px] text-soft">
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
