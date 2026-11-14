import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { requestLogin } from "@/app/actions";
import { getSessionUser } from "@/lib/auth";
import { normalizeParams, type RawParams } from "@/lib/params";

export default async function AccediPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  const next = params.next?.startsWith("/") ? params.next : "/preferiti";
  const user = await getSessionUser();

  if (user) {
    redirect(next);
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="brand">
          giro<span>.</span>
        </Link>

        <h1>Accedi a Giro</h1>
        <p className="auth-intro">
          Un link via email, nessuna password.
          <br />
          Le tue scoperte, sempre con te.
        </p>

        {params.errore === "email" ? (
          <p className="form-error">Inserisci un indirizzo email valido.</p>
        ) : null}

        <form action={requestLogin} className="auth-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email">La tua email</label>
          <div className="email-input">
            <Mail size={19} />
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="nome@esempio.it" />
          </div>
          <button type="submit" className="auth-primary">
            Invia il link di accesso <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-note">È la tua prima volta? Creeremo un account per te.</p>
        <p className="auth-note">
          Continuando accetti i <a href="/termini">Termini di servizio</a> e l&apos;
          <a href="/privacy">Informativa privacy</a>.
        </p>
      </div>
    </main>
  );
}
