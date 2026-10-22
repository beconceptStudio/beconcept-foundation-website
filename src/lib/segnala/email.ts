import "server-only";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { SITE_URL } from "@/lib/site";
import { formatReceivedAt } from "./dates";
import type { Segnalazione } from "./schema";
import { EMPTY, rapportoLabel, summaryGroups, type SummaryRow } from "./summary";

// docs/email-segnalazione.md

const FONT = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const C = { ink: "#111111", muted: "#5C5C5C", border: "#E0E0E0", surface: "#F2F2F2", paper: "#FFFFFF" };

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} mancante`);
  return value;
}

function mailer() {
  return new MailerSend({ apiKey: env("MAILERSEND_API_KEY") });
}

function sender() {
  return new Sender(env("MAIL_FROM"), process.env.MAIL_FROM_NAME ?? "Be Foundation");
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const nl2br = (value: string) => escapeHtml(value).replace(/\r?\n/g, "<br>");

function linkify(value: string) {
  return escapeHtml(value).replace(/(https?:\/\/[^\s<]+)/g, (url) => `<a href="${url}" style="color:${C.ink};">${url}</a>`);
}

function layout(content: string) {
  return `<!doctype html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Be Foundation</title></head>
<body style="margin:0;padding:0;background:${C.surface};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.surface};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.paper};font-family:${FONT};color:${C.ink};">
<tr><td style="padding:32px 32px 40px;">${content}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Notifica interna ─────────────────────────────────────────────

function rowValueHtml(row: SummaryRow) {
  if (row.value === EMPTY) return EMPTY;
  if (row.kind === "email") return `<a href="mailto:${escapeHtml(row.value)}" style="color:${C.ink};">${escapeHtml(row.value)}</a>`;
  if (row.kind === "tel") return `<a href="tel:${escapeHtml(row.value.replace(/[^\d+]/g, ""))}" style="color:${C.ink};">${escapeHtml(row.value)}</a>`;
  if (row.kind === "links") return linkify(row.value);
  return nl2br(row.value);
}

function rowHtml(row: SummaryRow) {
  const label = `<span style="font-size:13px;color:${C.muted};">${escapeHtml(row.label)}</span>`;
  const value = `<span style="font-size:15px;line-height:1.5;color:${C.ink};">${rowValueHtml(row)}</span>`;
  if (row.long) {
    return `<tr><td colspan="2" style="padding:8px 0;">${label}<br>${value}</td></tr>`;
  }
  return `<tr><td valign="top" width="38%" style="padding:6px 12px 6px 0;">${label}</td><td valign="top" style="padding:6px 0;">${value}</td></tr>`;
}

type NotificationInput = {
  data: Segnalazione;
  receivedAt: Date;
  notion: { url: string; code: string | null } | null;
};

export function notificationSubject(data: Segnalazione) {
  const rapporto = data.rapporto === "parte" ? "Ne fa parte" : "Segnalata da un sostenitore";
  return `Nuova segnalazione · ${data.nomeAssociazione} · ${rapporto}`;
}

export function notificationHtml({ data, receivedAt, notion }: NotificationInput) {
  const groups = summaryGroups(data)
    .map(
      (group) => `
<tr><td colspan="2" style="padding:24px 0 8px;border-top:1px solid ${C.border};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};">${escapeHtml(group.title)}</td></tr>
${group.rows.map(rowHtml).join("")}`,
    )
    .join("");

  const footer = notion
    ? `ID segnalazione: ${escapeHtml(notion.code ?? EMPTY)} · <a href="${escapeHtml(notion.url)}" style="color:${C.ink};">Apri in Notion</a>`
    : `Salvataggio su Notion non riuscito: la segnalazione è solo in questa email.`;

  return layout(`
<p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};">Be Foundation · Nuova segnalazione</p>
<h1 style="margin:0 0 8px;font-size:22px;line-height:1.3;">${escapeHtml(data.nomeAssociazione)}</h1>
<p style="margin:0 0 16px;font-size:13px;color:${C.muted};">Ricevuta il ${formatReceivedAt(receivedAt)} · Rapporto: ${escapeHtml(rapportoLabel(data))}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${groups}
<tr><td colspan="2" style="padding:24px 0 0;border-top:1px solid ${C.border};font-size:13px;line-height:1.6;color:${C.muted};">
Consenso valutazione trimestrale: confermato<br>${footer}
</td></tr>
</table>`);
}

