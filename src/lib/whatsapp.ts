/* ── WhatsApp enquiry helpers: every lead on the site ends up here ── */

export const WHATSAPP_NUMBER = "919530789815";

export interface Enquiry {
  name: string;
  business: string;
  email: string;
  phone: string;
  need: string;
  budget: string;
  message: string;
}

export type EnquiryErrors = Partial<Record<"name" | "contact" | "email", string>>;

export const EMPTY_ENQUIRY: Enquiry = {
  name: "",
  business: "",
  email: "",
  phone: "",
  need: "",
  budget: "",
  message: "",
};

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function buildEnquiryMessage(form: Enquiry): string {
  const rows: [string, string][] = [
    ["Name", form.name],
    ["Business", form.business],
    ["Email", form.email],
    ["Phone", form.phone],
    ["Looking for", form.need],
    ["Budget", form.budget],
  ];
  const lines = rows.filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`);
  const body = form.message.trim() ? `\n\n${form.message.trim()}` : "";
  return `Hi FIRST CLICK, I'd like to start a project.\n\n${lines.join("\n")}${body}`;
}

export function validateEnquiry(form: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!form.name.trim()) errors.name = "Please tell us your name.";
  if (!form.email.trim() && !form.phone.trim()) errors.contact = "Add a phone number or email so we can reply.";
  if (form.email.trim() && !isValidEmail(form.email)) {
    errors.email = "That email doesn't look right.";
  }
  return errors;
}
