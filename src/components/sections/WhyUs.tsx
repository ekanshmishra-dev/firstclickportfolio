import { WHY_POINTS } from "../../data/company";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

export default function WhyUs() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeading kicker="Why FIRST CLICK" title="Not just another digital agency." intro="Most businesses juggle a web developer, a designer, a page manager and an ads freelancer. We are all of them, working to one goal." />
        <div className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2">
          {WHY_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="group bg-ground p-8 transition-colors duration-300 hover:bg-raised md:p-10">
              <h3 className="text-title text-ink">{p.title}</h3>
              <p className="mt-3 max-w-md text-soft">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
