import { useEffect } from "react";
import { SITE_URL, seoFor, type PageSeo } from "../data/seo";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/* Keeps title, description, canonical and social tags in sync during client-side navigation.
   The same values are written into each page's static HTML at build time (scripts/prerender.mjs).
   Core pages pass their path; feature pages pass their own PageSeo. */
export function usePageMeta(pathOrSeo: string | PageSeo) {
  const page = typeof pathOrSeo === "string" ? seoFor(pathOrSeo) : pathOrSeo;
  useEffect(() => {
    const url = SITE_URL + (page.noindex ? window.location.pathname : page.path);
    document.title = page.title;
    setMeta("name", "description", page.description);
    setMeta("name", "robots", page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [page]);
}
