"use client";

import type { ChangeEvent, ReactNode } from "react";
import { MESSAGES } from "@/lib/segnala/schema";
import styles from "./SegnalaForm.module.css";

export function Required() {
  return (
    <span className={styles.required} aria-hidden="true">
      {" "}
      *
    </span>
  );
}

export function ErrorMessage({ id, message }: { id: string; message?: string }) {
  // Sempre nel DOM: il contenuto cambia e viene letto dagli screen reader collegati via aria-describedby.
  return (
    <p id={id} className={styles.error} hidden={!message}>
      {message}
    </p>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: ReactNode;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength: number;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url";
};

export function TextField({
  id,
  label,
  value,
  onChange,
  help,
  error,
  required = false,
  multiline = false,
  rows = 5,
  maxLength,
  type = "text",
  autoComplete,
  inputMode,
}: TextFieldProps) {
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const limitId = `${id}-limit`;
  const atLimit = value.length >= maxLength;
  const describedBy = [error ? errorId : null, help ? helpId : null, atLimit ? limitId : null].filter(Boolean).join(" ");

  const common = {
    id,
    name: id,
    value,
    maxLength,
    autoComplete,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className: [styles.input, multiline && styles.textarea, error && styles.inputError].filter(Boolean).join(" "),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <Required /> : null}
      </label>
      {multiline ? <textarea rows={rows} {...common} /> : <input type={type} inputMode={inputMode} {...common} />}
      <ErrorMessage id={errorId} message={error} />
      {help ? (
        <p id={helpId} className={styles.help}>
          {help}
        </p>
      ) : null}
      <p id={limitId} className={styles.limit} aria-live="polite">
        {atLimit ? MESSAGES.maxLength(maxLength) : ""}
      </p>
    </div>
  );
}
