import type { Feature } from "../types";
import PricingPage from "./PricingPage";
import { PRICING_SEO, pricingSchema } from "./meta";

/* Pricing page built from the brochure. Self-contained: remove it from src/features/index.ts and delete this folder. */
const pricing: Feature = {
  seo: PRICING_SEO,
  nav: { label: "Pricing", after: "/services" },
  element: <PricingPage />,
  schema: pricingSchema,
};

export default pricing;
