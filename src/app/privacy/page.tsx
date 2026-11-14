import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Informativa privacy",
  description:
    "Quali dati raccoglie Giro, perché, per quanto tempo e come esercitare i tuoi diritti.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const user = await getSessionUser();

  return (
    <>
      <SiteHeader active={null} user={user ? { email: user.email } : null} />

      <main className="page-narrow prose">
        <h1>Informativa privacy</h1>
        <p className="lede">
          Giro è un progetto dimostrativo, ma tratta dati veri: qui trovi in breve cosa raccoglie,
          perché e come cancellarlo.
        </p>

        <h2>Titolare del trattamento</h2>
        <p>
          Martina Rossini —{" "}
          <a href="mailto:martina.rossini704@gmail.com">martina.rossini704@gmail.com</a>
        </p>

        <h2>Quali dati trattiamo</h2>
        <ul>
          <li>
            <strong>Il tuo indirizzo email.</strong> Serve a farti accedere: non c&apos;è password,
            ricevi un link.
          </li>
          <li>
            <strong>Le attività che salvi nei preferiti.</strong> Servono a mostrarti la tua lista.
          </li>
          <li>
            <strong>Un cookie tecnico di sessione</strong> (<code>giro_session</code>), per
            ricordare che sei connesso.
          </li>
          <li>
            <strong>Dati tecnici di connessione</strong> — indirizzo IP, data e ora — gestiti dai
            fornitori che ospitano il sito e servono le mappe.
          </li>
        </ul>

        <h2>Perché, e su quale base giuridica</h2>
        <ul>
          <li>
            Per erogare il servizio (accesso, preferiti): esecuzione del contratto, art. 6.1.b
            GDPR.
          </li>
          <li>
            Per la sicurezza e la prevenzione degli abusi: legittimo interesse, art. 6.1.f GDPR.
          </li>
        </ul>
        <p>
          Non facciamo profilazione, non prendiamo decisioni automatizzate, non inviamo
          comunicazioni commerciali.
        </p>

        <h2>Cookie</h2>
        <p>
          Un solo cookie tecnico, necessario per restare connessi. Nessun cookie di profilazione,
          nessuna analitica, nessuna pubblicità: per questo non trovi un banner.
        </p>

        <h2>A chi possono essere comunicati</h2>
        <ul>
          <li>
            <strong>Cloudflare</strong> — hosting e database.
          </li>
          <li>
            <strong>Brevo</strong> — invio delle email con i link di accesso.
          </li>
          <li>
            <strong>OpenFreeMap</strong> — mappe: riceve l&apos;indirizzo IP quando carichi una
            mappa.
          </li>
        </ul>
        <p>Nessun dato è ceduto a terzi per finalità di marketing.</p>

        <h2>Trasferimenti fuori dall&apos;Unione europea</h2>
        <p>
          Alcuni fornitori possono trattare dati fuori dall&apos;UE, sulla base delle clausole
          contrattuali standard della Commissione europea.
        </p>

        <h2>Per quanto tempo</h2>
        <ul>
          <li>
            <strong>Account e preferiti:</strong> finché l&apos;account esiste. Puoi eliminarlo in
            qualsiasi momento dal menu del tuo account: la cancellazione è immediata e definitiva.
          </li>
          <li>
            <strong>Link di accesso:</strong> 15 minuti, utilizzabile una sola volta.
          </li>
          <li>
            <strong>Sessione:</strong> 30 giorni.
          </li>
          <li>
            <strong>Log tecnici:</strong> per il periodo stabilito dai fornitori, anche dopo la
            cancellazione dell&apos;account.
          </li>
        </ul>

        <h2>I tuoi diritti</h2>
        <p>
          Puoi chiedere accesso, rettifica, cancellazione, limitazione, opposizione e portabilità
          dei tuoi dati, scrivendo all&apos;indirizzo sopra. Se ritieni che il trattamento non sia
          corretto, puoi rivolgerti al Garante per la protezione dei dati personali:{" "}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            garanteprivacy.it
          </a>
          .
        </p>

        <h2>Età</h2>
        <p>
          Giro è pensato per gli adulti: l&apos;account va creato da un genitore o da chi esercita
          la responsabilità genitoriale.
        </p>

        <h2>Modifiche</h2>
        <p>
          Se questa informativa cambia, la versione aggiornata sarà pubblicata su questa pagina.
        </p>

        <p className="updated">
          Ultimo aggiornamento: novembre 2026. Per il contesto del progetto vedi{" "}
          <Link href="/progetto">Il progetto</Link>.
        </p>
      </main>
    </>
  );
}
