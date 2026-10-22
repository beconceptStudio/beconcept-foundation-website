import type { ReactNode } from "react";
import styles from "./Section.module.css";

type Tone = "light" | "surface" | "dark";
/** "none": nessun padding verticale dal componente; lo imposta la pagina con innerClassName. */
type Spacing = "default" | "hero" | "none";

type SectionProps = {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  spacing?: Spacing;
  /** Filetto superiore su fondo chiaro. */
  ruled?: boolean;
  as?: "section" | "div";
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
};

export function Section({
  children,
  id,
  tone = "light",
  spacing = "default",
  ruled = false,
  as: Tag = "section",
  labelledBy,
  className,
  innerClassName,
}: SectionProps) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={[styles.section, ruled && styles.ruled, className].filter(Boolean).join(" ")}
    >
      <div className={[styles.inner, spacing !== "none" && styles[spacing], innerClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </Tag>
  );
}

type SplitProps = {
  label: ReactNode;
  children: ReactNode;
  /** Contenuto a tutta larghezza della colonna (es. griglia di card). */
  wide?: boolean;
  className?: string;
  contentClassName?: string;
};

/** Colonna etichetta 1fr + colonna contenuto 3fr; in colonna su mobile. */
export function Split({ label, children, wide = false, className, contentClassName }: SplitProps) {
  return (
    <div className={[styles.split, className].filter(Boolean).join(" ")}>
      <div className={styles.splitLabel}>{label}</div>
      <div className={[styles.splitContent, wide && styles.splitContentWide, contentClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </div>
  );
}
