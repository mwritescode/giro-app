import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronDown, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { DiscoveryWorkspace } from "./DiscoveryWorkspace";
import { FilterPanel } from "./FilterPanel";
import { SiteHeader } from "./SiteHeader";
import { formatAges, formatDateRange } from "@/lib/format";
import { buildHref, parseFilters } from "@/lib/params";
import { countActivities, favouriteIdsFor, getCityBySlug, listActivities } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";

type DiscoveryPageProps = {
  citySlug: string;
  params: Record<string, string>;
};

export async function DiscoveryPage({ citySlug, params }: DiscoveryPageProps) {
  const city = getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }

  const user = await getSessionUser();
  const savedIds = user ? favouriteIdsFor(user.id) : new Set<number>();
  const filters = parseFilters(params);
  const activities = listActivities(city.slug, filters);
  const total = countActivities(city.slug);
  const base = `/${city.slug}`;

  const search = new URLSearchParams(params);
  search.delete("pannello");
  const query = search.toString();
  const saveNext = query ? `${base}?${query}` : base;

  const selectedFromUrl = params.selezionata
    ? activities.find((activity) => activity.slug === params.selezionata)
    : undefined;

  const dateLabel = filters.dates.length ? formatDateRange(filters.dates) : "Qualsiasi data";
  const ageLabel = filters.ages.length
    ? formatAges(Math.min(...filters.ages), Math.max(...filters.ages))
    : "Età dei bambini";
  const priceLabel = filters.freeOnly
    ? "Gratis"
    : filters.maxPriceCents !== null
      ? `Fino a ${filters.maxPriceCents / 100} €`
      : "Prezzo";

  return (
    <>
      <SiteHeader active="esplora" user={user ? { email: user.email } : null} />

      <section className="discovery-intro">
        <div>
          <h1>Fuori casa. Dentro la meraviglia.</h1>
          <p>Esperienze da vivere, cose nuove da imparare. Insieme.</p>
        </div>
        <Link href="/scegli-citta" className="location-search">
          <MapPin size={19} />
          <span>
            {city.name} <small>· entro {filters.radiusKm} km</small>
          </span>
          <ChevronDown size={17} />
          <span className="search-divider" />
          <Search size={19} />
        </Link>
      </section>

      <section className="filter-bar">
        <Link
          href={
            filters.dates.length
              ? buildHref(base, params, { data: "tutte" })
              : buildHref(base, params, { data: null })
          }
          className="filter-chip"
        >
          <CalendarDays size={15} /> {dateLabel} <ChevronDown size={13} />
        </Link>

        <Link
          href={
            filters.ages.length
              ? buildHref(base, params, { eta: null })
              : buildHref(base, params, { eta: "6,7,8,9,10" })
          }
          className={`filter-chip${filters.ages.length ? " is-active" : ""}`}
        >
          {ageLabel} {filters.ages.length ? <X size={13} /> : <ChevronDown size={13} />}
        </Link>

        <Link
          href={
            filters.freeOnly || filters.maxPriceCents !== null
              ? buildHref(base, params, { gratis: null, prezzo: null })
              : buildHref(base, params, { gratis: "1" })
          }
          className={`filter-chip${filters.freeOnly || filters.maxPriceCents !== null ? " is-active" : ""}`}
        >
          {priceLabel} {filters.freeOnly || filters.maxPriceCents !== null ? <X size={13} /> : <ChevronDown size={13} />}
        </Link>

        <Link href={buildHref(base, params, { pannello: "1" })} className="filter-chip">
          Cosa gli piace? <ChevronDown size={13} />
        </Link>

        <Link href={buildHref(base, params, { pannello: "1" })} className="filter-chip is-plain">
          <SlidersHorizontal size={15} /> Tutti i filtri
        </Link>

        <p className="filter-note">Un weekend, infinite curiosità.</p>
      </section>

      <DiscoveryWorkspace
        city={city}
        activities={activities}
        total={total}
        base={base}
        savedIds={[...savedIds]}
        saveNext={saveNext}
        radiusKm={filters.radiusKm ?? 10}
        initialSelectedId={selectedFromUrl?.id ?? null}
      />

      {params.pannello === "1" ? <FilterPanel citySlug={city.slug} filters={filters} /> : null}
    </>
  );
}
