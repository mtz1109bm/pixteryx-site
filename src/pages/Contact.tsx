import { useEffect, useState, useCallback } from "react";
import { brand } from "../brand";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Turnstile } from "../components/Turnstile";
import { track } from "../lib/analytics";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

export default function Contact({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Turnstile
  const [tsToken, setTsToken] = useState("");
  const [widgetKey, setWidgetKey] = useState(0); // change to re-render widget (volontaire)
  const handleTsToken = useCallback((t: string) => setTsToken(t), []); // ✅ stable (évite les re-renders du widget)

  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (status === "success") {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const regenWidget = () => setWidgetKey((k) => k + 1);

  const handleReset = () => {
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setStatus("idle");
    setTsToken("");
    regenWidget();
  };

  const isEmailOk = (email: string) => {
    const at = email.indexOf("@");
    const dot = email.lastIndexOf(".");
    return at > 0 && dot > at + 1 && dot < email.length - 1;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Votre nom est requis";
    if (!isEmailOk(form.email)) e.email = "Adresse e-mail invalide";
    if (form.message.trim().length < 20) e.message = "Le message doit contenir au moins 20 caractères";
    if (SITE_KEY && !tsToken) e.captcha = "Vérification requise"; // ✅ seulement si une clé existe
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          token: tsToken,
          gotcha: "", // honeypot côté serveur (valeur vide côté humain)
        }),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setErrors({});
        setTsToken("");
        if (SITE_KEY) regenWidget(); // ✅ régénère le widget après succès
        track("contact_form_submitted", { message_length: form.message.length });
      } else {
        setStatus("error");
        if (SITE_KEY) { setTsToken(""); regenWidget(); } // ✅ évite "timeout-or-duplicate"
      }
    } catch {
      setStatus("error");
      if (SITE_KEY) { setTsToken(""); regenWidget(); } // ✅ idem en cas d'exception
    }
  };

  const baseInput = "px-3 py-2 rounded-xl bg-slate-800/60 border focus:outline-none focus:ring-2 ";

  return (
    <section
      id="contact"
      className={`${brand.bg} ${brand.text} min-h-screen w-full snap-start flex items-center`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Contact</h2>
          <p className={`mt-3 ${brand.sub}`}>Parlez-nous de votre besoin, nous revenons vers vous rapidement.</p>
          <div className="mt-6 space-y-3 text-slate-300">
            <p className="flex items-center gap-2">
              <MapPin size={18} className="text-sky-400" /> 143 Grande Rue Saint Michel, 31400 Toulouse
            </p>
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-sky-400" />
              <a href="tel:+33766705330" onClick={() => track("phone_click", { location: "contact" })} className="underline">
                07 66 70 53 30
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={18} className="text-sky-400" />
              <a href="mailto:contact@pixteryx.fr" onClick={() => track("email_click", { location: "contact" })} className="underline">
                contact@pixteryx.fr
              </a>
            </p>
          </div>
        </div>

        <form className={`rounded-3xl border border-white/10 p-6 ${brand.card} grid gap-3`} onSubmit={handleSubmit} noValidate>
          <label className="grid gap-1">
            <span>Nom</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`${baseInput} border-white/10 focus:ring-sky-400/40 ${errors.name ? "border-red-500 focus:ring-red-400/40" : ""}`}
              placeholder="Votre nom"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && <p id="name-error" className="text-sm text-red-400">{errors.name}</p>}
          </label>

          <label className="grid gap-1">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`${baseInput} border-white/10 focus:ring-sky-400/40 ${errors.email ? "border-red-500 focus:ring-red-400/40" : ""}`}
              placeholder="vous@entreprise.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && <p id="email-error" className="text-sm text-red-400">{errors.email}</p>}
          </label>

          <label className="grid gap-1">
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={`${baseInput} border-white/10 focus:ring-sky-400/40 ${errors.message ? "border-red-500 focus:ring-red-400/40" : ""}`}
              placeholder="Décrivez votre projet... (minimum 20 caractères)"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              minLength={20}
              maxLength={1000}
              required
            />
            <div className={`text-right text-xs ${form.message.length < 20 ? "text-red-400" : "text-slate-500"}`}>{form.message.length}/1000</div>
            {errors.message && <p id="message-error" className="text-sm text-red-400">{errors.message}</p>}
          </label>

          {/* Honeypot (bots only) */}
          <input type="text" name="gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* Turnstile */}
          <div className="mt-2">
            <Turnstile
              siteKey={SITE_KEY}
              onToken={handleTsToken}  // ✅ stable
              keyProp={widgetKey}
              theme="dark"
            />
            {SITE_KEY && errors.captcha && <p className="text-sm text-red-400 mt-1">{errors.captcha}</p>}
          </div>

          <button
            disabled={status === "sending"}
            className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110 disabled:opacity-60"
          >
            {status === "sending" ? "Envoi…" : <>Envoyer <ArrowRight size={18} /></>}
          </button>

          <button type="button" onClick={handleReset} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50">Réinitialiser</button>

          <div aria-live="polite">
            {status === "success" && (
              <motion.div initial={{opacity:0, y:6, scale:0.98}} animate={{opacity:1, y:0, scale:1}} transition={{type:"spring", stiffness:160, damping:16}}
                className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
                Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.
              </motion.div>
            )}
            {status === "error" && (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                Une erreur s’est produite. Réessayez plus tard ou écrivez-nous à <a className="underline" href="mailto:contact@pixteryx.fr">contact@pixteryx.fr</a>.
              </div>
            )}
          </div>

          {showToast && (
            <motion.div role="status" aria-live="polite" initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} className="fixed top-4 right-4 z-50 rounded-xl border border-green-500/40 bg-slate-900/90 backdrop-blur px-4 py-3 text-green-300 shadow-lg">
              Message envoyé ✅
            </motion.div>
          )}

          <p className={`text-xs ${brand.sub}`}>
            En envoyant, vous acceptez notre{" "}
            <button type="button" className="underline" onClick={() => { onOpenPrivacy(); }}>
              politique de confidentialité
            </button>.
          </p>
        </form>
      </div>
    </section>
  );
}
