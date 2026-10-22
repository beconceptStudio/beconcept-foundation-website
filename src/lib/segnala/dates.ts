const TIME_ZONE = "Europe/Rome";

function romeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("it-IT", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

/** Trimestre nel formato del database Notion: "Q4 2026" (ora italiana). */
export function quarterLabel(date: Date) {
  const { year, month } = romeParts(date);
  return `Q${Math.ceil(Number(month) / 3)} ${year}`;
}

/** "gg/mm/aaaa, hh:mm" in ora italiana. */
export function formatReceivedAt(date: Date) {
  const { year, month, day, hour, minute } = romeParts(date);
  return `${day}/${month}/${year}, ${hour}:${minute}`;
}
