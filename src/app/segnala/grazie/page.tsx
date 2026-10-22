import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { MESSAGES } from "@/lib/segnala/schema";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("grazie", { noindex: true });

// 8.5: l'H1 cambia in base alla scelta fatta nel modulo.
const TITOLI = {
  segnala: { primary: "Grazie per averci fatto conoscere", secondary: "questa associazione." },
  parte: { primary: "Grazie per averci raccontato", secondary: "il vostro lavoro." },
} as const;

export default async function GraziePage({ searchParams }: PageProps<"/segnala/grazie">) {
  const params = await searchParams;
  const tipo = params.tipo === "parte" ? "parte" : "segnala";
  const confermaFallita = params.conferma === "ko";

  return (
    <Section spacing="none" innerClassName={styles.layout} labelledBy="grazie-title">
      <p className={styles.badge} data-reveal="up">
        <span className={styles.check} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11.5l4.5 4.5L18 6.5" />
          </svg>
        </span>
        ( Segnalazione inviata )
      </p>
      <Heading as="h1" size="h1" id="grazie-title" {...TITOLI[tipo]} className={styles.title} />
      <div className={styles.text} data-reveal="up">
        {confermaFallita ? (
          <p className={styles.notice} role="status">
            {MESSAGES.confirmationFailed}
          </p>
        ) : (
          <p>Abbiamo ricevuto la tua segnalazione e ti abbiamo inviato un&apos;email di conferma.</p>
        )}
        <p>
          A fine trimestre leggeremo con attenzione tutte le proposte. Se pensiamo di poter dare un contributo concreto,
          ti ricontatteremo per conoscere meglio l&apos;associazione.
        </p>
      </div>
      <div className={styles.actions} data-reveal="up">
        <ButtonLink href="/" variant="outline">
          Torna alla Home
        </ButtonLink>
        <TextLink href="/come-funziona/#come-scegliamo">Scopri come scegliamo</TextLink>
      </div>
    </Section>
  );
}
