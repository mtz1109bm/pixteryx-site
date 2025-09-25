import { useEffect, useRef } from "react";

declare global { interface Window { turnstile?: any } }

export function Turnstile({
  siteKey,
  onToken,
  keyProp,
  theme = "dark",
}: {
  siteKey?: string;
  onToken: (t: string) => void;
  keyProp: number;
  theme?: "dark" | "light" | "auto";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  // Anti double-montage de React.StrictMode en dev (évite un 2e render identique)
  const lastKeyRef = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey) return;              // pas de widget si pas de clé
    if (import.meta.env.DEV && lastKeyRef.current === keyProp) {
      // StrictMode appelle l'effet 2x avec les mêmes deps : on saute le doublon
      return;
    }
    lastKeyRef.current = keyProp;

    onTokenRef.current("");            // reset token à chaque (re)montage voulu
    const el = containerRef.current!;
    el.innerHTML = "";                 // clean avant render

    const render = () => {
      if (!window.turnstile) return;
      window.turnstile.render(el, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => onTokenRef.current(token),
        "refresh-expired": "auto",
      });
    };

    if (!window.turnstile) {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      render();
    }

    return () => {
      try {
        // @ts-ignore
        if (window.turnstile && el?.firstChild) window.turnstile.remove(el.firstChild);
      } catch {}
      el.innerHTML = "";
    };
    // ⛔ ne PAS dépendre de onToken (on passe par un ref)
  }, [siteKey, keyProp, theme]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="cf-turnstile" />;
}
