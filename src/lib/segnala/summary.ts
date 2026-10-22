import { CONTATTI, RAPPORTI, type Segnalazione } from "./schema";

export const EMPTY = "—";

export type SummaryRow = { label: string; value: string; long?: boolean; kind?: "email" | "tel" | "links" };
export type SummaryGroup = { title: string; rows: SummaryRow[] };

/**
 * Riepilogo per gruppi della segnalazione, usato sia per l'email interna sia per il corpo della pagina Notion
 * (docs/email-segnalazione.md). I campi facoltativi vuoti mostrano "—".
 */
export function summaryGroups(data: Segnalazione): SummaryGroup[] {
  const value = (text: string | undefined) => (text && text.trim() ? text : EMPTY);

  const legame: SummaryRow[] =
    data.rapporto === "parte"
      ? [{ label: "Ruolo", value: value(data.ruolo) }]
      : [
          { label: "Come la conosce", value: value(data.comeLaConosci) },
          { label: "Può metterci in contatto?", value: data.contatto ? CONTATTI[data.contatto] : EMPTY },
        ];

  return [
    {
      title: "01 · L'associazione",
      rows: [
        { label: "Nome", value: data.nomeAssociazione },
        { label: "Città e regione", value: data.citta },
        { label: "Sito e social", value: value(data.sito), kind: "links" },
        { label: "Di cosa si occupa e chi aiuta", value: data.attivita, long: true },
      ],
    },
    {
      title: "02 · Il bisogno",
      rows: [
        { label: "Aree", value: data.aree.join(" · ") },
        { label: "Cosa vorrebbe migliorare, e per chi", value: data.migliorare, long: true },
        { label: "Scadenza o momento importante", value: value(data.scadenza) },
      ],
    },
    { title: "03 · Il legame", rows: legame },
    {
      title: "04 · Recapiti",
      rows: [
        { label: "Nome e cognome", value: data.nome },
        { label: "Email", value: data.email, kind: "email" },
        { label: "Telefono", value: value(data.telefono), kind: "tel" },
        { label: "Altro", value: value(data.altro), long: true },
      ],
    },
  ];
}

export function rapportoLabel(data: Segnalazione) {
  return RAPPORTI[data.rapporto];
}
