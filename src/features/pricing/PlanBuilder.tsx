import { useState, type FormEvent } from "react";
import { OFFERS, COVERED_BY_360, inr } from "./data";
import { EMPTY_CONTACT, computePlan, planMessage, validateContact, type ContactErrors, type PlanContact, type PlanState } from "./plan";
import { useCountUp } from "./hooks";
import Button, { Arrow } from "../../components/ui/Button";
import SectionHeading from "../../components/ui/SectionHeading";
import Reveal from "../../components/ui/Reveal";
import { whatsappUrl } from "../../lib/whatsapp";

function Switch({ on, label, onToggle, disabled }: { on: boolean; label: string; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${on ? "bg-violet" : "bg-line-strong"}`}
    >
      <span className={`absolute left-1 top-1 size-5 rounded-full bg-white transition-transform duration-300 [transition-timing-function:var(--ease-out-quart)] ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-line bg-ground px-3.5 text-[16px] text-ink placeholder:text-muted transition-colors focus:border-violet focus:outline-none aria-[invalid=true]:border-[#f87171]";

function ContactField({
  id,
  label,
  optional,
  error,
  ...input
}: { id: string; label: string; optional?: boolean; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[14px] text-ink">
        {label}
        {optional && <span className="text-[13px] text-muted">Optional</span>}
      </label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={inputCls} {...input} />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[13px] text-[#f87171]">
          {error}
        </p>
      )}
    </div>
  );
}

function Total({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const shown = useCountUp(value);
  return (
    <div>
      <p className="text-[14px] text-muted">{label}</p>
      <p className="mt-1 font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.375rem)] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
        {inr(shown)}
        {suffix && <span className="ml-1 text-[0.5em] font-normal text-soft">{suffix}</span>}
      </p>
    </div>
  );
}

export default function PlanBuilder({ plan, setPlan }: { plan: PlanState; setPlan: (fn: (p: PlanState) => PlanState) => void }) {
  const { lines, oneTime, monthly, suggest360, hasSmm } = computePlan(plan);
  const has360 = !!plan.selected["agency-360"];
  const [contact, setContact] = useState<PlanContact>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const setField = (k: keyof PlanContact) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact((c) => ({ ...c, [k]: e.target.value }));
    if (errors[k as keyof ContactErrors]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSend = (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(contact);
    setErrors(found);
    if (found.name || found.email) {
      document.getElementById(found.name ? "plan-name" : "plan-email")?.focus();
      return;
    }
    const url = whatsappUrl(planMessage(plan, contact));
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };
  const toggle = (id: string) => setPlan((p) => ({ ...p, selected: { ...p.selected, [id]: !p.selected[id] } }));
  const setReels = (n: number) => setPlan((p) => ({ ...p, shootReels: Math.max(1, Math.min(50, n)) }));
  const setAdBudget = (n: number) => setPlan((p) => ({ ...p, adBudget: Math.max(5000, Math.min(500000, n)) }));
  // Covered services stay in the plan and show as "Included", so the customer sees what the retainer replaces.
  const switchTo360 = () => setPlan((p) => ({ ...p, selected: { ...p.selected, "agency-360": true } }));

  const note = (id: string) => {
    if (has360 && COVERED_BY_360.has(id)) return "Included in 360°";
    const o = OFFERS.find((x) => x.id === id)!;
    if (id === "performance-ads") {
      const budget = plan.adBudget ?? 20000;
      return `10% of ad budget (${inr(Math.round(budget * 0.1))}/mo fee on ${inr(budget)} spend)`;
    }
    if (o.freeWithSmm) return hasSmm ? "Free with your social media management" : "Free with social media management, otherwise quoted";
    if (o.perUnit) return `${inr(o.perUnit.amount)} per ${o.perUnit.unit}`;
    if (id === "web-dev" && has360) return `${inr(5000)} one-time · care included in 360°`;
    if (id === "smm-management") return plan.smmReels === 10 ? "10 reels · ₹8,000/mo (free barter collabs)" : "15 reels · ₹10,000/mo (free barter collabs)";
    return [o.oneTime && `${inr(o.oneTime)} one-time`, o.monthly && `${inr(o.monthly)}/mo`].filter(Boolean).join(" + ");
  };

  return (
    <section id="plan" className="scroll-mt-20 border-t border-line bg-raised/40 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          kicker="Plan builder"
          title="Build your plan in seconds."
          intro="Switch on what you need and see your estimate update live. Send it to us on WhatsApp and we'll confirm the final quote."
        />

        <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <ul className="divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-ground lg:col-span-7">
            {OFFERS.map((o) => {
              const on = !!plan.selected[o.id];
              const included = has360 && COVERED_BY_360.has(o.id);
              return (
                <li key={o.id} className={`flex flex-wrap items-center gap-4 px-5 py-4 transition-colors duration-300 md:px-6 ${on || included ? "bg-raised" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-medium text-ink">
                      {o.short}
                      {o.featured && <span className="ml-2 rounded-full bg-violet/15 px-2 py-0.5 align-middle text-[12px] text-violet-soft">Best value</span>}
                    </p>
                    <p className={`mt-0.5 text-[14px] ${included ? "text-live" : "text-muted"}`}>{note(o.id)}</p>
                  </div>
                  {o.id === "smm-management" && on && (
                    <div className="pr-pop flex items-center rounded-full border border-line-strong p-0.5 text-[13px]" role="radiogroup" aria-label="Social media package size">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={plan.smmReels === 10}
                        onClick={() => setPlan((p) => ({ ...p, smmReels: 10 }))}
                        className={`cursor-pointer rounded-full px-2.5 py-1 font-medium transition-colors ${plan.smmReels === 10 ? "bg-violet text-white" : "text-soft hover:text-ink"}`}
                      >
                        10 Reels (₹8K)
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={plan.smmReels !== 10}
                        onClick={() => setPlan((p) => ({ ...p, smmReels: 15 }))}
                        className={`cursor-pointer rounded-full px-2.5 py-1 font-medium transition-colors ${plan.smmReels !== 10 ? "bg-violet text-white" : "text-soft hover:text-ink"}`}
                      >
                        15 Reels (₹10K)
                      </button>
                    </div>
                  )}
                  {o.id === "performance-ads" && on && (
                    <div className="pr-pop flex items-center rounded-full border border-line-strong" role="group" aria-label="Monthly ad budget">
                      <button
                        type="button"
                        onClick={() => setAdBudget((plan.adBudget ?? 20000) - 5000)}
                        className="grid size-9 cursor-pointer place-items-center text-soft hover:text-ink"
                        aria-label="Lower ad budget"
                      >
                        −
                      </button>
                      <span className="w-24 text-center text-[13px] tabular-nums text-ink" aria-live="polite">
                        {inr(plan.adBudget ?? 20000)} ads
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdBudget((plan.adBudget ?? 20000) + 5000)}
                        className="grid size-9 cursor-pointer place-items-center text-soft hover:text-ink"
                        aria-label="Higher ad budget"
                      >
                        +
                      </button>
                    </div>
                  )}
                  {o.perUnit && on && (
                    <div className="pr-pop flex items-center rounded-full border border-line-strong" role="group" aria-label="Number of shoot reels">
                      <button type="button" onClick={() => setReels(plan.shootReels - 1)} className="grid size-9 cursor-pointer place-items-center text-soft hover:text-ink" aria-label="Fewer reels">
                        −
                      </button>
                      <span className="w-14 text-center text-[14px] tabular-nums text-ink" aria-live="polite">
                        {plan.shootReels} reels
                      </span>
                      <button type="button" onClick={() => setReels(plan.shootReels + 1)} className="grid size-9 cursor-pointer place-items-center text-soft hover:text-ink" aria-label="More reels">
                        +
                      </button>
                    </div>
                  )}
                  <Switch on={on || included} disabled={included} label={`Include ${o.title}`} onToggle={() => toggle(o.id)} />
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-[22px] border border-line bg-raised p-6 md:p-8" aria-live="polite">
              <p className="text-[15px] font-medium text-ink">Your estimate</p>
              <div className="mt-6 grid grid-cols-2 gap-6 border-b border-line pb-6">
                <Total label="One-time" value={oneTime} />
                <Total label="Monthly" value={monthly} suffix="/mo" />
              </div>

              {lines.length === 0 ? (
                <p className="py-8 text-[15px] text-muted">Switch on a service to start your plan.</p>
              ) : (
                <ul className="space-y-3 py-6">
                  {lines.map((l) => (
                    <li key={l.id} className="pr-pop flex items-start justify-between gap-4 text-[15px]">
                      <span className="text-ink">{l.title}</span>
                      <span className={`text-right ${l.status === "included" || l.status === "free" ? "text-live" : "text-soft"}`}>
                        {l.status === "included" ? "Included" : l.status === "free" ? "Free" : l.status === "on-request" ? "On request" : l.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {suggest360 && (
                <div className="pr-pop mb-6 rounded-[16px] border border-violet/40 bg-violet/10 p-4">
                  <p className="text-[15px] text-ink">The 360° retainer covers these for {inr(12000)}/mo, plus ads, collabs and website care.</p>
                  <button type="button" onClick={switchTo360} className="mt-2 cursor-pointer text-[15px] font-medium text-violet-soft underline underline-offset-4 hover:text-ink">
                    Switch to the 360° retainer
                  </button>
                </div>
              )}

              {lines.length > 0 && (
                <form onSubmit={onSend} noValidate aria-label="Send your plan" className="pr-pop border-t border-line pt-6">
                  <p className="mb-4 text-[15px] text-ink">Where should we send your quote?</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <ContactField id="plan-name" label="Name" name="name" autoComplete="name" placeholder="Your name" value={contact.name} onChange={setField("name")} error={errors.name} />
                    <ContactField
                      id="plan-email"
                      label="Email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="you@business.com"
                      value={contact.email}
                      onChange={setField("email")}
                      error={errors.email}
                    />
                    <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                      <ContactField id="plan-business" label="Business" optional name="business" autoComplete="organization" placeholder="Business name" value={contact.business} onChange={setField("business")} />
                    </div>
                  </div>
                  <Button type="submit" className="mt-5 w-full">
                    Send this plan on WhatsApp <Arrow />
                  </Button>
                  {sentUrl && (
                    <p role="status" className="pr-pop mt-3 text-[14px] text-live">
                      {"Your plan is ready in WhatsApp. Press send there. "}
                      <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
                        {"Didn't open?"}
                      </a>
                    </p>
                  )}
                </form>
              )}
              <p className="mt-4 text-[14px] text-muted">Prices from our current price list. Ad spend and creator fees are paid by you. Final quote confirmed before work begins.</p>
              {lines.length > 0 && (
                <button type="button" onClick={() => setPlan((p) => ({ ...p, selected: {} }))} className="mt-3 cursor-pointer text-[14px] text-soft underline underline-offset-4 hover:text-ink">
                  Clear plan
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
