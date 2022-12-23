import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import { BasicGameResponse } from './search'
import { downloadDir } from './file'

export interface ProductListResponse {
  status: string
  games?: BasicGameResponse[]
}

// Fetch all games to avoid making too many requests, caching it
const fetchAllGames = async (): Promise<BasicGameResponse[]> => {
  const response = await axios.get<ProductListResponse>('https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur')
  const data = response.data

  fs.writeFileSync(path.join(downloadDir(), 'vaks.json'), JSON.stringify(data))

  return data.games
}

// TODO: Check if vaks.json file has more than 1 day old, if so, fetch again

export {
  fetchAllGames
}
