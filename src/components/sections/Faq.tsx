import { FAQ } from "../../data/faq";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

/* Native <details> so answers are in the HTML for search engines and work without JavaScript. */
export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeading kicker="Questions" title="Before you get in touch." intro="Straight answers to what business owners usually ask us first." />
        <Reveal className="divide-y divide-line border-y border-line">
          {FAQ.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-soft transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-3xl pb-7 text-soft">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
