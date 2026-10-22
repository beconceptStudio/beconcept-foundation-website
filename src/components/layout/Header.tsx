"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClassName } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { NAV_ITEMS, SEGNALA_HREF, SEGNALA_LABEL, SITE_DESCRIPTOR } from "@/lib/site";
import styles from "./Header.module.css";

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Chiude il menu a ogni cambio di pagina.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current || !toggleRef.current) return;
      // Focus intrappolato tra il bottone di chiusura e le voci del menu.
      const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const segnalaActive = isActive(pathname, SEGNALA_HREF);

  return (
    <header className={styles.header} data-tone="light">
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Be Foundation, un progetto Beconcept: vai alla Home">
          <Logo />
          <span className={styles.descriptor} aria-hidden="true">
            {SITE_DESCRIPTOR}
          </span>
        </Link>

        <nav aria-label="Principale" className={styles.desktopNav}>
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={SEGNALA_HREF}
            className={buttonClassName("outline", "sm", styles.cta)}
            aria-current={segnalaActive ? "page" : undefined}
            data-track="segnala_click"
            data-track-posizione="header"
          >
            {SEGNALA_LABEL}
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.toggleLabel}>{open ? "Chiudi" : "Menu"}</span>
          <span className={styles.toggleIcon} data-open={open} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        id="menu-mobile"
        ref={panelRef}
        className={styles.panel}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <nav aria-label="Principale (mobile)">
          <ul className={styles.panelList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.panelLink}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={() => close()}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={SEGNALA_HREF}
            className={buttonClassName("primary", "lg", styles.panelCta)}
            aria-current={segnalaActive ? "page" : undefined}
            data-track="segnala_click"
            data-track-posizione="menu-mobile"
            onClick={() => close()}
          >
            {SEGNALA_LABEL}
          </Link>
        </nav>
      </div>
    </header>
  );
}
