import { defaultOptions } from '../config/constants'
import {
  type GameOffers,
  getGameData,
  getProductIds,
  type ProductIdsResponse,
} from './gather'

export class AllkeyshopService {
  private readonly currency: string
  private readonly platform: string
  private readonly store: string

  constructor(options?: {
    currency?: string
    platform?: string
    store?: string
  }) {
    this.currency = options?.currency?.toLowerCase() ?? defaultOptions.currency
    this.platform = options?.platform?.toLowerCase() ?? defaultOptions.platform
    this.platform = this.platform === 'pc' ? '' : this.platform
    this.store = options?.store?.toLowerCase() ?? defaultOptions.store
  }

  async search(name: string): Promise<GameOffers> {
    name = this.appendPlatform(name)

    const games = await getProductIds(name)

    if (games.status === 'error') {
      return this.emptyData()
    }

    const response = await getGameData(games.games, this.currency, this.store)

    return response ?? this.emptyData()
  }

  async find(name: string): Promise<ProductIdsResponse> {
    name = this.appendPlatform(name)
    return await getProductIds(name)
  }

  private appendPlatform(name: string): string {
    return this.platform !== '' ? `${name} ${this.platform}` : name
  }

  private emptyData(): GameOffers {
    return {
      offers: [],
      lowestPrices: {
        official: null,
        keyshops: null,
      },
    }
  }
}
