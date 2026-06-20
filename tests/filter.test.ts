import { filterByName, filterByStore } from '../src/filter'
import { gamesMock } from './mock/games.mock'
import { historyMock } from './mock/offers.mock'

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
    it('should filter by store name via fuzzy search and return matched records', () => {
      const results = filterByStore(historyMock, 'Kinguin')

      expect(results.length).toBe(1)
      expect(results[0].merchant).toBe('Kinguin')
    })

    it('should filter by store and return empty data if no match', () => {
      const results = filterByStore(historyMock, 'NonExistentStore')
      expect(results).toEqual([])
    })
  })
})
