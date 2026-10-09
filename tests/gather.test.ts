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
    ok: true,
    status: 200,
    json: async () => payload,
  })
}

describe('Gather', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
  })

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

    const entry = productSellingDetailsMock.history[0]
    const invalidEntries = [
      false,
      null,
      {},
      { ...entry, last_price: undefined },
      { ...entry, last_price: '38.66' },
      { ...entry, last_price: Number.NaN },
      { ...entry, last_price: Number.POSITIVE_INFINITY },
      { ...entry, last_price: -1 },
      { ...entry, min_discount_price: undefined },
      { ...entry, min_discount_price: -1 },
      { ...entry, merchant_id: 0 },
      { ...entry, merchant_id: '47' },
      { ...entry, merchant_id: 1.5 },
      { ...entry, edition: '1&edition=2' },
      { ...entry, region: {} },
      { ...entry, start: 'yesterday' },
      { ...entry, start: '2026-02-30 18:28:55' },
      { ...entry, best_discount_code: {} },
    ]

    it.each(invalidEntries)('omits bad history %#', async (invalidEntry) => {
      mockEndpoint({
        ...productSellingDetailsMock,
        history: [invalidEntry, ...productSellingDetailsMock.history],
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.offers).toHaveLength(2)
      expect(
        response!.offers.every((offer) => Number.isFinite(offer.currentPrice))
      ).toBe(true)
    })

    it('keeps free offers and normalizes an absent coupon to null', async () => {
      mockEndpoint({
        ...productSellingDetailsMock,
        history: [
          {
            ...entry,
            last_price: 0,
            min_discount_price: 0,
            best_discount_code: undefined,
          },
        ],
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.offers).toEqual([
        expect.objectContaining({
          currentPrice: 0,
          minDiscountPrice: 0,
          couponCode: null,
        }),
      ])
    })

    it('resolves alphanumeric region ids from the live catalog format', async () => {
      mockEndpoint({
        ...productSellingDetailsMock,
        history: [{ ...entry, region: '80eu' }],
        regions: { '80eu': { id: '80eu', name: 'Epic Europe' } },
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.offers[0].region).toBe('Epic Europe')
    })

    it.each([
      undefined,
      null,
      [],
      { '47': { name: 47 } },
      { '47': { name: '  ' } },
    ])('omits invalid merchants %#', async (merchants) => {
      mockEndpoint({ ...productSellingDetailsMock, merchants })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.offers).toEqual([])
      expect(response!.lowestPrices).toEqual({ official: null, keyshops: null })
    })

    it.each([
      '',
      '-1',
      '1.23garbage',
      'NaN',
      'Infinity',
      '1e3',
      ' 1.23 ',
      '9'.repeat(400),
    ])('does not expose an invalid lowest price: %j', async (price) => {
      mockEndpoint({
        ...productSellingDetailsMock,
        lower_official_price: {
          ...productSellingDetailsMock.lower_official_price,
          price,
        },
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.lowestPrices.official).toBeNull()
      expect(response!.lowestPrices.keyshops!.price).toBe(41.19)
    })

    it('preserves a valid zero historical low', async () => {
      mockEndpoint({
        ...productSellingDetailsMock,
        lower_official_price: {
          ...productSellingDetailsMock.lower_official_price,
          price: '0.00',
        },
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.lowestPrices.official!.price).toBe(0)
    })

    it.each([
      null,
      false,
      {},
      { ...productSellingDetailsMock.lower_official_price, price: 38.66 },
      { ...productSellingDetailsMock.lower_official_price, merchant_id: '47' },
      { ...productSellingDetailsMock.lower_official_price, merchant_id: 1.5 },
      {
        ...productSellingDetailsMock.lower_official_price,
        last_update: '2026-13-19 18:28:55',
      },
    ])('omits an invalid historical summary: %j', async (summary) => {
      mockEndpoint({
        ...productSellingDetailsMock,
        lower_official_price: summary,
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.lowestPrices.official).toBeNull()
      expect(response!.lowestPrices.keyshops!.price).toBe(41.19)
    })

    it('omits unresolved offers while preserving records with valid names', async () => {
      mockEndpoint({
        ...productSellingDetailsMock,
        history: [
          { ...entry, region: 'unknown' },
          ...productSellingDetailsMock.history,
        ],
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response!.offers).toHaveLength(2)
      expect(response!.offers.every((offer) => offer.region === 'Steam')).toBe(
        true
      )
    })

    const invalidPayloads = [
      null,
      false,
      {},
      { history: null },
      { history: {} },
    ]
    it.each(invalidPayloads)('rejects bad payloads %#', async (payload) => {
      mockEndpoint(payload)

      await expect(getGameData(gamesMock, 'EUR', '')).rejects.toThrow(
        'Invalid game pricing response'
      )
    })

    it('rejects HTTP errors even with a successful-looking response body', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => productSellingDetailsMock,
      })

      await expect(getGameData(gamesMock, 'EUR', '')).rejects.toThrow(
        'HTTP 503'
      )
    })

    it('encodes query values without allowing extra request parameters', async () => {
      mockEndpoint(productSellingDetailsMock)

      await getGameData(
        [{ id: '23918&v2=0', name: 'X' }],
        'eur&database=other',
        ''
      )

      const url = new URL((global.fetch as jest.Mock).mock.calls[0][0])
      expect(url.searchParams.get('normalised_name')).toBe('23918&v2=0')
      expect(url.searchParams.get('currency')).toBe('EUR&DATABASE=OTHER')
      expect(url.searchParams.get('database')).toBe('allkeyshop.com')
      expect(url.searchParams.get('v2')).toBe('1')
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
