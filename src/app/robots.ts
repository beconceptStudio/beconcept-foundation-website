import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /segnala/grazie/ non è bloccata qui: deve restare scansionabile perché il meta noindex venga letto.
export default function robots(): MetadataRoute.Robots {
  const production = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return {
    rules: production ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
