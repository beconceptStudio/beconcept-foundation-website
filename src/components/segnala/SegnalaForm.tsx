"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitSegnalazione } from "@/app/segnala/actions";
import { buttonClassName } from "@/components/ui/Button";
import { EVENTS, track } from "@/lib/analytics";
import {
  AREA_NON_SO,
  AREE,
  CONTATTI,
  FIELD_ORDER,
  HONEYPOT_FIELD,
  LIMITS,
  MAX_AREE,
  MESSAGES,
  RAPPORTI,
  segnalazioneSchema,
  toFieldErrors,
  type Contatto,
  type FieldErrors,
  type FieldName,
  type Rapporto,
} from "@/lib/segnala/schema";
import { ErrorMessage, Required, TextField } from "./fields";
import styles from "./SegnalaForm.module.css";

type Area = (typeof AREE)[number];

type Values = {
  rapporto?: Rapporto;
  nomeAssociazione: string;
  citta: string;
  sito: string;
  attivita: string;
  aree: Area[];
  migliorare: string;
  scadenza: string;
  ruolo: string;
  comeLaConosci: string;
  contatto?: Contatto;
  nome: string;
  email: string;
  telefono: string;
  altro: string;
  consenso: boolean;
};

const INITIAL: Values = {
  nomeAssociazione: "",
  citta: "",
  sito: "",
  attivita: "",
  aree: [],
  migliorare: "",
  scadenza: "",
  ruolo: "",
  comeLaConosci: "",
  nome: "",
  email: "",
  telefono: "",
  altro: "",
  consenso: false,
};

/** id dell'elemento che riceve il focus quando il campo ha un errore. */
const FOCUS_TARGET: Partial<Record<FieldName, string>> = {
  rapporto: "rapporto-parte",
  aree: `area-0`,
  contatto: "contatto-si",
};

const RAPPORTO_HELP: Record<Rapporto, string> = {
  parte: "Vorrei raccontarvi il nostro lavoro e ciò di cui abbiamo bisogno.",
  segnala: "Conosco il suo lavoro e penso che potreste esserle utili.",
};

function validate(values: Values): FieldErrors {
  const result = segnalazioneSchema.safeParse(values);
  return result.success ? {} : toFieldErrors(result.error);
}

