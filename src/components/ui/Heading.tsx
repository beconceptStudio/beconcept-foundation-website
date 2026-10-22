import type { ReactNode } from "react";
import styles from "./Heading.module.css";

type Level = "h1" | "h2" | "h3" | "p";
type Size = "h1" | "display" | "h2" | "h2Block" | "h3" | "quote";

type HeadingProps = {
  as?: Level;
  size?: Size;
  /** Prima parte, nel colore del testo. */
  primary: ReactNode;
  /** Seconda parte, in `heading-muted`. */
  secondary?: ReactNode;
  /** Manifesto: la parte grigia viene prima ("Be Foundation nasce per" / "accorciare questa distanza."). */
  mutedFirst?: boolean;
  /** Va a capo tra le due parti (hero Home). */
  breakLine?: boolean;
  weight?: "medium" | "semibold";
  /** Entrata riga per riga (Motion). Di default solo per i titoli grandi. */
  reveal?: boolean;
  id?: string;
  className?: string;
};

/**
 * Heading in due colori (design-reference, regola 1).
 * Su fondo scuro la parte principale diventa bianca tramite i token di tono.
 */
export function Heading({
  as: Tag = "h2",
  size = "h2",
  primary,
  secondary,
  mutedFirst = false,
  breakLine = false,
  weight = "semibold",
  reveal = size === "h1" || size === "display" || size === "h2" || size === "quote",
  id,
  className,
}: HeadingProps) {
  const separator = breakLine ? <br /> : " ";
  const classes = [styles.heading, styles[size], styles[weight], className].filter(Boolean).join(" ");
  const revealProps = reveal ? { "data-reveal": "lines" } : {};

  if (mutedFirst) {
    return (
      <Tag id={id} className={classes} {...revealProps}>
        <span className={styles.muted}>{primary}</span>
        {separator}
        {secondary}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={classes} {...revealProps}>
      {primary}
      {secondary ? (
        <>
          {separator}
          <span className={styles.muted}>{secondary}</span>
        </>
      ) : null}
    </Tag>
  );
}
