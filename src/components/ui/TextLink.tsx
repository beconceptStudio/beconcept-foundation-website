import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  /** Link esterno: freccia ↗ e nuova scheda. Altrimenti freccia →. */
  external?: boolean;
  arrow?: boolean;
  className?: string;
  trackSegnala?: string;
};

/** Link testuale sottolineato con offset 6px e freccia (design-reference, regola 4). */
export function TextLink({ href, children, external = false, arrow = true, className, trackSegnala }: TextLinkProps) {
  const classes = [styles.link, className].filter(Boolean).join(" ");
  const trackProps = trackSegnala ? { "data-track": "segnala_click", "data-track-posizione": trackSegnala } : {};

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener" {...trackProps}>
        {children}
        {arrow ? <span aria-hidden="true"> ↗</span> : null}
        <span className="visually-hidden"> (si apre in una nuova scheda)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...trackProps}>
      {children}
      {arrow ? <span aria-hidden="true"> →</span> : null}
    </Link>
  );
}
