# 2.0.0
## Breaking changes
- `search()` now returns a clean, denormalised structure: `{ offers, lowestPrices }`.
  Each offer already has its `merchant`, `edition` and `region` resolved to a
  readable name (instead of numeric ids), plus `currentPrice`, `minDiscountPrice`,
  `couponCode` and `lastUpdate`. `lowestPrices.official` and `lowestPrices.keyshops`
  expose the cheapest official-store and key-reseller price (either may be `null`).
  This replaces the previous `{ success, offers, merchants, editions, regions }` shape.

## Fixes
- Fix search returning no results: migrated to the `price_history_api` endpoint,
  as the old `admin-ajax` offers endpoint had stopped returning data.
- Cache the game catalog in the OS temp directory instead of inside the package,
  so it keeps working when installed as a read-only dependency.
- Only cache successful catalog responses (previously an error payload could be
  written to disk and read back as valid for a day).

## Improvements
- Deduplicate concurrent catalog downloads onto a single in-flight request.
- Reuse the fuzzy-search index across searches instead of rebuilding it every call.
- Behavioural test suite covering the transform, store/name filtering, currency
  handling and the error/empty paths.
- The build no longer emits test files into `dist`.

## Tooling
- Upgrade all dependencies to their latest versions (TypeScript 6.0, Jest 30,
  `@types/node` 26, …).
- Modernise `tsconfig` for TypeScript 6.0: `moduleResolution: nodenext` and an
  explicit `types` field (TS 6.0 no longer auto-includes `@types/*`).
- Replace ESLint + Prettier with [Biome](https://biomejs.dev) (`npm run check`).

# 1.3.0
- Remove axios dependency and use fetch instead.
- Upgrade dev dependencies.

# 1.2.0
- Improve performance and reduce memory usage when searching multiple games at once.
- Dramatic improvement in the search method. From 8 seconds to 0.2
## Breaking changes
- When using the `search` method and no games are found, it will return an object with success: false instead of rejecting the promise.

# 1.1.0

#### Refactor, unit tests and actions
- Refactor the code to make it simpler and more readable. Add unit tests and actions to automate the release process.