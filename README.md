# Be Foundation

Sito di Be Foundation, il progetto pro bono di Beconcept per le associazioni non profit: `foundation.beconcept.studio`.

Next.js (App Router, TypeScript), CSS Modules, deploy su Vercel.

## Sviluppo

```bash
npm install
cp .env.example .env.local   # e compila i valori
npm run dev
```

Per provare il template dei progetti senza pubblicare nulla:

```bash
PROGETTI_DIR=tests/fixtures/progetti npm run dev
```

## Struttura

```text
content/progetti/      un JSON per progetto (vedi content/progetti/README.md)
src/app/               pagine, Server Action del modulo, sitemap, robots, /og/ (immagine di condivisione)
src/components/        layout (Header, Footer, Section), ui (Heading, Button, …), progetti, segnala, legal, analytics
src/lib/               progetti, SEO, consenso, analytics, segnala/ (schema zod, Notion, email, rate limit)
src/styles/tokens.css  tutti i token del design come custom properties
src/fonts/             Suisse Int'l (woff2)
assets/og-fonts/       Suisse Int'l (otf) per l'immagine OG
```

## Contenuti e stili

- **Token:** colori, tipografia e spaziature sono in `src/styles/tokens.css`. I componenti usano solo questi token e gli alias di tono (`--tone-*`), che cambiano con `data-tone="light|surface|dark"` sulla sezione.
- **Heading in due colori:** `<Heading primary="…" secondary="…" />`; `mutedFirst` per il manifesto, `breakLine` per l'hero.
- **Progetti:** nessun progetto con `"published": true` mostra lo stato vuoto su Home e `/progetti/`.
- **Foto:** finché non arrivano le foto autorizzate, `ImageSlot` mostra i segnaposto del design.

## Animazioni d'entrata

GSAP (ScrollTrigger + SplitText) in `src/components/motion/Motion.tsx`, montato da `src/app/template.tsx` su ogni pagina; parametri in `src/lib/motion.ts`. Si attivano con l'attributo `data-reveal` (`lines`, `up`, `stagger`, `image`): `Heading` e `SectionLabel` lo mettono da soli, `ImageSlot` e le liste anche. Header, footer e campi del modulo non si animano. Con `prefers-reduced-motion` o senza JavaScript tutto è visibile da subito.

## Modulo /segnala/

Server Action `src/app/segnala/actions.ts`, con lo stesso schema zod sul client e sul server (`src/lib/segnala/schema.ts`).

Ordine delle operazioni: validazione e anti-spam (honeypot, tempo minimo di compilazione, rate limit per IP), poi salvataggio su Notion (database Applications), notifica a `MAIL_TO`, conferma a chi segnala, aggiornamento delle checkbox su Notion. La segnalazione è considerata ricevuta se riesce almeno uno tra Notion e la notifica.

## Consenso e analytics

iubenda Privacy Controls and Cookie Solution + Google Consent Mode v2 (tutto `denied` di default). `gtag.js` viene scaricato solo dopo il consenso alla finalità "Misurazione". Senza `NEXT_PUBLIC_IUBENDA_SITE_ID` e `NEXT_PUBLIC_IUBENDA_COOKIE_POLICY_ID` non viene caricato nulla.

Eventi GA4: `page_view` (anche nelle navigazioni client), `segnala_click` (parametro `posizione`), `segnalazione_inviata` (parametro `rapporto`).

## Deploy su Vercel

- Variabili d'ambiente: vedi `.env.example`. `MAILERSEND_API_KEY` e `NOTION_TOKEN` restano solo lato server.
- Rate limit: aggiungi Upstash Redis dal Vercel Marketplace; il codice legge `KV_REST_API_URL`/`KV_REST_API_TOKEN` oppure `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`.
- `robots.txt` blocca tutto sui deploy di anteprima (`VERCEL_ENV !== "production"`).
