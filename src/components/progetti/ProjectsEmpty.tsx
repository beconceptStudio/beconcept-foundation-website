import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import styles from "./ProjectsEmpty.module.css";

type ProjectsEmptyProps = {
  text: string;
  action?: ReactNode;
  headingId?: string;
};

/** Stato vuoto di Home e /progetti/: nessun progetto pubblicato. */
export function ProjectsEmpty({ text, action, headingId }: ProjectsEmptyProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.copy}>
        <Heading id={headingId} primary="I primi progetti" secondary="sono già in cammino." />
        <p className={styles.text} data-reveal="up">{text}</p>
        {action ? <div className={styles.action} data-reveal="up">{action}</div> : null}
      </div>
      <div className={styles.slots} data-reveal="up" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
