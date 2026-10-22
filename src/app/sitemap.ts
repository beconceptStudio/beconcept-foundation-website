import type { MetadataRoute } from "next";
import { getPublishedProgetti } from "@/lib/progetti";
import { SITE_URL } from "@/lib/site";

// /segnala/grazie/ è esclusa: noindex.
const STATIC_PATHS = ["/", "/come-funziona/", "/progetti/", "/segnala/", "/contatti/", "/privacy/", "/cookie/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, SITE_URL).toString();
  return [
    ...STATIC_PATHS.map((path) => ({ url: url(path) })),
    ...getPublishedProgetti().map((progetto) => ({ url: url(`/progetti/${progetto.slug}/`) })),
  ];
}
