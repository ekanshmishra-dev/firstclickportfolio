import type { PageSeo } from "../../data/seo";
import { SITE_URL } from "../../data/seo";
import { OFFERS } from "./data";

export const PRICING_SEO: PageSeo = {
  path: "/pricing",
  name: "Pricing",
  title: "Pricing: Websites, Reels, Social Media & Meta Ads | FIRST CLICK",
  description:
    "Websites from ₹5,000, social media management from ₹8,000/month and a 360° growth retainer at ₹12,000/month. See every service, what's included and build your plan.",
};

const amount = (o: (typeof OFFERS)[number]) => o.oneTime ?? o.monthly ?? o.perUnit?.amount;

/* OfferCatalog schema with the real prices, so search engines can show them. */
export const pricingSchema = () => [
  {
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}/pricing#catalog`,
    name: "FIRST CLICK services and pricing",
    itemListElement: OFFERS.map((o) => ({
      "@type": "Offer",
      name: o.title,
      description: o.subtitle,
      url: `${SITE_URL}/pricing#catalogue`,
      seller: { "@id": `${SITE_URL}/#organization` },
      ...(amount(o)
        ? { price: amount(o), priceCurrency: "INR", priceSpecification: { "@type": "PriceSpecification", price: amount(o), priceCurrency: "INR", description: `${o.price} ${o.priceNote}` } }
        : { price: 0, priceCurrency: "INR", description: `${o.price}; ${o.priceNote}` }),
      itemOffered: { "@type": "Service", name: o.title, provider: { "@id": `${SITE_URL}/#organization` } },
    })),
  },
];
