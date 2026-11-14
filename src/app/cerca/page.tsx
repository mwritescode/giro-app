import Link from "next/link";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ActivityCard } from "@/components/ActivityCard";
import { getSessionUser } from "@/lib/auth";
import { favouriteIdsFor, getCityBySlug, searchActivities, searchVenues } from "@/lib/queries";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/categories";
import { normalizeParams, type RawParams } from "@/lib/params";

const VENUE_LIMIT = 4;
const ACTIVITY_LIMIT = 5;

export default async function CercaPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  const query = (params.q ?? "").trim();
  const city = getCityBySlug(params.citta ?? "firenze") ?? getCityBySlug("firenze")!;
  const showAll = params.tutti === "1";

  const user = await getSessionUser();
  const savedIds = user ? favouriteIdsFor(user.id) : new Set<number>();

  const venues = query ? searchVenues(query, city.slug, VENUE_LIMIT) : [];
  const activities = query ? searchActivities(query, city.slug, showAll ? null : ACTIVITY_LIMIT) : [];
  const categories = query
    ? CATEGORY_SLUGS.filter((slug) => CATEGORY_LABELS[slug].toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasResults = venues.length > 0 || activities.length > 0 || categories.length > 0;
  const allResultsHref = `/cerca?q=${encodeURIComponent(query)}&citta=${city.slug}&tutti=1`;

  return (
    <>
      <SiteHeader active="esplora" user={user ? { email: user.email } : null} />

      <main className="page-narrow search-page">
        <form className="search-form" method="get" action="/cerca">
          <input type="hidden" name="citta" value={city.slug} />
          <div className="search-field">
            <Search size={19} />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Cerca attività, luoghi, interessi"
              aria-label="Cerca"
              autoFocus
            />
            <button type="submit" className="search-submit">
              Cerca
            </button>
          </div>
        </form>

        <p className="search-location">
          <MapPin size={14} /> {city.name} e dintorni ·{" "}
          <Link href="/scegli-citta">Cambia</Link>
        </p>

        {!query ? (
          <p className="search-hint">Cerca un museo, un laboratorio o un interesse.</p>
        ) : !hasResults ? (
          <div className="empty-results">
            <h2>Nessun risultato per “{query}”</h2>
            <p>Prova con una parola più semplice, oppure esplora tutte le attività.</p>
            <Link href={`/${city.slug}`}>
              Esplora le attività <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {venues.length > 0 ? (
              <section className="search-section">
                <h2>Luoghi a {city.name}</h2>
                {venues.map((venue) => (
                  <Link
                    key={venue.slug}
                    href={`/cerca?q=${encodeURIComponent(venue.name)}&citta=${city.slug}`}
                    className="search-result"
                  >
                    <span className="search-result-icon">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <h3>{venue.name}</h3>
                      <p>{venue.address}</p>
                    </div>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </section>
            ) : null}

            {activities.length > 0 ? (
              <section className="search-section">
                <h2>Attività</h2>
                <div className="experience-list">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      showCity
                      saved={savedIds.has(activity.id)}
                      saveNext={`/cerca?q=${encodeURIComponent(query)}&citta=${city.slug}`}
                    />
                  ))}
                </div>
                {!showAll && activities.length === ACTIVITY_LIMIT ? (
                  <Link href={allResultsHref} className="search-all">
                    Vedi tutti i risultati per “{query}”
                  </Link>
                ) : null}
              </section>
            ) : null}

            {categories.length > 0 ? (
              <section className="search-section">
                <h2>Esplora per interesse</h2>
                {categories.map((slug) => (
                  <Link
                    key={slug}
                    href={`/${city.slug}?interessi=${slug}`}
                    className="search-result"
                  >
                    <span className="search-result-icon">
                      <Search size={18} />
                    </span>
                    <div>
                      <h3>{CATEGORY_LABELS[slug]}</h3>
                      <p>Attività per piccoli curiosi</p>
                    </div>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </section>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
