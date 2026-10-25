import { useState } from "react";
import "./pricing.css";
import { EMPTY_PLAN, type PlanState } from "./plan";
import { PRICING_SEO } from "./meta";
import FeaturedPlan from "./FeaturedPlan";
import Catalogue from "./Catalogue";
import PlanBuilder from "./PlanBuilder";
import PageHero from "../../components/sections/PageHero";
import FinalCta from "../../components/sections/FinalCta";
import Button, { Arrow } from "../../components/ui/Button";
import { usePageMeta } from "../../lib/usePageMeta";

export default function PricingPage() {
  usePageMeta(PRICING_SEO);
  const [plan, setPlan] = useState<PlanState>(EMPTY_PLAN);

  const addToPlan = (id: string) => {
    setPlan((p) => ({ ...p, selected: { ...p.selected, [id]: true } }));
    document.getElementById("plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHero
        kicker="Pricing"
        title="Clear prices for everything we do."
        intro="Websites from ₹5,000, social media management from ₹8,000 a month, and a complete 360° growth retainer at ₹12,000 a month. See what's included, then build your own plan."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="#plan">
            Build your plan <Arrow dir="down" />
          </Button>
          <Button to="#catalogue" variant="ghost">
            Browse all services
          </Button>
        </div>
      </PageHero>
      <FeaturedPlan onAddToPlan={addToPlan} />
      <Catalogue onAddToPlan={addToPlan} />
      <PlanBuilder plan={plan} setPlan={setPlan} />
      <FinalCta />
    </>
  );
}
