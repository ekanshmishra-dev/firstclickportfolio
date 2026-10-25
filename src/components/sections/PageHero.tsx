import type { ReactNode } from "react";

/* Opening block for inner pages: kicker, h1, one paragraph, optional extras. */
export default function PageHero({ kicker, title, intro, children }: { kicker: string; title: ReactNode; intro: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <p className="rise mb-5 text-[15px] font-medium text-violet-soft">{kicker}</p>
        <h1 className="rise max-w-5xl text-display text-ink" style={{ animationDelay: "80ms" }}>
          {title}
        </h1>
        <p className="rise mt-7 max-w-2xl text-lead text-soft" style={{ animationDelay: "160ms" }}>
          {intro}
        </p>
        {children && (
          <div className="rise mt-10" style={{ animationDelay: "240ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
