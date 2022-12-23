import * as fs from 'fs'
import * as path from 'path'
import { fetchAllGames } from './fetch'
import { downloadDir } from './file'

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
  // Check if vaks.json file is in dist folder, if not, create it
  if (!fs.existsSync(path.join(downloadDir(), 'vaks.json'))) {
    await fetchAllGames()
  }

  // Read vaks.json file and search for the game name inside games.name
  try {
    const data = JSON.parse(fs.readFileSync(path.join(downloadDir(), 'vaks.json'), 'utf8'))
    const games = data.games.filter((game: any) => game.name.toLowerCase().includes(name.toLowerCase()))
    return {
      status: 'success',
      games
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
