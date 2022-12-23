import { fetchAllGames } from './fetch'

fetchAllGames().then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e)
})
