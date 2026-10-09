# CLAUDE.md

Guidance for working in this repository.

## What this is

`allkeyshop-api` — an unofficial TypeScript client for [AllKeyShop](https://www.allkeyshop.com).
Published to npm as a library (`main` → `dist/src/allkeyshop.js`). There is no server;
consumers import `AllkeyshopService` and call `search()` / `find()`.

## Commands

Use Node.js 24 LTS for development. CI tests Node 22 and 24.

- `npm run build` — compile with `tsc` to `dist/` (emits `dist/src` + `dist/config` only).
- `npm run typecheck` — TypeScript 7 checks source, configuration constants, and tests without emitting files.
- `npm test` — runs `typecheck`, `build`, then Jest against `dist/`. Babel transforms the tests and hoists Jest mocks.
- `npm run check` — Biome: format + lint + organise imports, with `--write`. Use this before committing.
- `npm run lint` / `npm run format` — lint-only / format-only.

## Architecture

The public surface is one class with two methods:

- `AllkeyshopService.search(name)` → `GameOffers` — offers + lowest prices for the best-matching game.
- `AllkeyshopService.find(name)` → `ProductIdsResponse` — just the matching game names/ids, no pricing.

Constructor options: `currency` (default `eur`), `platform` (default PC; appended to the
search term, `pc` means none), `store` (default any; filters offers by merchant name).

Data flow for `search()`:

1. `gather.ts:getProductIds` → `fetch.ts:fetchAllGames` downloads the **full** game
   catalog (`vaks.php`) once, caches it on disk (`os.tmpdir()`, 1-day TTL) and in memory,
   then `filter.ts:filterByName` fuzzy-matches the name locally.
2. `gather.ts:getGameData` fetches pricing for the top match (`price_history_api.php`) and
   **transforms** the raw response into the clean `GameOffers` shape: it validates each
   history record, keeps the newest record per merchant/edition/region seen in the last
   7 days, resolves ids to names and computes the current lows. `filterByStore` narrows
   offers when a `store` is set; the lows always cover all stores.

Files: `allkeyshop.ts` (public class) · `gather.ts` (lookup + pricing transform + public
types) · `fetch.ts` (catalog download/cache) · `file.ts` (cache dir) · `filter.ts` (fuzzy
filters) · `config/constants.ts` (defaults).

## Conventions & gotchas

- **Two external endpoints**, both undocumented and unstable: `vaks.php` (catalog) and
  `price_history_api.php` (pricing). If search breaks, suspect an endpoint change first —
  that is exactly what 2.0.0 fixed.
- **Raw vs public shapes**: the raw response is parsed as `unknown` and validated inside
  `gather.ts`; only the transformed `Offer` / `LowestPrice(s)` / `GameOffers` types are
  exported. Keep that boundary.
- **Pricing history semantics**: the endpoint returns years of records per listing. The
  newest record is usually still open and has no `last_price` or `best_discount_code`,
  so `currentPrice`/`couponCode` are often `null`. `min_discount_price` is always present
  and drives the current lows. Upstream timestamps are UTC.
- **`dist/` is committed** and shipped (`files: ["dist"]`). Rebuild it when source changes.
- **Compiler and test transforms are separate**: TypeScript 7 builds and type-checks;
  Babel strips test types and converts their modules for Jest. Imports from
  `../src/` resolve to the TypeScript build in `dist/src/`. Test type-checking belongs
  in `tsconfig.typecheck.json`; tests must stay out of the published `dist/` build.
- **Tests are behavioural** — assert observable behaviour, not implementation/existence.
  Mocks live in `tests/mock/`.
- Formatting is Biome-enforced: single quotes, no semicolons, 2-space indent. Non-null
  assertions are allowed in `tests/` only.
