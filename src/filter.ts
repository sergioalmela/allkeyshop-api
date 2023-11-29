import Fuse from 'fuse.js'
import { type BasicGameResponse } from './search'
import { type Offer } from './gather'

const filterByName = (
  list: BasicGameResponse[],
  name: string
): BasicGameResponse[] => {
  const fuse = new Fuse(list, {
    keys: ['name'],
  })

  const result = fuse.search(name)

  return result.map((item) => item.item)
}

const filterByStore = (list: Offer[], store: string): Offer[] => {
  const fuse = new Fuse(list, {
    keys: ['platform'],
  })

  const result = fuse.search(store)

  return result.map((item) => item.item)
}

export { filterByName, filterByStore }
