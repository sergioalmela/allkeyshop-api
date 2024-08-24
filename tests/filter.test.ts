import { filterByName, filterByStore } from '../src/filter'
import { gamesMock } from './mock/games.mock'
import { offersMock } from './mock/offers.mock'

describe('Filter', () => {
  describe('filterByName', () => {
    it('should filter by name and return the filtered data', () => {
      const games = filterByName(gamesMock, 'FIFA 2')

      expect(games.length).toBe(2)
    })

    it('should filter by name and return empty data', () => {
      const games = filterByName(gamesMock, 'GTA V')

      expect(games).toEqual([])
    })
  })

  describe('filterByStore', () => {
    it('should filter by store and return the filtered data', () => {
      const games = filterByStore(offersMock, 'PS5')

      expect(games.length).toBe(2)
    })

    it('should filter by store and return empty data', () => {
      const games = filterByStore(offersMock, 'XBOX')

      expect(games).toEqual([])
    })
  })
})
