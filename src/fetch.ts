import * as fs from 'fs'
import * as path from 'path'

// Fetch all games to avoid making too many requests, caching it
const fetchAllGames = async () => {
  const response = await fetch('https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur')
  const data = await response.json()
  fs.writeFileSync(path.join(__dirname, '../dist/vaks.json'), JSON.stringify(data))

  return data
}

// TODO: Check if vaks.json file has more than 1 day old, if so, fetch again

export {
  fetchAllGames
}
