import { SITE_URL, seoFor, type PageSeo } from "../data/seo";
import { SERVICES } from "../data/services";
import { FAQ } from "../data/faq";
import { SITE, activeSocials } from "../data/site";

/* JSON-LD for each page, written into the prerendered HTML. Only facts that appear on the site. */

const ORG_ID = `${SITE_URL}/#organization`;

const organization = () => ({
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: SITE.name,
  alternateName: ["First Click", "FirstClick", "First Click Connects"],
  description: seoFor("/").description,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.png`,
  telephone: "+91-9530789815",
  areaServed: { "@type": "Country", name: "India" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9530789815",
    contactType: "sales",
    availableLanguage: ["English", "Hindi"],
  },
  knowsAbout: SERVICES.map((s) => s.title),
  ...(activeSocials().length ? { sameAs: activeSocials().map((s) => s.url) } : {}),
});

const website = () => ({
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE.name,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-IN",
});

const breadcrumb = (page: PageSeo) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: page.name, item: SITE_URL + page.path },
  ],
});

const webPage = (page: PageSeo, type = "WebPage") => ({
  "@type": type,
  "@id": `${SITE_URL}${page.path}#webpage`,
  url: SITE_URL + page.path,
  name: page.title,
  description: page.description,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": ORG_ID },
  inLanguage: "en-IN",
});

/** `page` is a core page path or a feature page's PageSeo; `extra` adds that page's own nodes. */
export function schemaFor(page: string | PageSeo, extra: object[] = []): object {
  const seo = typeof page === "string" ? seoFor(page) : page;
  const graph: object[] = [organization(), website()];

  switch (seo.path) {
    case "/":
      graph.push(webPage(seo));
      break;
    case "/services":
      graph.push(
        webPage(seo, "CollectionPage"),
        breadcrumb(seo),
        ...SERVICES.map((s) => ({
          "@type": "Service",
          "@id": `${SITE_URL}/services#${s.slug}`,
          name: s.title,
          description: s.long,
          serviceType: s.title,
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "Country", name: "India" },
          url: `${SITE_URL}/services#${s.slug}`,
        })),
        {
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      );
      break;
    case "/about":
      graph.push(webPage(seo, "AboutPage"), breadcrumb(seo));
      break;
    case "/contact":
      graph.push(webPage(seo, "ContactPage"), breadcrumb(seo));
      break;
    default:
      if (!seo.noindex) graph.push(webPage(seo), breadcrumb(seo));
  }

  graph.push(...extra);
  return { "@context": "https://schema.org", "@graph": graph };
}
