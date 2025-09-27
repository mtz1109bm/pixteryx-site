import { useEffect, useRef } from "react";

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
  siteKey?: string;                // doit être une string
  onToken?: (token: string) => void;
  keyProp?: number;                // change -> re-render
  theme?: "auto" | "light" | "dark";
  className?: string;
};

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
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
  const widRef = useRef<string | null>(null);
  const firstReRenderSkip = useRef(true);

  // 1) Render initial — UNE SEULE fois (quand siteKey string dispo)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!siteKey || typeof siteKey !== "string") return;
      await loadScript();
      if (cancelled || !ref.current || !window.turnstile) return;

      // purge le container avant tout render
      try { ref.current.innerHTML = ""; } catch {}

      const id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => onToken?.(token),
        "expired-callback": () => onToken?.(""),
        "error-callback": () => onToken?.("")
      });
      widRef.current = id;
    })();

    return () => {
      cancelled = true;
      if (ref.current && window.turnstile) {
        try { window.turnstile.remove(ref.current); } catch {}
      }
      widRef.current = null;
    };
  }, [siteKey, onToken, theme]);

  // 2) Re-render UNIQUEMENT quand keyProp change après le mount
  useEffect(() => {
    if (keyProp === undefined) return;
    if (firstReRenderSkip.current) { firstReRenderSkip.current = false; return; }

    (async () => {
      if (!siteKey || typeof siteKey !== "string") return;
      await loadScript();
      if (!ref.current || !window.turnstile) return;

      try {
        window.turnstile.remove(ref.current);
        ref.current.innerHTML = "";
      } catch {}

      const id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => onToken?.(token),
        "expired-callback": () => onToken?.(""),
        "error-callback": () => onToken?.("")
      });
      widRef.current = id;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyProp]);

  // Placeholder si pas de clé valide
  if (!siteKey || typeof siteKey !== "string") {
    return (
      <div className={className} style={{ opacity: 0.7, fontSize: 14 }}>
        (Turnstile désactivé — VITE_TURNSTILE_SITE_KEY manquant ou invalide)
      </div>
    );
  }

  return <div ref={ref} className={className} />;
}
