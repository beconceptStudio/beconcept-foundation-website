import "server-only";
import { Client, isFullPage } from "@notionhq/client";
import type { BlockObjectRequest, CreatePageParameters } from "@notionhq/client";
import { quarterLabel } from "./dates";
import { CONTATTI, RAPPORTI, type Segnalazione } from "./schema";
import { summaryGroups } from "./summary";

// docs/notion.md · database Applications.

const RICH_TEXT_MAX = 2000;

type RichText = { type: "text"; text: { content: string }; annotations?: { bold?: boolean } };

function richText(content: string, bold = false): RichText[] {
  if (!content) return [];
  const chunks: RichText[] = [];
  for (let i = 0; i < content.length; i += RICH_TEXT_MAX) {
    chunks.push({ type: "text", text: { content: content.slice(i, i + RICH_TEXT_MAX) }, annotations: { bold } });
  }
  return chunks;
}

function client() {
  const auth = process.env.NOTION_TOKEN;
  if (!auth) throw new Error("NOTION_TOKEN mancante");
  return new Client({ auth });
}

function properties(data: Segnalazione, receivedAt: Date): CreatePageParameters["properties"] {
  return {
    Associazione: { title: richText(data.nomeAssociazione) },
    Rapporto: { select: { name: RAPPORTI[data.rapporto] } },
    "Città e regione": { rich_text: richText(data.citta) },
    "Sito e social": { rich_text: richText(data.sito) },
    "Di cosa si occupa": { rich_text: richText(data.attivita) },
    Aree: { multi_select: data.aree.map((name) => ({ name })) },
    "Cosa migliorare": { rich_text: richText(data.migliorare) },
    Scadenza: { rich_text: richText(data.scadenza) },
    Ruolo: { rich_text: richText(data.ruolo) },
    "Come la conosce": { rich_text: richText(data.comeLaConosci) },
    "Contatto possibile": { select: data.contatto ? { name: CONTATTI[data.contatto] } : null },
    "Nome e cognome": { rich_text: richText(data.nome) },
    Email: { email: data.email },
    Telefono: { phone_number: data.telefono || null },
    "Note aggiuntive": { rich_text: richText(data.altro) },
    Consenso: { checkbox: data.consenso },
    // Se l'opzione del trimestre non esiste ancora, Notion la crea dal nome.
    Trimestre: { select: { name: quarterLabel(receivedAt) } },
  };
}

/** Corpo della pagina: riepilogo per gruppi, come l'email interna. */
function body(data: Segnalazione): BlockObjectRequest[] {
  const blocks: BlockObjectRequest[] = [];
  for (const group of summaryGroups(data)) {
    blocks.push({ type: "heading_3", heading_3: { rich_text: richText(group.title) } });
    for (const row of group.rows) {
      if (row.long) {
        blocks.push({ type: "paragraph", paragraph: { rich_text: richText(row.label, true) } });
        blocks.push({ type: "paragraph", paragraph: { rich_text: richText(row.value) } });
      } else {
        blocks.push({
          type: "paragraph",
          paragraph: { rich_text: [...richText(`${row.label}: `, true), ...richText(row.value)] },
        });
      }
    }
    blocks.push({ type: "divider", divider: {} });
  }
  return blocks;
}

export type NotionRecord = { pageId: string; url: string; code: string | null };

export async function saveToNotion(data: Segnalazione, receivedAt: Date): Promise<NotionRecord> {
  const dataSourceId = process.env.NOTION_APPLICATIONS_DATA_SOURCE_ID;
  if (!dataSourceId) throw new Error("NOTION_APPLICATIONS_DATA_SOURCE_ID mancante");

  const page = await client().pages.create({
    parent: { type: "data_source_id", data_source_id: dataSourceId },
    properties: properties(data, receivedAt),
    children: body(data),
  });

  let code: string | null = null;
  let url = `https://www.notion.so/${page.id.replace(/-/g, "")}`;
  if (isFullPage(page)) {
    url = page.url;
    const id = page.properties.ID;
    if (id?.type === "unique_id" && id.unique_id.number !== null) {
      code = `${id.unique_id.prefix ? `${id.unique_id.prefix}-` : ""}${id.unique_id.number}`;
    }
  }
  return { pageId: page.id, url, code };
}

export async function markEmailsSent(pageId: string, sent: { notifica: boolean; conferma: boolean }) {
  await client().pages.update({
    page_id: pageId,
    properties: {
      "Notifica inviata": { checkbox: sent.notifica },
      "Conferma inviata": { checkbox: sent.conferma },
    },
  });
}
