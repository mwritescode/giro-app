import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { isoDate, upcomingWeekend } from "@/lib/format";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/seed";
import type { Filters } from "@/lib/types";

type FilterPanelProps = {
  citySlug: string;
  filters: Filters;
};

export function FilterPanel({ citySlug, filters }: FilterPanelProps) {
  const base = `/${citySlug}`;
  const weekend = upcomingWeekend();
  const today = isoDate(new Date());
  const tomorrow = isoDate(new Date(Date.now() + 86_400_000));

  const dateValue =
    filters.dates.length === 0 ? "tutte" : filters.dates.length === 1 ? filters.dates[0] : filters.dates.join(",");

  return (
    <div className="overlay">
      <form className="filters-panel" method="get" action={base}>
        <header className="filters-header">
          <h1>Tutti i filtri</h1>
          <Link href={base} className="icon-button" aria-label="Chiudi i filtri">
            <X size={20} />
          </Link>
        </header>

        <div className="filters-body">
          <section className="filter-section">
            <h2>Quando vuoi andare?</h2>
            <p>Scegli un giorno o un fine settimana.</p>
            <div className="choice-group">
              <label className="choice">
                <input type="radio" name="data" value="tutte" defaultChecked={dateValue === "tutte"} />
                Qualsiasi data
              </label>
              <label className="choice">
                <input type="radio" name="data" value={weekend.join(",")} defaultChecked={dateValue === weekend.join(",")} />
                Questo weekend
              </label>
              <label className="choice">
                <input type="radio" name="data" value={today} defaultChecked={dateValue === today} />
                Oggi
              </label>
              <label className="choice">
                <input type="radio" name="data" value={tomorrow} defaultChecked={dateValue === tomorrow} />
                Domani
              </label>
            </div>
          </section>

          <section className="filter-section">
            <h2>Età dei bambini</h2>
            <p>Trova attività adatte alla loro curiosità.</p>
            <div className="choice-group">
              {[6, 7, 8, 9, 10].map((age) => (
                <label key={age} className="choice">
                  <input type="checkbox" name="eta" value={age} defaultChecked={filters.ages.includes(age)} />
                  {age} anni
                </label>
              ))}
            </div>
          </section>

          <section className="filter-section">
            <h2>Prezzo per bambino</h2>
            <div className="choice-group">
              {[0, 10, 15, 20].map((price) => (
                <label key={price} className="choice">
                  <input
                    type="radio"
                    name="prezzo"
                    value={price === 0 ? "" : String(price)}
                    defaultChecked={
                      price === 0
                        ? filters.maxPriceCents === null && !filters.freeOnly
                        : filters.maxPriceCents === price * 100
                    }
                  />
                  {price === 0 ? "Nessun limite" : `Fino a ${price} €`}
                </label>
              ))}
            </div>
            <label className="checkbox-row">
              <input type="checkbox" name="gratis" value="1" defaultChecked={filters.freeOnly} />
              Solo attività gratuite
            </label>
          </section>

          <section className="filter-section">
            <h2>Cosa gli piace?</h2>
            <div className="choice-group">
              {CATEGORY_SLUGS.map((category) => (
                <label key={category} className="choice">
                  <input
                    type="checkbox"
                    name="interessi"
                    value={category}
                    defaultChecked={filters.categories.includes(category)}
                  />
                  {CATEGORY_LABELS[category]}
                </label>
              ))}
            </div>
          </section>

          <section className="filter-section">
            <h2>Dove si svolge?</h2>
            <p>Distanza dal centro città.</p>
            <div className="choice-group">
              {[5, 10, 25, 50].map((radius) => (
                <label key={radius} className="choice">
                  <input
                    type="radio"
                    name="raggio"
                    value={radius}
                    defaultChecked={(filters.radiusKm ?? 10) === radius}
                  />
                  {radius} km
                </label>
              ))}
            </div>
          </section>
        </div>

        <footer className="filters-footer">
          <button type="submit">
            Mostra le attività <ArrowRight size={17} />
          </button>
        </footer>
      </form>
    </div>
  );
}
