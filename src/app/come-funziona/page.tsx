import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Come funziona",
  description:
    "Come Giro ti aiuta a trovare laboratori, musei e avventure per bambini a Firenze e Milano: tre passaggi, dalla curiosità alla prenotazione.",
  alternates: { canonical: "/come-funziona" },
  openGraph: {
    title: "Come funziona",
    description:
      "Come Giro ti aiuta a trovare laboratori, musei e avventure per bambini a Firenze e Milano.",
    url: "/come-funziona",
    images: [{ url: "/images/garden.png", alt: "giro." }],
  },
};

const steps = [
  {
    title: "Trova la prossima scoperta",
    text: "Scegli Firenze o Milano e quanto vuoi spostarti. Esplora la mappa e filtra per giorno, età, prezzo e interessi.",
  },
  {
    title: "Scegli con calma",
    text: "Guarda foto, orari e prezzi. Salva le attività con il cuore: con un account le ritrovi su ogni dispositivo.",
  },
  {
    title: "Prenota con chi organizza",
    text: "Hai trovato quella giusta? Vai al sito dell'organizzatore per verificare la disponibilità e prenotare.",
  },
];

const answers = [
  {
    question: "Serve un account?",
    answer:
      "Puoi cercare e scoprire le attività senza registrarti. Per salvare i preferiti, accedi con un link via email: nessuna password.",
  },
  {
    question: "Le attività sono tutte gratuite?",
    answer:
      "Ci sono esperienze gratuite e a pagamento. Puoi filtrare per budget; prezzi, disponibilità e condizioni vanno confermati sul sito dell'organizzatore.",
  },
  {
    question: "Dove posso usare Giro?",
    answer:
      "Per ora a Firenze e Milano, inclusi i dintorni. Scegli la città e regola la distanza per trovare le attività nella zona che ti interessa.",
  },
];

export default async function ComeFunzionaPage() {
  const user = await getSessionUser();

  return (
    <>
      <SiteHeader active="come-funziona" user={user ? { email: user.email } : null} />

      <main className="how-main">
        <Link href="/" className="mobile-breadcrumb">
          <ArrowLeft size={16} /> Esplora
        </Link>

        <section className="how-hero">
          <div className="how-hero-copy">
            <h1>Come funziona</h1>
            <h2>
              Meno tempo a cercare.
              <br />
              Più cose da scoprire.
            </h2>
            <p>
              Laboratori, musei e avventure per bambini della scuola primaria. Giro ti aiuta a
              trovare un&apos;esperienza da vivere insieme, vicino a te.
            </p>
            <Link href="/" className="how-cta">
              Esplora le attività <ArrowRight size={18} />
            </Link>
          </div>
          <img className="how-hero-photo" src="/images/garden.png" alt="" />
        </section>

        <section className="how-steps">
          <h2>Dalla curiosità alla prossima uscita.</h2>
          <div className="how-step-grid">
            {steps.map((step, index) => (
              <article className="how-step" key={step.title}>
                <span className="how-step-number">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="how-answers">
          <h2>Prima di iniziare</h2>
          <div className="how-answer-grid">
            {answers.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-start">
          <div>
            <h2>Da dove comincia il prossimo giro?</h2>
            <p>Scegli una città e lasciati incuriosire.</p>
          </div>
          <div className="how-city-actions">
            <Link href="/firenze">
              Firenze <ArrowRight size={17} />
            </Link>
            <Link href="/milano">
              Milano <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="how-footer">
        <Link href="/" className="footer-brand">
          giro<span>.</span>
        </Link>
        <Link href="/termini">Termini di servizio</Link>
        <Link href="/privacy">Privacy</Link>
      </footer>
    </>
  );
}
