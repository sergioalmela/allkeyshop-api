import { filterByName, filterByStore } from './filter'
import { fetchAllGames } from './fetch'

export interface HistoryEntry {
  product_id: number
  merchant_id: number
  edition: string
  region: string
  last_price: number
  min_discount_price: number
  best_discount_code: string | null
  start: string
  end: string
  merchantName?: string
}

export interface BaseCatalogItem {
  id: string
  name: string
}

export interface PriceSummary {
  merchant_id: number
  price: string
  last_update: string
}

export interface ProductSellingDetails {
  officialMerchants: string
  history: HistoryEntry[]
  editions: Record<string, BaseCatalogItem>
  regions: Record<string, BaseCatalogItem>
  merchants: Record<string, BaseCatalogItem>
  lower_official_price: PriceSummary
  lower_keyshops_price: PriceSummary
}

export const getGameData = async (
  games: BasicGameData[],
  currency: string,
  store: string
): Promise<ProductSellingDetails | undefined> => {
  if (games !== undefined && games.length > 0) {
    const gameId = games[0].id
    const response = await fetch(
      `https://www.allkeyshop.com/api/price_history_api.php?normalised_name=${gameId}&currency=${currency.toUpperCase()}&database=allkeyshop.com&v2=1`
    )

    const data: ProductSellingDetails = await response.json()

    if (data.history && data.history.length > 0) {
      if (store !== '') {
        data.history = filterByStore(data.history, data.merchants, store)
      }
    }

    return data
  }

  return undefined
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

const noGamesFound = {
  status: 'error',
  games: [],
  message: 'No games found',
}

export const getProductIds = async (
  name: string
): Promise<ProductIdsResponse> => {
  // Read vaks.json file and search for the game name inside games.name
  try {
    const games = await fetchAllGames()

    if (games != null) {
      const filteredGames = filterByName(games, name)

      return {
        status: 'success',
        games: filteredGames,
      }
    } else {
      return noGamesFound
    }
  } catch (e) {
    return {
      status: 'error',
      games: [],
      message: e.message,
    }
  }
}
