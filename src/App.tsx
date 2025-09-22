import { useState, useEffect, type JSX } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Camera, Code, LineChart, Phone, Mail, MapPin } from "lucide-react";

// === Brand Colors
const brand = {
  bg: "bg-slate-950",
  card: "bg-slate-900/60",
  text: "text-slate-200",
  sub: "text-slate-400",
  primary: "text-sky-400",
  ring: "ring-sky-400/40",
  accent: "bg-sky-500",
};

// === SVG Logo (flat, blue, pixel + eye + X)
function PixteryxLogo({ size = 40, wordmark = true }: { size?: number; wordmark?: boolean }) {
  const stroke = "#38bdf8"; // tailwind sky-400
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pixteryx logo"
      >
        {/* Pixel */}
        <rect x="6" y="8" width="8" height="8" rx="1.5" fill={stroke} />
        {/* Eye outline */}
        <path
          d="M8 32C14 20 26 12 32 12c6 0 18 8 24 20-6 12-18 20-24 20S14 44 8 32Z"
          stroke={stroke}
          strokeWidth={4}
          fill="none"
          strokeLinejoin="round"
        />
        {/* X pupil */}
        <path d="M28 26l8 12M36 26l-8 12" stroke={stroke} strokeWidth={4} strokeLinecap="round" />
      </svg>
      {wordmark && <span className="font-semibold tracking-tight text-2xl text-sky-400">Pixteryx</span>}
    </div>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  const navItem = (
    <ul className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 font-medium">
      <li><a href="#services" className="hover:text-sky-300">Services</a></li>
      <li><a href="#about" className="hover:text-sky-300">À propos</a></li>
      <li><a href="#contact" className="hover:text-sky-300">Contact</a></li>
    </ul>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#top" className="focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-950 ring-sky-400 rounded-lg">
          <PixteryxLogo size={36} />
        </a>
        <nav className="hidden md:block text-slate-200">{navItem}</nav>
        <button className="md:hidden p-2 rounded-lg border border-white/10" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      </div>
      {open && <div className="md:hidden px-4 pb-4 text-slate-200">{navItem}</div>}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className={`${brand.bg} ${brand.text} relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs ${brand.sub}`}>
            <span className="text-sky-400">IA • Data • Vision</span>
            <span className="text-slate-500">par Pixteryx</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
            Transformer les <span className="text-sky-400">données</span> en <span className="text-sky-400">décisions</span>.
          </h1>
          <p className="mt-4 text-slate-400 max-w-prose">
            Solutions modernes en data, IA, vision par ordinateur et développement web/mobile. Fiables, performantes et durables — pour startups, PME et secteur public.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110">
              Discuter de votre projet <ArrowRight size={18} />
            </a>
            <a href="#services" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50">
              Voir nos services
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="justify-self-center">
          <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/60 shadow-xl">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-sky-500/10 blur-2xl" />
            <div className="flex items-center gap-4">
              <PixteryxLogo size={56} />
              <div>
                <p className="text-slate-400">Entreprise</p>
                <h3 className="text-2xl font-semibold">Pixteryx</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-slate-300">
              <li className="flex items-center gap-2"><Brain /> IA & Machine Learning</li>
              <li className="flex items-center gap-2"><Camera /> Vision par ordinateur</li>
              <li className="flex items-center gap-2"><LineChart /> Analyse avancée de données</li>
              <li className="flex items-center gap-2"><Code /> Développement web & mobile</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, desc }: { icon: JSX.Element; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-6 border border-white/10 ${brand.card}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-sky-500/10">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-slate-400">{desc}</p>
    </motion.div>
  );
}

