# FIRST CLICK website redesign — design spec

Date: 2026-10-25 · Status: approved by owner

## Goal
Replace the vibe-coded single page with a professional multi-page site for FIRST CLICK, a digital growth
agency (websites, apps, business automation, social media, content & reels, digital marketing, Meta ads).
A visitor must understand in five seconds: what we do → why we are good → what we build → how to hire us.
Primary conversion: an enquiry delivered to WhatsApp (+91 95307 89815).

## Audience
Owners of small and growing Indian businesses (salons, studios, retail, local services, D2C) spending
roughly ₹2,000–₹2,00,000+ on digital work. Mostly on phones. They want to trust that one team can do it all.

## Theme
"The site is the proof." A dark, precise technology-company look where every section carries working
interface pieces built in code (browser windows, a phone app, an automation flow, an ads dashboard, a
content calendar, a reel card). No stock photographs, no emoji, no fake numbers, awards or clients.

- Ground: near-black `#08080c`, raised surfaces `#111117` / `#17171f`, hairline `#24242e`.
- Ink: `#f4f3f8`, soft ink `#a3a1b3`, muted `#6f6d80`.
- Accent: electric violet `#7c5cff` — actions, focus, live UI states. Not used as decoration.
- Type: Bricolage Grotesque (display, 600, tight tracking), Inter (body, 16px+).
- Motion: one hero entrance, quiet reveal-on-scroll, real hover/focus feedback; all respects
  `prefers-reduced-motion`.

## Pages (react-router)
| Route | Contents |
| --- | --- |
| `/` | Hero "We build digital growth." + live ecosystem visual · service ticker · "What we build" tabbed showcase (one live mockup per service) · services list (expand, "Start with this") · why FIRST CLICK (4 points) · process (Discover → Build → Launch → Grow) · final CTA |
| `/services` | All 7 services in detail: what it is, what you get, who it is for, start button |
| `/work` | Expanded build showcase, labelled as capabilities (client case studies to come later) |
| `/about` | Who we are, principles, process — no invented stats |
| `/contact` | Enquiry form (name, business, email, phone, need, budget, message) → opens WhatsApp pre-filled; direct WhatsApp link |
| `*` | 404 with routes back |

Global: sticky navbar (Work, Services, About, Contact, "Start a project"), mobile menu, floating WhatsApp
button on mobile, footer with the WhatsApp number as the headline link.

## Behaviour
- "Start with this" on a service and service chips on the form pre-fill "What do you need?" (via
  `/contact?service=<slug>`).
- Form validates name + phone or email; on submit builds a WhatsApp message and opens `wa.me`.
- Social links (Instagram, LinkedIn, email) are configured in `src/data/site.ts` and hidden while empty.
- Kept, behaviour unchanged: `/admin` (AdminDashboard), employee portal (`#employee`, `/employee`,
  `portal`, `attendance`), brochure modal (`#brochure`) as a secondary CTA. Client gallery component and
  its data stay in the codebase but are not rendered until client work is ready.
- CaptionIt demo removed from pages; mentioned under Content & Reels.

## Structure
`src/data/` (site, services, builds) · `src/components/layout/` (Navbar, Footer, Layout, WhatsAppFab) ·
`src/components/ui/` (Button, Reveal, SectionHeading) · `src/components/mockups/` (BrowserFrame, PhoneFrame,
WebsiteMock, AppMock, AutomationMock, AdsMock, SocialMock, HeroEcosystem) · `src/pages/` · `src/lib/whatsapp.ts`.
Deep links need an SPA fallback: `public/_redirects` (Netlify), `vercel.json`, `public/.htaccess` (Apache/Hostinger).

## Verification
`vite build` passes; Playwright screenshots of every route at 375 / 768 / 1440; taste-skill inspector and
Vercel web-design-guidelines review; form → WhatsApp URL checked; admin/employee/brochure still open.

## Open items (owner will supply later)
Client case studies and images, social handles, hosting provider. Note: `.figma/make/site.json` sets
`robots.index: false`, which emits noindex — must be flipped before going live.
