import type { Category } from "./categories";

export type City = {
  id: number;
  slug: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  available: boolean;
};

export type ActivitySummary = {
  id: number;
  slug: string;
  title: string;
  category: Category;
  ageMin: number;
  ageMax: number;
  priceCents: number;
  durationMinutes: number;
  summary: string;
  image: string;
  venueName: string;
  venueAddress: string;
  venueLat: number;
  venueLng: number;
  cityName: string;
  citySlug: string;
  nextStart: string | null;
};

export type ActivitySession = {
  startsAt: string;
  endsAt: string;
};

export type ActivityDetail = ActivitySummary & {
  aboutTitle: string;
  aboutText: string;
  providerUrl: string;
  beforeYouGo: string;
  sessions: ActivitySession[];
};

export type Filters = {
  dates: string[];
  ages: number[];
  maxPriceCents: number | null;
  freeOnly: boolean;
  categories: Category[];
  radiusKm: number | null;
};
