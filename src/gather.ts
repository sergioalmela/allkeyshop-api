import axios from 'axios'
import { getProductIds } from './search'
import { filterByStore } from './filter'

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

const getGameData = async (
  name: string,
  currency: string,
  store: string
): Promise<ProductSellingDetails | undefined> => {
  const gameList = await getProductIds(name)

  if (gameList.games !== undefined && gameList.games.length > 0) {
    const gameId = gameList.games[0].id
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

export { getGameData }
