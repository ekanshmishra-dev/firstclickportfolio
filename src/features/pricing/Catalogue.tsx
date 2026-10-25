import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CATEGORIES, OFFERS, type Category, type Offer } from "./data";
import { useGlider } from "./hooks";
import Button, { Arrow } from "../../components/ui/Button";
import SectionHeading from "../../components/ui/SectionHeading";
import Reveal from "../../components/ui/Reveal";
import { whatsappUrl } from "../../lib/whatsapp";

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-violet-soft" fill="none" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Full detail for one service. Re-keyed on change so it animates in. */
function Detail({ offer, onAddToPlan }: { offer: Offer; onAddToPlan: (id: string) => void }) {
  return (
    <div key={offer.id} className="pr-panel-in">
      <div className="flex flex-wrap items-center gap-2">
        {offer.highlights.map((h) => (
          <span key={h} className="rounded-full border border-line px-3 py-1 text-[13px] text-soft">
            {h}
          </span>
        ))}
      </div>
      <h3 className="mt-6 text-title text-ink">{offer.title}</h3>
      <p className="mt-2 text-soft">{offer.subtitle}</p>

      <div className="mt-7 rounded-[16px] bg-ground/70 p-5">
        <p className="font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-ink">{offer.price}</p>
        <p className="mt-2 text-[15px] text-muted">{offer.priceNote}</p>
      </div>

      <p className="mt-7 text-soft">{offer.description}</p>

      <p className="mt-8 text-[14px] text-muted">{"What's included"}</p>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {offer.deliverables.map((d, i) => (
          <li key={d} className="pr-item-in flex items-start gap-2.5 text-[15px] text-ink" style={{ animationDelay: `${120 + i * 40}ms` }}>
            <Check />
            {d}
          </li>
        ))}
      </ul>

      <dl className="mt-8 grid gap-5 border-t border-line pt-6 text-[15px] sm:grid-cols-2">
        <div>
          <dt className="text-muted">Timeline</dt>
          <dd className="mt-1 text-ink">{offer.timeline}</dd>
        </div>
        <div>
          <dt className="text-muted">Ideal for</dt>
          <dd className="mt-1 text-ink">{offer.idealFor}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted">Tools we use</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {offer.tools.map((t) => (
              <span key={t} className="rounded-md bg-raised-2 px-2.5 py-1 text-[13px] text-soft">
                {t}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={whatsappUrl(`Hi FIRST CLICK, I'm interested in ${offer.title} (${offer.price}).`)} external>
          Enquire about this <Arrow />
        </Button>
        <Button variant="ghost" onClick={() => onAddToPlan(offer.id)}>
          Add to my plan
        </Button>
      </div>
    </div>
  );
}

export default function Catalogue({ onAddToPlan }: { onAddToPlan: (id: string) => void }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [activeId, setActiveId] = useState(OFFERS[0].id);
  const chipsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const visible = useMemo(() => OFFERS.filter((o) => category === "all" || o.category === category), [category]);
  const active = visible.find((o) => o.id === activeId) ?? visible[0];

  const chipBox = useGlider(chipsRef, '[aria-pressed="true"]', [category]);
  const rowBox = useGlider(listRef, '[aria-current="true"]', [active.id, category]);

  const pickCategory = (c: Category | "all") => {
    setCategory(c);
    const first = OFFERS.find((o) => c === "all" || o.category === c);
    if (first && !(c === "all" || active.category === c)) setActiveId(first.id);
  };

  const onListKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const i = visible.findIndex((o) => o.id === active.id);
    const next = visible[(i + dir + visible.length) % visible.length];
    setActiveId(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-id="${next.id}"]`)?.focus();
  };

  return (
    <section id="catalogue" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          kicker="All services"
          title="Every service, every price."
          intro="Filter by what you need and pick a service to see exactly what's included, how long it takes and what it costs."
        />

        <Reveal>
          <div ref={chipsRef} className="relative mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter services">
            {chipBox && (
              <span
                aria-hidden="true"
                className="pr-glider pointer-events-none absolute left-0 top-0 rounded-full bg-ink"
                style={{ transform: `translate(${chipBox.x}px, ${chipBox.y}px)`, width: chipBox.w, height: chipBox.h }}
              />
            )}
            {CATEGORIES.map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pickCategory(c.id)}
                  className={`relative h-11 cursor-pointer rounded-full border px-5 text-[15px] transition-colors duration-300 ${
                    on ? (chipBox ? "border-transparent text-ground" : "border-ink bg-ink text-ground") : "border-line text-soft hover:border-line-strong hover:text-ink"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <ul ref={listRef} onKeyDown={onListKey} className="relative flex min-w-0 flex-col gap-1 lg:col-span-5" aria-label="Services">
              {rowBox && (
                <span
                  aria-hidden="true"
                  className="pr-glider pointer-events-none absolute left-0 top-0 hidden rounded-[16px] border border-line-strong bg-raised lg:block"
                  style={{ transform: `translate(${rowBox.x}px, ${rowBox.y}px)`, width: rowBox.w, height: rowBox.h }}
                />
              )}
              {visible.map((o) => {
                const on = o.id === active.id;
                return (
                  <li key={`${category}-${o.id}`} className="pr-fade">
                    <button
                      type="button"
                      data-id={o.id}
                      aria-current={on}
                      aria-expanded={on}
                      onClick={() => setActiveId(o.id)}
                      className={`group relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-[16px] border px-5 py-4 text-left transition-colors duration-300 ${
                        on ? "border-line-strong bg-raised lg:border-transparent lg:bg-transparent" : "border-transparent hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className={`block text-[17px] font-medium transition-colors ${on ? "text-ink" : "text-soft group-hover:text-ink"}`}>
                          {o.short}
                          {o.featured && <span className="ml-2 rounded-full bg-violet/15 px-2 py-0.5 align-middle text-[12px] text-violet-soft">Best value</span>}
                        </span>
                        <span className="mt-0.5 block truncate text-[14px] text-muted">{o.subtitle}</span>
                      </span>
                      <span className={`shrink-0 text-right text-[15px] font-medium ${on ? "text-violet-soft" : "text-soft"}`}>
                        {o.freeWithSmm ? "Free*" : o.price.replace(" / month", "/mo")}
                      </span>
                    </button>
                    {/* On phones the detail opens under its row */}
                    {on && (
                      <div className="rounded-b-[16px] px-5 pb-8 pt-4 lg:hidden">
                        <Detail offer={o} onAddToPlan={onAddToPlan} />
                      </div>
                    )}
                  </li>
                );
              })}
              <li className="px-5 pt-4 text-[14px] text-muted">* Free with social media management. Ad spend and creator fees are paid by you.</li>
            </ul>

            <div className="hidden lg:col-span-7 lg:block">
              <div className="sticky top-24 rounded-[22px] border border-line bg-raised p-8 xl:p-10" aria-live="polite">
                <Detail offer={active} onAddToPlan={onAddToPlan} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
