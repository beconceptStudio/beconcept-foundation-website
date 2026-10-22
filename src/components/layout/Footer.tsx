import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { iubendaConfigured } from "@/lib/consent";
import { BECONCEPT_URL, LEGAL, NAV_ITEMS, SEGNALA_HREF, SEGNALA_LABEL, SITE_DESCRIPTOR } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} data-tone="dark">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.descriptor}>{SITE_DESCRIPTOR}</p>
          <p className={styles.payoff}>
            Aiutiamo le associazioni non profit a raccontare il proprio lavoro e a raggiungere chi può sostenerle. Con
            le competenze di Beconcept, gratuitamente.
          </p>
        </div>

        <nav aria-label="Footer" className={styles.column}>
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={SEGNALA_HREF}
                className={styles.link}
                data-track="segnala_click"
                data-track-posizione="footer"
              >
                {SEGNALA_LABEL}
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.column}>
          <ul className={styles.list}>
            <li>
              <a href={BECONCEPT_URL} className={styles.link} target="_blank" rel="noopener">
                Conosci Beconcept <span aria-hidden="true">↗</span>
                <span className="visually-hidden"> (si apre in una nuova scheda)</span>
              </a>
            </li>
            <li className={styles.inline}>
              <Link href="/privacy/" className={styles.link}>
                Privacy
              </Link>
              <span aria-hidden="true"> · </span>
              <Link href="/cookie/" className={styles.link}>
                Cookie
              </Link>
              {iubendaConfigured ? (
                <>
                  <span aria-hidden="true"> · </span>
                  <a href="#" className={`${styles.link} iubenda-cs-preferences-link`}>
                    Preferenze cookie
                  </a>
                </>
              ) : null}
            </li>
          </ul>
          <p className={styles.legal}>
            © {year} {LEGAL.ragioneSociale} · P.IVA {LEGAL.piva} · {LEGAL.sede}
          </p>
        </div>
      </div>
    </footer>
  );
}
