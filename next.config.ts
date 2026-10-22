import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gli URL del brief terminano con "/" (es. /come-funziona/).
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // I font OTF servono solo alla generazione dell'immagine OG.
  outputFileTracingIncludes: {
    "/og": ["./assets/og-fonts/**"],
  },
};

export default nextConfig;
