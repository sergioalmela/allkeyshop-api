import axios from 'axios'
import { filterByName, filterByStore } from './filter'
import { fetchAllGames } from './fetch'

export interface Offer {
  id: number
  affiliateUrl: string
  isActive: boolean
  merchant: string
  price: {
    eur: {
      bestCoupon: {
        code: string
        discountValue: string
        discountStrategy: string
        isCashback: boolean
      } | null
      currency: string
      price: number
      priceWithoutCoupon: number
    }
  }
  edition: string
  region: string
  stock: string
  platform: string
}

export interface Merchant {
  id: string
  name: string
  aggregateRating: {
    value: number
    count: number
  }
  types: string
  paymentMethods: string[]
  logoSlug: string
  reviewUrl: string
}

export interface Edition {
  id: string
  name: string
}

export interface Region {
  id: string
  name: string
  filterName: string
}

export interface ProductSellingDetails {
  success: boolean
  offers: Offer[]
  merchants: Record<string, Merchant>
  editions: Record<string, Edition>
  regions: Record<string, Region>
}

export const getGameData = async (
  games: BasicGameData[],
  currency: string,
  store: string
): Promise<ProductSellingDetails | undefined> => {
  if (games !== undefined && games.length > 0) {
    const gameId = games[0].id
    const response = await axios.get(
      `https://www.allkeyshop.com/blog/wp-admin/admin-ajax.php?action=get_offers&product=${gameId}&currency=${currency}`
    )

    if (response.data.success === true && response.data.offers.length > 0) {
      if (store !== '') {
        response.data.offers = filterByStore(response.data.offers, store)
      }
    }

    return response.data
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
      // Search for the game name inside the array of games
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
