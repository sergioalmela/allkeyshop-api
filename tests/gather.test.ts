import {
  emptyProductSellingDetailsMock,
  productSellingDetailsMock,
} from './mock/product-selling-details.mock'
import { getGameData, getProductIds } from '../src/gather'
import { gamesMock } from './mock/games.mock'
import * as fetchModule from '../src/fetch'

jest.mock('../src/fetch', () => ({
  fetchAllGames: jest.fn(),
}))

describe('Gather', () => {
  describe('getGameData', () => {
    it('should gather data from a game name and return clean payload', async () => {
      global.fetch = jest.fn().mockImplementation(async () => ({
        json: async () => productSellingDetailsMock,
      }))

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response).not.toBeUndefined()
      expect(response!.offers.length).toBe(2)
      expect(response!.offers[0].merchant).toBe('Kinguin')
      expect(response!.offers[1].merchant).toBe('G2A')
      expect(response!.lowestPrices.official!.price).toBe(38.66)
    })

    it('should gather data from a game name and filter by store', async () => {
      global.fetch = jest.fn().mockImplementation(async () => ({
        json: async () => productSellingDetailsMock,
      }))

      const response = await getGameData(gamesMock, 'EUR', 'Kinguin')

      expect(response).not.toBeUndefined()
      expect(response!.offers.length).toBe(1)
      expect(response!.offers[0].merchant).toBe('Kinguin')
    })

    it('should return empty structures when endpoint returns empty dataset', async () => {
      global.fetch = jest.fn().mockImplementation(async () => ({
        json: async () => emptyProductSellingDetailsMock,
      }))

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response).not.toBeUndefined()
      expect(response!.offers).toEqual([])
    })
  })

  describe('getProductIds', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return a list of game Ids', async () => {
      const expectedGames = [gamesMock[0], gamesMock[1]]
      ;(fetchModule.fetchAllGames as jest.Mock).mockResolvedValue(gamesMock)

      const productIds = await getProductIds('FIFA 2')

      expect(productIds).not.toBeUndefined()
      expect(productIds.games.length).toBe(2)
      expect(productIds.games).toEqual(expectedGames)
    })
  })
})
