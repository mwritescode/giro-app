import { formatPrice } from "./format";

export type SearchVenue = {
  slug: string;
  name: string;
  address: string;
};

export type SearchActivity = {
  slug: string;
  title: string;
  venueName: string;
  priceCents: number;
};

export type SearchCategory = {
  slug: string;
  label: string;
};

export type SearchPayload = {
  venues: SearchVenue[];
  activities: SearchActivity[];
  categories: SearchCategory[];
};

export type SearchRow = {
  key: string;
  href: string;
  section: "Luoghi" | "Attività" | "Interessi";
  title: string;
  subtitle: string;
};

export const EMPTY_PAYLOAD: SearchPayload = { venues: [], activities: [], categories: [] };

export function buildRows(payload: SearchPayload, citySlug: string): SearchRow[] {
  return [
    ...payload.venues.map((venue) => ({
      key: `luogo-${venue.slug}`,
      href: `/${citySlug}?luogo=${venue.slug}`,
      section: "Luoghi" as const,
      title: venue.name,
      subtitle: venue.address,
    })),
    ...payload.activities.map((activity) => ({
      key: `attivita-${activity.slug}`,
      href: `/attivita/${activity.slug}`,
      section: "Attività" as const,
      title: activity.title,
      subtitle: `${activity.venueName} · ${formatPrice(activity.priceCents)}`,
    })),
    ...payload.categories.map((category) => ({
      key: `interesse-${category.slug}`,
      href: `/${citySlug}?interessi=${category.slug}`,
      section: "Interessi" as const,
      title: category.label,
      subtitle: "Attività per piccoli curiosi",
    })),
  ];
}

export function hasResults(payload: SearchPayload): boolean {
  return payload.venues.length > 0 || payload.activities.length > 0 || payload.categories.length > 0;
}
