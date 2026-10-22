import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/TextLink";
import { ambitoLabel, getProgetto, getPublishedProgetti, STATO_LABEL } from "@/lib/progetti";
import { buildMetadata } from "@/lib/seo";
import { SEGNALA_HREF } from "@/lib/site";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProgetti().map((progetto) => ({ slug: progetto.slug }));
}

export async function generateMetadata({ params }: PageProps<"/progetti/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const progetto = getProgetto(slug);
  if (!progetto) return {};
  return buildMetadata({
    path: `/progetti/${progetto.slug}/`,
    title: `${progetto.nome} · Be Foundation`,
    description: progetto.bisogno,
  });
}

export default async function ProgettoPage({ params }: PageProps<"/progetti/[slug]">) {
  const { slug } = await params;
  const progetto = getProgetto(slug);
  if (!progetto) notFound();

  const blocchi = [
    { title: "Chi sono", paragraphs: progetto.chiSono },
    { title: "Da dove siamo partiti", paragraphs: progetto.daDoveSiamoPartiti },
    { title: "Cosa abbiamo fatto insieme", paragraphs: progetto.cosaAbbiamoFatto },
    { title: "Cosa è cambiato", paragraphs: progetto.cosaECambiato },
  ].filter((blocco): blocco is { title: string; paragraphs: string[] } => Boolean(blocco.paragraphs?.length));

  return (
    <>
      <Section spacing="none" innerClassName={styles.hero} labelledBy="progetto-title">
        <Link href="/progetti/" className={styles.back} data-reveal="up">
          <span aria-hidden="true">← </span>Progetti
        </Link>
        <div className={styles.heroRow}>
          <div className={styles.heroCopy}>
            <Heading as="h1" size="h1" id="progetto-title" primary={progetto.nome} className={styles.title} />
            <p className={styles.lead} data-reveal="up">{progetto.bisogno}</p>
          </div>
          <dl className={styles.meta} data-reveal="up">
            <div>
              <dt className="visually-hidden">Città e ambito</dt>
              <dd>
                ( {progetto.citta} · {ambitoLabel(progetto.ambito)} )
              </dd>
            </div>
            <div>
              <dt className="visually-hidden">Trimestre e stato</dt>
              <dd>
                ( {progetto.trimestre} · {STATO_LABEL[progetto.stato]} )
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <div className={styles.cover}>
        <ImageSlot
          src={progetto.immagine?.src}
          alt={progetto.immagine?.alt}
          placeholder="Immagine principale · autorizzata"
          ratio="16/7"
          priority
          sizes="(max-width: 1440px) 100vw, 1360px"
        />
      </div>

      <Section spacing="none" innerClassName={styles.blocks}>
        {blocchi.map((blocco, index) => (
          <section key={blocco.title} className={styles.block} aria-labelledby={`blocco-${index}`}>
            <SectionLabel className={styles.blockLabel}>{String(index + 1).padStart(2, "0")}</SectionLabel>
            <Heading id={`blocco-${index}`} size="h2Block" primary={blocco.title} className={styles.blockTitle} />
            <div className={styles.blockText} data-reveal="up">
              {blocco.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </Section>

      {progetto.voce ? (
        <Section tone="surface" labelledBy="voce-title">
          <h2 id="voce-title" className="visually-hidden">
            La loro voce
          </h2>
          <SectionLabel className={styles.voiceLabel}>La loro voce</SectionLabel>
          <figure className={styles.quote}>
            <blockquote>
              <Heading as="p" size="quote" weight="medium" primary={`“${progetto.voce.citazione}”`} />
            </blockquote>
            <figcaption className={styles.caption} data-reveal="up">
              {progetto.voce.nome}, {progetto.voce.ruolo}
            </figcaption>
          </figure>
        </Section>
      ) : null}

      <Section spacing="none" innerClassName={styles.actions}>
        <ButtonLink href={progetto.sostieni.url} external size="lg" data-reveal="up">
          Sostieni {progetto.nome}
        </ButtonLink>
        <p className={styles.next} data-reveal="up">
          Conosci un&apos;altra associazione a cui potremmo essere utili?{" "}
          <TextLink href={SEGNALA_HREF} trackSegnala="progetto-dettaglio">
            Segnalacela
          </TextLink>
        </p>
      </Section>
    </>
  );
}
