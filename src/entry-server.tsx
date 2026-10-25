import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppRoutes } from "./App";
import { PAGES, NOT_FOUND, type PageSeo } from "./data/seo";
import { FEATURES } from "./features";
import { schemaFor } from "./lib/schema";

/* Build-time renderer: scripts/prerender.mjs calls this once per public page. */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}

/** Every public page (core + features) with its JSON-LD. */
export const PRERENDER: { seo: PageSeo; schema: object }[] = [
  ...PAGES.map((seo) => ({ seo, schema: schemaFor(seo) })),
  ...FEATURES.map((f) => ({ seo: f.seo, schema: schemaFor(f.seo, f.schema?.() ?? []) })),
];

export const NOT_FOUND_PAGE = { seo: NOT_FOUND, schema: schemaFor(NOT_FOUND) };
