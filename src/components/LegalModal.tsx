import { useEffect, useRef, type JSX } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function LegalModal({
  id,
  open,
  onClose,
  title,
  icon,
  children,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  title: string;
  icon: JSX.Element;
  children: JSX.Element;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const titleId = `${id}-title`;

  useEffect(() => {
    if (!open) return;
    // mémorise le focus précédent + lock du scroll
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const panel = panelRef.current!;
    const getFocusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
        )
      );

    // focus initial
    const firstFocusable = getFocusables()[0];
    (firstFocusable || panel).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const els = getFocusables();
        if (els.length === 0) {
          e.preventDefault();
          return;
        }
        const idx = els.indexOf(document.activeElement as HTMLElement);
        let next = idx;
        if (e.shiftKey) next = idx <= 0 ? els.length - 1 : idx - 1;
        else next = idx === els.length - 1 ? 0 : idx + 1;
        els[next].focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      // restaure le focus à l’élément déclencheur
      setTimeout(() => lastActiveRef.current?.focus(), 0);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <motion.div id={id} className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[900px] max-h-[90vh] overflow-y-auto outline-none"
        initial={{ y: 24, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="m-0 md:m-4 rounded-t-2xl md:rounded-2xl border border-white/10 bg-slate-950">
          <div className="sticky top-0 flex items-center justify-between gap-4 px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <h3 id={titleId} className="flex items-center gap-2 text-lg font-semibold">
              {icon} {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-white/10 hover:border-sky-400/50"
              aria-label="Fermer la fenêtre"
            >
              <X />
            </button>
          </div>
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
