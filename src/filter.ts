import { type BasicGameData, type Offer } from './gather'
import FuzzySearch from 'fuzzy-search'

const filterByName = (
  games: BasicGameData[],
  name: string
): BasicGameData[] => {
  const searcher = new FuzzySearch(games, ['name'], {
    caseSensitive: false,
    sort: true,
  })

  return searcher.search(name)
}

const filterByStore = (offers: Offer[], store: string): Offer[] => {
  const searcher = new FuzzySearch(offers, ['platform'], {
    caseSensitive: false,
    sort: true,
  })

  return searcher.search(store)
}

export { filterByName, filterByStore }
