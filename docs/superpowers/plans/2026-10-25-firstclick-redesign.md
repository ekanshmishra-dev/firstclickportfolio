# FIRST CLICK Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the FIRST CLICK site as a multi-page, professional agency site per `docs/superpowers/specs/2026-10-25-firstclick-redesign-design.md`.

**Architecture:** React 19 SPA with react-router-dom. Content lives in typed data modules (`src/data`), pages compose small layout/ui components, and every visual is a code-built interface mockup (`src/components/mockups`). Legacy portals (Admin, Employee, Brochure) are mounted unchanged from the layout shell.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, react-router-dom 7, lucide-react, Playwright (verification).

## Global Constraints
- No fake stats, awards, years, or client names. No emoji. No stock photos.
- Accent `#7c5cff` used for actions, focus and live UI states only.
- Body text ≥ 16px; no text smaller than 13px on marketing pages.
- WhatsApp number: `919530789815`.
- Respect `prefers-reduced-motion`.
- Admin / Employee / Brochure behaviour must be unchanged.
- Strings with apostrophes use double quotes; components default-exported where new.

---

### Task 1: Foundation — deps, tokens, router shell
**Files:** Modify `package.json`, `index.html`, `src/index.css`, `src/main.tsx`, `src/App.tsx`. Create `src/data/site.ts`, `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`, `src/components/layout/{Layout,Navbar,Footer,WhatsAppFab,ScrollToTop}.tsx`, `src/components/ui/{Button,Reveal,SectionHeading}.tsx`, `public/_redirects`, `vercel.json`, `public/.htaccess`.
**Produces:** `SITE` config (`name, tagline, whatsapp, phoneDisplay, socials[]`), `buildEnquiryMessage(form): string`, `whatsappUrl(text?: string): string`, `<Button variant="primary|ghost" to|href>`, `<Reveal>`, `<SectionHeading kicker? title intro?>`.
- [ ] Write `whatsapp.test.ts` (node:test) asserting message contains name/need/budget and URL encodes it; run `node --test src/lib/whatsapp.test.ts` → FAIL.
- [ ] Implement `whatsapp.ts`; rerun → PASS.
- [ ] Install `react-router-dom`; set tokens + fonts; layout shell with routes `/`, `/services`, `/work`, `/about`, `/contact`, `*`; legacy portal routing preserved.
- [ ] `npx vite build` → success.

### Task 2: Mockup library
**Files:** Create `src/components/mockups/{BrowserFrame,PhoneFrame,WebsiteMock,AppMock,AutomationMock,AdsMock,SocialMock,HeroEcosystem}.tsx`.
**Produces:** each mock default-exported, props-free except `compact?: boolean`; `HeroEcosystem` composes them with pointer parallax (disabled under reduced motion).
- [ ] Build each mock with neutral sample business content (clearly generic: "Your Business", sample bookings) and no numbers presented as FIRST CLICK results.
- [ ] Build passes.

### Task 3: Home page
**Files:** Create `src/data/services.ts` (7 services: slug, title, short, long, deliverables[], forWho, mock), `src/data/builds.ts`, `src/pages/Home.tsx`, `src/components/sections/{Hero,Ticker,BuildShowcase,ServicesList,WhyUs,Process,FinalCta}.tsx`.
- [ ] Sections per spec; "Start with this" links to `/contact?service=<slug>`.
- [ ] Build passes.

### Task 4: Inner pages
**Files:** Create `src/pages/{Services,Work,About,Contact,NotFound}.tsx`, `src/components/sections/ContactForm.tsx`.
- [ ] Contact reads `?service=`, validates (name + phone or email), opens `whatsappUrl(buildEnquiryMessage(form))`, shows confirmation.
- [ ] Build passes.

### Task 5: SEO + cleanup
**Files:** Modify `index.html` (meta, JSON-LD without fake data), `public/sitemap.xml`, add `src/lib/usePageMeta.ts`; remove unused legacy CSS.
- [ ] Per-route `<title>` and description.

### Task 6: Verification
- [ ] `npx vite build`.
- [ ] Playwright screenshots of all routes at 375/768/1440; review and fix.
- [ ] Taste inspector `node .agents/skills/design-taste-frontend/scripts/inspect.mjs`; web-design-guidelines review.
- [ ] Check `/admin`, `#employee`, `#brochure` open.
