import Link from "next/link";
import { ChevronDown, Heart } from "lucide-react";

type SiteHeaderProps = {
  active?: "esplora" | "preferiti";
  user?: { name: string } | null;
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
        <Link href="/come-funziona">Come funziona</Link>
      </nav>

      <div className="header-right">
        <Link href="/preferiti" className={`saved-link${active === "preferiti" ? " is-active" : ""}`}>
          <Heart size={18} fill={active === "preferiti" ? "currentColor" : "none"} />
          I tuoi preferiti
        </Link>
        {user ? (
          <Link href="/account" className="account-button">
            <span className="account-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <span>{user.name}</span>
            <ChevronDown size={15} />
          </Link>
        ) : (
          <Link href="/accedi" className="signin-button">
            Accedi
          </Link>
        )}
      </div>
    </header>
  );
}
