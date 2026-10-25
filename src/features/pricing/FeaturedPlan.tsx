import { OFFERS } from "./data";
import Button, { Arrow } from "../../components/ui/Button";
import Reveal from "../../components/ui/Reveal";
import { whatsappUrl } from "../../lib/whatsapp";

const plan = OFFERS.find((o) => o.featured)!;

/* The flagship retainer, shown first: most enquiries are deciding between this and single services. */
export default function FeaturedPlan({ onAddToPlan }: { onAddToPlan: (id: string) => void }) {
  return (
    <section className="pb-20 md:pb-28" aria-labelledby="featured-plan-title">
      <div className="container-x">
        <Reveal className="pr-orbit-border relative overflow-hidden rounded-[26px]">
          <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-violet/20 blur-[110px]" />
          <div className="relative grid gap-10 p-7 md:p-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-violet/15 px-3 py-1 text-[14px] font-medium text-violet-soft">
                <span className="size-1.5 rounded-full bg-violet-soft" /> Best value
              </p>
              <h2 id="featured-plan-title" className="mt-5 text-head text-ink">
                {plan.title}
              </h2>
              <p className="mt-4 text-lead text-soft">{plan.description}</p>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-[clamp(2.75rem,2rem+3vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-ink">₹12,000</span>
                <span className="text-lead text-soft">/ month</span>
              </p>
              <p className="mt-2 text-[15px] text-muted">{plan.priceNote}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={whatsappUrl(`Hi FIRST CLICK, I'm interested in the ${plan.title} (${plan.price}).`)} external>
                  Ask about the 360° plan <Arrow />
                </Button>
                <Button variant="ghost" onClick={() => onAddToPlan(plan.id)}>
                  Add to my plan
                </Button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] text-muted">Everything included</p>
              <ul className="mt-4 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2">
                {plan.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 bg-ground/80 p-4 text-[15px] text-ink transition-colors duration-300 hover:bg-raised-2">
                    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-violet-soft" fill="none" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[15px] text-soft">
                <span className="text-ink">Best for: </span>
                {plan.idealFor}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
