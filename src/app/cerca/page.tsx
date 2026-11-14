import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ActivityCard } from "@/components/ActivityCard";
import { SearchBox } from "@/components/SearchBox";
import { getSessionUser } from "@/lib/auth";
import { favouriteIdsFor, getCityBySlug, searchActivities, searchVenues } from "@/lib/queries";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/categories";
import { normalizeParams, type RawParams } from "@/lib/params";
import { EMPTY_PAYLOAD, type SearchPayload } from "@/lib/search";

const VENUE_LIMIT = 4;
const ACTIVITY_LIMIT = 5;

export const metadata: Metadata = {
  title: "Cerca",
  robots: { index: false, follow: false },
};

export default async function CercaPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  const query = (params.q ?? "").trim();
  const city = (await getCityBySlug(params.citta ?? "firenze")) ?? (await getCityBySlug("firenze"))!;
  const showAll = params.tutti === "1";
  const hasQuery = query.length >= 2;

  const user = await getSessionUser();
  const savedIds = user ? await favouriteIdsFor(user.id) : new Set<number>();

  const payload: SearchPayload = hasQuery
    ? {
        venues: (await searchVenues(query, city.slug, VENUE_LIMIT)).map((venue) => ({
          slug: venue.slug,
          name: venue.name,
          address: venue.address,
        })),
        activities: (await searchActivities(query, city.slug, ACTIVITY_LIMIT)).map((activity) => ({
          slug: activity.slug,
          title: activity.title,
          venueName: activity.venueName,
          priceCents: activity.priceCents,
        })),
        categories: CATEGORY_SLUGS.filter((slug) =>
          CATEGORY_LABELS[slug].toLowerCase().includes(query.toLowerCase()),
        ).map((slug) => ({ slug, label: CATEGORY_LABELS[slug] })),
      }
    : EMPTY_PAYLOAD;

  const allActivities = showAll && hasQuery ? await searchActivities(query, city.slug, null) : [];

  return (
    <>
      <SiteHeader active="esplora" user={user ? { email: user.email } : null} />

      <main className="page-narrow search-page">
        <SearchBox
          citySlug={city.slug}
          initialQuery={query}
          initialPayload={payload}
          variant="page"
          autoOpen={!showAll}
        />

        <p className="search-location">
          <MapPin size={14} /> {city.name} e dintorni · <Link href="/scegli-citta">Cambia</Link>
        </p>

        {showAll ? (
          <section className="search-section">
            <h2>Tutti i risultati per “{query}”</h2>
            {allActivities.length === 0 ? (
              <p className="search-hint">Nessuna attività trovata.</p>
            ) : (
              <div className="experience-list">
                {allActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    showCity
                    saved={savedIds.has(activity.id)}
                    saveNext={`/cerca?q=${encodeURIComponent(query)}&citta=${city.slug}&tutti=1`}
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}
      </main>
    </>
  );
}
