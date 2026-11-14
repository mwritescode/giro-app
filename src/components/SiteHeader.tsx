import Link from "next/link";
import { Heart } from "lucide-react";
import { AccountMenu } from "./AccountMenu";

type SiteHeaderProps = {
  active?: "esplora" | "preferiti" | "come-funziona" | null;
  user?: { email: string } | null;
};

export function SiteHeader({ active = "esplora", user = null }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        giro<span>.</span>
      </Link>

      <nav className="site-nav">
        <Link href="/" className={active === "esplora" ? "is-active" : undefined}>
          Esplora
        </Link>
        <Link href="/come-funziona" className={active === "come-funziona" ? "is-active" : undefined}>
          Come funziona
        </Link>
      </nav>

      <div className="header-right">
        <Link href="/preferiti" className={`saved-link${active === "preferiti" ? " is-active" : ""}`}>
          <Heart size={18} fill={active === "preferiti" ? "currentColor" : "none"} />
          I tuoi preferiti
        </Link>
        {user ? (
          <AccountMenu email={user.email} />
        ) : (
          <Link href="/accedi" className="signin-button">
            Accedi
          </Link>
        )}
      </div>
    </header>
  );
}
