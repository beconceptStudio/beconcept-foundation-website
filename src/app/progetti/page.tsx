import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/progetti/ProjectCard";
import { ProjectsEmpty } from "@/components/progetti/ProjectsEmpty";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/TextLink";
import { getPublishedProgetti } from "@/lib/progetti";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("progetti");

export default function ProgettiPage() {
  const progetti = getPublishedProgetti();

  return (
    <>
      <Section spacing="none" labelledBy="progetti-title" innerClassName={styles.hero}>
        <SectionLabel className={styles.heroLabel}>Progetti</SectionLabel>
        <Heading
          as="h1"
          size="h1"
          id="progetti-title"
          primary="Le associazioni"
          secondary="che affianchiamo."
          className={styles.heroTitle}
        />
        <p className={styles.lead} data-reveal="up">
          Dietro ogni progetto ci sono persone che lavorano per gli altri. Qui raccontiamo chi sono, da dove siamo
          partiti e cosa abbiamo costruito insieme.
        </p>
      </Section>

      <Section ruled spacing="none" innerClassName={styles.list}>
        {progetti.length > 0 ? (
          <>
            <div className={styles.listHeader} aria-hidden="true">
              <SectionLabel as="span">Elenco</SectionLabel>
              <SectionLabel as="span">In corso · Concluso</SectionLabel>
            </div>
            <h2 className="visually-hidden">Elenco dei progetti</h2>
            <ul className={styles.cards} data-reveal="stagger">
              {progetti.map((progetto) => (
                <li key={progetto.slug}>
                  <ProjectCard progetto={progetto} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ProjectsEmpty
            text="Presto racconteremo qui le associazioni che stiamo affiancando. Nel frattempo, scopri come funziona Be Foundation."
            action={<TextLink href="/come-funziona/">Scopri come funziona</TextLink>}
          />
        )}
      </Section>
    </>
  );
}
