"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import { CityMap } from "./CityMap";
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
  const cardRefs = useRef(new Map<number, HTMLDivElement>());
  const saved = new Set(savedIds);

  const selected = activities.find((activity) => activity.id === selectedId) ?? activities[0] ?? null;

  function select(activity: ActivitySummary) {
    setSelectedId(activity.id);

    const url = new URL(window.location.href);
    url.searchParams.set("selezionata", activity.slug);
    window.history.replaceState(null, "", url);

    if (window.matchMedia("(min-width: 1081px)").matches) {
      cardRefs.current.get(activity.id)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  return (
    <main className="discovery-workspace">
      <aside className="results-panel">
        <div className="results-heading">
          <div>
            <h2>Da scoprire a {city.name}</h2>
            <p>
              {activities.length === total
                ? `${total} esperienze per piccoli curiosi`
                : `${activities.length} di ${total} esperienze`}
            </p>
          </div>
          <span className="results-count">{activities.length}</span>
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
        ) : (
          <div className="experience-list">
            {activities.map((activity) => (
              <div
                key={activity.id}
                ref={(element) => {
                  if (element) {
                    cardRefs.current.set(activity.id, element);
                  } else {
                    cardRefs.current.delete(activity.id);
                  }
                }}
              >
                <ActivityCard
                  activity={activity}
                  selected={selected?.id === activity.id}
                  saved={saved.has(activity.id)}
                  saveNext={saveNext}
                />
              </div>
            ))}
          </div>
        )}

        <p className="booking-note">
          Hai trovato la tua prossima avventura?
          <br />
          Prenota direttamente sul sito dell&apos;organizzatore.
        </p>
      </aside>

      <CityMap city={city} activities={activities} selected={selected} radiusKm={radiusKm} onSelect={select} />
    </main>
  );
}
