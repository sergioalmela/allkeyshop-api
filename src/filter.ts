import {
  type BasicGameData,
  type HistoryEntry,
  type BaseCatalogItem,
} from './gather'
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

const filterByStore = (
  history: HistoryEntry[],
  merchants: Record<string, BaseCatalogItem>,
  store: string
): HistoryEntry[] => {
  const enrichedHistory = history.map((item) => {
    const merchantIdStr = item.merchant_id?.toString()
    const merchantName =
      merchantIdStr && merchants ? merchants[merchantIdStr]?.name || '' : ''

    return {
      ...item,
      merchantName,
    }
  })

  const searcher = new FuzzySearch(enrichedHistory, ['merchantName'], {
    caseSensitive: false,
    sort: true,
  })

  return searcher.search(store)
}

export { filterByName, filterByStore }
