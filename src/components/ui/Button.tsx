import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "ghost" | "link";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  external?: boolean;
}

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "h-12 px-6 rounded-full bg-violet text-white hover:bg-violet-hover",
  ghost: "h-12 px-6 rounded-full border border-line-strong text-ink hover:border-soft hover:bg-white/[0.03]",
  link: "text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-violet-soft",
};

export default function Button({ children, variant = "primary", to, href, onClick, type = "button", className = "", external }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export function Arrow({ dir = "right" }: { dir?: "right" | "down" | "up-right" }) {
  const rotate = dir === "down" ? "rotate-90" : dir === "up-right" ? "-rotate-45" : "";
  const move = dir === "down" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-0.5";
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 transition-transform duration-200 ${rotate} ${move}`} fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
