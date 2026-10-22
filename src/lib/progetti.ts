import "server-only";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

// Brief 7.1–7.2. Un file JSON per progetto in content/progetti/.
const paragraphs = z.array(z.string().trim().min(1)).min(1);

export const AMBITI = ["persone", "salute", "animali", "ambiente", "comunità"] as const;

export const progettoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug in kebab-case"),
  /** Solo con collaborazione confermata e consenso dell'associazione. */
  published: z.boolean(),
  nome: z.string().trim().min(1),
  citta: z.string().trim().min(1),
  ambito: z.enum(AMBITI),
  trimestre: z.string().regex(/^Q[1-4] \d{4}$/, "formato Q4 2026"),
  stato: z.enum(["in-corso", "concluso"]),
  /** Una frase sul bisogno o sul cambiamento (card). */
  frase: z.string().trim().min(1),
  /** Il bisogno affrontato, in una frase (sottotitolo del dettaglio). */
  bisogno: z.string().trim().min(1),
  /** Immagine autorizzata in public/progetti/<slug>/. Senza, si mostra il segnaposto. */
  immagine: z.object({ src: z.string().startsWith("/"), alt: z.string().trim().min(1) }).optional(),
  chiSono: paragraphs,
  daDoveSiamoPartiti: paragraphs,
  cosaAbbiamoFatto: paragraphs,
  /** Solo risultati documentati, con periodo di riferimento. */
  cosaECambiato: paragraphs.optional(),
  /** Citazione autentica e autorizzata. */
  voce: z
    .object({
      citazione: z.string().trim().min(1),
      nome: z.string().trim().min(1),
      ruolo: z.string().trim().min(1),
    })
    .optional(),
  sostieni: z.object({ url: z.url() }),
});

export type Progetto = z.infer<typeof progettoSchema>;

export const STATO_LABEL: Record<Progetto["stato"], string> = {
  "in-corso": "In corso",
  concluso: "Concluso",
};

export function ambitoLabel(ambito: Progetto["ambito"]) {
  return ambito.charAt(0).toUpperCase() + ambito.slice(1);
}

// PROGETTI_DIR serve solo a provare il template in locale con tests/fixtures/progetti.
const CONTENT_DIR = process.env.PROGETTI_DIR
  ? path.join(/*turbopackIgnore: true*/ process.cwd(), process.env.PROGETTI_DIR)
  : path.join(process.cwd(), "content", "progetti");

function quarterKey(trimestre: string) {
  const [q, year] = trimestre.slice(1).split(" ");
  return Number(year) * 10 + Number(q);
}

let cache: Progetto[] | undefined;

/** Tutti i progetti, validati. Un file non valido fa fallire il build con un errore leggibile. */
function loadAll(): Progetto[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) return (cache = []);

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".json"));
  const progetti = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
    const result = progettoSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(`content/progetti/${file} non è valido:\n${z.prettifyError(result.error)}`);
    }
    if (`${result.data.slug}.json` !== file) {
      throw new Error(`content/progetti/${file}: lo slug deve coincidere con il nome del file.`);
    }
    return result.data;
  });

  cache = progetti.sort((a, b) => quarterKey(b.trimestre) - quarterKey(a.trimestre) || a.nome.localeCompare(b.nome, "it"));
  return cache;
}

export function getPublishedProgetti(): Progetto[] {
  return loadAll().filter((progetto) => progetto.published);
}

export function getProgetto(slug: string): Progetto | undefined {
  return getPublishedProgetti().find((progetto) => progetto.slug === slug);
}
