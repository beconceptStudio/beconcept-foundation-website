export const SITE_NAME = "Be Foundation";
export const SITE_DESCRIPTOR = "Un progetto Beconcept";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://foundation.beconcept.studio";
export const CONTACT_EMAIL = "foundation@beconcept.studio";
export const BECONCEPT_URL = "https://beconcept.studio/";

// Dati legali dal footer di beconcept.studio.
export const LEGAL = {
  ragioneSociale: "Beconcept Srl",
  piva: "02548810205",
  sede: "Asola (MN)",
};

export const NAV_ITEMS = [
  { href: "/#perche", label: "Il progetto" },
  { href: "/come-funziona/", label: "Come funziona" },
  { href: "/progetti/", label: "Progetti" },
  { href: "/contatti/", label: "Contatti" },
] as const;

export const SEGNALA_HREF = "/segnala/";
export const SEGNALA_LABEL = "Segnala un'associazione";
