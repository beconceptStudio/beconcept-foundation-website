import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Consent } from "@/components/analytics/Consent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { consentBootstrapScript, iubendaConfigured } from "@/lib/consent";
import { motionBootstrapScript } from "@/lib/motion";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import "./globals.css";

const suisse = localFont({
  src: [
    { path: "../fonts/SuisseIntl-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/SuisseIntl-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/SuisseIntl-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-suisse",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  ...pageMetadata("home"),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: lo script in <head> aggiunge la classe `motion` prima dell'idratazione.
    <html lang="it" className={suisse.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrapScript }} />
      </head>
      <body>
        {iubendaConfigured ? (
          <Script id="consent-bootstrap" strategy="beforeInteractive">
            {consentBootstrapScript()}
          </Script>
        ) : null}
        <a href="#contenuto" className="skip-link">
          Vai al contenuto
        </a>
        <Header />
        <main id="contenuto" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Consent />
      </body>
    </html>
  );
}
