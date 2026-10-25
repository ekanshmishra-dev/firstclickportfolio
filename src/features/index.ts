import type { Feature } from "./types";
import { NAV_LINKS } from "../data/site";
import pricing from "./pricing";

/* ── Optional pages. Each one adds its route, nav link, sitemap entry and prerendered HTML.
   To remove a page: delete its line below (and its import), then delete its folder. ── */
export const FEATURES: Feature[] = [
  pricing,
];

/** Main nav with feature links inserted where each feature asks. */
export const navLinks = () => {
  const links = [...NAV_LINKS];
  for (const f of FEATURES) {
    if (!f.nav) continue;
    const i = links.findIndex((l) => l.to === f.nav!.after);
    links.splice(i < 0 ? links.length : i + 1, 0, { label: f.nav.label, to: f.seo.path });
  }
  return links;
};

export const featureFor = (path: string) => FEATURES.find((f) => f.seo.path === path);
