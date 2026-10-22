import type { ReactNode } from "react";
import styles from "./SectionLabel.module.css";

type SectionLabelProps = {
  children: ReactNode;
  as?: "p" | "span" | "div";
  className?: string;
  /** Entrata con breve salita (Motion). */
  reveal?: boolean;
};

/** Etichetta di sezione tra parentesi: `( Perché esiste )`, `( 01 )`. */
export function SectionLabel({ children, as: Tag = "p", className, reveal = true }: SectionLabelProps) {
  return (
    <Tag className={[styles.label, className].filter(Boolean).join(" ")} data-reveal={reveal ? "up" : undefined}>
      ( {children} )
    </Tag>
  );
}
