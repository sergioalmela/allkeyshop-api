# 3.0.0
## Breaking changes
- `search()` returns current offers instead of the full price history. `offers`
  has one entry per merchant, edition and region: the newest record, if it was
  seen in the last 7 days. Each offer has a new `lastSeen` field.
- `currentPrice` and `couponCode` are `null` when the upstream has not filled
  them yet. This is usual for the newest, still-open price record.
- `lowestPrices` is the cheapest current `minDiscountPrice` at official stores
  and at key resellers, across all editions and regions. Its `lastUpdate` is
  when that price was last seen. The previous values, the upstream all-time
  lows, moved to the new `historicalLows` field.
- `search()` rejects when the game catalog cannot be loaded or the pricing
  request fails. It still returns empty offers when no game matches. `find()`
  reports a catalog failure as `status: 'error'` with the message
  `'Game catalog unavailable'`.

## Fixes
- Validate pricing records and omit malformed or unresolved ones instead of
  returning `undefined` prices or names.
- Recover from an unreadable or invalid catalog cache, write it atomically, and
  apply the one-day expiry to the in-memory catalog too.
- Reject HTTP errors from both endpoints instead of parsing them as data, and
  encode the pricing request parameters.

## Tooling
- TypeScript 7, Biome 2.5.15, Jest 30.5. Develop on Node 24 LTS.
- Replace ts-jest with babel-jest and add `npm run typecheck`; tests run
  against the compiled `dist/`. Remove ts-node and the unused ts-loader.
- CI runs on pull requests and on pushes to `main`, on Node 22 and 24.

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