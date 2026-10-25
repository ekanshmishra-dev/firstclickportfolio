import { COVERED_BY_360, OFFERS, inr } from "./data.ts";
import { isValidEmail } from "../../lib/whatsapp.ts";

/* Pricing rules for the plan builder, kept apart from the UI so they're easy to check. */

export interface PlanState {
  selected: Record<string, boolean>;
  shootReels: number;
  smmReels?: 10 | 15;
  adBudget?: number;
}

export interface PlanLine {
  id: string;
  title: string;
  detail: string;
  oneTime: number;
  monthly: number;
  status: "charged" | "included" | "free" | "on-request";
}

export const EMPTY_PLAN: PlanState = { selected: {}, shootReels: 5, smmReels: 15, adBudget: 20000 };

export function computePlan(plan: PlanState) {
  const has360 = !!plan.selected["agency-360"];
  const hasSmm = has360 || !!plan.selected["smm-management"];
  const lines: PlanLine[] = [];

  for (const o of OFFERS) {
    if (!plan.selected[o.id]) continue;
    const line: PlanLine = { id: o.id, title: o.short, detail: "", oneTime: 0, monthly: 0, status: "charged" };

    if (has360 && COVERED_BY_360.has(o.id)) {
      line.status = "included";
      line.detail = "Included in 360° retainer";
    } else if (o.id === "performance-ads") {
      const budget = plan.adBudget ?? 20000;
      line.monthly = Math.round(budget * 0.1);
      line.detail = `10% of ${inr(budget)} budget (${inr(line.monthly)}/mo)`;
    } else if (o.freeWithSmm) {
      line.status = hasSmm ? "free" : "on-request";
      line.detail = hasSmm ? "Free with social media management" : "Free with social media management, otherwise quoted";
    } else if (o.perUnit) {
      line.oneTime = o.perUnit.amount * plan.shootReels;
      line.detail = `${plan.shootReels} ${o.perUnit.unit}${plan.shootReels === 1 ? "" : "s"} × ${inr(o.perUnit.amount)}`;
    } else {
      line.oneTime = o.oneTime ?? 0;
      if (o.id === "smm-management") {
        const is10 = plan.smmReels === 10;
        line.monthly = is10 ? 8000 : 10000;
        line.detail = is10 ? "10 reels · ₹8,000/mo" : "15 reels · ₹10,000/mo";
      } else {
        // The 360° retainer already covers website maintenance.
        line.monthly = o.id === "web-dev" && has360 ? 0 : o.monthly ?? 0;
        const parts = [line.oneTime && `${inr(line.oneTime)} one-time`, line.monthly && `${inr(line.monthly)}/mo`].filter(Boolean);
        line.detail = o.id === "web-dev" && has360 ? `${inr(line.oneTime)} one-time · care included in 360°` : parts.join(" + ");
      }
    }
    lines.push(line);
  }

  const oneTime = lines.reduce((a, l) => a + l.oneTime, 0);
  const monthly = lines.reduce((a, l) => a + l.monthly, 0);

  // Suggest the retainer when the parts it covers already cost as much or more.
  const coveredMonthly = has360
    ? 0
    : lines.filter((l) => COVERED_BY_360.has(l.id) || l.id === "web-dev").reduce((a, l) => a + l.monthly, 0);
  const suggest360 = !has360 && coveredMonthly >= 12000;

  return { lines, oneTime, monthly, suggest360, coveredMonthly, hasSmm };
}

export interface PlanContact {
  name: string;
  email: string;
  business: string;
}

export const EMPTY_CONTACT: PlanContact = { name: "", email: "", business: "" };

export type ContactErrors = Partial<Record<"name" | "email", string>>;

/* Name and email are required so every plan enquiry can be followed up; business is optional. */
export function validateContact(c: PlanContact): ContactErrors {
  const errors: ContactErrors = {};
  if (!c.name.trim()) errors.name = "Please tell us your name.";
  if (!c.email.trim()) errors.email = "Add your email so we can send the quote.";
  else if (!isValidEmail(c.email)) errors.email = "That email doesn't look right.";
  return errors;
}

export function planMessage(plan: PlanState, contact: PlanContact = EMPTY_CONTACT): string {
  const { lines, oneTime, monthly } = computePlan(plan);
  const who = [
    ["Name", contact.name],
    ["Business", contact.business],
    ["Email", contact.email],
  ]
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join("\n");
  const rows = lines.map((l) => `• ${l.title}: ${l.detail}`).join("\n");
  const totals = [oneTime && `${inr(oneTime)} one-time`, monthly && `${inr(monthly)} / month`].filter(Boolean).join(" + ");
  return `Hi FIRST CLICK, I'd like a quote for this plan:\n\n${who ? `${who}\n\n` : ""}${rows}\n\nEstimate from your price list: ${totals || "to be discussed"}`;
}
