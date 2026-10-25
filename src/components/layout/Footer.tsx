import { Link } from "react-router-dom";
import { SITE, activeSocials } from "../../data/site";
import { navLinks } from "../../features";
import { SERVICES } from "../../data/services";
import { whatsappUrl } from "../../lib/whatsapp";
import Logo from "./Logo";

export default function Footer({ onOpenBrochure }: { onOpenBrochure: () => void }) {
  const socials = activeSocials();
  return (
    <footer className="border-t border-line bg-raised/40">
      <div className="container-x pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-lead text-soft">Have a project in mind? Message us directly.</p>
            <a
              href={whatsappUrl("Hi FIRST CLICK, I'd like to discuss a project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 block w-fit"
            >
              <span className="block font-display text-[clamp(2.25rem,1.2rem+4.4vw,4.75rem)] font-semibold leading-none tracking-[-0.04em] text-ink transition-colors group-hover:text-violet-soft">
                {SITE.phoneDisplay}
              </span>
              <span className="mt-4 inline-flex items-center gap-2 text-[15px] text-soft group-hover:text-ink">
                Chat on WhatsApp <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                <span className="text-muted">· {SITE.replyNote}</span>
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-5">
            <div>
              <p className="mb-4 text-[14px] text-muted">Company</p>
              <ul className="space-y-3 text-[15px]">
                {navLinks().map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-soft hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={onOpenBrochure} className="cursor-pointer text-soft hover:text-ink">
                    Brochure
                  </button>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-4 text-[14px] text-muted">Services</p>
              <ul className="space-y-3 text-[15px]">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services#${s.slug}`} className="text-soft hover:text-ink">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-[14px] text-muted">{SITE.descriptor}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-muted">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                {s.label}
              </a>
            ))}
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              WhatsApp
            </a>
            <span>© {new Date().getFullYear()} FIRST CLICK. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
