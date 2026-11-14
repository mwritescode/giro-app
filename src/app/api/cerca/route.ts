import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { searchActivities, searchVenues } from "@/lib/queries";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/categories";
import type { SearchPayload } from "@/lib/search";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const citySlug = request.nextUrl.searchParams.get("citta") ?? "firenze";

  if (query.length < 2) {
    return NextResponse.json<SearchPayload>({ venues: [], activities: [], categories: [] });
  }

  const venues = searchVenues(query, citySlug, 4).map((venue) => ({
    slug: venue.slug,
    name: venue.name,
    address: venue.address,
  }));

  const activities = searchActivities(query, citySlug, 5).map((activity) => ({
    slug: activity.slug,
    title: activity.title,
    venueName: activity.venueName,
    priceCents: activity.priceCents,
  }));

  const categories = CATEGORY_SLUGS.filter((slug) =>
    CATEGORY_LABELS[slug].toLowerCase().includes(query.toLowerCase()),
  ).map((slug) => ({ slug, label: CATEGORY_LABELS[slug] }));

  return NextResponse.json<SearchPayload>({ venues, activities, categories });
}
