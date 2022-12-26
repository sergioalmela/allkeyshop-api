import { getGameData, ProductRes } from './gather'
import { defaultOptions } from '../config/constants'

export class AllkeyshopService {
  private readonly currency: string
  private readonly platform: string
  private readonly shop: string

  constructor ({ currency = defaultOptions.currency, platform = defaultOptions.platform, shop = defaultOptions.shop }) {
    this.currency = currency
    this.platform = platform
    this.shop = shop
  }

  async search (name: string): Promise<ProductRes> {
    const response = await getGameData(name, this.currency, this.platform, this.shop)

    if (response?.success === true) {
      return response
    }

    return await new Promise((resolve, reject) => {
      reject(new Error('No games found'))
    })
  }
}
