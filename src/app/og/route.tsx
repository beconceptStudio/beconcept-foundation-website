import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Brief 10: "Be Foundation · Aiutiamo chi aiuta. · Un progetto Beconcept".
// Colori in esadecimale perché Satori non legge le custom properties CSS: sono i token ink, paper, heading-muted, text-muted.
const INK = "#111111";
const PAPER = "#FFFFFF";
const HEADING_MUTED = "#8C8C8C";
const TEXT_MUTED = "#5C5C5C";

// Route handler statico invece della convenzione opengraph-image: così l'immagine è la stessa su tutte le pagine,
// anche quelle che ridefiniscono openGraph nei metadata, e l'URL /og/ rispetta trailingSlash.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const [regular, semibold] = await Promise.all([
  readFile(join(process.cwd(), "assets/og-fonts/SuisseIntl-Regular.otf")),
  readFile(join(process.cwd(), "assets/og-fonts/SuisseIntl-SemiBold.otf")),
]);

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: PAPER,
          color: INK,
          fontFamily: "Suisse",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 80 80">
            <rect width="80" height="80" rx="16" fill={INK} />
            <path
              fill={PAPER}
              d="M56.2694 32.3217C54.6258 29.8817 52.7033 27.5 48.9067 27.5C45.1098 27.5 41.9885 30.57 41.9885 34.3433V52.5H45.717V34.3433C45.717 32.6017 47.1476 31.185 48.9067 31.185C50.6655 31.185 51.6853 32.1658 53.1664 34.3642C54.8506 36.8642 59.6317 43.8475 62.332 47.7875L63.0369 48.815H52.1594V52.5H68.5V27.5H64.7715V44.7767L63.5606 43.0083C59.795 37.5092 57.342 33.9142 56.2694 32.3217Z"
            />
            <path
              fill={PAPER}
              d="M31.0934 27.5C27.2966 27.5 25.3734 29.8817 23.7298 32.3217C22.38 34.325 19.0202 39.2392 16.4385 43.0083L15.2277 44.7767V27.5H11.5V52.5H27.8406V48.815H16.9631L17.6679 47.7875C20.3675 43.8475 25.1486 36.8642 26.8335 34.3642C28.3146 32.1658 29.2813 31.185 31.0934 31.185C32.9054 31.185 34.283 32.6017 34.283 34.3433V52.5H38.0115V34.3433C38.0115 30.57 34.9079 27.5 31.0934 27.5Z"
            />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}>Be Foundation</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 600, lineHeight: 0.98, letterSpacing: "-0.04em" }}>
          <span>Aiutiamo</span>
          <span style={{ color: HEADING_MUTED }}>chi aiuta.</span>
        </div>
        <span style={{ fontSize: 28, color: TEXT_MUTED }}>Un progetto Beconcept</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Suisse", data: regular, weight: 400, style: "normal" },
        { name: "Suisse", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
