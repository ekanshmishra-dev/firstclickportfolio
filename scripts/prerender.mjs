/* Writes a static HTML file per public page so crawlers and link previews see real content and tags.
   Run after `vite build` and the SSR build of src/entry-server.tsx (see "build" in package.json). */
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const ssrDir = resolve(root, "dist-ssr");
const { render, PRERENDER, NOT_FOUND_PAGE } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);
const SITE_URL = "https://firstclickconnects.online";

const template = readFileSync(resolve(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setTag(html, pattern, replacement, label) {
  const found = typeof pattern === "string" ? html.includes(pattern) : pattern.test(html);
  if (!found) throw new Error(`prerender: ${label} not found in index.html`);
  return html.replace(pattern, () => replacement);
}

function page({ seo, schema: jsonLd }, path) {
  const url = SITE_URL + (seo.path === "/" ? "/" : seo.path);
  const title = esc(seo.title);
  const desc = esc(seo.description);
  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "title");
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${desc}" />`, "description");
  html = setTag(html, /<meta name="robots"[^>]*>/, `<meta name="robots" content="${seo.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`, "robots");
  html = setTag(html, /<link rel="canonical"[^>]*>/, seo.noindex ? "" : `<link rel="canonical" href="${url}" />`, "canonical");
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`, "og:url");
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`, "og:title");
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}" />`, "og:description");
  html = setTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`, "twitter:title");
  html = setTag(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}" />`, "twitter:description");
  const schema = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  html = setTag(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${schema}</script>`, "json-ld");
  html = setTag(html, '<div id="root"></div>', `<div id="root">${render(path)}</div>`, "root");
  return html;
}

const written = [];
// The plain shell stays available for the internal-tool routes (/admin, /employee…) as spa.html.
writeFileSync(resolve(dist, "spa.html"), template);
for (const entry of PRERENDER) {
  const { seo } = entry;
  const file = seo.path === "/" ? "index.html" : `${seo.path.slice(1)}.html`;
  writeFileSync(resolve(dist, file), page(entry, seo.path));
  written.push(file);
}
writeFileSync(resolve(dist, "404.html"), page(NOT_FOUND_PAGE, "/404-not-found"));
written.push("404.html");

// Sitemap generated from the same page list, so it never drifts.
const today = new Date().toISOString().slice(0, 10);
const urls = PRERENDER.map(({ seo: p }) => `  <url><loc>${SITE_URL}${p.path === "/" ? "/" : p.path}</loc><lastmod>${today}</lastmod></url>`).join("\n");
writeFileSync(resolve(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered: ${written.join(", ")} + sitemap.xml`);
