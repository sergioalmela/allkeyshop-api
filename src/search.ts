import { fetchAllGames } from './fetch'
import { filterByName } from './filter'

export interface ProductIdsResponse {
  status: string
  games: BasicGameData[]
  message?: string
}

export interface BasicGameData {
  id: string
  name: string
}

const noGamesFound = {
  status: 'error',
  games: [],
  message: 'No games found',
}

// Get all product IDs from a game name
const getProductIds = async (name: string): Promise<ProductIdsResponse> => {
  // Read vaks.json file and search for the game name inside games.name
  try {
    const games = await fetchAllGames()

    if (games != null) {
      // Search for the game name inside the array of games
      const filteredGames = filterByName(games, name)

      return {
        status: 'success',
        games: filteredGames,
      }
    } else {
      return noGamesFound
    }
  } catch (e) {
    return {
      status: 'error',
      games: [],
      message: e.message,
    }
  }
}

export { getProductIds }