export function SegnalaForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [areeLimit, setAreeLimit] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [attempted, setAttempted] = useState(false);
  const submittingRef = useRef(false);
  const startedAt = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Dopo il primo tentativo di invio gli errori si aggiornano mentre si scrive.
    if (attempted) setErrors(validate(next));
  }

  function toggleArea(area: Area, checked: boolean) {
    setAreeLimit(false);
    if (!checked) {
      update(
        "aree",
        values.aree.filter((item) => item !== area),
      );
      return;
    }
    // "Non saprei dire" esclude le altre aree, e viceversa.
    if (area === AREA_NON_SO) {
      update("aree", [AREA_NON_SO]);
      return;
    }
    const current = values.aree.filter((item) => item !== AREA_NON_SO);
    if (current.length >= MAX_AREE) {
      setAreeLimit(true);
      return;
    }
    update("aree", [...current, area]);
  }

  function focusFirstError(fieldErrors: FieldErrors) {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (!first) return;
    const target = document.getElementById(FOCUS_TARGET[first] ?? first);
    target?.focus();
    target?.scrollIntoView({ block: "center" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setAttempted(true);
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setStatus("idle");
      focusFirstError(fieldErrors);
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    try {
      const result = await submitSegnalazione({
        values,
        startedAt: startedAt.current,
        [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
      });

      if (result.status === "ok") {
        track(EVENTS.segnalazioneInviata, { rapporto: result.rapporto });
        const params = new URLSearchParams({ tipo: result.rapporto });
        if (!result.confermaInviata) params.set("conferma", "ko");
        // Il bottone resta disabilitato fino al cambio pagina.
        router.push(`/segnala/grazie/?${params.toString()}`);
        return;
      }

      submittingRef.current = false;
      if (result.status === "invalid") {
        setStatus("idle");
        setErrors(result.errors);
        focusFirstError(result.errors);
        return;
      }
      setStatus("error");
    } catch {
      submittingRef.current = false;
      setStatus("error");
    }
  }

  const submitting = status === "submitting";
  const areeError = areeLimit ? MESSAGES.maxAree : errors.aree;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-describedby="segnala-intro">
      {/* Prima scelta (brief 8.2) */}
      <fieldset
        className={styles.rapporto}
        aria-describedby={errors.rapporto ? "rapporto-error" : undefined}
        aria-invalid={errors.rapporto ? true : undefined}
      >
        <legend className={styles.rapportoLegend}>
          Qual è il tuo rapporto con l&apos;associazione?
          <Required />
        </legend>
        <div className={styles.rapportoOptions}>
          {(Object.keys(RAPPORTI) as Rapporto[]).map((key) => (
            <label key={key} className={styles.rapportoCard} data-checked={values.rapporto === key}>
              <input
                type="radio"
                id={`rapporto-${key}`}
                name="rapporto"
                value={key}
                checked={values.rapporto === key}
                onChange={() => update("rapporto", key)}
                aria-describedby={`rapporto-${key}-help`}
                className={styles.rapportoInput}
              />
              <span>
                <span className={styles.rapportoTitle}>{RAPPORTI[key]}</span>
                <span id={`rapporto-${key}-help`} className={styles.rapportoHelp}>
                  {RAPPORTO_HELP[key]}
                </span>
              </span>
            </label>
          ))}
        </div>
        <ErrorMessage id="rapporto-error" message={errors.rapporto} />
      </fieldset>

      <p id="segnala-intro" className={styles.intro}>
        Scrivi con parole tue: ci interessa capire cosa fa questa realtà e cosa potrebbe migliorare. I campi con
        l&apos;asterisco sono obbligatori. Non inserire dati personali delle persone assistite, informazioni sanitarie o
        documenti riservati.
      </p>

      <div className={styles.groups}>
        {/* 01 · L'associazione */}
        <fieldset className={styles.group}>
          <legend className={styles.groupLegend}>( 01 · L&apos;associazione )</legend>
          <TextField
            id="nomeAssociazione"
            label="Nome dell'associazione"
            required
            value={values.nomeAssociazione}
            onChange={(value) => update("nomeAssociazione", value)}
            error={errors.nomeAssociazione}
            help="Il nome con cui si presenta pubblicamente."
            maxLength={LIMITS.short}
            autoComplete="organization"
          />
          <TextField
            id="citta"
            label="Città e regione"
            required
            value={values.citta}
            onChange={(value) => update("citta", value)}
            error={errors.citta}
            help="Dove ha sede o dove opera principalmente."
            maxLength={LIMITS.short}
            autoComplete="off"
          />
          <TextField
            id="sito"
            label="Sito e canali social"
            value={values.sito}
            onChange={(value) => update("sito", value)}
            error={errors.sito}
            help="Sito, social o pagina per le donazioni. Se non ci sono, lascia vuoto."
            maxLength={LIMITS.short}
            inputMode="url"
            autoComplete="off"
          />
          <TextField
            id="attivita"
            label="Di cosa si occupa e chi aiuta"
            required
            multiline
            rows={5}
            value={values.attivita}
            onChange={(value) => update("attivita", value)}
            error={errors.attivita}
            help="Raccontaci le sue attività, a chi si rivolgono e perché sono importanti. Max 700 caratteri."
            maxLength={LIMITS.attivita}
          />
        </fieldset>

        {/* 02 · Il bisogno */}
        <fieldset className={styles.group}>
          <legend className={styles.groupLegend}>( 02 · Il bisogno )</legend>
          <fieldset
            className={styles.field}
            aria-describedby={["aree-hint", areeError ? "aree-error" : null].filter(Boolean).join(" ")}
            aria-invalid={areeError ? true : undefined}
          >
            <legend className={styles.label}>
              Dove pensi che potremmo essere utili
              <Required />
              <span id="aree-hint" className={styles.labelNote}>
                {" "}
                (max 2)
              </span>
            </legend>
            <div className={styles.chips}>
              {AREE.map((area, index) => (
                <label key={area} className={styles.chip} data-checked={values.aree.includes(area)}>
                  <input
                    type="checkbox"
                    id={`area-${index}`}
                    name="aree"
                    value={area}
                    checked={values.aree.includes(area)}
                    onChange={(event) => toggleArea(area, event.target.checked)}
                    className={styles.chipInput}
                  />
                  {area}
                </label>
              ))}
            </div>
            <p id="aree-error" className={styles.error} hidden={!areeError} aria-live="polite">
              {areeError}
            </p>
          </fieldset>
          <TextField
            id="migliorare"
            label="Cosa vorresti migliorare, e per chi"
            required
            multiline
            rows={6}
            value={values.migliorare}
            onChange={(value) => update("migliorare", value)}
            error={errors.migliorare}
            help="Per esempio: le attività sono poco conosciute, un progetto è difficile da spiegare o chi vorrebbe aiutare non capisce come fare. Una situazione concreta ci aiuta più di una soluzione tecnica. Max 1.200 caratteri."
            maxLength={LIMITS.migliorare}
          />
          <TextField
            id="scadenza"
            label="C'è una scadenza o un momento importante?"
            value={values.scadenza}
            onChange={(value) => update("scadenza", value)}
            error={errors.scadenza}
            help="Un evento, una campagna, un anniversario. Ci aiuta a capire i tempi, anche se non garantisce la priorità."
            maxLength={LIMITS.scadenza}
          />
        </fieldset>

        {/* 03 · Il tuo legame: compare dopo la prima scelta; i valori restano se si cambia risposta */}
        {values.rapporto ? (
          <fieldset className={styles.group}>
            <legend className={styles.groupLegend}>( 03 · Il tuo legame )</legend>
            {values.rapporto === "parte" ? (
              <TextField
                id="ruolo"
                label="Qual è il tuo ruolo?"
                required
                value={values.ruolo}
                onChange={(value) => update("ruolo", value)}
                error={errors.ruolo}
                help="Per esempio: presidente, referente, volontario, membro del direttivo. Puoi segnalarla anche se non sei tu a decidere."
                maxLength={LIMITS.short}
                autoComplete="organization-title"
              />
            ) : (
              <>
                <TextField
                  id="comeLaConosci"
                  label="Come la conosci?"
                  required
                  value={values.comeLaConosci}
                  onChange={(value) => update("comeLaConosci", value)}
                  error={errors.comeLaConosci}
                  help="Il tuo legame o come hai scoperto il suo lavoro."
                  maxLength={LIMITS.short}
                  autoComplete="off"
                />
                <fieldset
                  className={styles.field}
                  aria-describedby={["contatto-help", errors.contatto ? "contatto-error" : null].filter(Boolean).join(" ")}
                  aria-invalid={errors.contatto ? true : undefined}
                >
                  <legend className={styles.label}>
                    Potresti metterci in contatto?
                    <Required />
                  </legend>
                  <div className={styles.chips}>
                    {(Object.keys(CONTATTI) as Contatto[]).map((key) => (
                      <label key={key} className={styles.chip} data-checked={values.contatto === key}>
                        <input
                          type="radio"
                          id={`contatto-${key}`}
                          name="contatto"
                          value={key}
                          checked={values.contatto === key}
                          onChange={() => update("contatto", key)}
                          className={styles.chipInput}
                        />
                        {CONTATTI[key]}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage id="contatto-error" message={errors.contatto} />
                  <p id="contatto-help" className={styles.help}>
                    Nessun problema se non puoi: in caso, troveremo insieme il modo giusto per avvicinarla.
                  </p>
                </fieldset>
              </>
            )}
          </fieldset>
        ) : null}

        {/* 04 · I tuoi recapiti */}
        <fieldset className={styles.group}>
          <legend className={styles.groupLegend}>( 04 · I tuoi recapiti )</legend>
          <TextField
            id="nome"
            label="Nome e cognome"
            required
            value={values.nome}
            onChange={(value) => update("nome", value)}
            error={errors.nome}
            maxLength={LIMITS.short}
            autoComplete="name"
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            required
            value={values.email}
            onChange={(value) => update("email", value)}
            error={errors.email}
            help="Qui riceverai la conferma e, se possiamo dare un contributo, ti ricontatteremo."
            maxLength={LIMITS.short}
            autoComplete="email"
            inputMode="email"
          />
          <TextField
            id="telefono"
            label="Telefono"
            type="tel"
            value={values.telefono}
            onChange={(value) => update("telefono", value)}
            error={errors.telefono}
            help="Se preferisci essere chiamato."
            maxLength={LIMITS.telefono}
            autoComplete="tel"
            inputMode="tel"
          />
          <TextField
            id="altro"
            label="Vuoi aggiungere qualcosa?"
            multiline
            rows={3}
            value={values.altro}
            onChange={(value) => update("altro", value)}
            error={errors.altro}
            help="Una storia, un dettaglio, qualcosa che ti ha colpito del loro lavoro."
            maxLength={LIMITS.altro}
          />
        </fieldset>
      </div>

      {/* Honeypot: invisibile e fuori dalla navigazione da tastiera */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Non compilare questo campo</label>
        <input ref={honeypotRef} id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.submit}>
        <div className={styles.consent}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              id="consenso"
              name="consenso"
              checked={values.consenso}
              onChange={(event) => update("consenso", event.target.checked)}
              aria-required="true"
              aria-invalid={errors.consenso ? true : undefined}
              aria-describedby={errors.consenso ? "consenso-error" : undefined}
              className={styles.checkbox}
            />
            <span>
              Ho capito che le segnalazioni vengono valutate a fine trimestre e che Be Foundation segue fino a quattro
              associazioni all&apos;anno, quindi non tutte le proposte possono essere accolte.
              <Required />
            </span>
          </label>
          <ErrorMessage id="consenso-error" message={errors.consenso} />
        </div>

        <p className={styles.privacy}>
          Trattiamo i tuoi dati solo per gestire la segnalazione. <Link href="/privacy/">Leggi l&apos;informativa privacy.</Link>
        </p>

        <div className={styles.actions}>
          <button
            type="submit"
            className={buttonClassName("primary", "lg")}
            aria-disabled={submitting || undefined}
            aria-describedby="segnala-status"
          >
            Invia la segnalazione
          </button>
          <p id="segnala-status" className={styles.status} role="status">
            {submitting ? MESSAGES.sending : ""}
          </p>
        </div>

        <p className={styles.sendError} role="alert">
          {status === "error" ? MESSAGES.sendError : ""}
        </p>
      </div>
    </form>
  );
}
