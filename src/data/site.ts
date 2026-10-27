import { WHATSAPP_NUMBER } from "../lib/whatsapp";
import { SITE_URL } from "./seo";

/* ── Company-wide facts. Social links stay hidden until a URL is filled in. ── */

export interface SocialLink {
  label: string;
  url: string;
}

export const SITE = {
  name: "FIRST CLICK CONNECTS LLP",
  shortName: "FIRST CLICK",
  descriptor: "Digital Growth Agency",
  url: SITE_URL,
  whatsapp: WHATSAPP_NUMBER,
  phoneDisplay: "+91 95307 89815",
  email: "",
  replyNote: "We usually reply on WhatsApp within a working day.",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/firstclick.socials/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/company/firstclickconnectsllp/" },
  ] as SocialLink[],
};

export const activeSocials = (): SocialLink[] => SITE.socials.filter((s) => s.url);

export const NAV_LINKS = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const BUDGETS = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000 – ₹2,00,000",
  "₹2,00,000+",
  "Not sure yet",
];
