import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";
import PageHero from "../components/sections/PageHero";
import FinalCta from "../components/sections/FinalCta";
import Faq from "../components/sections/Faq";
import ServiceMock from "../components/mockups/ServiceMock";
import Button, { Arrow } from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import { usePageMeta } from "../lib/usePageMeta";

export default function Services() {
  usePageMeta("/services");

  return (
    <>
      <PageHero
        kicker="Services"
        title="Everything your business needs to grow online."
        intro="Seven services, one team. Take one, or combine them into a complete growth system. Every engagement starts with a clear scope and quote."
      >
        <nav aria-label="Jump to a service">
          <ul className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`#${s.slug}`}
                  className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[15px] text-soft transition-colors hover:border-line-strong hover:text-ink"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {SERVICES.map((s, i) => (
        <section key={s.slug} id={s.slug} className="scroll-mt-20 border-t border-line py-20 md:py-28" aria-labelledby={`${s.slug}-title`}>
          <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
              <h2 id={`${s.slug}-title`} className="text-head text-ink">
                {s.title}
              </h2>
              <p className="mt-5 text-lead text-soft">{s.long}</p>

              <div className="mt-8 rounded-[18px] border border-line bg-raised p-6">
                <p className="text-[14px] text-muted">What you get</p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-[15px] text-ink">
                      <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-violet-soft" fill="none" aria-hidden="true">
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-6 text-[15px] text-soft">
                <span className="text-ink">Best for: </span>
                {s.forWho}
              </p>

              <div className="mt-8">
                <Button to={`/contact?service=${s.slug}`}>
                  Start with {s.title.toLowerCase()} <Arrow />
                </Button>
              </div>
            </Reveal>

            <Reveal delay={120} className={`relative lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
              <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[22px] border border-line bg-raised p-6 md:p-12">
                <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
                <div className="relative w-full max-w-[560px]">
                  <ServiceMock kind={s.mock} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <Faq />

      <FinalCta />
    </>
  );
}
