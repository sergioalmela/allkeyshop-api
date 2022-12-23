import * as fs from 'fs'
import * as path from 'path'
import { fetchAllGames } from './fetch'

// Get all product IDs from a game name
const getProductIds = async (name: string) => {
  // Check if vaks.json file is in dist folder, if not, create it
  if (!fs.existsSync(path.join(__dirname, '../dist/vaks.json'))) {
    await fetchAllGames()
  }

  // Read vaks.json file and search for the game name inside games.name
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../dist/vaks.json'), 'utf8'))
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