function Services() {
  return (
    <section id="services" className={`${brand.bg} ${brand.text}`}>
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold">Nos services</h2>
        <p className={`mt-2 ${brand.sub}`}>Du prototype au déploiement en production.</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard icon={<Brain className="text-sky-400" />} title="IA & ML" desc="Modèles de classification, régression, NLP et deep learning. Mise en production fiable (MLOps)." />
          <ServiceCard icon={<Camera className="text-sky-400" />} title="Vision par ordinateur" desc="Détection/segmentation, OCR, inspection qualité, traitement d'images 2D/3D." />
          <ServiceCard icon={<LineChart className="text-sky-400" />} title="Data Analytics" desc="Pipeline de données, feature engineering, dashboards décisionnels." />
          <ServiceCard icon={<Code className="text-sky-400" />} title="Dev Web & Mobile" desc="Apps sur mesure en React / Flutter, APIs performantes, intégrations cloud." />
          <ServiceCard icon={<Code className="text-sky-400" />} title="Traitement du signal" desc="Filtrage, time-series, audio/EEG/IoT, optimisation temps réel." />
          <ServiceCard icon={<LineChart className="text-sky-400" />} title="Conseil & Audit" desc="Stratégie data/IA, cadrage, roadmap, accompagnement d'équipes." />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className={`${brand.bg} ${brand.text}`}>
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">À propos</h2>
          <p className="mt-4 text-slate-400">
            Pixteryx est spécialisée dans l’analyse de données, l’IA et la vision par ordinateur. Nous aidons startups, PME et institutions à créer des solutions sur mesure, robustes et pérennes. Notre approche : innovation, fiabilité, performance et durabilité.
          </p>
          <p className="mt-3 text-slate-400">
            Expertise : traitement du signal & d’images, apprentissage automatique, développement web/mobile. Nous transformons vos données en décisions à impact.
          </p>
        </div>
        <div className={`rounded-3xl border border-white/10 p-6 ${brand.card}`}>
          <h3 className="text-xl font-semibold">Nos valeurs</h3>
          <ul className="mt-3 space-y-2 text-slate-300 list-disc list-inside">
            <li>Innovation continue</li>
            <li>Fiabilité et qualité de livraison</li>
            <li>Performance mesurable</li>
            <li>Durabilité et responsabilité</li>
          </ul>
          <div className="mt-6">
            <h4 className="font-semibold">Devise</h4>
            <p className={`${brand.sub}`}>« La puissance des données, la précision de la vision. »</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<any>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const [captcha, setCaptcha] = useState(() => {
    const a = Math.floor(1 + Math.random() * 8);
    const b = Math.floor(1 + Math.random() * 8);
    return { a, b };
  });
  const [captchaInput, setCaptchaInput] = useState("");

  const regenCaptcha = () => {
    setCaptcha(() => {
      const a = Math.floor(1 + Math.random() * 8);
      const b = Math.floor(1 + Math.random() * 8);
      return { a, b };
    });
    setCaptchaInput("");
  };

  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (status === "success") {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleReset = () => {
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setCaptchaInput("");
    setStatus("idle");
  };

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrbyzbep"; // 
  const isEmailOk = (email: string) => {
    const at = email.indexOf("@");
    const dot = email.lastIndexOf(".");
    return at > 0 && dot > at + 1 && dot < email.length - 1;
  };

  const validate = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = "Votre nom est requis";
    if (!isEmailOk(form.email)) e.email = "Adresse e-mail invalide";
    if (form.message.trim().length < 20) e.message = "Le message doit contenir au moins 20 caractères";
    const expected = (captcha.a + captcha.b).toString();
    if (captchaInput.trim() !== expected) e.captcha = "Résultat incorrect";
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
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("_replyto", form.email);
      fd.append("message", form.message);
      fd.append("_subject", "Nouveau message – pixteryx.fr");
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setErrors({});
        regenCaptcha();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const baseInput = "px-3 py-2 rounded-xl bg-slate-800/60 border focus:outline-none focus:ring-2 ";

  return (
    <section id="contact" className={`${brand.bg} ${brand.text}`}>
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Contact</h2>
          <p className={`mt-3 ${brand.sub}`}>Parlez-nous de votre besoin, nous revenons vers vous rapidement.</p>
          <div className="mt-6 space-y-3 text-slate-300">
            <p className="flex items-center gap-2"><MapPin size={18} className="text-sky-400" /> 143 Grande Rue Saint Michel, 31400 Toulouse</p>
            <p className="flex items-center gap-2"><Phone size={18} className="text-sky-400" /> 07 66 70 53 30</p>
            <p className="flex items-center gap-2"><Mail size={18} className="text-sky-400" /> <a href="mailto:contact@pixteryx.fr" className="underline">contact@pixteryx.fr</a></p>
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

          <label className="grid gap-1">
            <span>Vérification anti-robot : {captcha.a} + {captcha.b} = ?</span>
            <input
              name="captcha"
              inputMode="numeric"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.replace(/[^0-9]/g, ""))}
              className={`${baseInput} border-white/10 focus:ring-sky-400/40 ${errors.captcha ? "border-red-500 focus:ring-red-400/40" : ""}`}
              placeholder="Votre réponse"
              aria-invalid={!!errors.captcha}
              aria-describedby={errors.captcha ? "captcha-error" : undefined}
              required
            />
            <button type="button" onClick={regenCaptcha} className="justify-self-start text-xs underline text-sky-400 hover:text-sky-300">Rafraîchir le captcha</button>
            {errors.captcha && <p id="captcha-error" className="text-sm text-red-400">{errors.captcha}</p>}
          </label>

          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          <button
            disabled={status === "sending"}
            className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-slate-900 font-semibold hover:brightness-110 disabled:opacity-60"
          >
            {status === "sending" ? "Envoi…" : <>Envoyer <ArrowRight size={18} /></>}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-sky-400/50"
          >
            Réinitialiser
          </button>

          <div aria-live="polite">
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 16 }}
                className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300"
              >
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
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-4 right-4 z-50 rounded-xl border border-green-500/40 bg-slate-900/90 backdrop-blur px-4 py-3 text-green-300 shadow-lg"
            >
              Message envoyé ✅
            </motion.div>
          )}

          <p className={`text-xs ${brand.sub}`}>En envoyant, vous acceptez notre <a className="underline" href="#privacy">politique de confidentialité</a>.</p>
        </form>
      </div>
    </section>
  );
}

