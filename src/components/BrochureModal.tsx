import { useState, useMemo } from "react";
import {
  X,
  Sparkles,
  Globe,
  Smartphone,
  Video,
  Camera,
  Share2,
  TrendingUp,
  Users,
  CheckCircle2,
  Download,
  PhoneCall,
  Search,
  ChevronRight,
  Layers,
  Zap,
  Award,
  ShieldCheck,
  Flame,
  ArrowRight,
  Gift
} from "lucide-react";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceItem {
  id: string;
  category: "dev" | "creative" | "marketing" | "management" | "collab" | "events";
  title: string;
  subtitle: string;
  badge: string;
  price: string;
  recurringPrice?: string;
  priceTag: string;
  isFreeWithSmm?: boolean;
  isFeaturedPlan?: boolean;
  icon: any;
  accentColor: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  timeline: string;
  idealFor: string;
  highlights: string[];
}

const BROCHURE_SERVICES: ServiceItem[] = [
  {
    id: "web-dev",
    category: "dev",
    title: "Website Development & UI/UX Architecture",
    subtitle: "Blazing-Fast, High-Converting Web Platforms & E-Commerce",
    badge: "High Performance",
    price: "₹5,000",
    recurringPrice: "+ ₹1,500 / month (Management & SEOs)",
    priceTag: "₹5K One-Time + ₹1.5K/mo",
    isFreeWithSmm: false,
    icon: Globe,
    accentColor: "text-blue-400 border-blue-500/40 bg-blue-950/40",
    description:
      "We design and code bespoke digital storefronts, corporate portals, and custom SaaS web applications with ultra-fast loading speed, immaculate mobile responsiveness, and SEO-first architecture.",
    deliverables: [
      "Custom UI/UX Wireframing & Figma Prototypes",
      "Modern Next.js / React / Vite Core Development",
      "Headless E-Commerce & Shopify Store Customization",
      "Interactive 3D Elements, Animations & Clean Design",
      "Ultra-Fast 99+ Google PageSpeed Score & Mobile First",
      "Integrated Contact Forms, CRM & WhatsApp APIs",
      "Complete On-Page Technical SEO & Analytics Setup",
      "Monthly Maintenance, Bug Fixes & Ongoing SEO Support"
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Shopify", "Supabase"],
    timeline: "7 – 18 Business Days",
    idealFor: "Businesses, D2C Brands, Salons, Clinics, Real Estate & Startups",
    highlights: ["100% Custom Code", "₹5,000 One-Time Setup", "₹1,500/mo Monthly SEO & Management"]
  },
  {
    id: "app-dev",
    category: "dev",
    title: "Mobile App Development (iOS & Android)",
    subtitle: "Native-Quality Cross-Platform Mobile Applications",
    badge: "Scalable Mobile Tech",
    price: "₹20,000",
    recurringPrice: "+ ₹2,000 / month (Management & Maintenance)",
    priceTag: "₹20K One-Time + ₹2K/mo",
    isFreeWithSmm: false,
    icon: Smartphone,
    accentColor: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
    description:
      "Engaging mobile applications for iOS & Android built on robust scalable foundations. From client booking engines to e-commerce mobile shopping and internal staff apps.",
    deliverables: [
      "Intuitive Mobile UX/UI Flow & App Store Guidelines Compliance",
      "Cross-Platform Codebase (Flutter / React Native)",
      "Secure User Authentication, OTP & Social Login",
      "Push Notifications & In-App Alerts Engine",
      "Payment Gateway Integrations (Razorpay, Stripe, UPI)",
      "Admin Control Panel to Manage Content & Users Live",
      "App Store & Google Play Store Submission Assistance",
      "Monthly Server Management, Updates & Maintenance"
    ],
    techStack: ["Flutter", "React Native", "Firebase", "Node.js", "PostgreSQL", "App Store Connect"],
    timeline: "3 – 6 Weeks",
    idealFor: "E-commerce stores, Booking Platforms, Fitness Studios & Startups",
    highlights: ["Smooth 60fps Native UI", "₹20,000 One-Time Setup", "₹2,000/mo App Server Care"]
  },
  {
    id: "reels-video",
    category: "creative",
    title: "Only Professional Edits",
    subtitle: "Viral Hook Scripting, High-Retention Cuts & Motion Graphics (30 Reels/mo)",
    badge: "30 Reels / ₹12,000",
    price: "₹12,000 / month",
    recurringPrice: "Includes 30 Professional Reel Edits / Month with Motion Graphics",
    priceTag: "₹12,000 / 30 Reels",
    isFreeWithSmm: false,
    icon: Video,
    accentColor: "text-pink-400 border-pink-500/40 bg-pink-950/40",
    description:
      "Stop the scroll with cinematic short-form video content engineered specifically for Instagram Reels, YouTube Shorts, and TikTok algorithms with dynamic sound design, kinetic captions, and motion graphics.",
    deliverables: [
      "30 High-Retention Professional Reels Produced Every Month",
      "Psychology-Driven Viral Scripting & 3-Second Hook Concepts",
      "Kinetic Typography, Subtitles & Custom Emoji Captions",
      "Color Grading, Cinematic LUTs & 4K Resolution Mastering",
      "Motion Graphics, B-roll Integration & Visual Effects",
      "Sound Design, Audio Sync & Trending Audio Selection",
      "Before/After Transitions, Aesthetic Product Spotlights",
      "Ready-to-Post Multi-Format Exports"
    ],
    techStack: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut Pro", "Logic Pro"],
    timeline: "24 – 48 Hours per Reel batch",
    idealFor: "Brands wanting explosive organic reach, Influencers & Service Businesses",
    highlights: ["30 Reels / Month (₹12,000 value)", "Professional Motion Graphics Included", "Trending Sound Research"]
  },
  {
    id: "event-shoots",
    category: "events",
    title: "Event Shoots, Festive Campaigns & 4K Production",
    subtitle: "On-Location Shoots for Festive Drops, Grand Openings & Events",
    badge: "₹2K Per Reel",
    price: "₹2,000 / Reel",
    recurringPrice: "Complete On-Site Shoot + Edit + Final Delivery",
    priceTag: "₹2,000 / Reel",
    isFreeWithSmm: false,
    icon: Camera,
    accentColor: "text-amber-400 border-amber-500/40 bg-amber-950/40",
    description:
      "Professional on-ground camera team equipped with 4K cinema cameras, gimbals, and studio lighting to capture your store openings, festive collection launches, and brand milestones.",
    deliverables: [
      "Professional On-Location Videography & Photography Team",
      "Sony / Cinema 4K Cameras with Prime Lenses & Gimbals",
      "Wireless Lavalier Microphones & Studio Lighting Setup",
      "Festive Campaign Shoots (Diwali, New Year, Wedding Season, Eid)",
      "Model & Product Posing Direction + Storyboard Coordination",
      "Same-Day / Next-Day Teaser Video Edits for Live Hype",
      "High-Res Retouched Still Photos + Cinematic Reel Delivery",
      "Raw Footage Archive Access for Future Content Repurposing"
    ],
    techStack: ["Sony FX3 / A7S III", "DJI Ronin RS3", "Godox Pro Lighting", "DJI Wireless Mic"],
    timeline: "On-site + 48h Post Production",
    idealFor: "Jewellery Showrooms, Salons, Real Estate, Fashion Brands & Festivals",
    highlights: ["Only ₹2,000 per Produced Reel", "4K Cinema Camera Rig", "Director-Led Shoot"]
  },
  {
    id: "smm-management",
    category: "management",
    title: "Social Media Management & End-to-End Handling",
    subtitle: "100% Hands-Off Content Creation, Scheduling, Upload & Daily Growth",
    badge: "Popular Retainer",
    price: "₹8,000 – ₹10,000 / month",
    recurringPrice: "₹8,000/mo (10 Reels) or ₹10,000/mo (15 Reels) • Includes FREE Meta Ads & FREE Barter Collabs",
    priceTag: "₹8K (10 Reels) / ₹10K (15 Reels)",
    isFreeWithSmm: false,
    icon: Share2,
    accentColor: "text-purple-400 border-purple-500/40 bg-purple-950/40",
    description:
      "Let our dedicated social media managers handle your entire brand presence across Facebook, Instagram & YouTube. We script, design, write captions, upload at peak algorithm times, reply to DMs, and manage monthly growth.",
    deliverables: [
      "10 Reels Package (₹8,000/mo) or 15 Reels Package (₹10,000/mo) — Scripting, Editing & Publishing",
      "6–10 Graphics Posts & Carousels / Month (Brand Creatives & Promos)",
      "Platforms Covered: Facebook (FB), Instagram (Insta), YouTube (YT)",
      "Complete 30-Day Content Calendar & Aesthetic Feed Architecture",
      "Daily Content Scheduling & Optimization (Reels, Carousels, Stories)",
      "High-Converting Copywriting, Strategic Hashtags & SEO Keywords",
      "Active Community Management (DM Replies, Comments, Engagement)",
      "Meta Ads Management Included FREE (Client pays ad spend)",
      "Free Barter Influencer Outreach Included FREE",
      "Highlight Cover Design, Bio Optimization & Link-in-Bio Setup",
      "Detailed Monthly Performance & Growth Insights Report"
    ],
    techStack: [
      "Facebook (FB)",
      "Instagram (Insta)",
      "YouTube (YT)",
      "Meta Business Suite",
      "Notion",
      "Figma",
      "Canva Pro",
      "Hootsuite",
      "Buffer"
    ],
    timeline: "Monthly Retainer (Daily Execution)",
    idealFor: "Business owners who want zero headache and 100% consistent social growth across Facebook, Instagram & YouTube",
    highlights: [
      "₹8,000/mo (10 Reels) | ₹10,000/mo (15 Reels)",
      "10 or 15 Reels & 6–10 Graphics / Month",
      "Facebook, Instagram & YouTube (FB, Insta, YT)",
      "Meta Ads Management FREE",
      "Barter Collabs Handling FREE"
    ]
  },
  {
    id: "performance-ads",
    category: "marketing",
    title: "Meta Ads, Sales & Performance Marketing",
    subtitle: "Laser-Targeted Facebook & Instagram Ads for Maximum ROAS & Leads",
    badge: "10% of Ad Spend",
    price: "10% of Ad Budget",
    recurringPrice: "10% Agency Management Fee on Monthly Ad Spend",
    priceTag: "10% of Ad Spend",
    isFreeWithSmm: false,
    icon: TrendingUp,
    accentColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
    description:
      "Get high-converting ad funnels on Meta Ads Manager with A/B creative testing, custom audience retargeting, and lead nurturing workflows with a transparent 10% agency management fee on your ad spend.",
    deliverables: [
      "10% Agency Management Fee on your monthly ad spend",
      "Client funds ad spend directly to Meta Ads Manager (Zero markup)",
      "Meta Pixel, CAPI (Conversions API) & Domain Verification",
      "Audience Research, Demographics, Interest & Lookalike Stacking",
      "High-CTR Ad Creatives (Video Hooks, Static Banners, Carousel Ads)",
      "Persuasive Sales Ad Copy, Headlines & Strong Call-to-Actions",
      "Instant Lead Form Setup & Automated WhatsApp Notification Triggers",
      "Daily Budget Optimization, Bid Capping & ROAS Scaling",
      "Weekly ROAS / Cost-Per-Lead (CPL) Performance Dashboard"
    ],
    techStack: ["Meta Ads Manager", "Google Analytics 4", "Meta Pixel / CAPI", "Zapier", "WhatsApp API"],
    timeline: "Continuous Active Campaign Scaling",
    idealFor: "Businesses wanting predictable daily leads, footfalls, or e-commerce purchases",
    highlights: ["Agency Fee: 10% of Ad Spend", "Direct Ad Spend Funding", "Targeted High ROAS"]
  },
  {
    id: "influencer-collabs",
    category: "collab",
    title: "Free Barter Influencer Collaborations",
    subtitle: "Creator Outreach, Free Barter Partnerships & Shoot Coordination",
    badge: "FREE with SMM",
    price: "FREE with Social Media Management",
    recurringPrice: "100% Free Barter Partnerships (Product/Service Exchange) — Zero Creator Fees",
    priceTag: "FREE Barter (with SMM)",
    isFreeWithSmm: true,
    icon: Users,
    accentColor: "text-yellow-400 border-yellow-500/40 bg-yellow-950/40",
    description:
      "Harness the credibility of trusted local and national creators. We identify matching creators, manage 100% free barter product/service deals, and coordinate shoots at ZERO agency service charge when taking our SMM package.",
    deliverables: [
      "100% FREE Agency Coordination & Outreach with SMM package",
      "Vetted Influencer Shortlisting Matching Your Exact Target Audience",
      "100% Free Barter (Product/Service Exchange) Collaborations",
      "Strictly Zero Creator Charges / Paid Fees",
      "Creative Brief, Script Guidelines & Storyboard Alignment",
      "On-Site Store Visit Coordination & Content Supervision",
      "Deliverable Tracking (Stories, Feed Collab Posts, Reels, YouTube)",
      "Post-Campaign Engagement, Reach & ROI Audit"
    ],
    techStack: ["Creator Intelligence", "Influencer CRM", "Meta Collab Hub", "Google Sheets"],
    timeline: "1 – 3 Weeks per Campaign",
    idealFor: "Salons, Boutiques, Restaurants, Cafes, Skincare, Lifestyle & Apparel Brands",
    highlights: ["Agency Fee: ₹0 (FREE with SMM)", "100% Free Barter Creator Collabs", "Direct Social Proof"]
  },
  {
    id: "agency-360",
    category: "management",
    title: "360° All-in-One Growth Agency Retainer",
    subtitle: "Everything Under One Roof: Tech, Content, Shoots, Management & Ads",
    badge: "🔥 Best Value Flagship",
    price: "₹12,000 / month",
    recurringPrice: "Everything Included: Tech + Content + SMM + Ads + Collabs",
    priceTag: "₹12,000 / mo (All-in-One)",
    isFeaturedPlan: true,
    icon: Flame,
    accentColor: "text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-950/40",
    description:
      "Our most popular all-in-one growth partnership. You focus 100% on running your core business, while First Click handles your entire website maintenance, 30 Reels with motion graphics, end-to-end social media, Meta ads, and influencer collaborations.",
    deliverables: [
      "Website Maintenance, Ongoing Updates & SEO Care",
      "30 Cinematic Edited Reels / Month with Motion Graphics",
      "End-to-End Social Media Management & Daily Posting",
      "Meta Ads Management & High-ROAS Lead Generation Setup",
      "Free Barter Influencer Outreach & Shoot Coordination",
      "Event & Shoot Planning Support",
      "Dedicated Creative Director, Video Editor & Account Manager",
      "24/7 Priority WhatsApp Agency Hotline & Weekly Strategy Sync"
    ],
    techStack: ["All Tech + Production + Marketing Stacks Combined"],
    timeline: "Monthly Retainer (All-Inclusive)",
    idealFor: "Ambitious founders, showrooms, salons & brands ready for complete market dominance",
    highlights: ["All-in-One: ₹12,000/mo", "Saves Over ₹15,000/mo vs Individual Services", "Complete Agency Team"]
  }
];

const CATEGORIES = [
  { id: "all", label: "All Services & Pricing" },
  { id: "dev", label: "Web & App Dev" },
  { id: "creative", label: "Professional Edits & Reels" },
  { id: "events", label: "Event Shoots" },
  { id: "management", label: "SMM & 360° Retainer" },
  { id: "marketing", label: "Meta Ads" },
  { id: "collab", label: "Barter Collabs" }
];

export function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeServiceId, setActiveServiceId] = useState<string>("agency-360");

  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BROCHURE_SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        service.title.toLowerCase().includes(q) ||
        service.subtitle.toLowerCase().includes(q) ||
        service.price.toLowerCase().includes(q) ||
        service.deliverables.some((d) => d.toLowerCase().includes(q)) ||
        service.techStack.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const activeService = useMemo(() => {
    return (
      BROCHURE_SERVICES.find((s) => s.id === activeServiceId) ||
      filteredServices[0] ||
      BROCHURE_SERVICES[0]
    );
  }, [activeServiceId, filteredServices]);

  if (!isOpen) return null;

  const handleWhatsAppInquiry = (service?: ServiceItem) => {
    const item = service || activeService;
    const cleanRecurring = item.recurringPrice ? ` (${item.recurringPrice})` : "";
    const text = `Hello FIRST CLICK team!\n\nI reviewed your Service Brochure and I am interested in booking:\n*${item.title}*\nPrice: ${item.price}${cleanRecurring}\n\nPlease share onboarding details and next steps.`;
    const url = `https://wa.me/919530789815?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleDownloadBrochure = () => {
    const printWindow = window.open("", "_blank", "width=900,height=1000");
    if (!printWindow) {
      window.print();
      return;
    }

    const servicesHtml = BROCHURE_SERVICES.map(
      (s) => `
      <div class="service-card ${s.isFeaturedPlan ? "featured" : ""}">
        <div class="service-header">
          <div>
            <div class="service-badge">${s.badge}</div>
            <h3 class="service-title">${s.title}</h3>
            <div class="service-sub">${s.subtitle}</div>
          </div>
          <div class="service-price">
            <div class="price-val">${s.price}</div>
            ${s.recurringPrice ? `<div class="price-rec">${s.recurringPrice}</div>` : ""}
          </div>
        </div>
        <p class="service-desc">${s.description}</p>
        <div class="deliverables-title">Key Deliverables & Inclusions:</div>
        <ul class="deliverables-list">
          ${s.deliverables.map((d) => `<li>✔ ${d}</li>`).join("")}
        </ul>
        <div class="service-footer">
          <span><strong>⚡ Timeline:</strong> ${s.timeline}</span>
          <span><strong>🛠 Stack:</strong> ${s.techStack.slice(0, 4).join(", ")}</span>
        </div>
      </div>
    `
    ).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>FIRST CLICK — Official Agency Brochure & Pricing</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', sans-serif;
            background: #ffffff;
            color: #111827;
            padding: 30px;
            line-height: 1.4;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-size: 26px;
            font-weight: 900;
            color: #7c3aed;
            letter-spacing: 1px;
          }
          .brand-sub {
            font-size: 12px;
            color: #4b5563;
            margin-top: 3px;
          }
          .contact-box {
            text-align: right;
            font-size: 11px;
            color: #374151;
          }
          .contact-box strong { color: #111827; }
          .services-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .service-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            background: #f9fafb;
            page-break-inside: avoid;
          }
          .service-card.featured {
            border: 2px solid #7c3aed;
            background: #faf5ff;
            grid-column: span 2;
          }
          .service-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          .service-badge {
            display: inline-block;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 8px;
            background: #ede9fe;
            color: #6d28d9;
            border-radius: 9999px;
            margin-bottom: 4px;
          }
          .service-title {
            font-size: 14px;
            font-weight: 800;
            color: #111827;
          }
          .service-sub {
            font-size: 11px;
            color: #6b7280;
          }
          .service-price {
            text-align: right;
          }
          .price-val {
            font-size: 14px;
            font-weight: 900;
            color: #059669;
          }
          .price-rec {
            font-size: 9px;
            color: #6b7280;
          }
          .service-desc {
            font-size: 11px;
            color: #374151;
            margin-bottom: 10px;
          }
          .deliverables-title {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #4b5563;
            margin-bottom: 4px;
          }
          .deliverables-list {
            list-style: none;
            font-size: 10.5px;
            color: #4b5563;
            display: grid;
            grid-template-columns: 1fr;
            gap: 3px;
            margin-bottom: 10px;
          }
          .service-footer {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
          }
          .footer-cta {
            border-top: 2px solid #e5e7eb;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #4b5563;
          }
          .footer-btn {
            background: #059669;
            color: #ffffff;
            font-weight: bold;
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
          }
          @media print {
            body { padding: 15px; }
            .service-card { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-title">FIRST CLICK</div>
            <div class="brand-sub">Official Digital Agency Capabilities & Transparent Pricing Brochure</div>
          </div>
          <div class="contact-box">
            <div><strong>WhatsApp / Phone:</strong> +91 9530789815</div>
            <div><strong>Email:</strong> firstclickdigital@gmail.com</div>
            <div><strong>Services:</strong> Web, Apps, Reels, Shoots, SMM, Meta Ads</div>
          </div>
        </div>

        <div class="services-grid">
          ${servicesHtml}
        </div>

        <div class="footer-cta">
          <div>
            <strong>FIRST CLICK Digital Agency</strong> • 100% Transparent Pricing Guarantee • Dedicated Account Managers
          </div>
          <div>
            <strong>WhatsApp Hotline:</strong> +91 9530789815
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/90">
      {/* Main Container - High performance solid dark theme */}
      <div className="relative w-full max-w-7xl bg-[#0b0b14] border border-[#232338] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-4 border-b border-[#1c1c2e] bg-[#10101c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center border border-purple-400/40 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-mono">
                  FIRST CLICK
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-purple-950 text-purple-300 border border-purple-500/40 rounded-full">
                  Official Pricing & Brochure
                </span>
              </div>
              <p className="text-xs text-[#9d9cb8] hidden sm:block">
                Transparent Pricing • Websites, Apps, Reels, Shoots, SMM, Meta Ads & Collabs
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBrochure}
              title="Download Brochure PDF or Print"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#c5c3e0] hover:text-white bg-[#181828] hover:bg-[#222238] border border-[#2c2c44] rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => handleWhatsAppInquiry()}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-white uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book via WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close Brochure"
              className="p-2 text-[#8a88ab] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-4 sm:px-8 py-3 bg-[#0d0d18] border-b border-[#1c1c2e] flex flex-col md:flex-row items-center justify-between gap-2.5 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-[#141424] text-[#8e8ca8] hover:text-white hover:bg-[#1c1c32]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7a9c]" />
            <input
              type="text"
              placeholder="Search service, price, ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#141424] border border-[#23233c] focus:border-purple-500/60 rounded-lg text-xs text-white placeholder-[#686684] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8e8ca8] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Brochure Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Interactive Service Cards Grid / List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#797799]">
                Services & Pricing ({filteredServices.length})
              </span>
              <span className="text-[11px] text-purple-400 font-medium">
                Select to view details
              </span>
            </div>

            {filteredServices.length === 0 ? (
              <div className="p-8 text-center bg-[#10101f] rounded-2xl border border-dashed border-[#272744]">
                <p className="text-sm text-[#8e8ca8]">No services match your search query.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs text-purple-400 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredServices.map((service) => {
                const IconComponent = service.icon;
                const isSelected = activeService.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setActiveServiceId(service.id)}
                    className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#18182e] border-purple-500 ring-1 ring-purple-500/50"
                        : "bg-[#0e0e1a] border-[#1d1d33] hover:border-[#2f2f4f] hover:bg-[#121222]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl border ${service.accentColor} shrink-0`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                            {service.title}
                          </h3>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 ${
                              service.isFreeWithSmm
                                ? "text-emerald-300 border-emerald-500/40 bg-emerald-950/60"
                                : service.isFeaturedPlan
                                ? "text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-950/60"
                                : service.accentColor
                            }`}
                          >
                            {service.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#8e8ca8] mt-0.5 line-clamp-1">
                          {service.subtitle}
                        </p>

                        {/* Price Badge on Card */}
                        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#1c1c30]">
                          <div className="flex items-center gap-1.5">
                            {service.isFreeWithSmm ? (
                              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                                <Gift className="w-3 h-3 text-emerald-400" /> FREE with SMM
                              </span>
                            ) : (
                              <span className="text-xs font-mono font-bold text-white">
                                {service.price}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-purple-400 ml-auto flex items-center gap-0.5">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* All in one highlight banner */}
            <div
              onClick={() => {
                setActiveServiceId("agency-360");
                setSelectedCategory("all");
              }}
              className="mt-2 p-3.5 rounded-xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-purple-950/60 border border-purple-500/40 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-400 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-fuchsia-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">360° All-in-One Retainer: ₹12,000/mo</h4>
                  <p className="text-[10px] text-[#b5b3d6]">Web + SMM + 30 Reels + Ads + Collabs</p>
                </div>
              </div>
              <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-0.5 shrink-0">
                View Plan →
              </span>
            </div>
          </div>

          {/* Right Column: Detailed Showcase of Selected Service (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="h-full bg-[#10101c] border border-[#23233c] rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
              <div>
                {/* Header of Active Service */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1f1f33]">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl border ${activeService.accentColor}`}>
                      {(() => {
                        const Icon = activeService.icon;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${activeService.accentColor}`}
                        >
                          {activeService.badge}
                        </span>
                        <span className="text-xs font-mono text-[#817f9e]">
                          ⚡ {activeService.timeline}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-bold text-white mt-1">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Big Prominent Pricing Box */}
                <div className="mt-4 p-4 rounded-xl bg-[#090912] border border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                      Package Investment / Pricing:
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black font-mono text-white">
                        {activeService.price}
                      </span>
                    </div>
                    {activeService.recurringPrice && (
                      <p className="text-xs text-[#a09ebf] mt-0.5 font-medium">
                        {activeService.recurringPrice}
                      </p>
                    )}
                  </div>

                  {activeService.isFreeWithSmm && (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      ₹0 Agency Fee with SMM
                    </div>
                  )}
                </div>

                {/* Subtitle & Description */}
                <div className="mt-4">
                  <p className="text-xs sm:text-sm font-semibold text-purple-300">
                    {activeService.subtitle}
                  </p>
                  <p className="text-xs text-[#a4a2c4] mt-1.5 leading-relaxed">
                    {activeService.description}
                  </p>
                </div>

                {/* Key Highlights badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeService.highlights.map((hl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#181828] border border-[#26263e] text-[#d8d6f0]"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      {hl}
                    </span>
                  ))}
                </div>

                {/* Deliverables Checklist */}
                <div className="mt-5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#8b89ac] font-bold mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> What is Included in this Package:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeService.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded-lg bg-[#0b0b14] border border-[#1a1a2c] text-xs text-[#c5c3e0]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech & Production Stack */}
                <div className="mt-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#8b89ac] font-bold mb-2">
                    Tools & Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeService.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#161626] border border-[#26263e] text-[#b4b2d4]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ideal For */}
                <div className="mt-4 p-2.5 rounded-xl bg-[#0b0b14] border border-[#1a1a2c] text-xs text-[#9d9cb8]">
                  <strong className="text-white">Best Suited For: </strong>
                  {activeService.idealFor}
                </div>
              </div>

              {/* Bottom WhatsApp Booking CTA banner */}
              <div className="mt-6 pt-4 border-t border-[#1f1f33] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d0d18] p-3.5 rounded-xl">
                <div>
                  <div className="text-[11px] text-[#8e8ca8]">Ready to get started?</div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                    Book for {activeService.price} <ArrowRight className="w-3 h-3 text-purple-400" />
                  </div>
                </div>

                <button
                  onClick={() => handleWhatsAppInquiry(activeService)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book Package on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Summary Strip */}
        <div className="px-5 py-3 bg-[#0a0a12] border-t border-[#1a1a2c] flex flex-wrap items-center justify-between gap-2 text-xs text-[#7c7a9c] shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Transparent Pricing Guarantee
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">No Hidden Charges • Dedicated Account Managers</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9e9cb8]">Want everything in one plan?</span>
            <button
              onClick={() => {
                setActiveServiceId("agency-360");
                setSelectedCategory("all");
              }}
              className="text-fuchsia-400 hover:text-fuchsia-300 font-bold underline cursor-pointer"
            >
              Get All-in-One @ ₹12,000/mo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
