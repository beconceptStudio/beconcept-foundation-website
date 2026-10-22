"use server";

import { headers } from "next/headers";
import { sendConfirmation, sendNotification } from "@/lib/segnala/email";
import { markEmailsSent, saveToNotion, type NotionRecord } from "@/lib/segnala/notion";
import { checkRateLimit } from "@/lib/segnala/rate-limit";
import {
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  segnalazioneSchema,
  toFieldErrors,
  type FieldErrors,
  type Rapporto,
} from "@/lib/segnala/schema";

export type SubmitResult =
  | { status: "ok"; rapporto: Rapporto; confermaInviata: boolean }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "error" };

type SubmitPayload = {
  values: unknown;
  /** Honeypot: deve restare vuoto. */
  [HONEYPOT_FIELD]?: string;
  /** Timestamp di apertura del modulo. */
  startedAt: number;
};

async function clientIp() {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

/**
 * Invio della segnalazione (docs/email-segnalazione.md, "Ordine delle operazioni"):
 * validazione → Notion → notifica interna → conferma → checkbox su Notion.
 */
export async function submitSegnalazione(payload: SubmitPayload): Promise<SubmitResult> {
  const parsed = segnalazioneSchema.safeParse(payload?.values);

  // Anti-spam: a un bot rispondiamo come se fosse andato tutto bene, senza salvare nulla.
  const isBot = Boolean(payload?.[HONEYPOT_FIELD]) || Date.now() - Number(payload?.startedAt ?? 0) < MIN_FILL_MS;
  if (isBot) {
    console.warn("[segnala] invio scartato dai controlli anti-spam");
    return { status: "ok", rapporto: parsed.success ? parsed.data.rapporto : "segnala", confermaInviata: true };
  }

  if (!(await checkRateLimit(await clientIp()))) {
    console.warn("[segnala] rate limit superato");
    return { status: "error" };
  }

  if (!parsed.success) {
    return { status: "invalid", errors: toFieldErrors(parsed.error) };
  }

  const data = parsed.data;
  const receivedAt = new Date();

  let notion: NotionRecord | null = null;
  try {
    notion = await saveToNotion(data, receivedAt);
  } catch (error) {
    console.error("[segnala] salvataggio Notion non riuscito", error);
  }

  let notificaInviata = false;
  try {
    await sendNotification({ data, receivedAt, notion });
    notificaInviata = true;
  } catch (error) {
    console.error("[segnala] notifica interna non inviata", error);
  }

  // Se né Notion né la notifica sono andati a buon fine, la segnalazione andrebbe persa.
  if (!notion && !notificaInviata) {
    return { status: "error" };
  }

  let confermaInviata = false;
  try {
    await sendConfirmation(data);
    confermaInviata = true;
  } catch (error) {
    console.error("[segnala] conferma a chi segnala non inviata", error);
  }

  if (notion) {
    try {
      await markEmailsSent(notion.pageId, { notifica: notificaInviata, conferma: confermaInviata });
    } catch (error) {
      console.error("[segnala] aggiornamento checkbox Notion non riuscito", error);
    }
  }

  return { status: "ok", rapporto: data.rapporto, confermaInviata };
}
