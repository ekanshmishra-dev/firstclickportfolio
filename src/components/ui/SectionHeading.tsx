import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "split";
  action?: ReactNode;
  as?: "h1" | "h2";
}

/* Section opener: short kicker, two-line headline, one supporting sentence. */
export default function SectionHeading({ kicker, title, intro, align = "split", action, as: H = "h2" }: SectionHeadingProps) {
  const size = H === "h1" ? "text-display" : "text-head";
  return (
    <Reveal className={`mb-12 md:mb-16 grid gap-6 ${align === "split" ? "lg:grid-cols-12 lg:items-end" : ""}`}>
      <div className={align === "split" ? "max-w-3xl lg:col-span-7" : "max-w-3xl"}>
        {kicker && <p className="mb-4 text-[15px] font-medium text-violet-soft">{kicker}</p>}
        <H className={`${size} text-ink`}>{title}</H>
      </div>
      {(intro || action) && (
        <div className={align === "split" ? "max-w-2xl lg:col-span-5 lg:justify-self-end lg:max-w-md" : "max-w-2xl"}>
          {intro && <p className="text-lead text-soft">{intro}</p>}
          {action && <div className="mt-6">{action}</div>}
        </div>
      )}
    </Reveal>
  );
}
