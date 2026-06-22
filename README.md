# AllKeyShop API
Unofficial AllKeyShop API made in typescript

## Installation
```bash
npm install allkeyshop-api
```

## Usage
### Import and initialize
```typescript
import { AllkeyshopService } from 'allkeyshop-api'

const allkeyshopService = new AllkeyshopService()
```

### Initialize with custom options
```typescript
const options = {
    currency: 'eur',
    platform: '',
    store: 'steam'
}

const allkeyshopService = new AllkeyshopService(options)
```
* Currency: Get prices in the selected currency. Default: eur
* Platform: Get prices for the selected platform. Default: '' (PC). Possible values: 'PS5', 'Xbox One', 'Nintendo Switch' etc.
* Store: Filter by selected store. Default: '' (any). Possible values: 'steam', 'origin', 'ea-app', 'uplay', 'gog', 'epic' etc.

### Get game keys by name
```typescript
allkeyshopService.search('Borderlands 3').then((data) => {
    console.log(data)
})

// Output:
// {
//     offers: [
//         {
//             merchant: 'Kinguin',
//             edition: 'Standard Edition',
//             region: 'Steam',
//             currentPrice: 38.66,
//             minDiscountPrice: 37.37,
//             couponCode: 'AKSGAME',
//             lastUpdate: '2026-06-19 18:28:55'
//         },
//         ...
//     ],
//     lowestPrices: {
//         official: {
//             merchant: 'Kinguin',
//             price: 38.66,
//             lastUpdate: '2026-06-19 18:28:55'
//         },
//         keyshops: {
//             merchant: 'G2A',
//             price: 41.19,
//             lastUpdate: '2026-06-19 03:02:53'
//         }
//     }
// }
```

Each offer already has its `merchant`, `edition` and `region` resolved to a
readable name. `lowestPrices.official` is the cheapest official-store price and
`lowestPrices.keyshops` the cheapest key-reseller price (either may be `null`
when no data is available).

### Get game names without data
```typescript
allkeyshopService.find('DARK SOULS III').then((data) => {
    console.log(data)
})

// Output:
// {
//     status: 'success', 
//     games: [
//          { id: '83060', name: 'DARK SOULS' },
//          { id: '83063', name: 'DARK SOULS REMASTERED' },
//          ...
//     ]
// }
```

## Features
Search for games and get the cheapest price for each platform

* Search any game and get all key prices, including official stores and key resellers
* Filter by platform
* Filter by store
* Search by specific currency

## Technologies used
- [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
- [![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white)](https://jestjs.io/)

## Issues

Feel free to submit issues and enhancement requests here: [Report Issue](https://github.com/sergioalmela/allkeyshop-api/issues)

## Donate
If you want to support the project, you can buy me a coffee. Thanks!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/sergioalmela)

## Contributing

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!