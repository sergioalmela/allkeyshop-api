import { fetchAllGames } from './fetch'
import { getProductIds } from './search'
import { getGameData } from './gather'
import { AllkeyshopService } from './allkeyshop'

// TODO: Remove this file, test only
/* fetchAllGames().then((data) => {
  console.log('Fetched')
}).catch((e) => {
  console.error(e)
}) */

/* getGameData('ark survival').then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e)
}) */

const allkeyshopService = new AllkeyshopService({
  currency: 'eur',
  platform: 'PS5',
  store: ''
})

/*allkeyshopService.search('Borderlands 3').then((data) => {
  console.log(data)
})*/

allkeyshopService.find('FIFA 22').then((data) => {
    console.log(data)
})
