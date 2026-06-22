import { AllkeyshopService } from '../src/allkeyshop'
import type { GameOffers } from '../src/gather'
import * as gather from '../src/gather'

jest.mock('../src/gather', () => ({
  getProductIds: jest.fn(),
  getGameData: jest.fn(),
}))

const getProductIds = gather.getProductIds as jest.Mock
const getGameData = gather.getGameData as jest.Mock

const gameOffers: GameOffers = {
  offers: [
    {
      merchant: 'Kinguin',
      edition: 'Standard Edition',
      region: 'Steam',
      currentPrice: 38.66,
      minDiscountPrice: 37.37,
      couponCode: 'AKSGAME',
      lastUpdate: '2026-06-19 18:28:55',
    },
  ],
  lowestPrices: { official: null, keyshops: null },
}

const emptyOffers: GameOffers = {
  offers: [],
  lowestPrices: { official: null, keyshops: null },
}

describe('AllkeyshopService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getProductIds.mockResolvedValue({ status: 'success', games: [{ id: '1' }] })
    getGameData.mockResolvedValue(gameOffers)
  })

  describe('search', () => {
    it('returns the offers found for the game', async () => {
      const result = await new AllkeyshopService().search('Borderlands 3')

      expect(result).toEqual(gameOffers)
    })

    it('returns empty offers when the game cannot be found', async () => {
      getProductIds.mockResolvedValue({ status: 'error', games: [] })

      const result = await new AllkeyshopService().search('Unknown game')

      expect(result).toEqual(emptyOffers)
      expect(getGameData).not.toHaveBeenCalled()
    })

    it('returns empty offers when no pricing data is available', async () => {
      getGameData.mockResolvedValue(undefined)

      const result = await new AllkeyshopService().search('Borderlands 3')

      expect(result).toEqual(emptyOffers)
    })

    it('passes the configured currency and store to the data fetch', async () => {
      const service = new AllkeyshopService({ currency: 'USD', store: 'Steam' })

      await service.search('Borderlands 3')

      expect(getGameData).toHaveBeenCalledWith(
        expect.anything(),
        'usd',
        'steam'
      )
    })

    it('appends the platform to the search term', async () => {
      const service = new AllkeyshopService({ platform: 'PS5' })

      await service.search('Borderlands 3')

      expect(getProductIds).toHaveBeenCalledWith('Borderlands 3 ps5')
    })

    it('treats the "pc" platform as no platform suffix', async () => {
      const service = new AllkeyshopService({ platform: 'PC' })

      await service.search('Borderlands 3')

      expect(getProductIds).toHaveBeenCalledWith('Borderlands 3')
    })
  })

  describe('find', () => {
    it('returns the matching game names without pricing data', async () => {
      const matches = { status: 'success', games: [{ id: '1', name: 'X' }] }
      getProductIds.mockResolvedValue(matches)

      const result = await new AllkeyshopService().find('Dark Souls')

      expect(result).toEqual(matches)
      expect(getGameData).not.toHaveBeenCalled()
    })
  })
})
