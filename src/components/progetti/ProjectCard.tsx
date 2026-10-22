import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { ambitoLabel, STATO_LABEL, type Progetto } from "@/lib/progetti";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  progetto: Progetto;
  /** In Home la card è più compatta: senza trimestre e senza "Leggi la storia". */
  variant?: "list" | "preview";
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ progetto, variant = "list", headingLevel: Title = "h3" }: ProjectCardProps) {
  const meta = [progetto.citta, ambitoLabel(progetto.ambito), variant === "list" ? progetto.trimestre : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className={styles.card}>
      <ImageSlot
        src={progetto.immagine?.src}
        alt={progetto.immagine?.alt}
        placeholder="Foto autorizzata"
        ratio="4/3"
        sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
      <div className={styles.meta}>
        <span>{meta}</span>
        <span className={styles.badge}>{STATO_LABEL[progetto.stato]}</span>
      </div>
      <Title className={styles.title}>
        <Link href={`/progetti/${progetto.slug}/`} className={styles.link}>
          {progetto.nome}
        </Link>
      </Title>
      <p className={styles.frase}>{progetto.frase}</p>
      {variant === "list" ? (
        <span className={styles.more} aria-hidden="true">
          Leggi la storia →
        </span>
      ) : null}
    </article>
  );
}
