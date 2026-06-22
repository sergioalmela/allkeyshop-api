import * as fetchModule from '../src/fetch'
import { getGameData, getProductIds } from '../src/gather'
import { gamesMock } from './mock/games.mock'
import {
  emptyProductSellingDetailsMock,
  productSellingDetailsMock,
} from './mock/product-selling-details.mock'

jest.mock('../src/fetch', () => ({
  fetchAllGames: jest.fn(),
}))

const mockEndpoint = (payload: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => payload,
  })
}

describe('Gather', () => {
  describe('getGameData', () => {
    it('maps the raw history into offers with resolved names and parsed prices', async () => {
      mockEndpoint(productSellingDetailsMock)

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response).toBeDefined()
      expect(response!.offers).toEqual([
        {
          merchant: 'Kinguin',
          edition: 'Standard Edition',
          region: 'Steam',
          currentPrice: 38.66,
          minDiscountPrice: 37.37,
          couponCode: 'AKSGAME',
          lastUpdate: '2026-06-19 18:28:55',
        },
        {
          merchant: 'G2A',
          edition: 'Standard Edition',
          region: 'Steam',
          currentPrice: 41.19,
          minDiscountPrice: 38.52,
          couponCode: 'AKSHERO',
          lastUpdate: '2026-06-19 03:02:53',
        },
      ])
    })

    it('exposes the lowest official and keyshop prices', async () => {
      mockEndpoint(productSellingDetailsMock)

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.lowestPrices.official).toEqual({
        merchant: 'Kinguin',
        price: 38.66,
        lastUpdate: '2026-06-19 18:28:55',
      })
      expect(response!.lowestPrices.keyshops).toEqual({
        merchant: 'G2A',
        price: 41.19,
        lastUpdate: '2026-06-19 03:02:53',
      })
    })

    it('requests the chosen currency in upper case', async () => {
      mockEndpoint(productSellingDetailsMock)

      await getGameData(gamesMock, 'usd', '')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('currency=USD')
      )
    })

    it('keeps only the offers of the requested store', async () => {
      mockEndpoint(productSellingDetailsMock)

      const response = await getGameData(gamesMock, 'EUR', 'Kinguin')

      expect(response!.offers).toHaveLength(1)
      expect(response!.offers[0].merchant).toBe('Kinguin')
    })

    it('returns empty offers and no lowest prices for an empty dataset', async () => {
      mockEndpoint(emptyProductSellingDetailsMock)

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.offers).toEqual([])
      expect(response!.lowestPrices).toEqual({ official: null, keyshops: null })
    })

    it('returns undefined when there are no games to look up', async () => {
      expect(await getGameData([], 'EUR', '')).toBeUndefined()
    })
  })

  describe('getProductIds', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('returns the games whose name fuzzily matches the query', async () => {
      ;(fetchModule.fetchAllGames as jest.Mock).mockResolvedValue(gamesMock)

      const productIds = await getProductIds('FIFA 2')

      expect(productIds.status).toBe('success')
      expect(productIds.games).toEqual([gamesMock[0], gamesMock[1]])
    })

    it('reports an error when the game catalog is unavailable', async () => {
      ;(fetchModule.fetchAllGames as jest.Mock).mockResolvedValue(null)

      const productIds = await getProductIds('FIFA 2')

      expect(productIds.status).toBe('error')
      expect(productIds.games).toEqual([])
    })

    it('surfaces the error message when fetching the catalog throws', async () => {
      ;(fetchModule.fetchAllGames as jest.Mock).mockRejectedValue(
        new Error('network down')
      )

      const productIds = await getProductIds('FIFA 2')

      expect(productIds.status).toBe('error')
      expect(productIds.message).toBe('network down')
    })
  })
})
