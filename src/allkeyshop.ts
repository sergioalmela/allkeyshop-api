import { getGameData, ProductRes } from './gather'
import { defaultOptions } from '../config/constants'

export class AllkeyshopService {
  private readonly currency: string
  private readonly platform: string
  private readonly shop: string

  constructor (options?: { currency?: string, platform?: string, shop?: string }) {
    this.currency = options?.currency ?? defaultOptions.currency
    this.platform = options?.platform?.toLowerCase() ?? defaultOptions.platform
    this.shop = options?.shop?.toLowerCase() ?? defaultOptions.shop
  }

  // Search data for a game by name and return the first result (best matching)
  async search (name: string): Promise<ProductRes> {
    name = this.platform !== '' ? `${name} ${this.platform}` : name

    const response = await getGameData(name, this.currency, this.platform, this.shop)

    if (response?.success === true) {
      return response
    }

    return await new Promise((resolve, reject) => {
      reject(new Error('No games found'))
    })
  }

  // Return all matching results for a game name without data
  /* async find (name: string): Promise<ProductRes> {
    // TODO
  } */
}
