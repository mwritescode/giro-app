"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LocateFixed, Minus, Plus, Search, X } from "lucide-react";
import { formatPrice, formatSession } from "@/lib/format";
import type { ActivitySummary, City } from "@/lib/types";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const DEFAULT_ZOOM = 12;

export type MapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

type CityMapProps = {
  city: City;
  activities: ActivitySummary[];
  selected: ActivitySummary | null;
  radiusKm: number;
  onSelect: (activity: ActivitySummary) => void;
  onSearchArea: (bounds: MapBounds) => void;
  areaActive: boolean;
  onClearArea: () => void;
};

export function CityMap({
  city,
  activities,
  selected,
  radiusKm,
  onSelect,
  onSearchArea,
  areaActive,
  onClearArea,
}: CityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const libraryRef = useRef<typeof import("maplibre-gl") | null>(null);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const library = await import("maplibre-gl");
      if (cancelled || !containerRef.current) {
        return;
      }

      libraryRef.current = library;

      const map = new library.Map({
        container: containerRef.current,
        style: STYLE_URL,
        center: [city.lng, city.lat],
        zoom: DEFAULT_ZOOM,
        attributionControl: { compact: true },
      });

      mapRef.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [city.lat, city.lng]);

  useEffect(() => {
    const map = mapRef.current;
    const library = libraryRef.current;
    if (!map || !library || !ready) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = activities.map((activity) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = `price-pin${selected?.id === activity.id ? " is-selected" : ""}`;
      element.textContent = formatPrice(activity.priceCents);
      element.setAttribute("aria-label", `${activity.title}, ${formatPrice(activity.priceCents)}`);
      element.addEventListener("click", () => onSelectRef.current(activity));

      return new library.Marker({ element })
        .setLngLat([activity.venueLng, activity.venueLat])
        .addTo(map);
    });
  }, [activities, selected, ready]);

  return (
    <section className="map-panel">
      <div ref={containerRef} className="map-canvas" />

      <noscript>
        <p className="map-noscript">La mappa interattiva richiede JavaScript.</p>
      </noscript>

      <div className="map-location-label">
        {city.name} · entro {radiusKm} km
      </div>

      {areaActive ? (
        <button className="search-area is-active" type="button" onClick={onClearArea}>
          <X size={15} /> Togli il filtro area
        </button>
      ) : (
        <button
          className="search-area"
          type="button"
          onClick={() => {
            const bounds = mapRef.current?.getBounds();
            if (!bounds) {
              return;
            }
            onSearchArea({
              west: bounds.getWest(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              north: bounds.getNorth(),
            });
          }}
        >
          <Search size={16} /> Cerca in quest&apos;area
        </button>
      )}

      <div aria-live="polite">
        {selected ? (
          <article className="selected-preview">
            <div className="selected-preview-photo">
              <img src={`/images/${selected.image}.png`} alt="" />
            </div>
            <div className="selected-preview-content">
              <div>
                <p>{selected.venueName}</p>
                <h3>{selected.title}</h3>
                <span>{selected.nextStart ? formatSession(selected.nextStart) : ""}</span>
              </div>
              <div className="selected-preview-footer">
                <strong>
                  {formatPrice(selected.priceCents)}
                  {selected.priceCents > 0 ? <small> / bambino</small> : null}
                </strong>
                <Link href={`/attivita/${selected.slug}`} className="preview-cta">
                  Scopri
                </Link>
              </div>
            </div>
          </article>
        ) : null}
      </div>

      <div className="map-tools">
        <button
          type="button"
          aria-label="Centra sulla città"
          onClick={() => mapRef.current?.flyTo({ center: [city.lng, city.lat], zoom: DEFAULT_ZOOM })}
        >
          <LocateFixed size={19} />
        </button>
        <button type="button" aria-label="Ingrandisci" onClick={() => mapRef.current?.zoomIn()}>
          <Plus size={19} />
        </button>
        <button type="button" aria-label="Riduci" onClick={() => mapRef.current?.zoomOut()}>
          <Minus size={19} />
        </button>
      </div>
    </section>
  );
}
