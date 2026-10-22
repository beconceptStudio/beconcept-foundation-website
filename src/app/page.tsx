import { ImageSlot } from "@/components/ui/ImageSlot";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { NumberedColumns, StepList } from "@/components/ui/StepList";
import { Section, Split } from "@/components/layout/Section";
import { ProjectCard } from "@/components/progetti/ProjectCard";
import { ProjectsEmpty } from "@/components/progetti/ProjectsEmpty";
import { getPublishedProgetti } from "@/lib/progetti";
import { BECONCEPT_URL, SEGNALA_HREF, SEGNALA_LABEL } from "@/lib/site";
import styles from "./page.module.css";

const SERVIZI = [
  {
    title: "Strategia e messaggio",
    text: "Capire cosa raccontare, a chi e cosa chiedere. Perché chi incontra l'associazione capisca in pochi secondi perché vale la pena sostenerla.",
  },
  {
    title: "Siti e strumenti digitali",
    text: "Un sito chiaro, accessibile e semplice da aggiornare, con percorsi facili per informarsi, donare, fare volontariato o mettersi in contatto.",
  },
  {
    title: "Contenuti, immagini e social",
    text: "Testi, fotografie, video e contenuti che raccontano le persone e il lavoro di ogni giorno, e ne rendono visibile il valore.",
  },
];

const PASSI = [
  { title: "Ci segnali un'associazione", text: "La tua, o una che conosci e stimi. Il modulo è sempre aperto." },
  {
    title: "La scegliamo",
    text: "A fine trimestre valutiamo le proposte e scegliamo dove possiamo fare più differenza.",
  },
  {
    title: "Definiamo insieme l'obiettivo",
    text: "Ascoltiamo chi vive l'associazione ogni giorno e concordiamo cosa realizzare, con tempi sostenibili per tutti.",
  },
  {
    title: "Ci mettiamo al lavoro",
    text: "Gratuitamente, con gli standard di Beconcept. E lasciamo strumenti che l'associazione potrà continuare a usare.",
  },
];

const HOME_PREVIEW_MAX = 3;

