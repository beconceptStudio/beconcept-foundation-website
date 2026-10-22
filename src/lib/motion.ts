// Parametri delle animazioni d'entrata (componente Motion). Valori misurati su lamalama.com e resi più sobri.
export const MOTION = {
  duration: 0.9,
  imageDuration: 1.2,
  ease: "expo.out",
  /** Spostamento delle righe dei titoli, in % della loro altezza. */
  lineOffset: 80,
  lineStagger: 0.08,
  /** Salita di paragrafi e blocchi, in px. */
  offset: 24,
  itemStagger: 0.08,
  /** Sfalsamento tra elementi che entrano nello schermo insieme. */
  batchStagger: 0.1,
  start: "top 88%",
} as const;

export const MOTION_CLASS = "motion";

/**
 * Eseguito in <head> prima del primo paint: se l'utente non ha chiesto movimento ridotto,
 * aggiunge la classe che nasconde gli elementi `data-reveal` finché GSAP non li anima.
 * Se per qualsiasi motivo GSAP non parte entro 3 secondi, la classe viene tolta e tutto resta visibile.
 */
export const motionBootstrapScript = `
(function () {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var root = document.documentElement;
    root.classList.add('${MOTION_CLASS}');
    setTimeout(function () { if (!window.__bfMotionReady) root.classList.remove('${MOTION_CLASS}'); }, 3000);
  } catch (e) {}
})();
`;
