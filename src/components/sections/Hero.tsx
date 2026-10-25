import Button, { Arrow } from "../ui/Button";
import HeroEcosystem from "../mockups/HeroEcosystem";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40" aria-labelledby="hero-title">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-40 top-10 size-[560px] rounded-full bg-violet/15 blur-[140px]" />

      <div className="container-x relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="rise mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-raised/60 py-1.5 pl-2 pr-4 text-[14px] text-soft">
            <span className="rounded-full bg-violet/15 px-2.5 py-0.5 text-[13px] font-medium text-violet-soft">FIRST CLICK</span>
            Digital growth agency
          </p>
          <h1 id="hero-title" className="rise text-display text-ink" style={{ animationDelay: "80ms" }}>
            We build digital <span className="text-violet-soft">growth.</span>
          </h1>
          <p className="rise mt-7 max-w-[34rem] text-lead text-soft" style={{ animationDelay: "160ms" }}>
            Websites, apps, automation, social media and performance marketing, built to help businesses look better, operate smarter and grow
            faster.
          </p>
          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
            <Button to="/contact">
              Start a project <Arrow />
            </Button>
            <Button to="/#services" variant="ghost">
              See what we build <Arrow dir="down" />
            </Button>
          </div>
          <p className="rise mt-8 text-[14px] text-muted" style={{ animationDelay: "320ms" }}>
            One team for your website, content, ads and automation.
          </p>
        </div>

        <div className="rise lg:col-span-6" style={{ animationDelay: "200ms" }}>
          <HeroEcosystem />
        </div>
      </div>
    </section>
  );
}
