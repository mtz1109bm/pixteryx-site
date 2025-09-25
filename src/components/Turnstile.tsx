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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onToken("");
    if (!siteKey) return; // ✅ pas de clé -> pas de widget et PAS de message
    const el = ref.current!;
    const render = () => {
      if (!window.turnstile) return;
      window.turnstile.render(el, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => onToken(token),
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
    return () => { el.innerHTML = ""; };
  }, [siteKey, onToken, keyProp, theme]);

  if (!siteKey) return null; // ✅ silence total

  return <div ref={ref} className="cf-turnstile" />;
}
