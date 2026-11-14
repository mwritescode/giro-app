# giro.

A discovery site for kids' activities in Florence and Milan. Parents browse a
curated catalogue, filter by date, age, price and interest, see everything on a
map, save favourites, and book on the organiser's own site.

Aggregator, not a booking platform: there is no checkout and no payment flow by
design. Every activity hands off to its organiser.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- SQLite through Node's built-in `node:sqlite` — no native modules, no ORM
- Plain CSS with the design tokens from the design file
- Lucide icons

## Running it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. The database is created and seeded automatically on
first request at `.data/giro.db` (gitignored). Delete that folder to re-seed.

```bash
pnpm build && pnpm start   # production build
```

## How it is put together

```
src/app/
  page.tsx                    / → redirects to /firenze
  firenze/page.tsx            discovery, Florence
  milano/page.tsx             discovery, Milan
  scegli-citta/page.tsx       city + radius chooser, incl. "not available" state
  attivita/[slug]/page.tsx    activity detail
src/components/               header, discovery, cards, map, filter panel
src/lib/
  schema.ts                   SQL schema, applied on boot
  seed.ts                     the catalogue: cities, venues, activities
  queries.ts                  all reads, incl. filtering
  params.ts                   URL ⇄ filters (filters live in the query string)
  format.ts                   Italian dates, prices, durations
```

Filters live in the URL, so a filtered view is shareable and the back button
works:

```
/firenze?data=2026-11-21,2026-11-22&eta=6,7&gratis=1&interessi=arte&raggio=10
```

The filter panel is a plain `GET` form, so filtering works with no client-side
JavaScript at all.

## Data

36 activities across 12 Florentine and 24 Milan venues, with recurring sessions
generated for the next six weekends. Venue names and addresses are real;
coordinates are approximate and should be verified before this is used for
anything beyond a demo. Photos are placeholder assets from the design file.

## Not built yet

- Accounts and favourites (magic link) — the UI is designed, the code is not written
- Search with grouped suggestions (places / activities / interests)
- Real map: MapLibre with OpenStreetMap tiles instead of the static map image
- Share buttons and Open Graph previews for activities
- "Come funziona", Terms and Privacy
