import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string;
      reset: (idOrEl?: string | HTMLElement) => void;
      remove: (idOrEl?: string | HTMLElement) => void;
      getResponse?: (id?: string) => string | null;
    };
    __turnstileReady?: Promise<void>;
  }
}

type Props = {
  siteKey?: string;                // string attendue par l’API
  onToken?: (token: string) => void;
  keyProp?: number;                // change pour forcer un reset/rerender
  theme?: "auto" | "light" | "dark";
  className?: string;
};

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (window.__turnstileReady) return window.__turnstileReady;

  window.__turnstileReady = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(s);
  });
  return window.__turnstileReady;
}

export function Turnstile({ siteKey, onToken, keyProp, theme = "auto", className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);

  // 1) Mount: load script + initial render
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!siteKey || typeof siteKey !== "string") return; // ne tente pas si pas de clé
      await loadScript();
      if (cancelled || !ref.current || !window.turnstile) return;

      // Sécurité: si un rendu existe déjà dans ce container, on le purge
      try { ref.current.innerHTML = ""; } catch {}

      const id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => onToken?.(token),
        "expired-callback": () => onToken?.(""),
        "error-callback": () => onToken?.("")
      });
      setWidgetId(id);
    })();
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try { window.turnstile.remove(widgetId); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]); // render initial quand la clé est dispo

  // 2) Reset/re-render quand keyProp change
  useEffect(() => {
    (async () => {
      if (!siteKey || typeof siteKey !== "string") return;
      await loadScript();
      if (!ref.current || !window.turnstile) return;

      // Supprimer l’ancien widget s’il existe, puis re-render propre
      try {
        if (widgetId) window.turnstile.remove(widgetId);
        ref.current.innerHTML = "";
      } catch {}
      const id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => onToken?.(token),
        "expired-callback": () => onToken?.(""),
        "error-callback": () => onToken?.("")
      });
      setWidgetId(id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyProp]); // uniquement quand on veut régénérer

  // Placeholder si pas de clé (dev/local désactivé)
  if (!siteKey || typeof siteKey !== "string") {
    return (
      <div className={className} style={{ opacity: 0.7, fontSize: 14 }}>
        (Turnstile désactivé — VITE_TURNSTILE_SITE_KEY manquant)
      </div>
    );
  }

  return <div ref={ref} className={className} />;
}
