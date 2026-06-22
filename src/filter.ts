import FuzzySearch from 'fuzzy-search'
import type { BasicGameData, Offer } from './gather'

// The game catalog rarely changes between searches, so we reuse the fuzzy
// index and only rebuild it when the underlying list changes.
let nameIndex:
  | { games: BasicGameData[]; searcher: FuzzySearch<BasicGameData> }
  | undefined

const filterByName = (
  games: BasicGameData[],
  name: string
): BasicGameData[] => {
  if (nameIndex === undefined || nameIndex.games !== games) {
    nameIndex = {
      games,
      searcher: new FuzzySearch(games, ['name'], {
        caseSensitive: false,
        sort: true,
      }),
    }
  }

  return nameIndex.searcher.search(name)
}

const filterByStore = (offers: Offer[], store: string): Offer[] => {
  const searcher = new FuzzySearch(offers, ['merchant'], {
    caseSensitive: false,
    sort: true,
  })

  return searcher.search(store)
}

export { filterByName, filterByStore }
