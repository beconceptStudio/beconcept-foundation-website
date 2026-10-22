import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { SegnalaForm } from "@/components/segnala/SegnalaForm";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/TextLink";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("segnala");

export default function SegnalaPage() {
  return (
    <>
      {/* 8.1 Testo prima del modulo */}
      <Section spacing="none" innerClassName={styles.intro} labelledBy="segnala-title">
        <div className={styles.introCopy}>
          <SectionLabel className={styles.label}>Segnala</SectionLabel>
          <Heading
            as="h1"
            size="h1"
            id="segnala-title"
            primary="Facci conoscere"
            secondary="un'associazione a cui tieni."
            className={styles.title}
          />
          <p className={styles.lead} data-reveal="up">
            Raccontaci cosa fa, perché il suo lavoro ti sembra importante e dove una comunicazione migliore potrebbe
            aiutarla. Può essere la tua associazione o una che stimi da lontano.
          </p>
        </div>
        <section className={styles.box} data-reveal="up" data-tone="surface" aria-labelledby="prima-di-iniziare">
          <h2 id="prima-di-iniziare" className={styles.boxLabel}>
            ( Prima di iniziare )
          </h2>
          <ul className={styles.boxList}>
            <li>Ci vogliono circa 5 minuti e non serve avere un progetto già definito.</li>
            <li>
              Valutiamo tutte le proposte a fine trimestre e ricontattiamo chi le ha inviate quando possiamo dare un
              contributo.
            </li>
            <li>Seguiamo fino a quattro associazioni all&apos;anno, quindi non possiamo accogliere tutte le proposte.</li>
          </ul>
          <TextLink href="/come-funziona/#faq">Hai dubbi? Leggi le domande frequenti</TextLink>
        </section>
      </Section>

      {/* 8.2–8.4 Modulo */}
      <Section spacing="none">
        <SegnalaForm />
      </Section>
    </>
  );
}
