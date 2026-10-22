import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, SEGNALA_HREF, SEGNALA_LABEL } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("contatti");

export default function ContattiPage() {
  return (
    <Section spacing="none" innerClassName={styles.layout} labelledBy="contatti-title">
      <div className={styles.main}>
        <SectionLabel className={styles.label}>Contatti</SectionLabel>
        <Heading as="h1" size="h1" id="contatti-title" primary="Parliamone." className={styles.title} />
        <p className={styles.lead} data-reveal="up">
          Vuoi saperne di più su Be Foundation, collaborare con noi o capire come potremmo aiutare la tua associazione?
          Scrivici: ti risponde direttamente il nostro team.
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className={styles.email} data-reveal="up">
          {CONTACT_EMAIL}
        </a>
      </div>

      <section className={styles.box} data-reveal="up" data-tone="surface" aria-labelledby="contatti-segnala">
        <SectionLabel className={styles.label}>Segnala</SectionLabel>
        <Heading as="h2" size="h3" id="contatti-segnala" primary="Vuoi segnalarci un'associazione?" className={styles.boxTitle} />
        <p className={styles.boxText}>Usa il modulo dedicato: raccoglie tutto quello che ci serve per conoscerla.</p>
        <ButtonLink href={SEGNALA_HREF} trackSegnala="contatti">
          {SEGNALA_LABEL}
        </ButtonLink>
      </section>
    </Section>
  );
}
