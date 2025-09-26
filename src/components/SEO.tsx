
// src/components/SEO.tsx
import { useEffect } from "react";

type Props = {
  title?: string;
  description?: string;
  canonical?: string;
  jsonLd?: object;     // optionnel
  imageUrl?: string;   // OG image (sinon fallback /og-default.png)
};

export function SEO({ title, description, canonical, jsonLd, imageUrl }: Props) {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Helpers typés
    const ensureMetaByName = (name: string): HTMLMetaElement => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      return el;
    };

    const ensureMetaByProp = (property: string): HTMLMetaElement => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      return el;
    };

    const ensureCanonical = (): HTMLLinkElement => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      return link;
    };

    // Description
    if (description) {
      const m = ensureMetaByName("description");
      m.content = description;
    }

    // Canonical
    if (canonical) {
      const link = ensureCanonical();
      link.href = canonical;
    }

    // Open Graph / Twitter
    const url = canonical || window.location.href;
    const ogTitle = title || "Pixteryx — Data, IA, Vision & Développement";
    const ogDesc =
      description ||
      "Solutions modernes en data, IA, vision par ordinateur et développement web/mobile.";
    const ogImg = imageUrl || `${window.location.origin}/og-default.png`;

    ensureMetaByProp("og:type").content = "website";
    ensureMetaByProp("og:url").content = url;
    ensureMetaByProp("og:title").content = ogTitle;
    ensureMetaByProp("og:description").content = ogDesc;
    ensureMetaByProp("og:image").content = ogImg;

    ensureMetaByName("twitter:card").content = "summary_large_image";
    ensureMetaByName("twitter:title").content = ogTitle;
    ensureMetaByName("twitter:description").content = ogDesc;
    ensureMetaByName("twitter:image").content = ogImg;

    // JSON-LD (⚠️ caster en HTMLScriptElement)
    let scriptEl = document.getElementById("jsonld") as HTMLScriptElement | null;

    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "jsonld";
        scriptEl.type = "application/ld+json"; // <-- propriété de HTMLScriptElement
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonical, jsonLd, imageUrl]);

  return null;
}
