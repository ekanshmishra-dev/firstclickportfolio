import { useState, type FormEvent } from "react";
import { whatsappUrl } from "../../lib/whatsapp";
import Button, { Arrow } from "../ui/Button";
import Reveal from "../ui/Reveal";

/* Closing call to action. The quick field starts a WhatsApp chat; the button leads to the full form. */
export default function FinalCta() {
  const [business, setBusiness] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const about = business.trim() ? ` My business: ${business.trim()}.` : "";
    window.open(whatsappUrl(`Hi FIRST CLICK, I'd like to start a project.${about}`), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-36">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[150px]" />
      <Reveal className="container-x relative text-center">
        <h2 className="mx-auto max-w-4xl text-[clamp(2.75rem,1.4rem+6vw,6.5rem)] text-ink">
          Ready for your <span className="text-violet-soft">next click?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lead text-soft">{"Tell us what you're building. We'll figure out the digital side."}</p>

        <form onSubmit={onSubmit} className="mx-auto mt-12 flex max-w-xl flex-col gap-3 rounded-[28px] border border-line-strong bg-raised p-2 transition-colors focus-within:border-violet-soft sm:flex-row sm:rounded-full">
          <label htmlFor="cta-business" className="sr-only">
            Your business
          </label>
          <input
            id="cta-business"
            name="business"
            autoComplete="organization"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Your business, e.g. a salon in Jaipur…"
            className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[16px] text-ink placeholder:text-muted focus:outline-none"
          />
          <Button type="submit" className="shrink-0">
            Chat on WhatsApp <Arrow />
          </Button>
        </form>
        <p className="mt-5 text-[15px] text-muted">
          Prefer a form?{" "}
          <Button to="/contact" variant="link" className="!text-soft">
            Send a detailed enquiry
          </Button>
        </p>
      </Reveal>
    </section>
  );
}
