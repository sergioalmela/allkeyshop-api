import axios from 'axios'

import {
  emptyProductSellingDetailsMock,
  productSellingDetailsMock,
} from './mock/product-selling-details.mock'
import { getGameData } from '../src/gather'
import { gamesMock } from './mock/games.mock'

describe('Gather', () => {
  describe('getGameData', () => {
    it('should gather data from a game name', async () => {
      jest.spyOn(axios, 'get').mockImplementation(async () => {
        return { data: productSellingDetailsMock }
      })

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

      jest.spyOn(axios, 'get').mockImplementation(async () => {
        return { data: productSellingDetailsMock }
      })

      const response = await getGameData(gamesMock, 'EUR', 'PS5')

      expect(response).not.toBeUndefined()

      expect(response!.success).toBe(true)
      expect(response!.offers.length).toBe(1)
      expect(response!.offers).toEqual([expectedGame])
    })

    it('should return undefined when no data is found', async () => {
      jest.spyOn(axios, 'get').mockImplementation(async () => {
        return { data: emptyProductSellingDetailsMock }
      })

      const response = await getGameData(gamesMock, 'EUR', '')

      expect(response).not.toBeUndefined()

      expect(response!.success).toBe(true)
      expect(response!.offers).toEqual([])
      expect(response!.merchants).toEqual({})
      expect(response!.editions).toEqual({})
      expect(response!.regions).toEqual({})
    })
  })
})
