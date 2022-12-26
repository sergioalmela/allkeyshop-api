import { fetchAllGames } from './fetch'

export interface ProductIdsResponse {
  status: string
  games?: BasicGameResponse[]
  message?: string
}

export interface BasicGameResponse {
  id: string
  name: string
}

const noGamesFound = {
  status: 'error',
  message: 'No games found'
}

// Get all product IDs from a game name
const getProductIds = async (name: string): Promise<ProductIdsResponse> => {
  // Read vaks.json file and search for the game name inside games.name
  try {
    const games = await fetchAllGames()

    if (games != null) {
      // Search for the game name inside the array of games
      const filteredGames = games.filter((game) => game.name.toLowerCase().includes(name.toLowerCase()))

      return {
        status: 'success',
        games: filteredGames
      }
    } else {
      return noGamesFound
    }
  } catch (e) {
    return {
      status: 'error',
      message: e.message
    }
  }
}

export {
  getProductIds
}
