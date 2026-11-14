import { getDb } from "./db";
import type { Category } from "./seed";
import type { ActivityDetail, ActivitySession, ActivitySummary, City, Filters } from "./types";

type CityRow = {
  id: number;
  slug: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  available: number;
};

type ActivityRow = {
  id: number;
  slug: string;
  title: string;
  category: Category;
  age_min: number;
  age_max: number;
  price_cents: number;
  duration_minutes: number;
  summary: string;
  image: string;
  venue_name: string;
  venue_address: string;
  venue_lat: number;
  venue_lng: number;
  city_name: string;
  city_slug: string;
  next_start: string | null;
};

function toCity(row: CityRow): City {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    region: row.region,
    lat: row.lat,
    lng: row.lng,
    available: row.available === 1,
  };
}

function toSummary(row: ActivityRow): ActivitySummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    ageMin: row.age_min,
    ageMax: row.age_max,
    priceCents: row.price_cents,
    durationMinutes: row.duration_minutes,
    summary: row.summary,
    image: row.image,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    venueLat: row.venue_lat,
    venueLng: row.venue_lng,
    cityName: row.city_name,
    citySlug: row.city_slug,
    nextStart: row.next_start,
  };
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

export function listCities(): City[] {
  const rows = getDb().prepare("SELECT * FROM cities ORDER BY available DESC, name").all() as CityRow[];
  return rows.map(toCity);
}

export function getCityBySlug(slug: string): City | null {
  const row = getDb().prepare("SELECT * FROM cities WHERE slug = ?").get(slug) as CityRow | undefined;
  return row ? toCity(row) : null;
}

export function findCities(query: string): City[] {
  const term = `%${query.trim().toLowerCase()}%`;
  const rows = getDb()
    .prepare("SELECT * FROM cities WHERE lower(name) LIKE ? OR lower(region) LIKE ? ORDER BY available DESC, name")
    .all(term, term) as CityRow[];
  return rows.map(toCity);
}

export function listActivities(citySlug: string, filters: Filters): ActivitySummary[] {
  const now = new Date().toISOString().slice(0, 16);
  const clauses: string[] = ["c.slug = ?"];
  const params: (string | number)[] = [];

  const dateList = filters.dates.filter(Boolean);
  const datePlaceholders = dateList.map(() => "?").join(", ");

  const nextStart = dateList.length
    ? `(SELECT MIN(s.starts_at) FROM sessions s WHERE s.activity_id = a.id AND substr(s.starts_at, 1, 10) IN (${datePlaceholders}))`
    : "(SELECT MIN(s.starts_at) FROM sessions s WHERE s.activity_id = a.id AND s.starts_at >= ?)";

  const nextParams = dateList.length ? dateList : [now];
  params.push(...nextParams);
  params.push(citySlug);

  if (filters.freeOnly) {
    clauses.push("a.price_cents = 0");
  } else if (filters.maxPriceCents !== null) {
    clauses.push("a.price_cents <= ?");
    params.push(filters.maxPriceCents);
  }

  if (filters.categories.length) {
    clauses.push(`a.category IN (${filters.categories.map(() => "?").join(", ")})`);
    params.push(...filters.categories);
  }

  if (filters.ages.length) {
    clauses.push("a.age_min <= ? AND a.age_max >= ?");
    params.push(Math.max(...filters.ages), Math.min(...filters.ages));
  }

  if (dateList.length) {
    clauses.push(
      `EXISTS (SELECT 1 FROM sessions s2 WHERE s2.activity_id = a.id AND substr(s2.starts_at, 1, 10) IN (${datePlaceholders}))`,
    );
    params.push(...dateList);
  }

  const sql = `
    SELECT a.id, a.slug, a.title, a.category, a.age_min, a.age_max, a.price_cents,
           a.duration_minutes, a.summary, a.image,
           v.name AS venue_name, v.address AS venue_address, v.lat AS venue_lat, v.lng AS venue_lng,
           c.name AS city_name, c.slug AS city_slug,
           ${nextStart} AS next_start
    FROM activities a
    JOIN venues v ON v.id = a.venue_id
    JOIN cities c ON c.id = v.city_id
    WHERE ${clauses.join(" AND ")}
    ORDER BY next_start IS NULL, next_start, a.title
  `;

  let rows = getDb().prepare(sql).all(...params) as ActivityRow[];
  rows = rows.filter((row) => row.next_start !== null);

  const city = getCityBySlug(citySlug);
  if (city && filters.radiusKm) {
    rows = rows.filter((row) => distanceKm(city.lat, city.lng, row.venue_lat, row.venue_lng) <= filters.radiusKm!);
  }

  return rows.map(toSummary);
}

