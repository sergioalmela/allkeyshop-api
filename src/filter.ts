import Fuse from 'fuse.js'
import { type BasicGameData, type Offer } from './gather'

const filterByName = (
  games: BasicGameData[],
  name: string
): BasicGameData[] => {
  const fuse = new Fuse(games, {
    keys: ['name'],
  })

  const result = fuse.search(name)

  return result.map((item) => item.item)
}

const filterByStore = (offers: Offer[], store: string): Offer[] => {
  const fuse = new Fuse(offers, {
    keys: ['platform'],
  })

  const result = fuse.search(store)

  return result.map((item) => item.item)
}

export { filterByName, filterByStore }
