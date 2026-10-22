import type { Metadata } from "next";
import { SITE_NAME } from "./site";

export const OG_IMAGE = {
  url: "/og/",
  width: 1200,
  height: 630,
  alt: "Be Foundation · Aiutiamo chi aiuta. · Un progetto Beconcept",
};

// Brief, sezione 10.
const PAGES = {
  home: {
    path: "/",
    title: "Be Foundation · Un progetto Beconcept",
    description:
      "Beconcept affianca gratuitamente fino a quattro associazioni non profit all'anno con strategia, design e comunicazione digitale. Segnalaci chi merita di essere conosciuto.",
  },
  comeFunziona: {
    path: "/come-funziona/",
    title: "Come funziona · Be Foundation",
    description:
      "Dalla segnalazione al lavoro insieme: come scegliamo le associazioni, cosa offriamo gratuitamente e cosa chiediamo. Fino a quattro progetti all'anno.",
  },
  progetti: {
    path: "/progetti/",
    title: "Progetti · Be Foundation",
    description:
      "Le associazioni che affianchiamo: il loro lavoro, il bisogno da cui siamo partiti e ciò che abbiamo costruito insieme.",
  },
  segnala: {
    path: "/segnala/",
    title: "Segnala un'associazione · Be Foundation",
    description:
      "Fai parte di un'associazione o ne conosci una che merita di essere vista? Raccontacela in pochi minuti.",
  },
  contatti: {
    path: "/contatti/",
    title: "Contatti · Be Foundation",
    description: "Scrivi al team di Be Foundation, il progetto pro bono di Beconcept per le associazioni non profit.",
  },
  // Pagine non coperte dal brief 10: titolo nello stesso schema, nessuna description inventata oltre il minimo.
  grazie: {
    path: "/segnala/grazie/",
    title: "Grazie · Be Foundation",
    description: "Abbiamo ricevuto la tua segnalazione.",
  },
  privacy: {
    path: "/privacy/",
    title: "Privacy · Be Foundation",
    description: "Informativa privacy di Be Foundation, un progetto Beconcept.",
  },
  cookie: {
    path: "/cookie/",
    title: "Cookie · Be Foundation",
    description: "Cookie policy di Be Foundation, un progetto Beconcept.",
  },
} as const;

export type PageKey = keyof typeof PAGES;

export function buildMetadata({
  path,
  title,
  description,
  noindex = false,
}: {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function pageMetadata(key: PageKey, options: { noindex?: boolean } = {}): Metadata {
  return buildMetadata({ ...PAGES[key], ...options });
}
