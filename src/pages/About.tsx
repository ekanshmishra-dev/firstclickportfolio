import PageHero from "../components/sections/PageHero";
import WhyUs from "../components/sections/WhyUs";
import Process from "../components/sections/Process";
import FinalCta from "../components/sections/FinalCta";
import Reveal from "../components/ui/Reveal";
import { INDUSTRIES } from "../data/company";
import { usePageMeta } from "../lib/usePageMeta";

const WORKING_WITH_US = [
  { title: "A clear quote first", desc: "You know the scope, timeline and cost before any work begins." },
  { title: "One point of contact", desc: "One person who knows your project and answers your questions." },
  { title: "Updates on WhatsApp", desc: "Progress shared where you already are, not buried in email threads." },
];

export default function About() {
  usePageMeta("/about");

  return (
    <>
      <PageHero
        kicker="About FIRST CLICK"
        title="We make businesses look better online, and work better behind the scenes."
        intro="FIRST CLICK is a digital growth agency. We design and build websites and apps, run social media and ad campaigns, and automate the busywork in between, so the businesses we work with can focus on their customers."
      />

      <section className="border-t border-line py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-head text-ink">Why we started.</h2>
            <div className="mt-8 space-y-5 text-lead text-soft">
              <p>
                Most growing businesses don't need more agencies. They need one partner who understands how the pieces connect: how a reel turns
                into a website visit, a visit into an enquiry, and an enquiry into a customer.
              </p>
              <p>
                That is what we do. We start from your goals, build only what moves them forward, and keep improving once it's live. Whether
                it's your first website or a full growth system, the work is designed to be useful, not just to look good.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="rounded-[22px] border border-line bg-raised p-7 md:p-9">
              <h3 className="text-title text-ink">Working with us</h3>
              <ul className="mt-6 divide-y divide-line">
                {WORKING_WITH_US.map((w) => (
                  <li key={w.title} className="py-5 first:pt-0 last:pb-0">
                    <p className="font-medium text-ink">{w.title}</p>
                    <p className="mt-1 text-soft">{w.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <p className="text-[15px] text-muted">Who we work with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {INDUSTRIES.map((b) => (
                  <li key={b} className="rounded-full bg-raised-2 px-3.5 py-1.5 text-[14px] text-soft">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <WhyUs />
      <Process />
      <FinalCta />
    </>
  );
}
