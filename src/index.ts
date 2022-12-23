import { fetchAllGames } from './fetch'
import { getProductIds } from './search'
import { getGameData } from './gather'

// TODO: Remove this file, test only
/* fetchAllGames().then((data) => {
  console.log('Fetched')
}).catch((e) => {
  console.error(e)
}) */

getGameData('ark survival').then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e)
})
