import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "outline";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  external?: boolean;
  /** Posizione per l'evento GA `segnala_click`. */
  trackSegnala?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

export function buttonClassName(variant: Variant = "primary", size: Size = "md", className?: string) {
  return [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");
}

export function ButtonLink({
  href,
  external = false,
  variant,
  size,
  children,
  className,
  trackSegnala,
  ...rest
}: LinkButtonProps) {
  const classes = buttonClassName(variant, size, className);
  const trackProps = trackSegnala ? { "data-track": "segnala_click", "data-track-posizione": trackSegnala } : {};

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener" {...trackProps} {...rest}>
        {children}
        <span aria-hidden="true">&nbsp;↗</span>
        <span className="visually-hidden"> (si apre in una nuova scheda)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...trackProps} {...rest}>
      {children}
    </Link>
  );
}
