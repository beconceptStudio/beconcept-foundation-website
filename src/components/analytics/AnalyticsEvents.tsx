"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { EVENTS, track } from "@/lib/analytics";

/**
 * - page_view sulle navigazioni client (il primo lo invia il loader dopo il consenso);
 * - `segnala_click` su qualunque elemento con `data-track="segnala_click"`.
 */
export function AnalyticsEvents() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Lascia a Next il tempo di aggiornare il <title>.
    const id = window.setTimeout(() => {
      track("page_view", { page_location: window.location.href, page_title: document.title });
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(`[data-track="${EVENTS.segnalaClick}"]`);
      if (!target) return;
      track(EVENTS.segnalaClick, { posizione: target.dataset.trackPosizione, pagina: window.location.pathname });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
