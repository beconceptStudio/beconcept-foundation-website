type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __bfAnalytics?: { granted: boolean; loaded: boolean };
  }
}

/** Invia un evento GA4 solo se l'utente ha dato il consenso alla misurazione. */
export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (!window.__bfAnalytics?.granted || !window.gtag) return;
  window.gtag("event", event, params);
}

export const EVENTS = {
  segnalaClick: "segnala_click",
  segnalazioneInviata: "segnalazione_inviata",
} as const;
