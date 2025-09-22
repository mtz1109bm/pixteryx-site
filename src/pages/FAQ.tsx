import { brand } from "../brand";

const QA = [
  {
    q: "Quels types de projets réalisez-vous ?",
    a: "IA/ML, vision par ordinateur, data analytics, développement web/mobile, traitement du signal et missions de conseil/audit.",
  },
  {
    q: "Quels sont vos délais habituels ?",
    a: "Un MVP se livre souvent en 3 à 8 semaines selon la complexité, la qualité des données et les intégrations nécessaires.",
  },
  {
    q: "Comment calculez-vous le prix ?",
    a: "Principalement au forfait après cadrage (ou en régie si besoin). Le devis rapide donne une fourchette indicative basée sur quelques paramètres.",
  },
  {
    q: "Proposez-vous la maintenance ?",
    a: "Oui : contrats de TMA, MLOps (surveillance & réentraînement), mises à jour sécurité et petites évolutions.",
  },
  {
    q: "Travaillez-vous avec le secteur public ?",
    a: "Oui, nous accompagnons des organismes publics et parapublics (conformité RGPD, localisation des données).",
  },
  {
    q: "Qui possède la propriété intellectuelle ?",
    a: "Par défaut, les livrables réalisés pour vous vous appartiennent (hors briques open source).",
  },
];

export default function FAQ() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": QA.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  };

  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen py-16`}>
      <title>Pixteryx — FAQ</title>
      <link rel="canonical" href="https://www.pixteryx.fr/faq" />
      <script type="application/ld+json">{JSON.stringify(ld)}</script>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold">FAQ</h1>
        <p className={`mt-2 ${brand.sub}`}>Réponses aux questions les plus fréquentes.</p>

        <div className="mt-8 space-y-3">
          {QA.map(({ q, a }) => (
            <details key={q} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-slate-300">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
