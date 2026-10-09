import { fetchAllGames } from './fetch'
import { filterByName, filterByStore } from './filter'

// --- Public output shape (what consumers of the API receive) ---

/** A recorded offer from the upstream price history. */
export interface Offer {
  merchant: string
  edition: string
  region: string
  currentPrice: number
  minDiscountPrice: number
  couponCode: string | null
  lastUpdate: string
}

/** A historical low across all stores, independent of the store filter. */
export interface LowestPrice {
  merchant: string
  price: number
  lastUpdate: string
}

export interface GameOffers {
  offers: Offer[]
  lowestPrices: {
    official: LowestPrice | null
    keyshops: LowestPrice | null
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isPrice = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

const isMerchantId = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0

const isTimestamp = (value: unknown): value is string => {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
  ) {
    return false
  }

  const date = new Date(`${value.replace(' ', 'T')}Z`)
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 19).replace('T', ' ') === value
  )
}

const resolveName = (catalog: unknown, id: string | number): string => {
  if (!isRecord(catalog)) {
    return ''
  }

  const item = catalog[String(id)]
  return isRecord(item) && typeof item.name === 'string' ? item.name : ''
}

const toOffer = (
  entry: unknown,
  raw: Record<string, unknown>
): Offer | undefined => {
  if (
    !isRecord(entry) ||
    !isMerchantId(entry.merchant_id) ||
    typeof entry.edition !== 'string' ||
    !/^[1-9]\d*$/.test(entry.edition) ||
    typeof entry.region !== 'string' ||
    !/^[a-z0-9]+$/i.test(entry.region) ||
    !isPrice(entry.last_price) ||
    !isPrice(entry.min_discount_price) ||
    !isTimestamp(entry.start) ||
    (entry.best_discount_code != null &&
      typeof entry.best_discount_code !== 'string')
  ) {
    return undefined
  }

  const merchant = resolveName(raw.merchants, entry.merchant_id)
  const edition = resolveName(raw.editions, entry.edition)
  const region = resolveName(raw.regions, entry.region)
  if (merchant.trim() === '' || edition.trim() === '' || region.trim() === '') {
    return undefined
  }

  return {
    merchant,
    edition,
    region,
    currentPrice: entry.last_price,
    minDiscountPrice: entry.min_discount_price,
    couponCode: entry.best_discount_code ?? null,
    lastUpdate: entry.start,
  }
}

const toLowestPrice = (
  summary: unknown,
  raw: Record<string, unknown>
): LowestPrice | null => {
  if (
    !isRecord(summary) ||
    !isMerchantId(summary.merchant_id) ||
    typeof summary.price !== 'string' ||
    !/^\d+(?:\.\d+)?$/.test(summary.price) ||
    !isPrice(Number(summary.price)) ||
    !isTimestamp(summary.last_update)
  ) {
    return null
  }

  const merchant = resolveName(raw.merchants, summary.merchant_id)
  if (merchant.trim() === '') {
    return null
  }

  return {
    merchant,
    price: Number(summary.price),
    lastUpdate: summary.last_update,
  }
}

export const getGameData = async (
  games: BasicGameData[],
  currency: string,
  store: string
): Promise<GameOffers | undefined> => {
  if (games === undefined || games.length === 0) {
    return undefined
  }

  const gameId = games[0].id
  const url = new URL('https://www.allkeyshop.com/api/price_history_api.php')
  url.search = new URLSearchParams({
    normalised_name: gameId,
    currency: currency.toUpperCase(),
    database: 'allkeyshop.com',
    v2: '1',
  }).toString()
  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Failed to fetch game pricing: HTTP ${response.status}`)
  }

  const raw: unknown = await response.json()
  if (!isRecord(raw) || !Array.isArray(raw.history)) {
    throw new Error('Invalid game pricing response')
  }

  let offers: Offer[] = []
  for (const entry of raw.history) {
    const offer = toOffer(entry, raw)
    if (offer !== undefined) {
      offers.push(offer)
    }
  }

  if (store !== '') {
    offers = filterByStore(offers, store)
  }

  return {
    offers,
    lowestPrices: {
      official: toLowestPrice(raw.lower_official_price, raw),
      keyshops: toLowestPrice(raw.lower_keyshops_price, raw),
    },
  }
}

export interface ProductIdsResponse {
  status: string
  games: BasicGameData[]
  message?: string
}

export interface BasicGameData {
  id: string
  name: string
}

const noGamesFound: ProductIdsResponse = {
  status: 'error',
  games: [],
  message: 'No games found',
}

export const getProductIds = async (
  name: string
): Promise<ProductIdsResponse> => {
  try {
    const games = await fetchAllGames()

    if (games == null) {
      return noGamesFound
    }

    return {
      status: 'success',
      games: filterByName(games, name),
    }
  } catch (e) {
    return {
      status: 'error',
      games: [],
      message: e instanceof Error ? e.message : 'Unknown error',
    }
  }
}
