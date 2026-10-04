import { randomUUID } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { cacheDir } from './file'
import type { BasicGameData } from './gather'

interface CachedCatalog {
  games: BasicGameData[]
  expiresAt: number
}

const CATALOG_FILE = 'vaks.json'
const CATALOG_URL =
  'https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur'
const ONE_DAY_MS = 24 * 60 * 60 * 1000

let cachedCatalog: CachedCatalog | undefined
let pendingLoad: Promise<BasicGameData[] | undefined> | undefined

const catalogPath = (): string => path.join(cacheDir(), CATALOG_FILE)

const parseCatalog = (data: unknown): BasicGameData[] | undefined => {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('status' in data) ||
    data.status !== 'success' ||
    !('games' in data) ||
    !Array.isArray(data.games)
  ) {
    return undefined
  }

  const games: BasicGameData[] = []
  for (const game of data.games) {
    if (
      typeof game !== 'object' ||
      game === null ||
      !('id' in game) ||
      !('name' in game) ||
      typeof game.name !== 'string' ||
      game.name.trim() === ''
    ) {
      return undefined
    }

    // Some catalog entries have no usable pricing product id.
    if (game.id === 0 || game.id === '0') {
      continue
    }

    if (
      !(
        (typeof game.id === 'string' && /^[1-9]\d*$/.test(game.id)) ||
        (typeof game.id === 'number' &&
          Number.isSafeInteger(game.id) &&
          game.id > 0)
      )
    ) {
      return undefined
    }

    games.push({ id: String(game.id), name: game.name })
  }

  return data.games.length > 0 && games.length === 0 ? undefined : games
}

const readCachedCatalog = (): CachedCatalog | undefined => {
  try {
    const file = catalogPath()
    const modifiedAt = fs.statSync(file).mtime.getTime()
    const expiresAt = modifiedAt + ONE_DAY_MS

    if (modifiedAt > Date.now() || expiresAt <= Date.now()) {
      return undefined
    }

    const games = parseCatalog(JSON.parse(fs.readFileSync(file, 'utf8')))
    return games === undefined ? undefined : { games, expiresAt }
  } catch {
    return undefined
  }
}

// Atomic replacement keeps other processes from reading a partial catalog.
// The disk cache is optional: filesystem failures must not break a lookup.
const persistCatalog = (games: BasicGameData[]): void => {
  const file = catalogPath()
  const temporaryFile = `${file}.${randomUUID()}.tmp`

  try {
    fs.mkdirSync(cacheDir(), { recursive: true })
    fs.writeFileSync(
      temporaryFile,
      JSON.stringify({ status: 'success', games })
    )
    fs.renameSync(temporaryFile, file)
  } catch {
    try {
      fs.unlinkSync(temporaryFile)
    } catch {
      return
    }
  }
}

const loadGames = async (): Promise<CachedCatalog | undefined> => {
  const diskCatalog = readCachedCatalog()
  if (diskCatalog !== undefined) {
    return diskCatalog
  }

  const response = await fetch(CATALOG_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch game catalog: HTTP ${response.status}`)
  }

  const games = parseCatalog(await response.json())
  if (games === undefined) {
    return undefined
  }

  persistCatalog(games)
  return { games, expiresAt: Date.now() + ONE_DAY_MS }
}

const fetchAllGames = async (): Promise<BasicGameData[] | undefined> => {
  if (cachedCatalog !== undefined && cachedCatalog.expiresAt > Date.now()) {
    return cachedCatalog.games
  }

  // Share a single in-flight load between concurrent callers so the catalog
  // is never downloaded more than once.
  if (pendingLoad === undefined) {
    pendingLoad = loadGames()
      .then((catalog) => {
        cachedCatalog = catalog
        return catalog?.games
      })
      .finally(() => {
        pendingLoad = undefined
      })
  }

  return pendingLoad
}

export { fetchAllGames }
