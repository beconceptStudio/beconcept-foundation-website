import Script from "next/script";
import { iubendaConfigured } from "@/lib/consent";
import { AnalyticsEvents } from "./AnalyticsEvents";

/**
 * iubenda Privacy Controls and Cookie Solution + eventi GA4.
 * Lo script di Consent Mode (beforeInteractive) sta direttamente in app/layout.tsx.
 * Senza ID iubenda non carica nulla: niente banner e niente GA.
 */
export function Consent() {
  if (!iubendaConfigured) return null;

  return (
    <>
      <Script id="iubenda-cs" src="https://cdn.iubenda.com/cs/iubenda_cs.js" strategy="afterInteractive" charSet="UTF-8" />
      <AnalyticsEvents />
    </>
  );
}
