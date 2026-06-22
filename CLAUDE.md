# CLAUDE.md

Guidance for working in this repository.

## What this is

`allkeyshop-api` — an unofficial TypeScript client for [AllKeyShop](https://www.allkeyshop.com).
Published to npm as a library (`main` → `dist/src/allkeyshop.js`). There is no server;
consumers import `AllkeyshopService` and call `search()` / `find()`.

## Commands

- `npm run build` — compile with `tsc` to `dist/` (emits `dist/src` + `dist/config` only).
- `npm test` — runs `build` then Jest (ts-jest type-checks the tests).
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
   **transforms** the raw response into the clean `GameOffers` shape (resolving merchant/
   edition/region ids to names, parsing prices). `filterByStore` narrows offers when a
   `store` is set.

Files: `allkeyshop.ts` (public class) · `gather.ts` (lookup + pricing transform + public
types) · `fetch.ts` (catalog download/cache) · `file.ts` (cache dir) · `filter.ts` (fuzzy
filters) · `config/constants.ts` (defaults).

## Conventions & gotchas

- **Two external endpoints**, both undocumented and unstable: `vaks.php` (catalog) and
  `price_history_api.php` (pricing). If search breaks, suspect an endpoint change first —
  that is exactly what 2.0.0 fixed.
- **Raw vs public types**: the raw API shapes (`Raw*`) are internal to `gather.ts`; only
  the transformed `Offer` / `LowestPrice` / `GameOffers` types are exported. Keep that boundary.
- **`dist/` is committed** and shipped (`files: ["dist"]`). Rebuild it when source changes.
- **Tests are behavioural** — assert observable behaviour, not implementation/existence.
  Mocks live in `tests/mock/`.
- Formatting is Biome-enforced: single quotes, no semicolons, 2-space indent. Non-null
  assertions are allowed in `tests/` only.
