import type { Metadata } from "next";
import { Section, Split } from "@/components/layout/Section";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { NumberedColumns, PrincipleList, StepList } from "@/components/ui/StepList";
import { pageMetadata } from "@/lib/seo";
import { SEGNALA_HREF, SEGNALA_LABEL } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata("comeFunziona");

const PERCORSO = [
  {
    title: "La segnalazione",
    text: "Chiunque può proporre un'associazione: chi ne fa parte o chi ne conosce e stima il lavoro. Il modulo è aperto tutto l'anno e non serve avere un progetto già definito.",
  },
  {
    title: "La scelta",
    text: "A fine trimestre Ivan e Andrea leggono tutte le proposte e scelgono se e quale progetto avviare. Se una proposta ci sembra adatta, contattiamo chi l'ha inviata per conoscere meglio l'associazione.",
  },
  {
    title: "L'ascolto",
    text: "Incontriamo chi vive l'associazione ogni giorno. Capiamo cosa fa, chi vorrebbe raggiungere e cosa oggi fatica a raccontare. Poi concordiamo insieme obiettivi, attività e tempi.",
  },
  {
    title: "Il lavoro e la consegna",
    text: "Realizziamo ciò che abbiamo concordato con gli stessi standard dei progetti per i nostri clienti. Alla fine consegniamo materiali e indicazioni perché l'associazione possa continuare a usarli in autonomia.",
  },
];

const CRITERI = [
  {
    title: "L'impatto",
    text: "Le persone, gli animali, i luoghi e le comunità che beneficiano del lavoro dell'associazione.",
  },
  { title: "L'urgenza", text: "Quanto conta intervenire adesso, per l'associazione e per chi aiuta." },
  {
    title: "La differenza che possiamo fare",
    text: "Dove una comunicazione migliore può davvero cambiare qualcosa.",
  },
  {
    title: "Le condizioni per lavorare bene",
    text: "Un referente disponibile, materiali a cui attingere e tempi realistici.",
  },
];

const PRINCIPI = [
  { title: "Capire prima di proporre", text: "Ascoltiamo chi vive l'associazione prima di decidere cosa fare." },
  { title: "La stessa qualità", text: "Gratuito non vuol dire minore: lavoriamo con gli standard di sempre." },
  { title: "Rispetto del tempo di tutti", text: "Concordiamo attività sostenibili per noi e per l'associazione." },
  { title: "Parlare chiaro", text: "Diciamo cosa possiamo fare, cosa no, e raccontiamo solo risultati reali." },
  {
    title: "Lasciare qualcosa che resta",
    text: "Strumenti che l'associazione potrà usare ogni giorno, anche dopo di noi.",
  },
];

const FAQ = [
  {
    question: "Chi può segnalare un'associazione?",
    answer:
      "Chiunque. Puoi proporre la realtà di cui fai parte oppure segnalarne una che conosci. In questa fase ci rivolgiamo a organizzazioni non profit attive in Italia.",
  },
  {
    question: "Serve avere un progetto già definito?",
    answer: "No. Basta raccontarci cosa fa l'associazione e cosa oggi fatica a comunicare. Al resto pensiamo insieme.",
  },
  {
    question: "Posso segnalare un'associazione senza conoscerne i referenti?",
    answer:
      "Sì. Raccontaci quello che sai e lasciaci un tuo recapito. La segnalazione non impegna l'associazione: prima di iniziare qualsiasi lavoro parliamo direttamente con lei.",
  },
  {
    question: "Quando saprò qualcosa?",
    answer:
      "Dopo l'invio ricevi subito un'email di conferma. Valutiamo le proposte a fine trimestre e ti ricontattiamo se possiamo dare un contributo.",
  },
  {
    question: "Segnalare significa essere scelti?",
    answer:
      "No. Seguiamo fino a quattro associazioni all'anno, quindi dobbiamo scegliere. Ogni proposta però viene letta con attenzione, e anche il primo confronto serve a capire insieme se e come possiamo essere utili.",
  },
  {
    question: "È davvero tutto gratuito?",
    answer:
      "Il lavoro del nostro team sì, sempre. Eventuali costi esterni, come dominio, hosting o pubblicità, li chiariamo prima di iniziare.",
  },
  {
    question: "Cosa chiedete all'associazione scelta?",
    answer:
      "Un referente con cui confrontarci, i materiali che avete e un po' del vostro tempo per raccontarci il vostro lavoro. L'impegno lo concordiamo prima di partire, tenendo conto di tutto quello che già fate.",
  },
  {
    question: "Quanto dura un progetto? E dopo?",
    answer:
      "Dipende da cosa decidiamo di realizzare. Alla fine consegniamo materiali e indicazioni per usarli in autonomia. Un eventuale supporto successivo si concorda a parte.",
  },
  {
    question: "Posso segnalare più di un'associazione?",
    answer: "Certo, con una segnalazione per ciascuna.",
  },
];

