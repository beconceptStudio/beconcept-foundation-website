import Image from "next/image";
import styles from "./ImageSlot.module.css";

type ImageSlotProps = {
  /** Foto reale; se manca si mostra il segnaposto del design. */
  src?: string;
  alt?: string;
  /** Testo del segnaposto, es. "Foto team Beconcept". */
  placeholder: string;
  ratio?: "4/5" | "4/3" | "16/7";
  shade?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function ImageSlot({
  src,
  alt = "",
  placeholder,
  ratio = "4/3",
  shade = "light",
  sizes = "100vw",
  priority = false,
  className,
}: ImageSlotProps) {
  const ratioClass = { "4/5": styles.r45, "4/3": styles.r43, "16/7": styles.r167 }[ratio];
  const classes = [styles.slot, ratioClass, className].filter(Boolean).join(" ");

  if (src) {
    return (
      <div className={classes} data-reveal="image">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={styles.image} />
      </div>
    );
  }

  return (
    <div className={[classes, styles.placeholder, shade === "dark" && styles.dark].filter(Boolean).join(" ")} aria-hidden="true" data-reveal="image">
      <span className={styles.caption}>[{placeholder}]</span>
    </div>
  );
}
