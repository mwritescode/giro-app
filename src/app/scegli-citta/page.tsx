import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, MapPin, Search, X } from "lucide-react";
import { normalizeParams, type RawParams } from "@/lib/params";
import { findCities, getCityBySlug, listCities } from "@/lib/queries";

const RADII = [5, 10, 25, 50];

export default async function ScegliCittaPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  const query = params.q?.trim() ?? "";
  const radius = RADII.includes(Number(params.raggio)) ? Number(params.raggio) : 10;
  const selectedSlug = params.citta ?? "firenze";

  if (params.azione === "esplora") {
    const city = await getCityBySlug(selectedSlug);
    if (city?.available) {
      redirect(`/${city.slug}?raggio=${radius}`);
    }
  }

  const allCities = await listCities();
  const availableCities = allCities.filter((city) => city.available);
  const availableCityNames = availableCities.map((city) => city.name);
  const results = query ? await findCities(query) : allCities;
  const available = results.filter((city) => city.available);
  const unavailable = results.filter((city) => !city.available);
  const selected = await getCityBySlug(selectedSlug);

  return (
    <main className="auth-shell">
      <form className="city-chooser" method="get" action="/scegli-citta">
        <input type="hidden" name="azione" value="esplora" />

        <header className="city-chooser-header">
          <h1>Dove vuoi esplorare?</h1>
          <Link href="/firenze" className="icon-button" aria-label="Chiudi">
            <X size={20} />
          </Link>
        </header>

        <div className="city-chooser-body">
          <div className="city-query">
            <Search size={18} />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Cerca una città"
              aria-label="Cerca una città"
            />
            <button type="submit" className="reset-filters">
              Cerca
            </button>
          </div>

          {unavailable.length > 0 && available.length === 0 ? (
            <div className="city-unavailable">
              <h2>Non siamo ancora a {unavailable[0].name}</h2>
              <p>
                Per ora puoi esplorare {availableCityNames.join(" e ")}
                , anche nei dintorni.
              </p>
            </div>
          ) : null}

          <div>
            <p className="city-options-label">
              {unavailable.length > 0 && available.length === 0 ? "Scegli una città disponibile" : "Città disponibili"}
            </p>

            {(available.length > 0 ? available : availableCities).map((city) => (
              <label key={city.id} className={`city-option${city.slug === selectedSlug ? " is-selected" : ""}`}>
                <input
                  type="radio"
                  name="citta"
                  value={city.slug}
                  defaultChecked={city.slug === selectedSlug}
                  hidden
                />
                <span className="city-option-icon">
                  <MapPin size={20} />
                </span>
                <div>
                  <h2>{city.name}</h2>
                  <p>{city.region}</p>
                </div>
                {city.slug === selectedSlug ? <Check size={19} /> : <ArrowRight size={17} />}
              </label>
            ))}
          </div>

          <section className="city-radius">
            <h2>Distanza dalla città</h2>
            <div className="radius-options">
              {RADII.map((value) => (
                <label key={value} className="choice">
                  <input type="radio" name="raggio" value={value} defaultChecked={value === radius} />
                  {value} km
                </label>
              ))}
            </div>
            <p>Dal centro di {selected?.name ?? "Firenze"}, inclusi i dintorni.</p>
          </section>
        </div>

        <footer className="city-chooser-footer">
          <button type="submit">
            Esplora {selected?.name ?? "Firenze"} <ArrowRight size={17} />
          </button>
        </footer>
      </form>
    </main>
  );
}
