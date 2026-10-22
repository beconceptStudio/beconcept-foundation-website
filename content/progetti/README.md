# Progetti

Un file JSON per ogni associazione affiancata: `content/progetti/<slug>.json`. Il nome del file deve coincidere con `slug`.

Si pubblica **solo** con collaborazione confermata e materiali autorizzati dall'associazione (nome, logo, foto, citazione). Finché nessun progetto ha `"published": true`, Home e `/progetti/` mostrano lo stato vuoto "I primi progetti sono già in cammino."

Lo schema è in `src/lib/progetti.ts`: un file non valido blocca il build e l'errore indica il campo da correggere.

| Campo | Obbl. | Note |
| --- | --- | --- |
| `slug` | sì | kebab-case, diventa `/progetti/<slug>/` |
| `published` | sì | `false` finché non c'è l'autorizzazione |
| `nome` | sì | nome dell'associazione (H1) |
| `citta` | sì | |
| `ambito` | sì | `persone` · `salute` · `animali` · `ambiente` · `comunità` |
| `trimestre` | sì | es. `Q4 2026` |
| `stato` | sì | `in-corso` · `concluso` |
| `frase` | sì | una frase sul bisogno o sul cambiamento (card) |
| `bisogno` | sì | il bisogno affrontato, in una frase (sottotitolo) |
| `immagine` | no | `{ "src": "/progetti/<slug>/cover.jpg", "alt": "…" }`, file in `public/progetti/<slug>/` |
| `chiSono` | sì | array di paragrafi |
| `daDoveSiamoPartiti` | sì | array di paragrafi |
| `cosaAbbiamoFatto` | sì | array di paragrafi |
| `cosaECambiato` | no | solo risultati documentati, con periodo di riferimento |
| `voce` | no | `{ "citazione", "nome", "ruolo" }`, citazione autentica e autorizzata |
| `sostieni` | sì | `{ "url": "https://…" }`, link donazioni o sito ufficiale |

Per provare il template in locale senza pubblicare nulla: `PROGETTI_DIR=tests/fixtures/progetti npm run dev`.
