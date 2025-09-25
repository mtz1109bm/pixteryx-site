import { useMemo, useState, useCallback } from "react";
import { brand } from "../brand";
import { Turnstile } from "../components/Turnstile";
import { ArrowRight, Calculator } from "lucide-react";
import { track } from "../lib/analytics";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

type Service = "ia-ml" | "vision" | "data-analytics" | "dev-web-mobile" | "signal" | "conseil-audit";
type Complexity = "low" | "med" | "high";
type Scope = "mvp" | "std" | "xl";
type Deadline = "flex" | "normal" | "rush";

const LABELS: Record<Service, string> = {
  "ia-ml": "IA & ML",
  "vision": "Vision par ordinateur",
  "data-analytics": "Data Analytics",
  "dev-web-mobile": "Dév. Web & Mobile",
  "signal": "Traitement du signal",
  "conseil-audit": "Conseil & Audit",
};

export default function Quote() {
  const [service, setService] = useState<Service>("ia-ml");
  const [complexity, setComplexity] = useState<Complexity>("med");
  const [scope, setScope] = useState<Scope>("std");
  const [deadline, setDeadline] = useState<Deadline>("normal");
  const [features, setFeatures] = useState<number>(6);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [token, setToken] = useState("");
  const handleToken = useCallback((t: string) => setToken(t), []); // ✅ stable (évite les re-renders du widget)

  const [widgetKey, setWidgetKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estimation simple (indicative)
  const { daysMin, daysMax, priceMin, priceMax } = useMemo(() => {
    const base: Record<Service, [number, number]> = {
      "ia-ml": [15, 35],
      "vision": [18, 40],
      "data-analytics": [10, 25],
      "dev-web-mobile": [12, 30],
      "signal": [12, 28],
      "conseil-audit": [5, 12],
    };
    let [dMin, dMax] = base[service];

    const scopeMul: Record<Scope, number> = { mvp: 0.7, std: 1, xl: 1.5 };
    dMin = Math.round(dMin * scopeMul[scope]);
    dMax = Math.round(dMax * scopeMul[scope]);

    const cxMul: Record<Complexity, number> = { low: 0.9, med: 1, high: 1.25 };
    dMin = Math.round(dMin * cxMul[complexity]);
    dMax = Math.round(dMax * cxMul[complexity]);

    const fMul = 1 + (features - 6) * 0.03; // ~0.88 à ~1.18
    dMin = Math.max(1, Math.round(dMin * fMul));
    dMax = Math.max(dMin, Math.round(dMax * fMul));

    const rushMul: Record<Deadline, number> = { flex: 0.95, normal: 1, rush: 1.2 };
    dMin = Math.round(dMin * rushMul[deadline]);
    dMax = Math.round(dMax * rushMul[deadline]);

    const rateMin = 550;
    const rateMax = 850;

    return {
      daysMin: dMin,
      daysMax: dMax,
      priceMin: dMin * rateMin,
      priceMax: dMax * rateMax,
    };
  }, [service, complexity, scope, deadline, features]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Votre nom est requis";
    const at = email.indexOf("@");
    const dot = email.lastIndexOf(".");
    if (!(at > 0 && dot > at + 1 && dot < email.length - 1)) e.email = "Adresse e-mail invalide";
    if (SITE_KEY && !token) e.token = "Vérification requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetCaptcha = () => setWidgetKey((k) => k + 1);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          notes,
          token,
          service,
          complexity,
          scope,
          deadline,
          features,
          estimate: { daysMin, daysMax, priceMin, priceMax },
        }),
      });
      if (res.ok) {
        setStatus("success");
        track("quote_request_submitted", { service, complexity, scope, deadline });
        setName("");
        setEmail("");
        setNotes("");
        setToken("");
        if (SITE_KEY) resetCaptcha(); // régénère le widget après succès
      } else {
        setStatus("error");
        if (SITE_KEY) {
          setToken("");
          resetCaptcha(); // régénère le widget si l’API échoue (évite "timeout-or-duplicate")
        }
      }
    } catch {
      setStatus("error");
      if (SITE_KEY) {
        setToken("");
        resetCaptcha();
      }
    }
  };

  const money = (v: number) => v.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen py-16`}>
      <title>Pixteryx — Devis rapide</title>
      <link rel="canonical" href="https://www.pixteryx.fr/devis-rapide" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3">
          <Calculator className="text-sky-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Devis rapide</h1>
        </div>
        <p className={`mt-2 ${brand.sub}`}>
          Obtenez une estimation indicative en 1 minute. Un expert vous recontacte pour affiner.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className={`rounded-2xl border border-white/10 p-6 ${brand.card} grid gap-4`}>
            <div className="grid gap-1">
              <label className="text-sm">Type de projet</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as Service)}
                className="px-3 py-2 rounded-xl bg-slate-800/60 border border-white/10"
              >
                {Object.keys(LABELS).map((k) => (
                  <option key={k} value={k}>
                    {LABELS[k as Service]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-sm">Complexité</label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "med", "high"] as Complexity[]).map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setComplexity(c)}
                    className={`px-3 py-2 rounded-xl border ${
                      complexity === c ? "border-sky-400/60 bg-sky-500/10" : "border-white/10"
                    }`}
                  >
                    {c === "low" ? "Simple" : c === "med" ? "Moyenne" : "Élevée"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm">Portée</label>
              <div className="grid grid-cols-3 gap-2">
                {(["mvp", "std", "xl"] as Scope[]).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setScope(s)}
                    className={`px-3 py-2 rounded-xl border ${
                      scope === s ? "border-sky-400/60 bg-sky-500/10" : "border-white/10"
                    }`}
                  >
                    {s === "mvp" ? "MVP" : s === "std" ? "Standard" : "Étendue"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm">Échéance</label>
              <div className="grid grid-cols-3 gap-2">
                {(["flex", "normal", "rush"] as Deadline[]).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDeadline(d)}
                    className={`px-3 py-2 rounded-xl border ${
                      deadline === d ? "border-sky-400/60 bg-sky-500/10" : "border-white/10"
                    }`}
                  >
                    {d === "flex" ? "Flexible" : d === "normal" ? "3–8 sem." : "Urgent"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm">Fonctionnalités clés : {features}</label>
              <input
                type="range"
                min={3}
                max={12}
                value={features}
                onChange={(e) => setFeatures(parseInt(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm">Nom</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`px-3 py-2 rounded-xl bg-slate-800/60 border ${
                  errors.name ? "border-red-500" : "border-white/10"
                }`}
                placeholder="Votre nom"
              />
              {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
            </div>

            <div className="grid gap-1">
              <label className="text-sm">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={`px-3 py-2 rounded-xl bg-slate-800/60 border ${
                  errors.email ? "border-red-500" : "border-white/10"
                }`}
                placeholder="vous@entreprise.com"
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            <div className="grid gap-1">
              <label className="text-sm">Notes (optionnel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="px-3 py-2 rounded-xl bg-slate-800/60 border border-white/10"
                placeholder="Contexte, objectifs, contraintes…"
              />
            </div>

            <div>
              <Turnstile siteKey={SITE_KEY} onToken={handleToken} keyProp={widgetKey} theme="dark" />
              {SITE_KEY && errors.token && <p className="text-sm text-red-400 mt-1">{errors.token}</p>}
            </div>

            <button
              disabled={status === "sending"}
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110 disabled:opacity-60"
            >
              {status === "sending" ? "Envoi…" : (
                <>
                  Demander un devis <ArrowRight size={18} />
                </>
              )}
            </button>

            {status === "success" && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
                Merci ! Nous revenons vers vous très vite avec un devis affiné.
              </div>
            )}
            {status === "error" && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                Une erreur s’est produite. Réessayez plus tard ou écrivez-nous à{" "}
                <a className="underline" href="mailto:contact@pixteryx.fr">
                  contact@pixteryx.fr
                </a>.
              </div>
            )}
          </form>

          {/* Résultat */}
          <div className="rounded-2xl border border-white/10 p-6 bg-slate-900/40 h-fit">
            <h3 className="text-xl font-semibold">Estimation indicative</h3>
            <p className={`mt-1 ${brand.sub}`}>Basée sur vos choix (pouvant varier après cadrage).</p>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>
                Jours homme estimés : <strong>{daysMin}–{daysMax} j</strong>
              </li>
              <li>
                Budget estimé : <strong>{money(priceMin)} – {money(priceMax)}</strong>
              </li>
              <li>
                Service : {LABELS[service]} — Complexité : {complexity === "low" ? "Simple" : complexity === "med" ? "Moyenne" : "Élevée"}
              </li>
              <li>
                Portée : {scope === "mvp" ? "MVP" : "Standard"}
                {scope === "xl" ? " Étendue" : ""} — Échéance : {deadline === "rush" ? "Urgent" : deadline === "flex" ? "Flexible" : "3–8 sem."}
              </li>
              <li>Fonctionnalités clés : {features}</li>
            </ul>
            <p className={`mt-4 text-sm ${brand.sub}`}>
              Le devis final tiendra compte des détails techniques, données disponibles, intégrations, et contraintes de production.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
