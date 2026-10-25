import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { SERVICES, serviceBySlug } from "../data/services";
import { BUDGETS, SITE, activeSocials } from "../data/site";
import { EMPTY_ENQUIRY, buildEnquiryMessage, validateEnquiry, whatsappUrl, type Enquiry, type EnquiryErrors } from "../lib/whatsapp";
import { WhatsAppIcon } from "../components/layout/WhatsAppFab";
import Button, { Arrow } from "../components/ui/Button";
import { usePageMeta } from "../lib/usePageMeta";

const inputCls =
  "h-12 w-full rounded-xl border border-line bg-ground px-4 text-[16px] text-ink placeholder:text-muted transition-colors focus:border-violet focus:outline-none aria-[invalid=true]:border-[#f87171]";

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[15px] text-ink">
        {label}
        {optional && <span className="text-[13px] text-muted">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[14px] text-[#f87171]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-10 cursor-pointer rounded-full border px-4 text-[15px] transition-colors duration-200 ${
        selected ? "border-violet bg-violet/15 text-ink" : "border-line text-soft hover:border-line-strong hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function Contact() {
  usePageMeta("/contact");

  const [params] = useSearchParams();
  const [form, setForm] = useState<Enquiry>(EMPTY_ENQUIRY);

  // Applied after mount so the prerendered HTML and the first client render match.
  const serviceParam = params.get("service");
  useEffect(() => {
    const preselected = serviceBySlug(serviceParam);
    if (preselected) setForm((f) => (f.need ? f : { ...f, need: preselected.title }));
  }, [serviceParam]);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const needs = form.need ? form.need.split(", ") : [];
  const toggleNeed = (title: string) => {
    const next = needs.includes(title) ? needs.filter((n) => n !== title) : [...needs, title];
    setForm((f) => ({ ...f, need: next.join(", ") }));
  };

  const set = (k: keyof Enquiry) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (Object.keys(errors).length) setErrors({});
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateEnquiry(form);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = found.name ? "name" : found.email ? "email" : "phone";
      document.getElementById(first)?.focus();
      return;
    }
    const url = whatsappUrl(buildEnquiryMessage(form));
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  const socials = activeSocials();

  return (
    <section className="relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="rise mb-5 text-[15px] font-medium text-violet-soft">Contact</p>
          <h1 className="rise text-display text-ink" style={{ animationDelay: "80ms" }}>
            {"Let's build something that works."}
          </h1>
          <p className="rise mt-7 max-w-md text-lead text-soft" style={{ animationDelay: "160ms" }}>
            Tell us about your business and what you need. We reply on WhatsApp with questions, ideas and a clear quote.
          </p>

          <div className="rise mt-12 space-y-8" style={{ animationDelay: "240ms" }}>
            <a
              href={whatsappUrl("Hi FIRST CLICK, I'd like to discuss a project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-[18px] border border-line bg-raised p-5 transition-colors hover:border-line-strong"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-live/15">
                <WhatsAppIcon className="size-6 text-live" />
              </span>
              <span className="flex-1">
                <span className="block text-[14px] text-muted">Prefer to chat directly?</span>
                <span className="block font-display text-[22px] font-semibold tracking-tight text-ink">{SITE.phoneDisplay}</span>
              </span>
              <Arrow />
            </a>

            <dl className="grid grid-cols-1 gap-6 text-[15px] sm:grid-cols-2">
              <div>
                <dt className="text-muted">Company</dt>
                <dd className="mt-1 text-ink">
                  {SITE.name} · {SITE.descriptor}
                </dd>
              </div>
              <div>
                <dt className="text-muted">We do</dt>
                <dd className="mt-1 text-ink">Websites · Apps · Automation · Social Media · Marketing · Meta Ads</dd>
              </div>
              <div>
                <dt className="text-muted">Response</dt>
                <dd className="mt-1 text-ink">{SITE.replyNote}</dd>
              </div>
              {(SITE.email || socials.length > 0) && (
                <div>
                  <dt className="text-muted">Elsewhere</dt>
                  <dd className="mt-1 flex flex-wrap gap-x-4 text-ink">
                    {SITE.email && (
                      <a href={`mailto:${SITE.email}`} className="underline decoration-line-strong underline-offset-4 hover:decoration-violet-soft">
                        {SITE.email}
                      </a>
                    )}
                    {socials.map((s) => (
                      <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-4 hover:decoration-violet-soft">
                        {s.label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="rise lg:col-span-7" style={{ animationDelay: "200ms" }}>
          {sentUrl ? (
            <div className="flex h-full flex-col items-start justify-center rounded-[22px] border border-line bg-raised p-8 md:p-12" role="status">
              <span className="grid size-12 place-items-center rounded-full bg-live/15 text-live">
                <svg viewBox="0 0 16 16" className="size-6" fill="none" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 className="mt-6 text-head text-ink">Almost there.</h2>
              <p className="mt-4 max-w-md text-lead text-soft">
                {"Your enquiry is ready in WhatsApp. Press send there and we'll get back to you with next steps."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={sentUrl} external>
                  {"WhatsApp didn't open? Tap here"} <Arrow />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSentUrl(null);
                    setForm(EMPTY_ENQUIRY);
                  }}
                >
                  New enquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="rounded-[22px] border border-line bg-raised p-6 md:p-10" aria-label="Project enquiry">
              <h2 className="text-title text-ink">Project enquiry</h2>
              <p className="mt-2 text-[15px] text-muted">Takes about a minute. Sending opens WhatsApp with your details filled in.</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field id="name" label="Name" error={errors.name}>
                  <input id="name" name="name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={inputCls} placeholder="Your name" />
                </Field>
                <Field id="business" label="Business / brand" optional>
                  <input id="business" name="business" autoComplete="organization" value={form.business} onChange={set("business")} className={inputCls} placeholder="Business name" />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input id="email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} value={form.email} onChange={set("email")} aria-invalid={!!errors.email || !!errors.contact} aria-describedby={errors.email ? "email-error" : undefined} className={inputCls} placeholder="you@business.com" />
                </Field>
                <Field id="phone" label="Phone / WhatsApp" error={errors.contact}>
                  <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "phone-error" : undefined} className={inputCls} placeholder="+91 …" />
                </Field>
              </div>

              <fieldset className="mt-8">
                <legend className="mb-3 text-[15px] text-ink">What do you need?</legend>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <Chip key={s.slug} selected={needs.includes(s.title)} onClick={() => toggleNeed(s.title)}>
                      {s.title}
                    </Chip>
                  ))}
                  <Chip selected={needs.includes("Not sure yet")} onClick={() => toggleNeed("Not sure yet")}>
                    Not sure yet
                  </Chip>
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="mb-3 flex w-full items-baseline justify-between text-[15px] text-ink">
                  Budget <span className="text-[13px] text-muted">Optional</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <Chip key={b} selected={form.budget === b} onClick={() => setForm((f) => ({ ...f, budget: f.budget === b ? "" : b }))}>
                      {b}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <div className="mt-8">
                <Field id="message" label="Message" optional>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    className={`${inputCls} h-auto py-3 leading-relaxed`}
                    placeholder="A few lines about your business and what you'd like to achieve…"
                  />
                </Field>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[14px] text-muted">We only use your details to reply to this enquiry.</p>
                <Button type="submit" className="w-full sm:w-auto">
                  Send enquiry <Arrow />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
