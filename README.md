# giro.

A discovery site for kids' activities in Florence and Milan. Parents browse a
curated catalogue, filter by date, age, price and interest, see everything on a
map, save favourites, and book on the organiser's own site.

Aggregator, not a booking platform: there is no checkout and no payment flow by
design. Every activity hands off to its organiser.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Cloudflare D1 (SQLite) for data, with MapLibre for the map
- Plain CSS with the design tokens from the design file
- Lucide icons

## Running it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. `next dev` runs with the Cloudflare bindings attached
(see `initOpenNextCloudflareForDev` in `next.config.ts`), so the database is the
same D1 you get in production, backed locally by `.wrangler/state`. The schema is
created and the catalogue seeded on the first request. Delete `.wrangler/` to
start from an empty database again.

To run the app in the real Workers runtime instead of Node:

```bash
pnpm preview      # builds for Workers and serves on :8787
```

### Signing in locally

Accounts use magic links, but there is no email service in local development:
the link is printed to the terminal running `pnpm dev`.

1. Go to `/accedi`, enter any email address.
2. Copy the `http://localhost:3000/accedi/verifica?token=…` line from the terminal.
3. Open it. You are signed in and can save activities.

Links expire after 15 minutes and work once.

Without a mailer key the link is printed to the terminal. To send real email,
set `RESEND_API_KEY` (and optionally `RESEND_FROM`) in `.dev.vars` locally, or as
a Worker secret in production. `sendLoginEmail` in `src/lib/mailer.ts` uses Resend
when the key is present and falls back to the console otherwise. Set `APP_URL` if
links should point somewhere other than the request host.

### The map worker

MapLibre runs tile parsing in a web worker, and Turbopack does not emit that
worker file. `scripts/copy-maplibre-worker.mjs` copies it into
`public/maplibre/` on install, dev and build, and `CityMap` points MapLibre at
it with `setWorkerUrl`. `public/maplibre/` is gitignored, so the copy always
matches the installed version.

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
  progetto/page.tsx           what the project is and what it is not
  privacy/page.tsx            privacy notice
  accedi/                     sign-in, "check your email", expired link
  accedi/verifica/route.ts    consumes the token, sets the session cookie
  preferiti/page.tsx          saved activities, filled and empty
  actions.ts                  server actions: request login, toggle favourite, logout
src/components/               header, account menu, discovery, cards, map, filter panel
src/lib/
  schema.ts                   SQL schema, applied on boot
  d1.ts                       the D1 handle, schema and seed bootstrap
  seed.ts                     the catalogue: cities, venues, activities
  queries.ts                  all reads, incl. filtering and favourites
  auth.ts                     magic-link tokens, sessions, cookies
  mailer.ts                   dev implementation: prints the link
  params.ts                   URL ⇄ filters (filters live in the query string)
  format.ts                   Italian dates, prices, durations
```

Filters live in the URL, so a filtered view is shareable and the back button
works:

```
/firenze?data=2026-11-21,2026-11-22&eta=6,7&gratis=1&interessi=arte&raggio=10
```

Selecting a pin on the map updates the preview and the list highlight without
moving the page, and mirrors the choice into `selezionata` with `replaceState`,
so it is shareable without adding history entries.

The filter panel is a plain `GET` form, so filtering works with no client-side
JavaScript at all.

## Data

36 activities across 12 Florentine and 24 Milan venues, with recurring sessions
generated for the next six weekends. Venue names and addresses are real;
coordinates are approximate and should be verified before this is used for
anything beyond a demo. Photos are placeholder assets from the design file.

## Deploying

`pnpm deploy` builds for Workers and pushes to Cloudflare. It needs a Cloudflare
account and `wrangler login` once, plus a real D1 database id in `wrangler.jsonc`
(the placeholder there is for local development). Magic links also need a real
sender: swap the console implementation in `src/lib/mailer.ts` for a provider
such as Resend, and set `APP_URL` to the deployed origin.

## Not built yet

- Search with grouped suggestions (places / activities / interests)
- Real map: MapLibre with OpenStreetMap tiles instead of the static map image
- Share buttons and Open Graph previews for activities
- "Come funziona", Terms and Privacy
- Real email delivery for magic links (code ready, key not configured)
