export const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cities (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  available INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city_id INTEGER NOT NULL REFERENCES cities (id),
  lat REAL NOT NULL,
  lng REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  venue_id INTEGER NOT NULL REFERENCES venues (id),
  category TEXT NOT NULL,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  summary TEXT NOT NULL,
  about_title TEXT NOT NULL,
  about_text TEXT NOT NULL,
  image TEXT NOT NULL,
  provider_url TEXT NOT NULL,
  before_you_go TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  activity_id INTEGER NOT NULL REFERENCES activities (id) ON DELETE CASCADE,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_activity_idx ON sessions (activity_id);
CREATE INDEX IF NOT EXISTS sessions_starts_idx ON sessions (starts_at);
CREATE INDEX IF NOT EXISTS activities_venue_idx ON activities (venue_id);
`;
