"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import { CityMap, type MapBounds } from "./CityMap";
import type { ActivitySummary, City } from "@/lib/types";

type DiscoveryWorkspaceProps = {
  city: City;
  activities: ActivitySummary[];
  total: number;
  base: string;
  savedIds: number[];
  saveNext: string;
  radiusKm: number;
  initialSelectedId: number | null;
};

export function DiscoveryWorkspace({
  city,
  activities,
  total,
  base,
  savedIds,
  saveNext,
  radiusKm,
  initialSelectedId,
}: DiscoveryWorkspaceProps) {
  const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const saved = new Set(savedIds);

  const visible = bounds
    ? activities.filter(
        (activity) =>
          activity.venueLat >= bounds.south &&
          activity.venueLat <= bounds.north &&
          activity.venueLng >= bounds.west &&
          activity.venueLng <= bounds.east,
      )
    : activities;

  const selected = visible.find((activity) => activity.id === selectedId) ?? visible[0] ?? null;

  function select(activity: ActivitySummary) {
    setSelectedId(activity.id);

    const url = new URL(window.location.href);
    url.searchParams.set("selezionata", activity.slug);
    window.history.replaceState(null, "", url);
  }

  return (
    <main className="discovery-workspace">
      <aside className="results-panel">
        <div className="results-heading">
          <div>
            <h2>Da scoprire a {city.name}</h2>
            <p>
              {visible.length === total
                ? `${total} esperienze per piccoli curiosi`
                : `${visible.length} di ${total} esperienze`}
            </p>
          </div>
          <span className="results-count">{visible.length}</span>
        </div>

        {activities.length === 0 ? (
          <div className="empty-results">
            <h2>Un piccolo cambio di piani?</h2>
            <p>
              Non abbiamo trovato attività con questi filtri.
              <br />
              Prova un&apos;altra data o amplia il budget: la prossima scoperta potrebbe essere lì.
            </p>
            <Link href={base}>
              Rimuovi i filtri <ArrowRight size={17} />
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-results">
            <h2>Niente in quest&apos;area</h2>
            <p>Sposta la mappa o allarga l&apos;area di ricerca.</p>
            <button type="button" onClick={() => setBounds(null)}>
              Togli il filtro area <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <div className="experience-list">
            {visible.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                selected={selected?.id === activity.id}
                saved={saved.has(activity.id)}
                saveNext={saveNext}
              />
            ))}
          </div>
        )}

        <p className="booking-note">
          Hai trovato la tua prossima avventura?
          <br />
          Prenota direttamente sul sito dell&apos;organizzatore.
        </p>
      </aside>

      <CityMap
        city={city}
        activities={visible}
        selected={selected}
        radiusKm={radiusKm}
        onSelect={select}
        onSearchArea={setBounds}
        areaActive={bounds !== null}
        onClearArea={() => setBounds(null)}
      />
    </main>
  );
}
