import styles from "./StepList.module.css";

export type Step = { title: string; text: string };

type StepListProps = {
  steps: readonly Step[];
  minColumn?: "240" | "260";
};

/** Passi numerati 01–04 con filetto superiore. */
export function StepList({ steps, minColumn = "240" }: StepListProps) {
  return (
    <ol className={[styles.list, minColumn === "260" && styles.wide].filter(Boolean).join(" ")} data-reveal="stagger">
      {steps.map((step, index) => (
        <li key={step.title} className={styles.step}>
          <span className={styles.number} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.text}>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

type ColumnsProps = {
  items: readonly Step[];
  minColumn?: "260" | "280";
};

/** Colonne con etichetta ( 01 ), titolo e testo, separate da filetti verticali (Cosa facciamo, Come scegliamo). */
export function NumberedColumns({ items, minColumn = "280" }: ColumnsProps) {
  return (
    <ol
      className={[styles.columns, minColumn === "260" && styles.columnsNarrow].filter(Boolean).join(" ")}
      data-reveal="stagger"
    >
      {items.map((item, index) => (
        <li key={item.title} className={styles.column}>
          <span className={styles.columnLabel} aria-hidden="true">
            ( {String(index + 1).padStart(2, "0")} )
          </span>
          <h3 className={styles.columnTitle}>{item.title}</h3>
          <p className={styles.columnText}>{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

type PrinciplesProps = {
  items: readonly Step[];
};

/** Elenco compatto di principi con filetto sottile. */
export function PrincipleList({ items }: PrinciplesProps) {
  return (
    <ul className={styles.principles} data-reveal="stagger">
      {items.map((item) => (
        <li key={item.title} className={styles.principle}>
          <h3 className={styles.principleTitle}>{item.title}</h3>
          <p className={styles.principleText}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
