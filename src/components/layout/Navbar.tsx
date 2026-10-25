import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../../features";
import Button, { Arrow } from "../ui/Button";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-[15px] transition-colors duration-200 ${isActive ? "text-ink" : "text-soft hover:text-ink"}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 border-b ${
        scrolled || open ? "bg-ground/85 backdrop-blur-xl border-line" : "border-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ground">
        Skip to content
      </a>
      <nav className="container-x flex h-[68px] items-center justify-between" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks().map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkCls}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button to="/contact" className="!h-10 !px-5 text-[15px]">
            Start a project <Arrow />
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-11 place-items-center rounded-full border border-line md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="container-x h-[calc(100dvh-68px)] overflow-y-auto pb-10 pt-6 md:hidden"
      >
        <ul className="flex flex-col">
          {navLinks().map((l) => (
            <li key={l.to} className="border-b border-line">
              <NavLink to={l.to} className={({ isActive }) => `flex items-center justify-between py-5 font-display text-[28px] font-semibold tracking-[-0.03em] ${isActive ? "text-ink" : "text-soft"}`}>
                {l.label}
                <Arrow />
              </NavLink>
            </li>
          ))}
        </ul>
        <Button to="/contact" className="mt-8 w-full">
          Start a project <Arrow />
        </Button>
      </div>
    </header>
  );
}
