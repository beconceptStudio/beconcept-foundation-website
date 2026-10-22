import styles from "./Accordion.module.css";

export type AccordionItem = { question: string; answer: string };

type AccordionProps = {
  items: readonly AccordionItem[];
};

/**
 * FAQ su <details>/<summary> nativi: tastiera, screen reader e stato aperto/chiuso senza JavaScript.
 * La prima domanda è aperta (design-reference, Stati e varianti).
 */
export function Accordion({ items }: AccordionProps) {
  return (
    <div className={styles.accordion} data-reveal="stagger">
      {items.map((item, index) => (
        <details key={item.question} className={styles.item} open={index === 0}>
          <summary className={styles.summary}>
            <span>{item.question}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
