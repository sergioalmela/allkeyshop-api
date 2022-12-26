import axios from 'axios'
import { getProductIds } from './search'

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

export interface ProductRes {
  success: boolean
  offers: Offer[]
  merchants: { [key: string]: Merchant }
  editions: { [key: string]: Edition }
  regions: { [key: string]: Region }
}

const getGameData = async (name: string, currency: string, platform: string, shop: string): Promise<ProductRes | undefined> => {
  const gameList = await getProductIds(name)

  if (gameList.games !== undefined && gameList.games.length > 0) {
    const gameId = gameList.games[0].id
    const response = await axios.get(`https://www.allkeyshop.com/blog/wp-admin/admin-ajax.php?action=get_offers&product=${gameId}&currency=${currency}`)

    return response.data
  }

  return undefined
}

export {
  getGameData
}
