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
    it('should gather data from a game name', async () => {
      global.fetch = jest.fn().mockImplementation(async () => ({
        json: async () => productSellingDetailsMock,
      }))

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response).not.toBeUndefined()
      expect(response!.success).toBe(true)
      expect(response!.offers.length).toBe(3)
      expect(response!.offers).toEqual(productSellingDetailsMock.offers)
      expect(response!.merchants).toEqual(productSellingDetailsMock.merchants)
      expect(response!.editions).toEqual(productSellingDetailsMock.editions)
      expect(response!.regions).toEqual(productSellingDetailsMock.regions)
    })

    it('should gather data from a game name and filter by store', async () => {
      const expectedGame = productSellingDetailsMock.offers[2]

      global.fetch = jest.fn().mockImplementation(async () => ({
        json: async () => productSellingDetailsMock,
      }))

      const response = await getGameData(gamesMock, 'EUR', 'PS5')

      expect(response).not.toBeUndefined()

      expect(response!.success).toBe(true)
      expect(response!.offers.length).toBe(1)
      expect(response!.offers).toEqual([expectedGame])
    })

    it('should return undefined when no data is found', async () => {
      global.fetch = jest.fn().mockImplementation(async () => ({
        json: async () => emptyProductSellingDetailsMock,
      }))

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response).not.toBeUndefined()

      expect(response!.success).toBe(true)
      expect(response!.offers).toEqual([])
      expect(response!.merchants).toEqual({})
      expect(response!.editions).toEqual({})
      expect(response!.regions).toEqual({})
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

    it('should return an empty list of game Ids', async () => {
      ;(fetchModule.fetchAllGames as jest.Mock).mockResolvedValue([])

      const productIds = await getProductIds('GTA V')

      expect(productIds).not.toBeUndefined()
      expect(productIds.games.length).toBe(0)
      expect(productIds.games).toEqual([])
    })
  })
})