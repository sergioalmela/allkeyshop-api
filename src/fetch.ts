import * as fs from 'node:fs'
import * as path from 'node:path'
import { cacheDir } from './file'
import type { BasicGameData } from './gather'

interface ProductListResponse {
  status: string
  games?: BasicGameData[]
}

const CATALOG_FILE = 'vaks.json'
const CATALOG_URL =
  'https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur'
const ONE_DAY_MS = 24 * 60 * 60 * 1000

let cachedGames: BasicGameData[] | undefined
let pendingLoad: Promise<BasicGameData[] | undefined> | undefined

const catalogPath = (): string => path.join(cacheDir(), CATALOG_FILE)

// The on-disk catalog is considered fresh for one day.
const isCacheFresh = (): boolean => {
  const file = catalogPath()

  if (!fs.existsSync(file)) {
    return false
  }

  const ageMs = Date.now() - fs.statSync(file).mtime.getTime()

  return ageMs < ONE_DAY_MS
}

const readCachedCatalog = (): BasicGameData[] | undefined => {
  const data = JSON.parse(fs.readFileSync(catalogPath(), 'utf8'))

  return data.games
}

const downloadCatalog = async (): Promise<BasicGameData[] | undefined> => {
  const response = await fetch(CATALOG_URL)
  const data: ProductListResponse = await response.json()

  // Only persist a successful response so we never cache an error payload.
  if (data.status !== 'success' || data.games === undefined) {
    return undefined
  }

  fs.mkdirSync(cacheDir(), { recursive: true })
  fs.writeFileSync(catalogPath(), JSON.stringify(data))

  return data.games
}

const loadGames = async (): Promise<BasicGameData[] | undefined> =>
  isCacheFresh() ? readCachedCatalog() : downloadCatalog()

const fetchAllGames = async (): Promise<BasicGameData[] | undefined> => {
  if (cachedGames !== undefined) {
    return cachedGames
  }

  // Share a single in-flight load between concurrent callers so the catalog
  // is never downloaded more than once.
  if (pendingLoad === undefined) {
    pendingLoad = loadGames()
  }

  try {
    cachedGames = await pendingLoad
    return cachedGames
  } finally {
    pendingLoad = undefined
  }
}

export { fetchAllGames }
