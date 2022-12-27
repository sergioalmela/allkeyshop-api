import Fuse from 'fuse.js'
import { BasicGameResponse } from './search'

const filterByName = (list: BasicGameResponse[], name: string): BasicGameResponse [] => {
  const fuse = new Fuse(list, {
    keys: ['name']
  })

  const result = fuse.search(name)

  return result.map((item) => item.item)
}

export {
  filterByName
}
