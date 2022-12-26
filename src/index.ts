import { fetchAllGames } from './fetch'
import { getProductIds } from './search'
import { getGameData } from './gather'
import {AllkeyshopService} from "./allkeyshop";

// TODO: Remove this file, test only
/* fetchAllGames().then((data) => {
  console.log('Fetched')
}).catch((e) => {
  console.error(e)
}) */

/*getGameData('ark survival').then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e)
})*/

const allkeyshopService = new AllkeyshopService({
    currency: 'eur',
    platform: 'pc',
    shop: 'all'
})

allkeyshopService.search('Dark Souls').then((data) => {
    console.log(data)
})