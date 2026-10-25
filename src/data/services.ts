/* ── The seven services FIRST CLICK sells. Copy is factual: no results promised. ── */

export type MockKind = "website" | "app" | "automation" | "social" | "content" | "marketing" | "ads";

export interface Service {
  slug: string;
  num: string;
  title: string;
  short: string;
  long: string;
  deliverables: string[];
  forWho: string;
  mock: MockKind;
}

export const SERVICES: Service[] = [
  {
    slug: "website-development",
    num: "01",
    title: "Website Development",
    short: "High-converting websites designed around your business.",
    long: "Fast, mobile-first websites that explain what you do in seconds and make it easy to call, book or buy. Built custom, not from a template, with the pages, forms and integrations your business actually uses.",
    deliverables: ["Custom design and build", "Mobile-first, fast loading", "Enquiry and booking forms", "On-page SEO setup", "Domain, hosting and launch"],
    forWho: "Businesses that need a credible website or a rebuild of one that isn't bringing enquiries.",
    mock: "website",
  },
  {
    slug: "app-development",
    num: "02",
    title: "App Development",
    short: "Custom mobile experiences for modern businesses.",
    long: "Android, iOS and web apps for bookings, ordering, memberships or internal operations. We plan the flows, design the screens and build an app your customers and staff can use without a manual.",
    deliverables: ["User flows and screen design", "Android and iOS builds", "Admin panel", "Payments and notifications", "Store submission"],
    forWho: "Businesses with repeat customers, memberships or staff workflows that a website can't handle.",
    mock: "app",
  },
  {
    slug: "business-automation",
    num: "03",
    title: "Business Automation",
    short: "Automate repetitive processes, leads, follow-ups and workflows.",
    long: "Connect your forms, WhatsApp, email, sheets and CRM so new leads are captured, assigned and followed up automatically. Fewer missed enquiries, less copy-pasting, more time for actual work.",
    deliverables: ["Lead capture to CRM or sheet", "WhatsApp and email auto-replies", "Follow-up reminders", "Team notifications", "Simple reporting"],
    forWho: "Teams losing leads in DMs and spreadsheets, or spending hours on manual follow-ups.",
    mock: "automation",
  },
  {
    slug: "social-media-management",
    num: "04",
    title: "Social Media Management",
    short: "Strategy, content, reels, posting and complete social media management.",
    long: "We plan your monthly content, design the posts, write the captions, schedule everything and keep your profile consistent, so your page looks active and professional without taking up your day.",
    deliverables: ["Monthly content calendar", "Post and story design", "Captions and hashtags", "Scheduling and posting", "Profile optimisation"],
    forWho: "Businesses that know they should post consistently but don't have the time or team.",
    mock: "social",
  },
  {
    slug: "content-and-reels",
    num: "05",
    title: "Content & Reels",
    short: "Short-form content designed to capture attention and generate enquiries.",
    long: "Scripted, shot and edited short-form video for Instagram Reels, YouTube Shorts and ads. Hooks in the first seconds, clear offers and a call to action. Our in-house CaptionIt tool helps draft hooks and captions faster.",
    deliverables: ["Reel concepts and scripts", "Shoot planning", "Editing, captions and music", "Cover frames", "Ad-ready cuts"],
    forWho: "Brands that need attention-grabbing video without hiring a full production team.",
    mock: "content",
  },
  {
    slug: "digital-marketing",
    num: "06",
    title: "Digital Marketing",
    short: "Growth-focused campaigns designed around measurable results.",
    long: "A plan that connects your website, search, social and offers into one path from first visit to enquiry. We set up tracking first, so every decision is based on what's actually happening.",
    deliverables: ["Growth plan", "Google Business Profile and local SEO", "Landing pages", "Analytics and tracking", "Monthly review"],
    forWho: "Businesses spending on marketing without knowing what's working.",
    mock: "marketing",
  },
  {
    slug: "meta-ads",
    num: "07",
    title: "Meta Ads",
    short: "Targeted advertising campaigns focused on leads, sales and growth.",
    long: "Facebook and Instagram campaigns built around one goal: leads, messages or sales. We create the ads, define the audiences, install the pixel and optimise every week based on cost per result.",
    deliverables: ["Campaign strategy", "Ad creatives and copy", "Audience setup", "Pixel and conversion tracking", "Weekly optimisation and reports"],
    forWho: "Businesses ready to put a budget behind growth and want every rupee tracked.",
    mock: "ads",
  },
];

export const serviceBySlug = (slug: string | null) => SERVICES.find((s) => s.slug === slug);
