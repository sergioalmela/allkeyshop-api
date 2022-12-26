import { getGameData } from './gather'

export class AllkeyshopService {
  constructor ({ currency = 'eur', platform = 'pc', shop = 'all' }) {}
  //constructor (private options?: object) {}

  async search (name: string): Promise<any> {
    const response = await getGameData(name)

    if (response?.success === true) {
      return response
    }

    return new Promise((resolve, reject) => {
      reject(new Error('No games found'))
    })
  }
}
