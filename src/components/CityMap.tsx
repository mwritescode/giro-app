import Link from "next/link";
import { LocateFixed, Minus, Plus, Search } from "lucide-react";
import { formatPrice, formatSession } from "@/lib/format";
import type { ActivitySummary, City } from "@/lib/types";

const MAP_IMAGES: Record<string, string> = {
  firenze: "/images/florence-map.png",
  milano: "/images/milan-map.png",
};

const SPAN_LAT = 0.045;
const SPAN_LNG = 0.062;

type CityMapProps = {
  city: City;
  activities: ActivitySummary[];
  selected: ActivitySummary | null;
  radiusKm: number;
  onSelect: (activity: ActivitySummary) => void;
};

export function CityMap({ city, activities, selected, radiusKm, onSelect }: CityMapProps) {
  const minLat = city.lat - SPAN_LAT;
  const maxLat = city.lat + SPAN_LAT;
  const minLng = city.lng - SPAN_LNG;
  const maxLng = city.lng + SPAN_LNG;

  const pins = activities.slice(0, 10).map((activity) => {
    const x = Math.min(94, Math.max(6, ((activity.venueLng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.min(88, Math.max(10, ((maxLat - activity.venueLat) / (maxLat - minLat)) * 100));
    return { activity, x, y };
  });

  return (
    <section className="map-panel">
      <img
        className="city-map"
        src={MAP_IMAGES[city.slug] ?? MAP_IMAGES.firenze}
        alt={`Mappa di ${city.name}`}
      />

      <div className="map-location-label">
        {city.name} · entro {radiusKm} km
      </div>

      <button className="search-area" type="button">
        <Search size={16} /> Cerca in quest&apos;area
      </button>

      <div className="map-tools">
        <button type="button" aria-label="Centra sulla città">
          <LocateFixed size={19} />
        </button>
        <button type="button" aria-label="Ingrandisci">
          <Plus size={19} />
        </button>
        <button type="button" aria-label="Riduci">
          <Minus size={19} />
        </button>
      </div>

      {pins.map(({ activity, x, y }) => {
        const isSelected = selected?.id === activity.id;
        return (
          <button
            key={activity.id}
            type="button"
            className={`price-pin${isSelected ? " is-selected" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => onSelect(activity)}
            aria-pressed={isSelected}
            aria-label={`${activity.title}, ${formatPrice(activity.priceCents)}`}
          >
            {formatPrice(activity.priceCents)}
          </button>
        );
      })}

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

      <p className="map-attribution">© OpenStreetMap contributors</p>
    </section>
  );
}
