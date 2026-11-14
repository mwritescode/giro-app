import { getDb } from "./d1";
import type { Category } from "./categories";
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

export async function listCities(): Promise<City[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM cities ORDER BY available DESC, name")
    .all<CityRow>();
  return results.map(toCity);
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM cities WHERE slug = ?").bind(slug).first<CityRow>();
  return row ? toCity(row) : null;
}

export async function findCities(query: string): Promise<City[]> {
  const db = await getDb();
  const term = `%${query.trim().toLowerCase()}%`;
  const { results } = await db
    .prepare("SELECT * FROM cities WHERE lower(name) LIKE ? OR lower(region) LIKE ? ORDER BY available DESC, name")
    .bind(term, term)
    .all<CityRow>();
  return results.map(toCity);
}

export async function listActivities(citySlug: string, filters: Filters): Promise<ActivitySummary[]> {
  const db = await getDb();
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

  if (filters.venueSlug) {
    clauses.push("v.slug = ?");
    params.push(filters.venueSlug);
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

  const { results } = await db.prepare(sql).bind(...params).all<ActivityRow>();
  let rows = results.filter((row) => row.next_start !== null);

  const city = await getCityBySlug(citySlug);
  if (city && filters.radiusKm) {
    rows = rows.filter((row) => distanceKm(city.lat, city.lng, row.venue_lat, row.venue_lng) <= filters.radiusKm!);
  }

  return rows.map(toSummary);
}

export async function countActivities(citySlug: string): Promise<number> {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS count FROM activities a
       JOIN venues v ON v.id = a.venue_id
       JOIN cities c ON c.id = v.city_id
       WHERE c.slug = ?`,
    )
    .bind(citySlug)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

export async function getActivityBySlug(slug: string): Promise<ActivityDetail | null> {
  const db = await getDb();
  const now = new Date().toISOString().slice(0, 16);

  const row = await db
    .prepare(
      `SELECT a.*, v.name AS venue_name, v.address AS venue_address, v.lat AS venue_lat, v.lng AS venue_lng,
              c.name AS city_name, c.slug AS city_slug,
              (SELECT MIN(s.starts_at) FROM sessions s WHERE s.activity_id = a.id AND s.starts_at >= ?) AS next_start
       FROM activities a
       JOIN venues v ON v.id = a.venue_id
       JOIN cities c ON c.id = v.city_id
       WHERE a.slug = ?`,
    )
    .bind(now, slug)
    .first<ActivityRow & {
      about_title: string;
      about_text: string;
      provider_url: string;
      before_you_go: string;
    }>();

  if (!row) {
    return null;
  }

  const { results } = await db
    .prepare("SELECT starts_at, ends_at FROM sessions WHERE activity_id = ? AND starts_at >= ? ORDER BY starts_at LIMIT 8")
    .bind(row.id, now)
    .all<{ starts_at: string; ends_at: string }>();

  return {
    ...toSummary(row),
    aboutTitle: row.about_title,
    aboutText: row.about_text,
    providerUrl: row.provider_url,
    beforeYouGo: row.before_you_go,
    sessions: results.map<ActivitySession>((session) => ({
      startsAt: session.starts_at,
      endsAt: session.ends_at,
    })),
  };
}

export async function listFavourites(userId: number): Promise<ActivitySummary[]> {
  const db = await getDb();
  const { results } = await db
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
    .bind(new Date().toISOString().slice(0, 16), userId)
    .all<ActivityRow>();
  return results.map(toSummary);
}

export async function favouriteIdsFor(userId: number): Promise<Set<number>> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT activity_id FROM favourites WHERE user_id = ?")
    .bind(userId)
    .all<{ activity_id: number }>();
  return new Set(results.map((row) => row.activity_id));
}

export async function isFavourite(userId: number, activityId: number): Promise<boolean> {
  const db = await getDb();
  const row = await db
    .prepare("SELECT 1 AS present FROM favourites WHERE user_id = ? AND activity_id = ?")
    .bind(userId, activityId)
    .first<{ present: number }>();
  return Boolean(row);
}

export async function toggleFavouriteRow(userId: number, activityId: number): Promise<boolean> {
  const db = await getDb();

  if (await isFavourite(userId, activityId)) {
    await db
      .prepare("DELETE FROM favourites WHERE user_id = ? AND activity_id = ?")
      .bind(userId, activityId)
      .run();
    return false;
  }

  await db
    .prepare("INSERT INTO favourites (user_id, activity_id, created_at) VALUES (?, ?, ?)")
    .bind(userId, activityId, new Date().toISOString())
    .run();
  return true;
}

export type VenueResult = {
  slug: string;
  name: string;
  address: string;
  cityName: string;
};

export async function searchVenues(term: string, citySlug: string, limit: number): Promise<VenueResult[]> {
  const db = await getDb();
  const pattern = `%${term.trim().toLowerCase()}%`;
  const { results } = await db
    .prepare(
      `SELECT v.slug, v.name, v.address, c.name AS city_name
       FROM venues v
       JOIN cities c ON c.id = v.city_id
       WHERE c.slug = ? AND (lower(v.name) LIKE ? OR lower(v.address) LIKE ?)
       ORDER BY v.name
       LIMIT ?`,
    )
    .bind(citySlug, pattern, pattern, limit)
    .all<{ slug: string; name: string; address: string; city_name: string }>();

  return results.map((row) => ({
    slug: row.slug,
    name: row.name,
    address: row.address,
    cityName: row.city_name,
  }));
}

export async function searchActivities(
  term: string,
  citySlug: string,
  limit: number | null,
): Promise<ActivitySummary[]> {
  const db = await getDb();
  const pattern = `%${term.trim().toLowerCase()}%`;
  const { results } = await db
    .prepare(
      `SELECT a.id, a.slug, a.title, a.category, a.age_min, a.age_max, a.price_cents,
              a.duration_minutes, a.summary, a.image,
              v.name AS venue_name, v.address AS venue_address, v.lat AS venue_lat, v.lng AS venue_lng,
              c.name AS city_name, c.slug AS city_slug,
              (SELECT MIN(s.starts_at) FROM sessions s WHERE s.activity_id = a.id AND s.starts_at >= ?) AS next_start
       FROM activities a
       JOIN venues v ON v.id = a.venue_id
       JOIN cities c ON c.id = v.city_id
       WHERE c.slug = ?
         AND (lower(a.title) LIKE ? OR lower(a.summary) LIKE ? OR lower(v.name) LIKE ?)
       ORDER BY a.title
       LIMIT ?`,
    )
    .bind(new Date().toISOString().slice(0, 16), citySlug, pattern, pattern, pattern, limit ?? -1)
    .all<ActivityRow>();

  return results.map(toSummary);
}

export async function getVenueBySlug(
  slug: string,
): Promise<{ slug: string; name: string; address: string; citySlug: string } | null> {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT v.slug, v.name, v.address, c.slug AS city_slug
       FROM venues v
       JOIN cities c ON c.id = v.city_id
       WHERE v.slug = ?`,
    )
    .bind(slug)
    .first<{ slug: string; name: string; address: string; city_slug: string }>();

  return row ? { slug: row.slug, name: row.name, address: row.address, citySlug: row.city_slug } : null;
}
