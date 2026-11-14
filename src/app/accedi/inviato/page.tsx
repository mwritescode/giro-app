import Link from "next/link";
import { Mail } from "lucide-react";
import { requestLogin } from "@/app/actions";
import { normalizeParams, type RawParams } from "@/lib/params";

export default async function LinkInviatoPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  const email = params.email ?? "";
  const next = params.next?.startsWith("/") ? params.next : "/preferiti";

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="brand">
          giro<span>.</span>
        </Link>

        <div className="auth-state-icon">
          <Mail size={25} />
        </div>

        <h1>Controlla la tua email</h1>
        <p className="auth-intro">
          Abbiamo inviato un link di accesso a
          <br />
          <strong>{email}</strong>
        </p>
        <p className="auth-note">
          Aprilo per accedere a Giro e ritrovare i tuoi preferiti.
          <br />
          Il link è valido per 15 minuti e può essere usato una sola volta.
        </p>

        <form action={requestLogin} className="auth-form">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next} />
          <button type="submit" className="auth-secondary">
            Invia un nuovo link
          </button>
        </form>

        <Link href={`/accedi?next=${encodeURIComponent(next)}`} className="auth-link">
          Usa un&apos;altra email
        </Link>

        <p className="auth-note">Non lo trovi? Controlla anche nello spam.</p>
      </div>
    </main>
  );
}
