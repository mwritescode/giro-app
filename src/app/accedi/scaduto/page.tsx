import Link from "next/link";
import { Link2Off } from "lucide-react";
import { requestLogin } from "@/app/actions";
import { normalizeParams, type RawParams } from "@/lib/params";

export default async function LinkScadutoPage({ searchParams }: { searchParams: Promise<RawParams> }) {
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
          <Link2Off size={25} />
        </div>

        <h1>
          Questo link
          <br />
          non è più valido
        </h1>
        <p className="auth-intro">
          Potrebbe essere scaduto
          <br />
          o già stato utilizzato.
        </p>

        {email ? (
          <form action={requestLogin} className="auth-form">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="next" value={next} />
            <p className="auth-note">
              Ti invieremo un nuovo link a
              <br />
              <strong>{email}</strong>
            </p>
            <button type="submit" className="auth-primary">
              Invia un nuovo link
            </button>
          </form>
        ) : null}

        <Link href={`/accedi?next=${encodeURIComponent(next)}`} className="auth-link">
          Usa un&apos;altra email
        </Link>
      </div>
    </main>
  );
}
