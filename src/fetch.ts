import * as fs from 'fs'
import * as path from 'path'
import { downloadDir } from './file'
import { type BasicGameData } from './gather'

export interface ProductListResponse {
  status: string
  games?: BasicGameData[]
}

let cachedGames: BasicGameData[] | undefined

const fetchAllGames = async (): Promise<BasicGameData[] | undefined> => {
  if (cachedGames !== undefined) {
    return cachedGames
  }

  // Check if vaks.json file is in dist folder, if not, create it
  if (!fileGamesExistsAndIsValid()) {
    const response = await fetch(
      'https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur'
    )
    const data: ProductListResponse = await response.json()

    fs.writeFileSync(
      path.join(downloadDir(), 'vaks.json'),
      JSON.stringify(data)
    )

    if (data.status === 'success') {
      cachedGames = data.games
      return data.games
    }
  } else {
    const data = JSON.parse(
      fs.readFileSync(path.join(downloadDir(), 'vaks.json'), 'utf8')
    )

    cachedGames = data.games
    return data.games
  }

  return undefined
}

// Check if vaks.json file has more than 1 day old, if so, fetch again
const fileGamesExistsAndIsValid = (): boolean => {
  const file = path.join(downloadDir(), 'vaks.json')

  if (!fs.existsSync(file)) {
    return false
  }

  const stats = fs.statSync(file)
  const now = new Date()
  const diff = Math.abs(now.getTime() - stats.mtime.getTime())
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

  return diffDays <= 1
}

export { fetchAllGames }