/* ── Search metadata for every public page. Used at runtime (usePageMeta) and at build time (prerender). ── */

export const SITE_URL = "https://firstclickconnects.online";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  name: string;
  noindex?: boolean;
}

export const PAGES: PageSeo[] = [
  {
    path: "/",
    name: "Home",
    title: "FIRST CLICK | Digital Growth Agency for Websites, Apps & Ads",
    description:
      "FIRST CLICK is a digital growth agency in India building websites, mobile apps, business automation, social media, reels and Meta Ads campaigns that bring enquiries.",
  },
  {
    path: "/services",
    name: "Services",
    title: "Website, App, Automation & Meta Ads Services | FIRST CLICK",
    description:
      "Website development, app development, business automation, social media management, content & reels, digital marketing and Meta Ads, all from one team.",
  },
  {
    path: "/work",
    name: "Work",
    title: "Our Work: Websites, Apps, Automation & Campaigns | FIRST CLICK",
    description:
      "See the websites, booking apps, WhatsApp automations, social media plans and Meta Ads campaigns FIRST CLICK builds for growing businesses.",
  },
  {
    path: "/about",
    name: "About",
    title: "About FIRST CLICK | Your Digital Growth Partner in India",
    description:
      "FIRST CLICK makes businesses look better online and work better behind the scenes, with websites, apps, automation, content and marketing under one roof.",
  },
  {
    path: "/contact",
    name: "Contact",
    title: "Contact FIRST CLICK | Start Your Website or Marketing Project",
    description:
      "Tell us about your business and what you need. FIRST CLICK replies on WhatsApp with next steps and a clear quote for your website, app or campaign.",
  },
];

export const NOT_FOUND: PageSeo = {
  path: "/404",
  name: "Not found",
  title: "Page Not Found | FIRST CLICK",
  description: "This page doesn't exist. Head back to FIRST CLICK's home page.",
  noindex: true,
};

export const seoFor = (path: string): PageSeo => PAGES.find((p) => p.path === path) ?? NOT_FOUND;
