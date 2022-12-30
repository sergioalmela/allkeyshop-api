import { getGameData, ProductRes } from './gather'
import { defaultOptions } from '../config/constants'
import { getProductIds, ProductIdsResponse } from './search'

export class AllkeyshopService {
  private readonly currency: string
  private readonly platform: string
  private readonly store: string

  constructor (options?: { currency?: string, platform?: string, store?: string }) {
    this.currency = options?.currency?.toLowerCase() ?? defaultOptions.currency
    this.platform = options?.platform?.toLowerCase() ?? defaultOptions.platform
    this.platform = this.platform === 'pc' ? '' : this.platform
    this.store = options?.store?.toLowerCase() ?? defaultOptions.store
  }

  // Search data for a game by name and return the first result (best matching)
  async search (name: string): Promise<ProductRes> {
    name = this.addPlatform(name)

    const response = await getGameData(name, this.currency, this.store)

    if (response?.success === true) {
      return response
    }

    return await new Promise((resolve, reject) => {
      reject(new Error('No games found'))
    })
  }

  // Return all matching results for a game name without data
  async find (name: string): Promise<ProductIdsResponse> {
    name = this.addPlatform(name)

    return await getProductIds(name)
  }

  private addPlatform (name: string): string {
    return this.platform !== '' ? `${name} ${this.platform}` : name
  }
}
