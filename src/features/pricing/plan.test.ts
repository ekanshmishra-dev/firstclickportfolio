import { test } from "node:test";
import assert from "node:assert/strict";
import { computePlan, planMessage, validateContact } from "./plan.ts";

const pick = (...ids: string[]) => ({ selected: Object.fromEntries(ids.map((i) => [i, true])), shootReels: 5 });

test("website: one-time build plus monthly care", () => {
  const r = computePlan(pick("web-dev"));
  assert.equal(r.oneTime, 5000);
  assert.equal(r.monthly, 1500);
});

test("collabs are free with social media management", () => {
  const r = computePlan(pick("smm-management", "influencer-collabs"));
  assert.equal(r.monthly, 10000);
  assert.deepEqual(r.lines.map((l) => l.status), ["charged", "free"]);

  const r10 = computePlan({ ...pick("smm-management", "influencer-collabs"), smmReels: 10 });
  assert.equal(r10.monthly, 8000);
});

test("meta ads is charged at 10% of the monthly ad budget", () => {
  const r = computePlan({ selected: { "performance-ads": true }, shootReels: 5, adBudget: 30000 });
  assert.equal(r.monthly, 3000);
  assert.match(r.lines[0].detail, /10% of ₹30,000 budget/);
});

test("360 retainer includes reels, social, ads, collabs and website care", () => {
  const r = computePlan(pick("agency-360", "reels-video", "smm-management", "web-dev"));
  assert.equal(r.monthly, 12000);
  assert.equal(r.oneTime, 5000);
  assert.equal(r.lines.find((l) => l.id === "reels-video")!.status, "included");
});

test("suggests 360 when covered services cost at least as much", () => {
  assert.equal(computePlan(pick("reels-video", "smm-management")).suggest360, true);
  assert.equal(computePlan(pick("smm-management")).suggest360, false);
});

test("event shoots are priced per reel", () => {
  const r = computePlan({ selected: { "event-shoots": true }, shootReels: 8 });
  assert.equal(r.oneTime, 16000);
});

test("whatsapp message lists lines and totals", () => {
  const msg = planMessage(pick("web-dev", "smm-management"));
  assert.match(msg, /Website: ₹5,000 one-time \+ ₹1,500\/mo/);
  assert.match(msg, /₹5,000 one-time \+ ₹11,500 \/ month/);
});

test("message includes contact details, skipping an empty business", () => {
  const msg = planMessage(pick("web-dev"), { name: "Asha", email: "asha@example.com", business: "" });
  assert.match(msg, /Name: Asha\nEmail: asha@example.com\n\n• Website/);
  assert.ok(!msg.includes("Business:"));
  const withBiz = planMessage(pick("web-dev"), { name: "Asha", email: "asha@example.com", business: "Asha's Bakery" });
  assert.match(withBiz, /Business: Asha's Bakery/);
});

test("name and email are required, business is optional", () => {
  assert.deepEqual(validateContact({ name: "Asha", email: "asha@example.com", business: "" }), {});
  assert.ok(validateContact({ name: " ", email: "asha@example.com", business: "" }).name);
  assert.ok(validateContact({ name: "Asha", email: "", business: "" }).email);
  assert.ok(validateContact({ name: "Asha", email: "asha@", business: "" }).email);
});
