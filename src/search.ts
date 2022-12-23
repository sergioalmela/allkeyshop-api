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

// Get all product IDs from a game name
const getProductIds = async (name: string): Promise<ProductIdsResponse> => {
  // Read vaks.json file and search for the game name inside games.name
  try {
    const games = await fetchAllGames()

    if (games) {
      // Search for the game name inside the array of games
      const filteredGames = games.filter((game) => game.name.toLowerCase().includes(name.toLowerCase()))

      return {
        status: 'success',
        games: filteredGames
      }
    } else {
      return {
        status: 'error',
        message: 'No games found'
      }
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