export default function HomePage() {
  const progetti = getPublishedProgetti().slice(0, HOME_PREVIEW_MAX);

  return (
    <>
      {/* 5.1 Apertura */}
      <section id="hero" className={styles.hero} aria-labelledby="hero-title">
        <Heading as="h1" size="h1" id="hero-title" primary="Aiutiamo" secondary="chi aiuta." breakLine />
        <div className={styles.heroBottom}>
          <a href="#perche" className={styles.scroll} data-reveal="up">
            <span className={styles.scrollCircle} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3v14" />
                <path d="M4 11l6 6 6-6" />
              </svg>
            </span>
            Scorri il racconto
          </a>
          <div className={styles.heroCopy}>
            <p className={styles.lead} data-reveal="up">
              Il team di Beconcept sceglie fino a quattro associazioni non profit all&apos;anno e mette al loro servizio
              strategia, design e comunicazione digitale. Gratuitamente, con la stessa cura che dedichiamo ai nostri
              clienti.
            </p>
            <div className={styles.heroActions} data-reveal="up">
              <ButtonLink href="#perche">Scopri il progetto</ButtonLink>
              <TextLink href={SEGNALA_HREF} arrow={false} trackSegnala="hero">
                Conosci un&apos;associazione? Segnalacela
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.heroImages}>
        <ImageSlot placeholder="Foto autentica · persone al lavoro" ratio="4/5" sizes="(max-width: 720px) 100vw, 33vw" />
        <ImageSlot
          placeholder="Foto autentica · una sede, un gesto"
          ratio="4/5"
          shade="dark"
          className={styles.heroImageOffset}
          sizes="(max-width: 720px) 100vw, 33vw"
        />
        <ImageSlot placeholder="Foto autentica · volontari" ratio="4/5" sizes="(max-width: 720px) 100vw, 33vw" />
      </div>

      {/* 5.2 Perché esiste */}
      <section id="perche" className={styles.perche} aria-labelledby="perche-title">
        <div className={styles.container}>
          <Split label={<SectionLabel>Perché esiste</SectionLabel>}>
            <Heading id="perche-title" primary="C'è tanto bene" secondary="che nessuno vede." className={styles.h2Spaced} />
            <div className={styles.narrative} data-reveal="up">
              <p>
                Ci sono associazioni che ogni giorno accompagnano famiglie, stanno accanto a chi è fragile, proteggono
                animali e territori, tengono unite le comunità. Lo fanno con poche risorse e moltissima dedizione.
              </p>
              <p>
                Spesso il loro lavoro lo conosce solo chi lo incontra da vicino. Non perché valga meno, ma perché tempo
                ed energie vanno, giustamente, alle persone di cui si prendono cura. E la comunicazione resta indietro.
              </p>
              <p>
                Così chi potrebbe dare una mano, un donatore, un volontario, un&apos;azienda, non sa che esistono, cosa
                fanno o di cosa hanno bisogno.
              </p>
            </div>
          </Split>
          <Heading
            as="p"
            size="display"
            weight="medium"
            primary="Be Foundation nasce per"
            secondary="accorciare questa distanza."
            mutedFirst
            className={styles.manifesto}
          />
        </div>
      </section>

      {/* 5.3 Cosa facciamo */}
      <Section id="cosa-facciamo" tone="dark" labelledBy="cosa-title">
        <Split label={<SectionLabel>Cosa facciamo</SectionLabel>} className={styles.splitSpaced}>
          <Heading
            id="cosa-title"
            primary="Facciamo del bene"
            secondary="con quello che sappiamo fare meglio."
            className={styles.h2Intro}
          />
          <p className={styles.intro} data-reveal="up">
            Il nostro mestiere è aiutare le idee a farsi capire e a raggiungere le persone giuste. Con Be Foundation lo
            mettiamo a disposizione di chi lavora per gli altri.
          </p>
        </Split>
        <NumberedColumns items={SERVIZI} />
        <p className={styles.closing} data-reveal="up">
          Ogni associazione parte da un punto diverso. Per questo non abbiamo pacchetti: scegliamo insieme ciò che serve
          davvero.
        </p>
      </Section>

      {/* 5.4 Come funziona (anteprima) */}
      <Section id="come-funziona" labelledBy="come-title">
        <Split label={<SectionLabel>Come funziona</SectionLabel>} className={styles.splitSpacedLg}>
          <Heading
            id="come-title"
            primary="Fino a quattro associazioni all'anno."
            secondary="Seguite da vicino."
            className={styles.h2Intro}
          />
          <p className={styles.intro} data-reveal="up">
            Abbiamo scelto di fare poche cose e di farle bene. Ogni progetto riceve tempo, attenzione e un team dedicato.
          </p>
        </Split>
        <StepList steps={PASSI} />
        <div className={styles.afterList} data-reveal="up">
          <TextLink href="/come-funziona/">Scopri come funziona</TextLink>
        </div>
      </Section>

      {/* 5.5 Progetti (anteprima) */}
      <Section id="progetti" ruled labelledBy="progetti-title">
        <Split label={<SectionLabel>Progetti</SectionLabel>} wide>
          {progetti.length > 0 ? (
            <>
              <Heading
                id="progetti-title"
                primary="Le prime associazioni"
                secondary="che affianchiamo."
                className={styles.h2Spaced}
              />
              <ul className={styles.cards} data-reveal="stagger">
                {progetti.map((progetto) => (
                  <li key={progetto.slug}>
                    <ProjectCard progetto={progetto} variant="preview" />
                  </li>
                ))}
              </ul>
              <div className={styles.afterList} data-reveal="up">
                <TextLink href="/progetti/">Guarda i progetti</TextLink>
              </div>
            </>
          ) : (
            <ProjectsEmpty
              headingId="progetti-title"
              text="Presto racconteremo qui le associazioni che stiamo affiancando: il loro lavoro, da dove siamo partiti e cosa abbiamo costruito insieme."
            />
          )}
        </Split>
      </Section>

      {/* 5.6 Chi c'è dietro */}
      <Section id="beconcept" tone="surface" labelledBy="beconcept-title">
        <div className={styles.media}>
          <ImageSlot
            placeholder="Foto team Beconcept"
            ratio="4/3"
            shade="dark"
            className={styles.mediaImage}
            sizes="(max-width: 960px) 100vw, 50vw"
          />
          <div className={styles.mediaCopy}>
            <SectionLabel className={styles.labelSpaced}>Chi c&apos;è dietro</SectionLabel>
            <Heading
              id="beconcept-title"
              primary="Dietro Be Foundation"
              secondary="c'è Beconcept."
              className={styles.h2Media}
            />
            <div className={styles.mediaText} data-reveal="up">
              <p>
                Beconcept è un&apos;agenzia creativa di Mantova. Ogni giorno affianchiamo aziende e persone nel dare
                forma alle loro idee, comunicarle e farle crescere, unendo strategia, design e sviluppo digitale.
              </p>
              <p>
                Be Foundation è il modo in cui restituiamo una parte di questo lavoro. Crediamo che le competenze
                abbiano più valore quando vengono condivise. E lavorare a progetti come questi ci ricorda, ogni volta,
                perché abbiamo scelto questo mestiere.
              </p>
            </div>
            <div className={styles.mediaLink} data-reveal="up">
              <TextLink href={BECONCEPT_URL} external>
                Conosci Beconcept
              </TextLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 5.7 Invito finale */}
      <Section id="segnala" tone="dark" spacing="none" labelledBy="segnala-title" innerClassName={styles.invite}>
        <Heading
          id="segnala-title"
          size="display"
          primary="Conosci un'associazione"
          secondary="che merita di essere conosciuta?"
          className={styles.inviteTitle}
        />
        <div className={styles.inviteRow}>
          <p className={styles.inviteText} data-reveal="up">
            Puoi farne parte, sostenerla o averne visto il lavoro da vicino. Raccontacela: bastano pochi minuti e non
            serve avere già un progetto in mente.
          </p>
          <div className={styles.inviteAction} data-reveal="up">
            <ButtonLink href={SEGNALA_HREF} size="lg" trackSegnala="home-finale">
              {SEGNALA_LABEL}
            </ButtonLink>
            <p className={styles.inviteNote}>
              Valutiamo tutte le proposte a fine trimestre e ricontattiamo chi le ha inviate quando possiamo dare un
              contributo concreto.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
