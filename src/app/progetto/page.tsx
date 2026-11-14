import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Il progetto",
  description:
    "Giro è un progetto dimostrativo nato da una tesi in Scienze dell'Educazione: un modo per esplorare come si scelgono le esperienze da vivere con i bambini.",
  alternates: { canonical: "/progetto" },
};

export default async function ProgettoPage() {
  const user = await getSessionUser();

  return (
    <>
      <SiteHeader active={null} user={user ? { email: user.email } : null} />

      <main className="page-narrow prose">
        <h1>Il progetto</h1>
        <p className="lede">
          Giro è un progetto dimostrativo: mostra come potrebbe funzionare un servizio per scoprire
          esperienze da vivere con i bambini a Firenze e a Milano. Non è un servizio commerciale e
          non vende biglietti.
        </p>

        <h2>Perché esiste</h2>
        <p>
          Nasce da una tesi in Scienze dell&apos;Educazione. L&apos;idea di partenza è semplice: il
          tempo che un genitore passa a cercare è tempo che non passa a fare. Giro esplora come
          ridurre quella distanza — poche informazioni, ben scelte, e la possibilità di decidere
          senza aprire venti schede.
        </p>

        <h2>Cosa dimostra</h2>
        <ul>
          <li>Un catalogo filtrabile per giorno, età, prezzo e interesse.</li>
          <li>Una mappa con i prezzi, per capire cosa è davvero vicino.</li>
          <li>Una ricerca che suggerisce luoghi, attività e interessi mentre scrivi.</li>
          <li>La possibilità di salvare le attività e ritrovarle su ogni dispositivo.</li>
          <li>Un accesso senza password: un link via email, niente da ricordare.</li>
        </ul>

        <h2>Cosa non è</h2>
        <ul>
          <li>
            <strong>Non è un&apos;agenzia di prenotazione.</strong> Quando un&apos;attività ti
            interessa, Giro ti porta sul sito dell&apos;organizzatore: prezzi, disponibilità e
            condizioni sono suoi.
          </li>
          <li>
            <strong>Non è un catalogo esaustivo.</strong> Le attività servono a mostrare il
            funzionamento del prodotto; date e disponibilità possono non essere aggiornate.
          </li>
          <li>
            <strong>Non è un servizio commerciale.</strong> Non ci sono inserzioni, non ci sono
            affiliazioni, non c&apos;è nulla in vendita.
          </li>
        </ul>

        <h2>Contatti</h2>
        <p>
          Per qualsiasi cosa: <a href="mailto:martina.rossini704@gmail.com">martina.rossini704@gmail.com</a>.
          Per il trattamento dei dati personali vedi l&apos;
          <Link href="/privacy">informativa privacy</Link>.
        </p>

        <p className="updated">Ultimo aggiornamento: novembre 2026.</p>
      </main>
    </>
  );
}
