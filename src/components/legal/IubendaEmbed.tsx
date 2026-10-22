"use client";

import { useEffect } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "./IubendaEmbed.module.css";

type IubendaEmbedProps = {
  policyId: string;
  kind: "privacy" | "cookie";
  title: string;
};

const SCRIPT_ID = "iubenda-policy-embed";

/**
 * Embed ufficiale iubenda (body embed, senza iframe): lo script sostituisce il link con il testo della policy.
 * Lo script viene reinserito a ogni montaggio perché scansiona la pagina solo quando si carica,
 * e con la navigazione client il secondo embed non verrebbe elaborato.
 */
export function IubendaEmbed({ policyId, kind, title }: IubendaEmbedProps) {
  useEffect(() => {
    if (!policyId) return;
    document.getElementById(SCRIPT_ID)?.remove();
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://cdn.iubenda.com/iubenda.js";
    script.async = true;
    document.body.appendChild(script);
  }, [policyId, kind]);

  if (!policyId) {
    return (
      <p className={styles.fallback}>
        Il documento non è ancora disponibile. Per qualsiasi domanda scrivici a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    );
  }

  const href =
    kind === "privacy"
      ? `https://www.iubenda.com/privacy-policy/${policyId}`
      : `https://www.iubenda.com/privacy-policy/${policyId}/cookie-policy`;

  return (
    <div className={styles.embed}>
      <a href={href} className="iubenda-white no-brand iubenda-noiframe iubenda-embed iub-body-embed" title={title}>
        {title}
      </a>
    </div>
  );
}
