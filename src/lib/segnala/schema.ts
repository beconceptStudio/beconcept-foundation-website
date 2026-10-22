import { z } from "zod";

// Schema condiviso client/server del modulo /segnala/ (brief 8.2–8.4).

export const MESSAGES = {
  required: "Questo campo ci serve per capire la proposta.",
  email: "Controlla l'indirizzo email: sembra incompleto.",
  maxAree: "Scegli al massimo due aree.",
  maxLength: (n: number) => `Hai raggiunto il limite di ${n.toLocaleString("it-IT")} caratteri.`,
  consenso: "Conferma di aver letto come valutiamo le proposte.",
  sending: "Stiamo inviando la tua segnalazione…",
  sendError:
    "Non siamo riusciti a inviare la segnalazione. I tuoi testi sono ancora qui: riprova tra qualche istante.",
  confirmationFailed:
    "Abbiamo ricevuto la tua segnalazione, ma non siamo riusciti a inviarti l'email di conferma. Non serve compilarla di nuovo.",
} as const;

export const RAPPORTI = {
  parte: "Ne faccio parte",
  segnala: "Voglio segnalarne una",
} as const;
export type Rapporto = keyof typeof RAPPORTI;

export const AREE = [
  "Chiarezza del messaggio",
  "Sito e strumenti digitali",
  "Contenuti e fotografie",
  "Social",
  "Come donare o partecipare",
  "Altro",
  "Non saprei dire",
] as const;
export const AREA_NON_SO = "Non saprei dire";
export const MAX_AREE = 2;

export const CONTATTI = {
  si: "Sì",
  no: "No",
  "non-so": "Non so",
} as const;
export type Contatto = keyof typeof CONTATTI;

export const LIMITS = {
  short: 200,
  attivita: 700,
  migliorare: 1200,
  scadenza: 500,
  telefono: 40,
  altro: 500,
} as const;

const requiredText = (max: number) =>
  z
    .string(MESSAGES.required)
    .trim()
    .min(1, MESSAGES.required)
    .max(max, MESSAGES.maxLength(max));

const optionalText = (max: number) => z.string().trim().max(max, MESSAGES.maxLength(max)).default("");

export const segnalazioneSchema = z
  .object({
    rapporto: z.enum(["parte", "segnala"], MESSAGES.required),
    // 01 · L'associazione
    nomeAssociazione: requiredText(LIMITS.short),
    citta: requiredText(LIMITS.short),
    sito: optionalText(LIMITS.short),
    attivita: requiredText(LIMITS.attivita),
    // 02 · Il bisogno
    aree: z
      .array(z.enum(AREE), MESSAGES.required)
      .min(1, MESSAGES.required)
      .max(MAX_AREE, MESSAGES.maxAree)
      .refine((aree) => !(aree.includes(AREA_NON_SO) && aree.length > 1), MESSAGES.maxAree),
    migliorare: requiredText(LIMITS.migliorare),
    scadenza: optionalText(LIMITS.scadenza),
    // 03 · Il tuo legame (dipende dal rapporto)
    ruolo: optionalText(LIMITS.short),
    comeLaConosci: optionalText(LIMITS.short),
    contatto: z.enum(["si", "no", "non-so"]).optional(),
    // 04 · I tuoi recapiti
    nome: requiredText(LIMITS.short),
    email: z.string(MESSAGES.required).trim().min(1, MESSAGES.required).pipe(z.email(MESSAGES.email)),
    telefono: optionalText(LIMITS.telefono),
    altro: optionalText(LIMITS.altro),
    consenso: z.literal(true, MESSAGES.consenso),
  })
  .superRefine((data, ctx) => {
    if (data.rapporto === "parte" && !data.ruolo) {
      ctx.addIssue({ code: "custom", path: ["ruolo"], message: MESSAGES.required });
    }
    if (data.rapporto === "segnala") {
      if (!data.comeLaConosci) ctx.addIssue({ code: "custom", path: ["comeLaConosci"], message: MESSAGES.required });
      if (!data.contatto) ctx.addIssue({ code: "custom", path: ["contatto"], message: MESSAGES.required });
    }
  })
  // I campi del gruppo 3 non pertinenti restano nel modulo (se si cambia scelta) ma non vengono inviati.
  .transform((data) =>
    data.rapporto === "parte"
      ? { ...data, comeLaConosci: "", contatto: undefined }
      : { ...data, ruolo: "" },
  );

export type SegnalazioneInput = z.input<typeof segnalazioneSchema>;
export type Segnalazione = z.output<typeof segnalazioneSchema>;
export type FieldName = keyof SegnalazioneInput;
export type FieldErrors = Partial<Record<FieldName, string>>;

/** Ordine dei campi nella pagina: serve a spostare il focus sul primo errore. */
export const FIELD_ORDER: FieldName[] = [
  "rapporto",
  "nomeAssociazione",
  "citta",
  "sito",
  "attivita",
  "aree",
  "migliorare",
  "scadenza",
  "ruolo",
  "comeLaConosci",
  "contatto",
  "nome",
  "email",
  "telefono",
  "altro",
  "consenso",
];

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as FieldName | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

/** Campi anti-spam, fuori dallo schema dei dati. */
export const HONEYPOT_FIELD = "bf_note_interne";
export const MIN_FILL_MS = 3000;
