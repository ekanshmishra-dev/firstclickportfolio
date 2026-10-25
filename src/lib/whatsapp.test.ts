import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEnquiryMessage, whatsappUrl, validateEnquiry } from "./whatsapp.ts";

const form = {
  name: "Asha Mehta",
  business: "Asha's Bakery",
  email: "asha@example.com",
  phone: "98765 43210",
  need: "Website Development",
  budget: "₹25,000 – ₹75,000",
  message: "Need online orders & a menu page.",
};

test("message includes every filled field", () => {
  const msg = buildEnquiryMessage(form);
  for (const value of Object.values(form)) assert.ok(msg.includes(value), `missing ${value}`);
});

test("message skips empty fields", () => {
  const msg = buildEnquiryMessage({ ...form, business: "", budget: "" });
  assert.ok(!msg.includes("Business:"));
  assert.ok(!msg.includes("Budget:"));
});

test("url targets the agency number and encodes text", () => {
  const url = whatsappUrl("Hi & hello");
  assert.equal(url, "https://wa.me/919530789815?text=Hi%20%26%20hello");
  assert.equal(whatsappUrl(), "https://wa.me/919530789815");
});

test("validation needs a name and a way to reply", () => {
  assert.deepEqual(validateEnquiry(form), {});
  assert.ok(validateEnquiry({ ...form, name: " " }).name);
  assert.ok(validateEnquiry({ ...form, email: "", phone: "" }).contact);
  assert.ok(validateEnquiry({ ...form, email: "not-an-email", phone: "" }).email);
});
