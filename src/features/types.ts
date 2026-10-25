import type { ReactNode } from "react";
import type { PageSeo } from "../data/seo";

/* A self-contained page that plugs into routing, navigation, the sitemap and prerendering. */
export interface Feature {
  seo: PageSeo;
  element: ReactNode;
  /** Adds a nav link placed after the given path */
  nav?: { label: string; after: string };
  /** Extra JSON-LD nodes for this page */
  schema?: () => object[];
}
