import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IubendaEmbed } from "./IubendaEmbed";
import styles from "./LegalPage.module.css";

type LegalPageProps = {
  label: string;
  title: string;
  kind: "privacy" | "cookie";
  policyId: string;
};

/** Layout testo semplice per /privacy/ e /cookie/ con la policy iubenda incorporata. */
export function LegalPage({ label, title, kind, policyId }: LegalPageProps) {
  return (
    <Section spacing="hero" labelledBy="legal-title">
      <SectionLabel className={styles.label}>{label}</SectionLabel>
      <Heading as="h1" size="h1" id="legal-title" primary={title} className={styles.title} />
      <IubendaEmbed kind={kind} policyId={policyId} title={title} />
    </Section>
  );
}