export function countActivities(citySlug: string): number {
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS count FROM activities a
       JOIN venues v ON v.id = a.venue_id
       JOIN cities c ON c.id = v.city_id
       WHERE c.slug = ?`,
    )
    .get(citySlug) as { count: number };
  return row.count;
}

export function getActivityBySlug(slug: string): ActivityDetail | null {
  const row = getDb()
    .prepare(
      `SELECT a.*, v.name AS venue_name, v.address AS venue_address, v.lat AS venue_lat, v.lng AS venue_lng,
              c.name AS city_name, c.slug AS city_slug,
              (SELECT MIN(s.starts_at) FROM sessions s WHERE s.activity_id = a.id AND s.starts_at >= ?) AS next_start
       FROM activities a
       JOIN venues v ON v.id = a.venue_id
       JOIN cities c ON c.id = v.city_id
       WHERE a.slug = ?`,
    )
    .get(new Date().toISOString().slice(0, 16), slug) as (ActivityRow & {
    about_title: string;
    about_text: string;
    provider_url: string;
    before_you_go: string;
  }) | undefined;

  if (!row) {
    return null;
  }

  const sessions = getDb()
    .prepare("SELECT starts_at, ends_at FROM sessions WHERE activity_id = ? AND starts_at >= ? ORDER BY starts_at LIMIT 8")
    .all(row.id, new Date().toISOString().slice(0, 16)) as { starts_at: string; ends_at: string }[];

  return {
    ...toSummary(row),
    aboutTitle: row.about_title,
    aboutText: row.about_text,
    providerUrl: row.provider_url,
    beforeYouGo: row.before_you_go,
    sessions: sessions.map<ActivitySession>((session) => ({
      startsAt: session.starts_at,
      endsAt: session.ends_at,
    })),
  };
}

export function listFavourites(userId: number): ActivitySummary[] {
  const rows = getDb()
    .prepare(
      `SELECT a.id, a.slug, a.title, a.category, a.age_min, a.age_max, a.price_cents,
              a.duration_minutes, a.summary, a.image,
              v.name AS venue_name, v.address AS venue_address, v.lat AS venue_lat, v.lng AS venue_lng,
              c.name AS city_name, c.slug AS city_slug,
              (SELECT MIN(s.starts_at) FROM sessions s WHERE s.activity_id = a.id AND s.starts_at >= ?) AS next_start
       FROM favourites f
       JOIN activities a ON a.id = f.activity_id
       JOIN venues v ON v.id = a.venue_id
       JOIN cities c ON c.id = v.city_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
    )
    .all(new Date().toISOString().slice(0, 16), userId) as ActivityRow[];
  return rows.map(toSummary);
}

export function favouriteIdsFor(userId: number): Set<number> {
  const rows = getDb()
    .prepare("SELECT activity_id FROM favourites WHERE user_id = ?")
    .all(userId) as { activity_id: number }[];
  return new Set(rows.map((row) => row.activity_id));
}

export function isFavourite(userId: number, activityId: number): boolean {
  const row = getDb()
    .prepare("SELECT 1 AS present FROM favourites WHERE user_id = ? AND activity_id = ?")
    .get(userId, activityId) as { present: number } | undefined;
  return Boolean(row);
}

export function toggleFavouriteRow(userId: number, activityId: number): boolean {
  const db = getDb();
  if (isFavourite(userId, activityId)) {
    db.prepare("DELETE FROM favourites WHERE user_id = ? AND activity_id = ?").run(userId, activityId);
    return false;
  }
  db.prepare("INSERT INTO favourites (user_id, activity_id, created_at) VALUES (?, ?, ?)").run(
    userId,
    activityId,
    new Date().toISOString(),
  );
  return true;
}
