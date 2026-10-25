/* ── Services and prices from the FIRST CLICK brochure (src/components/BrochureModal.tsx).
   Facts are unchanged: prices, inclusions, timelines and tools. Wording is tidied for the site. ── */

export type Category = "dev" | "creative" | "events" | "management" | "marketing" | "collab";

export interface Offer {
  id: string;
  category: Category;
  title: string;
  short: string;
  subtitle: string;
  /** Headline price as shown in the brochure */
  price: string;
  priceNote: string;
  /** Numbers used by the plan builder (rupees) */
  oneTime?: number;
  monthly?: number;
  perUnit?: { amount: number; unit: string };
  freeWithSmm?: boolean;
  featured?: boolean;
  description: string;
  deliverables: string[];
  tools: string[];
  timeline: string;
  idealFor: string;
  highlights: string[];
}

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "dev", label: "Web & app" },
  { id: "creative", label: "Professional edits" },
  { id: "events", label: "Shoots" },
  { id: "management", label: "Social & retainers" },
  { id: "marketing", label: "Meta Ads" },
  { id: "collab", label: "Influencers" },
];

export const OFFERS: Offer[] = [
  {
    id: "web-dev",
    category: "dev",
    title: "Website Development & UI/UX",
    short: "Website",
    subtitle: "Fast, high-converting business websites and online stores",
    price: "₹5,000",
    priceNote: "one-time + ₹1,500 / month for management & SEO",
    oneTime: 5000,
    monthly: 1500,
    description:
      "Custom-designed and custom-coded business websites, corporate portals, online stores and web apps, built for fast loading, clean mobile layouts and search visibility from day one.",
    deliverables: [
      "UI/UX wireframes and Figma prototypes",
      "Modern Next.js / React / Vite development",
      "Headless e-commerce and Shopify store customisation",
      "Interactive elements and clean animations",
      "Mobile-first build optimised for PageSpeed",
      "Contact forms, CRM and WhatsApp API integration",
      "On-page technical SEO and analytics setup",
      "Monthly maintenance, fixes and ongoing SEO support",
    ],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Shopify", "Supabase"],
    timeline: "7 – 18 business days",
    idealFor: "Businesses, D2C brands, salons, clinics, real estate and startups",
    highlights: ["100% custom code", "₹5,000 one-time setup", "₹1,500/mo SEO & management"],
  },
  {
    id: "app-dev",
    category: "dev",
    title: "Mobile App Development",
    short: "Mobile app",
    subtitle: "Cross-platform apps for iOS and Android",
    price: "₹20,000",
    priceNote: "one-time + ₹2,000 / month for management & maintenance",
    oneTime: 20000,
    monthly: 2000,
    description:
      "iOS and Android apps built on a scalable foundation: booking apps, shopping apps and internal staff tools, with an admin panel to manage everything live.",
    deliverables: [
      "Mobile UX/UI flows following App Store guidelines",
      "Cross-platform codebase (Flutter / React Native)",
      "Secure login with OTP and social sign-in",
      "Push notifications and in-app alerts",
      "Payments with Razorpay, Stripe and UPI",
      "Admin panel to manage content and users",
      "App Store and Google Play submission support",
      "Monthly server management, updates and maintenance",
    ],
    tools: ["Flutter", "React Native", "Firebase", "Node.js", "PostgreSQL", "App Store Connect"],
    timeline: "3 – 6 weeks",
    idealFor: "E-commerce stores, booking platforms, fitness studios and startups",
    highlights: ["Smooth native-feel UI", "₹20,000 one-time setup", "₹2,000/mo server care"],
  },
  {
    id: "reels-video",
    category: "creative",
    title: "Only Professional Edits",
    short: "Only Professional Edits",
    subtitle: "Up to 30 professional edited reels a month with motion graphics",
    price: "₹12,000 / month",
    priceNote: "₹12,000 for 30 professional reel edits with motion graphics",
    monthly: 12000,
    description:
      "Short-form video edited professionally for Instagram Reels, YouTube Shorts and TikTok: strong opening hooks, kinetic captions, sound design and motion graphics that keep people watching.",
    deliverables: [
      "Up to 30 professional edited reels every month",
      "Hook-first scripting and concepts",
      "Kinetic typography and on-screen captions",
      "Colour grading and 4K mastering",
      "Motion graphics, B-roll and visual effects",
      "Sound design and trending audio selection",
      "Before/after transitions and product spotlights",
      "Ready-to-post exports in every format",
    ],
    tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut Pro", "Logic Pro"],
    timeline: "24 – 48 hours per batch",
    idealFor: "Brands, creators and service businesses that want organic reach",
    highlights: ["₹12,000 for 30 reels (₹400/reel)", "Motion graphics included", "Trending audio research"],
  },
  {
    id: "event-shoots",
    category: "events",
    title: "Event Shoots & Festive Campaigns",
    short: "Event shoot",
    subtitle: "On-location 4K shoots for launches, festivals and events",
    price: "₹2,000 / reel",
    priceNote: "complete on-site shoot, edit and final delivery",
    perUnit: { amount: 2000, unit: "reel" },
    description:
      "An on-ground team with 4K cameras, gimbals and lighting to capture store openings, festive collection launches and brand milestones, delivered as finished reels and photos.",
    deliverables: [
      "On-location videography and photography team",
      "Sony / cinema 4K cameras with gimbals",
      "Wireless microphones and studio lighting",
      "Festive campaign shoots (Diwali, New Year, wedding season, Eid)",
      "Model and product direction with storyboards",
      "Same-day or next-day teaser edits",
      "Retouched photos and edited reels",
      "Raw footage archive for future content",
    ],
    tools: ["Sony FX3 / A7S III", "DJI Ronin RS3", "Godox lighting", "DJI wireless mic"],
    timeline: "On-site + 48 hours post-production",
    idealFor: "Jewellery showrooms, salons, real estate, fashion brands and festivals",
    highlights: ["₹2,000 per produced reel", "4K cinema camera rig", "Director-led shoot"],
  },
  {
    id: "smm-management",
    category: "management",
    title: "Social Media Management",
    short: "Social media management",
    subtitle: "Content, posting, replies and growth, fully handled",
    price: "₹8,000 – ₹10,000 / month",
    priceNote: "₹8,000/mo (10 reels) or ₹10,000/mo (15 reels) · Free Barter Collabs included",
    monthly: 10000,
    description:
      "A dedicated team runs your Facebook, Instagram and YouTube: scripting, design, captions, scheduling at the right times, replying to DMs and reporting on growth every month.",
    deliverables: [
      "10 reels (₹8,000/mo) or 15 reels (₹10,000/mo): scripted, edited & published",
      "6–10 graphic posts and carousels a month",
      "Facebook, Instagram and YouTube covered",
      "30-day content calendar and feed planning",
      "Daily scheduling of reels, carousels and stories",
      "Captions, hashtags and keyword research",
      "Community management: DMs, comments and engagement",
      "Meta Ads management available at 10% of ad budget",
      "Free barter influencer outreach included free",
      "Highlight covers, bio and link-in-bio setup",
      "Monthly performance and growth report",
    ],
    tools: ["Meta Business Suite", "Instagram", "Facebook", "YouTube", "Notion", "Figma", "Canva Pro", "Buffer"],
    timeline: "Monthly retainer, daily execution",
    idealFor: "Owners who want consistent social growth without managing it themselves",
    highlights: ["10 reels (₹8,000) or 15 reels (₹10,000)", "Meta Ads @ 10% budget", "Barter collabs free"],
  },
  {
    id: "performance-ads",
    category: "marketing",
    title: "Meta Ads & Performance Marketing",
    short: "Meta Ads",
    subtitle: "Facebook and Instagram ads for leads and sales",
    price: "10% of ad budget",
    priceNote: "monthly management fee is 10% of your ad spend",
    description:
      "Lead and sales campaigns on Meta Ads Manager with creative testing, retargeting and automatic WhatsApp alerts for new leads. Transparent agency management fee of 10% of your ad spend.",
    deliverables: [
      "10% agency management fee on your monthly ad spend",
      "You pay ad spend directly to Meta (zero agency markup)",
      "Meta Pixel, Conversions API and domain verification",
      "Audience research, interests and lookalikes",
      "Video, static and carousel ad creatives",
      "Ad copy, headlines and calls to action",
      "Instant lead forms with WhatsApp notifications",
      "Daily budget optimisation and scaling",
      "Weekly cost-per-lead and ROAS reporting",
    ],
    tools: ["Meta Ads Manager", "Google Analytics 4", "Meta Pixel / CAPI", "Zapier", "WhatsApp API"],
    timeline: "Ongoing, optimised continuously",
    idealFor: "Businesses that want a steady flow of leads, walk-ins or online orders",
    highlights: ["10% of ad budget", "Zero markup on ad spend", "Weekly reporting"],
  },
  {
    id: "influencer-collabs",
    category: "collab",
    title: "Free Barter Influencer Collaborations",
    short: "Barter collabs",
    subtitle: "Creator outreach, barter deals and shoot coordination",
    price: "Free with social media management",
    priceNote: "100% free barter partnerships (product/service exchange) — zero creator fees",
    freeWithSmm: true,
    description:
      "We find creators who match your audience, arrange genuine barter collaboration deals (product or service exchange), brief them and supervise the shoot, at zero coordination fee when you take our social media management.",
    deliverables: [
      "No coordination fee with the social media package",
      "Shortlist of creators matching your exact target audience",
      "100% free barter collaboration outreach & negotiation",
      "Strictly zero creator fees (genuine product/service exchange)",
      "Creative brief, script guidelines and storyboard",
      "Store visit coordination and content supervision",
      "Tracking of stories, collab posts, reels and videos",
      "Usage rights for running content as ads",
      "Post-campaign reach and engagement review",
    ],
    tools: ["Influencer CRM", "Meta collab tools", "Google Sheets"],
    timeline: "1 – 3 weeks per campaign",
    idealFor: "Salons, boutiques, restaurants, cafés, skincare, lifestyle and apparel brands",
    highlights: ["₹0 coordination fee with SMM", "100% Free Barter Collabs", "Real social proof"],
  },
  {
    id: "agency-360",
    category: "management",
    title: "360° All-in-One Growth Retainer",
    short: "360° retainer",
    subtitle: "Tech, content, shoots, social media and ads under one roof",
    price: "₹12,000 / month",
    priceNote: "website care, reels, social media, ads and collabs included",
    monthly: 12000,
    featured: true,
    description:
      "Our complete growth partnership. You run your business while we handle website maintenance, 30 reels with motion graphics, end-to-end social media, Meta Ads and influencer collaborations.",
    deliverables: [
      "Website maintenance, updates and SEO care",
      "30 edited reels a month with motion graphics",
      "End-to-end social media management and daily posting",
      "Meta Ads management and lead generation setup",
      "Free barter influencer outreach and coordination",
      "Event and shoot planning support",
      "Dedicated creative director, video editor and account manager",
      "Priority WhatsApp line and weekly strategy sync",
    ],
    tools: ["Every tool across development, production and marketing"],
    timeline: "Monthly retainer, all-inclusive",
    idealFor: "Founders, showrooms, salons and brands ready to grow on every channel",
    highlights: ["All-in-one: ₹12,000/mo", "One team for everything", "Weekly strategy sync"],
  },
];

/** Services the 360° retainer covers, so the plan builder doesn't charge for them twice. */
export const COVERED_BY_360 = new Set(["reels-video", "smm-management", "performance-ads", "influencer-collabs"]);

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
