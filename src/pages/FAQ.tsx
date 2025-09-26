import { brand } from "../brand";
import { SEO } from "../components/SEO";

const QA = [
  {
    q: "Quels types de projets traitez-vous ?",
    a: "Data analytics, IA/ML, vision par ordinateur, web/mobile, traitement du signal, conseil & audit.",
  },
  {
    q: "Quels sont vos délais moyens ?",
    a: "De 2 à 8 semaines selon la complexité, la portée et la disponibilité des données.",
  },
  {
    q: "Proposez-vous un accompagnement de A à Z ?",
    a: "Oui : cadrage, design des solutions, prototypage, industrialisation (MLOps), et suivi.",
  },
];

export default function FAQ() {
  return (
    <section className={`${brand.bg} ${brand.text} min-h-screen py-16`}>
      <SEO
        title="FAQ — Pixteryx"
        description="Questions fréquentes sur nos services data, IA, vision et développement."
        canonical="https://www.pixteryx.fr/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": QA.map(({ q, a }) => ({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": { "@type": "Answer", "text": a }
          }))
        }}
      />
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold">FAQ</h1>
        <div className="mt-8 space-y-6">
          {QA.map((item, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-6 bg-slate-900/40">
              <h2 className="text-xl font-semibold">{item.q}</h2>
              <p className="mt-2 text-slate-300">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