export default function ComeFunzionaPage() {
  return (
    <>
      {/* 6.1 Apertura */}
      <Section spacing="hero" labelledBy="cf-title">
        <SectionLabel className={styles.heroLabel}>Come funziona</SectionLabel>
        <Heading
          as="h1"
          size="h1"
          id="cf-title"
          primary="Prima ascoltiamo."
          secondary="Poi ci mettiamo al lavoro."
          className={styles.heroTitle}
        />
        <p className={styles.lead} data-reveal="up">
          Ogni associazione ha una storia, un pubblico e un bisogno diversi. Il nostro metodo parte da lì, non da un
          pacchetto di servizi.
        </p>
      </Section>

      {/* 6.2 Da dove nasce l'idea */}
      <Section tone="surface" labelledBy="idea-title">
        <div className={styles.media}>
          <ImageSlot
            placeholder="Ritratto Ivan e Andrea"
            ratio="4/3"
            shade="dark"
            className={styles.mediaImage}
            sizes="(max-width: 960px) 100vw, 50vw"
          />
          <div className={styles.mediaCopy}>
            <SectionLabel className={styles.labelSpaced}>Da dove nasce l&apos;idea</SectionLabel>
            <Heading id="idea-title" primary="Un'idea nata" secondary="dentro Beconcept." className={styles.h2Media} />
            <div className={styles.mediaText} data-reveal="up">
              <p>
                Be Foundation nasce da un&apos;idea di Ivan, fondatore di Beconcept: usare quello che sappiamo fare
                meglio per aiutare chi, ogni giorno, si prende cura degli altri.
              </p>
              <p>
                Andrea l&apos;ha accolta e fatta sua fin dal primo momento. Insieme l&apos;hanno trasformata in un
                impegno concreto, che oggi coinvolge tutto il team.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 6.3 Il percorso */}
      <Section labelledBy="percorso-title">
        <Split label={<SectionLabel>Il percorso</SectionLabel>} className={styles.splitSpaced}>
          <Heading id="percorso-title" primary="Dalla segnalazione" secondary="al lavoro insieme." />
        </Split>
        <StepList steps={PERCORSO} minColumn="260" />
      </Section>

      {/* 6.4 Come scegliamo */}
      <Section id="come-scegliamo" tone="dark" labelledBy="scelta-title">
        <Split label={<SectionLabel>Come scegliamo</SectionLabel>} className={styles.splitSpaced}>
          <Heading id="scelta-title" primary="Cosa guardiamo" secondary="quando scegliamo." />
        </Split>
        <NumberedColumns items={CRITERI} minColumn="260" />
        <div className={styles.criteriaText} data-reveal="up">
          <p>
            Non è una gara né una votazione: il numero di segnalazioni ricevute per la stessa associazione non conta.
            Conta quanto possiamo esserle utili.
          </p>
          <p>
            Seguiamo fino a quattro associazioni all&apos;anno: per questo non possiamo accogliere tutte le proposte.
            Ognuna però viene letta con attenzione, e se possiamo dare un contributo ti ricontattiamo.
          </p>
        </div>
      </Section>

      {/* 6.5 Cosa è gratuito · 6.6 A chi ci rivolgiamo */}
      <Section>
        <div className={styles.twoColumns}>
          <section aria-labelledby="gratuito-title">
            <SectionLabel className={styles.labelSpaced}>Cosa è gratuito</SectionLabel>
            <Heading
              id="gratuito-title"
              primary="Il nostro lavoro è gratuito."
              secondary="Sempre."
              className={styles.h2Column}
            />
            <p className={styles.columnText} data-reveal="up">
              Strategia, design, sviluppo e contenuti realizzati dal team di Beconcept sono offerti pro bono. Eventuali
              costi di servizi esterni, come dominio, hosting, licenze o pubblicità, li chiariamo insieme prima di
              iniziare. Così non ci sono sorprese.
            </p>
          </section>
          <section aria-labelledby="destinatari-title">
            <SectionLabel className={styles.labelSpaced}>A chi ci rivolgiamo</SectionLabel>
            <Heading id="destinatari-title" primary="A chi" secondary="ci rivolgiamo." className={styles.h2Column} />
            <div className={styles.columnText} data-reveal="up">
              <p>
                Associazioni, fondazioni, enti del Terzo settore e realtà di volontariato attive in Italia, che lavorano
                per le persone, gli animali, l&apos;ambiente o le comunità.
              </p>
              <p>E che hanno voglia di mettersi in gioco: un progetto funziona quando lo costruiamo insieme.</p>
            </div>
          </section>
        </div>
      </Section>

      {/* 6.7 I nostri principi */}
      <Section tone="surface" labelledBy="principi-title">
        <Split label={<SectionLabel>I nostri principi</SectionLabel>} className={styles.splitSpacedSm}>
          <Heading id="principi-title" primary="Come vogliamo" secondary="lavorare." />
        </Split>
        <PrincipleList items={PRINCIPI} />
      </Section>

      {/* 6.8 Domande frequenti */}
      <Section id="faq" labelledBy="faq-title">
        <div className={styles.faq}>
          <div className={styles.faqIntro}>
            <SectionLabel className={styles.labelSpaced}>FAQ</SectionLabel>
            <Heading id="faq-title" primary="Domande" secondary="frequenti" />
          </div>
          <div className={styles.faqList}>
            <Accordion items={FAQ} />
          </div>
        </div>
      </Section>

      {/* 6.9 Chiusura */}
      <Section tone="dark" labelledBy="chiusura-title">
        <div className={styles.closing} data-reveal="up">
          <Heading id="chiusura-title" primary="Hai in mente" secondary="un'associazione?" />
          <ButtonLink href={SEGNALA_HREF} size="lg" trackSegnala="come-funziona-finale">
            {SEGNALA_LABEL}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
