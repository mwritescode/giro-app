import { upcomingWeekend } from "./format";
import { CATEGORY_SLUGS, type Category } from "./categories";
import type { Filters } from "./types";

export type RawParams = Record<string, string | string[] | undefined>;

export function normalizeParams(raw: RawParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      out[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      out[key] = value.join(",");
    }
  }
  return out;
}

export function parseFilters(params: Record<string, string>): Filters {
  const dates =
    params.data === "tutte"
      ? []
      : params.data
        ? params.data.split(",").filter(Boolean)
        : upcomingWeekend();

  const ages = (params.eta ?? "")
    .split(",")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  const categories = (params.interessi ?? "")
    .split(",")
    .filter((value): value is Category => CATEGORY_SLUGS.includes(value as Category));

  return {
    dates,
    ages,
    maxPriceCents: params.prezzo ? Number(params.prezzo) * 100 : null,
    freeOnly: params.gratis === "1",
    categories,
    radiusKm: params.raggio ? Number(params.raggio) : 10,
    venueSlug: params.luogo ?? null,
  };
}

export function buildHref(base: string, params: Record<string, string>, patch: Record<string, string | null>): string {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }
  const query = next.toString();
  return query ? `${base}?${query}` : base;
}
