import { Link } from "react-router-dom";
import { serviceBySlug } from "../data/services";
import PageHero from "../components/sections/PageHero";
import FinalCta from "../components/sections/FinalCta";
import WebsiteMock from "../components/mockups/WebsiteMock";
import AppMock from "../components/mockups/AppMock";
import AutomationMock from "../components/mockups/AutomationMock";
import SocialMock from "../components/mockups/SocialMock";
import ContentMock from "../components/mockups/ContentMock";
import MarketingMock from "../components/mockups/MarketingMock";
import AdsMock from "../components/mockups/AdsMock";
import Button, { Arrow } from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import { whatsappUrl } from "../lib/whatsapp";
import { usePageMeta } from "../lib/usePageMeta";
import type { ReactNode } from "react";

interface Build {
  slug: string;
  title: string;
  desc: string;
  span: string;
  mock: ReactNode;
}

const BUILDS: Build[] = [
  { slug: "website-development", title: "Booking website", desc: "Clear services and prices, online booking, WhatsApp confirmation.", span: "md:col-span-7", mock: <WebsiteMock /> },
  { slug: "app-development", title: "Customer app", desc: "Bookings, loyalty points and reminders in the customer's pocket.", span: "md:col-span-5", mock: <AppMock className="mx-auto h-[420px] w-[210px]" /> },
  { slug: "business-automation", title: "Lead follow-up automation", desc: "Every enquiry saved, answered and assigned without anyone copy-pasting.", span: "md:col-span-5", mock: <AutomationMock /> },
  { slug: "meta-ads", title: "Lead generation campaign", desc: "Instagram and Facebook ads tracked down to the cost of each lead.", span: "md:col-span-7", mock: <AdsMock /> },
  { slug: "social-media-management", title: "Monthly social media plan", desc: "A planned calendar and a profile that looks consistent and active.", span: "md:col-span-7", mock: <SocialMock /> },
  { slug: "content-and-reels", title: "Short-form reel", desc: "A hook in the first second, captions on screen and a clear next step.", span: "md:col-span-5", mock: <ContentMock className="mx-auto h-[420px] w-[210px]" /> },
  { slug: "digital-marketing", title: "Marketing tracking", desc: "Know which channel brings enquiries before spending more.", span: "md:col-span-12", mock: <MarketingMock className="mx-auto max-w-[620px]" /> },
];

export default function Work() {
  usePageMeta("/work");

  return (
    <>
      <PageHero
        kicker="Work"
        title="The standard we build to."
        intro="These are working examples of what we deliver, built in code just like client projects. Detailed client case studies will be published here soon."
      >
        <Button href={whatsappUrl("Hi FIRST CLICK, can you share examples of work for a business like mine?")} external variant="ghost">
          Ask for examples in your industry <Arrow />
        </Button>
      </PageHero>

      <section className="pb-24 md:pb-32">
        <div className="container-x grid gap-4 md:grid-cols-12">
          {BUILDS.map((b, i) => {
            const svc = serviceBySlug(b.slug);
            return (
              <Reveal key={b.slug} delay={(i % 2) * 100} className={`group flex flex-col overflow-hidden rounded-[22px] border border-line bg-raised ${b.span}`}>
                <div className="relative flex min-h-[340px] flex-1 items-center justify-center overflow-hidden bg-ground/60 p-6 md:p-10">
                  <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
                  <div className="relative w-full max-w-[560px] transition-transform duration-500 group-hover:-translate-y-1">{b.mock}</div>
                </div>
                <div className="flex flex-col gap-4 border-t border-line p-6 sm:flex-row sm:items-end sm:justify-between md:p-8">
                  <div>
                    <p className="text-[14px] text-muted">{svc?.title}</p>
                    <h2 className="mt-2 text-title text-ink">{b.title}</h2>
                    <p className="mt-2 max-w-md text-soft">{b.desc}</p>
                  </div>
                  <Link to={`/services#${b.slug}`} className="inline-flex shrink-0 items-center gap-2 text-[15px] text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-violet-soft">
                    View service
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