export function notificationText({ data, receivedAt, notion }: NotificationInput) {
  const lines = [
    "BE FOUNDATION · Nuova segnalazione",
    `Ricevuta il ${formatReceivedAt(receivedAt)} · Rapporto: ${rapportoLabel(data)}`,
  ];
  for (const group of summaryGroups(data)) {
    lines.push("", "──────────────", group.title.toUpperCase());
    for (const row of group.rows) {
      lines.push(row.long ? `${row.label}\n${row.value}` : `${row.label}: ${row.value}`);
    }
  }
  lines.push("", "──────────────", "Consenso valutazione trimestrale: confermato");
  lines.push(
    notion
      ? `ID segnalazione: ${notion.code ?? EMPTY} · Apri in Notion: ${notion.url}`
      : "Salvataggio su Notion non riuscito: la segnalazione è solo in questa email.",
  );
  return lines.join("\n");
}

export async function sendNotification(input: NotificationInput) {
  const params = new EmailParams()
    .setFrom(sender())
    .setTo([new Recipient(env("MAIL_TO"), "Be Foundation")])
    .setReplyTo(new Recipient(input.data.email, input.data.nome))
    .setSubject(notificationSubject(input.data))
    .setHtml(notificationHtml(input))
    .setText(notificationText(input));
  await mailer().email.send(params);
}

// ── Conferma a chi segnala (brief 8.6) ───────────────────────────

export const CONFIRMATION_SUBJECT = "Abbiamo ricevuto la tua segnalazione · Be Foundation";

function confirmationParagraphs(data: Segnalazione) {
  return [
    `Ciao ${data.nome},`,
    `grazie per averci parlato di ${data.nomeAssociazione} e per il tempo che hai dedicato a raccontarci il suo lavoro.`,
    "A fine trimestre leggeremo con attenzione tutte le proposte ricevute. Se pensiamo di poter dare un contributo concreto, ti ricontatteremo per approfondire.",
    "Seguiamo fino a quattro associazioni all'anno, quindi non possiamo accogliere ogni segnalazione. Ma ognuna ci aiuta a conoscere meglio il bene che c'è intorno a noi.",
  ];
}

const comeFunzionaUrl = () => new URL("/come-funziona/", SITE_URL).toString();

export function confirmationHtml(data: Segnalazione) {
  const paragraphs = confirmationParagraphs(data)
    .map((text) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(text)}</p>`)
    .join("");
  const url = comeFunzionaUrl();
  return layout(`
${paragraphs}
<p style="margin:0 0 32px;font-size:16px;line-height:1.6;">Se vuoi sapere come lavoriamo: <a href="${url}" style="color:${C.ink};font-weight:600;">${url.replace(/^https?:\/\//, "")}</a></p>
<p style="margin:0;font-size:16px;line-height:1.5;font-weight:600;">Il team di Be Foundation</p>
<p style="margin:0;font-size:13px;color:${C.muted};">Un progetto Beconcept</p>`);
}

export function confirmationText(data: Segnalazione) {
  return [
    ...confirmationParagraphs(data),
    `Se vuoi sapere come lavoriamo: ${comeFunzionaUrl()}`,
    "Il team di Be Foundation\nUn progetto Beconcept",
  ].join("\n\n");
}

export async function sendConfirmation(data: Segnalazione) {
  const params = new EmailParams()
    .setFrom(sender())
    .setTo([new Recipient(data.email, data.nome)])
    .setReplyTo(new Recipient(env("MAIL_FROM"), process.env.MAIL_FROM_NAME ?? "Be Foundation"))
    .setSubject(CONFIRMATION_SUBJECT)
    .setHtml(confirmationHtml(data))
    .setText(confirmationText(data));
  await mailer().email.send(params);
}
