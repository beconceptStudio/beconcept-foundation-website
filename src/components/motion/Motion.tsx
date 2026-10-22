"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, type ReactNode } from "react";
import { MOTION, MOTION_CLASS } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Effetti d'entrata sobri, ispirati a lamalama.com: elementi marcati con `data-reveal` nel contenuto della pagina.
 *
 * - `lines`: il testo entra riga per riga, salendo da sotto una maschera (titoli);
 * - `up`: dissolvenza con una breve salita (etichette, paragrafi, CTA);
 * - `stagger`: come `up`, sui figli diretti uno dopo l'altro (card, step, FAQ);
 * - `image`: il riquadro si scopre dal basso.
 *
 * Gli elementi che entrano insieme nello schermo partono in sequenza (ScrollTrigger.batch),
 * così l'hero si compone da solo al caricamento senza schermate introduttive.
 * Con prefers-reduced-motion non succede nulla: lo script in <head> non aggiunge la classe `motion`.
 */
export function Motion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scope.current;
    if (!container || !document.documentElement.classList.contains(MOTION_CLASS)) return;

    // Il setup è asincrono (attende i font): tutto ciò che crea va registrato qui per poterlo annullare.
    // In sviluppo React esegue l'effetto due volte: senza questa pulizia ogni elemento verrebbe animato due volte.
    let cancelled = false;
    const ctx = gsap.context(() => {}, container);
    const splits: SplitText[] = [];
    let triggers: ScrollTrigger[] = [];

    function reveal(el: HTMLElement, delay: number) {
      // Un elemento si anima una sola volta.
      if (el.dataset.revealed) return;
      // Toglie il "nascosto" del CSS; gli stati iniziali di gsap.from sono applicati nello stesso frame.
      el.dataset.revealed = "true";
      const type = el.dataset.reveal;

      ctx.add(() => {
        if (type === "lines") {
          const split = SplitText.create(el, { type: "lines", linesClass: "reveal-line", aria: "auto" });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: MOTION.lineOffset,
            autoAlpha: 0,
            clipPath: "inset(-10% -10% 110% -10%)",
            duration: MOTION.duration,
            ease: MOTION.ease,
            stagger: MOTION.lineStagger,
            delay,
            // Finita l'entrata le righe non servono più: il testo torna a fluire liberamente al resize.
            onComplete: () => split.revert(),
          });
          return;
        }

        if (type === "image") {
          gsap.from(el, {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: MOTION.imageDuration,
            ease: MOTION.ease,
            delay,
            clearProps: "clipPath",
          });
          return;
        }

        gsap.from(type === "stagger" ? Array.from(el.children) : el, {
          y: MOTION.offset,
          autoAlpha: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: MOTION.itemStagger,
          delay,
          clearProps: "transform,opacity,visibility",
        });
      });
    }

    // Le righe vanno calcolate con il font definitivo.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const elements = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-revealed])", container);
      // Elementi già sopra lo schermo (es. arrivo su un'ancora): visibili subito, senza animazione.
      const pending = elements.filter((el) => {
        if (el.getBoundingClientRect().bottom > 0) return true;
        el.dataset.revealed = "true";
        return false;
      });
      triggers = ScrollTrigger.batch(pending, {
        start: MOTION.start,
        once: true,
        onEnter: (batch) => batch.forEach((el, index) => reveal(el as HTMLElement, index * MOTION.batchStagger)),
      });
      (window as Window & { __bfMotionReady?: boolean }).__bfMotionReady = true;
    });

    return () => {
      cancelled = true;
      triggers.forEach((trigger) => trigger.kill());
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return <div ref={scope}>{children}</div>;
}
