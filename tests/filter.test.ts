import { filterByName, filterByStore } from '../src/filter'
import { gamesMock } from './mock/games.mock'
import { offersMock } from './mock/offers.mock'

describe('Filter', () => {
  describe('filterByName', () => {
    it('matches every game that fuzzily contains the query', () => {
      const games = filterByName(gamesMock, 'FIFA 2')

      expect(games.map((game) => game.name)).toEqual(['FIFA 23', 'FIFA 24'])
    })

    it('returns an empty list when nothing matches', () => {
      const games = filterByName(gamesMock, 'GTA V')

      expect(games).toEqual([])
    })
  })

  describe('filterByStore', () => {
    it('keeps only the offers whose merchant matches the store', () => {
      const results = filterByStore(offersMock, 'Kinguin')

      expect(results).toHaveLength(1)
      expect(results[0].merchant).toBe('Kinguin')
    })

    it('is case-insensitive', () => {
      const results = filterByStore(offersMock, 'kinguin')

      expect(results).toHaveLength(1)
      expect(results[0].merchant).toBe('Kinguin')
    })

    it('returns an empty list when no merchant matches', () => {
      const results = filterByStore(offersMock, 'NonExistentStore')

      expect(results).toEqual([])
    })
  })
})