// === Mentions légales & Politique de confidentialité (ancres)
function Mentions() {
  return (
    <section id="mentions" className={`${brand.bg} ${brand.text}`}>
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 prose prose-invert">
        <h2>Mentions légales</h2>
        <p><strong>Éditeur :</strong> Pixteryx (SASU). Adresse : 143 Grande Rue Saint Michel, 31400 Toulouse, France. Tél. : 07 66 70 53 30. E-mail : <a href="mailto:contact@pixteryx.fr">contact@pixteryx.fr</a>.</p>
        <p><strong>Directeur de la publication :</strong> [Nom du dirigeant].</p>
        <p><strong>Immatriculation :</strong> SIREN/SIRET : [à compléter]. RCS : [Ville et numéro]. Capital social : [€].</p>
        <p><strong>Hébergement :</strong> Vercel Inc. (vercel.com).</p>
        <h3>Propriété intellectuelle</h3>
        <p>Le contenu du site (textes, logos, éléments graphiques) est la propriété de Pixteryx ou de ses partenaires. Toute reproduction non autorisée est interdite.</p>
        <h3>Responsabilité</h3>
        <p>Pixteryx s’efforce d’assurer l’exactitude des informations publiées mais ne saurait être tenue responsable des erreurs ou omissions.</p>
        <p className={`text-xs ${brand.sub}`}>Dernière mise à jour : 21/09/2025.</p>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className={`${brand.bg} ${brand.text}`}>
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 prose prose-invert">
        <h2>Politique de confidentialité</h2>
        <p>Pixteryx respecte le Règlement Général sur la Protection des Données (RGPD) et la loi française.</p>
        <h3>Données collectées</h3>
        <p>Via le formulaire de contact : nom, adresse e-mail, contenu du message. Finalités : répondre à vos demandes et assurer le suivi commercial. Base légale : intérêts légitimes et mesures précontractuelles.</p>
        <h3>Destinataires & hébergement</h3>
        <p>Les données sont traitées par Pixteryx et hébergées chez nos prestataires (hébergeur web/Vercel, outil de formulaire le cas échéant). Nous ne revendons pas vos données.</p>
        <h3>Durées de conservation</h3>
        <p>Jusqu’à 3 ans après le dernier contact à des fins de prospection, sauf obligation légale différente.</p>
        <h3>Vos droits</h3>
        <p>Vous disposez des droits d’accès, rectification, effacement, opposition, limitation et portabilité. Pour les exercer : <a href="mailto:contact@pixteryx.fr">contact@pixteryx.fr</a>. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).</p>
        <h3>Cookies</h3>
        <p>Par défaut, nous n’utilisons pas de cookies de suivi. Si des outils d’analyse sont ajoutés, une bannière d’information et un paramétrage des consentements seront mis en place.</p>
        <h3>Sécurité</h3>
        <p>Nous mettons en œuvre des mesures raisonnables pour protéger vos données. Les transferts en dehors de l’UE (par nos prestataires) sont encadrés par des garanties appropriées.</p>
        <p className={`text-xs ${brand.sub}`}>Dernière mise à jour : 21/09/2025.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={`${brand.bg} ${brand.text} border-t border-white/10`}>
      <div className={`max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm ${brand.sub}`}>
        <div className="flex items-center gap-2">
          <PixteryxLogo size={20} wordmark={false} /> <span>© {new Date().getFullYear()} Pixteryx. Tous droits réservés.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#mentions" className="hover:text-sky-300">Mentions légales</a>
          <a href="#privacy" className="hover:text-sky-300">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className={`${brand.bg} ${brand.text} min-h-screen`}>
      <NavBar />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Mentions />
      <Privacy />
      <Footer />
    </main>
  );
}
