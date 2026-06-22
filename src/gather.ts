import { fetchAllGames } from './fetch'
import { filterByName, filterByStore } from './filter'

// --- Public output shape (what consumers of the API receive) ---

export interface Offer {
  merchant: string
  edition: string
  region: string
  currentPrice: number
  minDiscountPrice: number
  couponCode: string | null
  lastUpdate: string
}

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

// --- Raw shape returned by allkeyshop's price_history_api endpoint ---

interface CatalogItem {
  id: string
  name: string
}

interface RawHistoryEntry {
  product_id: number
  merchant_id: number
  edition: string
  region: string
  last_price: number
  min_discount_price: number
  best_discount_code: string | null
  start: string
  end: string
}

interface RawPriceSummary {
  merchant_id: number
  price: string
  last_update: string
}

interface RawProductDetails {
  officialMerchants: string
  history: RawHistoryEntry[]
  editions: Record<string, CatalogItem>
  regions: Record<string, CatalogItem>
  merchants: Record<string, CatalogItem>
  lower_official_price: RawPriceSummary
  lower_keyshops_price: RawPriceSummary
}

const resolveName = (
  catalog: Record<string, CatalogItem> | undefined,
  id: string | number
): string => catalog?.[String(id)]?.name ?? ''

const toOffer = (entry: RawHistoryEntry, raw: RawProductDetails): Offer => ({
  merchant: resolveName(raw.merchants, entry.merchant_id),
  edition: resolveName(raw.editions, entry.edition),
  region: resolveName(raw.regions, entry.region),
  currentPrice: entry.last_price,
  minDiscountPrice: entry.min_discount_price,
  couponCode: entry.best_discount_code,
  lastUpdate: entry.start,
})

const toLowestPrice = (
  summary: RawPriceSummary | undefined,
  raw: RawProductDetails
): LowestPrice | null => {
  if (!summary || summary.merchant_id === 0) {
    return null
  }

  return {
    merchant: resolveName(raw.merchants, summary.merchant_id),
    price: Number.parseFloat(summary.price),
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
  const response = await fetch(
    `https://www.allkeyshop.com/api/price_history_api.php?normalised_name=${gameId}&currency=${currency.toUpperCase()}&database=allkeyshop.com&v2=1`
  )

  const raw: RawProductDetails = await response.json()

  let offers = (raw.history ?? []).map((entry) => toOffer(entry, raw))

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
