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
* Platform: Look up games for the selected platform. Default: '' (PC). Possible values: 'PS5', 'Xbox One', 'Nintendo Switch' etc.
* Store: Filter by selected store. Default: '' (any). Possible values: 'steam', 'origin', 'ea-app', 'uplay', 'gog', 'epic' etc.

### Get current game prices by name
```typescript
allkeyshopService.search('Borderlands 3').then((data) => {
    console.log(data)
})

// Output:
// {
//     offers: [
//         {
//             merchant: 'Steam',
//             edition: 'Standard Edition',
//             region: 'Steam',
//             currentPrice: null,
//             minDiscountPrice: 59.99,
//             couponCode: null,
//             lastUpdate: '2026-10-08 17:17:01',
//             lastSeen: '2026-10-09 00:02:35'
//         },
//         ...
//     ],
//     lowestPrices: {
//         official: {
//             merchant: 'Gamesplanet US',
//             price: 48.01,
//             lastUpdate: '2026-10-07 12:35:26'
//         },
//         keyshops: {
//             merchant: 'GameBoost',
//             price: 2.96,
//             lastUpdate: '2026-10-09 03:33:04'
//         }
//     },
//     historicalLows: {
//         official: {
//             merchant: 'Steam',
//             price: 2.99,
//             lastUpdate: '2025-07-10 16:56:31'
//         },
//         keyshops: {
//             merchant: 'Kinguin',
//             price: 1.6,
//             lastUpdate: '2026-07-22 08:19:20'
//         }
//     }
// }
```

`offers` has one entry per merchant, edition and region: the newest price
record, if it was seen in the last 7 days. `merchant`, `edition` and `region`
are resolved to readable names. Incomplete or malformed records are omitted.

* `minDiscountPrice`: the best recorded price after coupon. Always present.
* `currentPrice` and `couponCode`: the upstream fills these only when a price
  record closes. The newest record is usually still open, so both are often
  `null`.
* `lastUpdate`: when the record started. `lastSeen`: when the price was last
  observed.

`lowestPrices.official` and `lowestPrices.keyshops` are the cheapest current
`minDiscountPrice` at official stores and at key resellers; their `lastUpdate`
is when that price was last seen. `historicalLows` holds the all-time lows
reported by the upstream. Any of them may be `null`. Both cover the whole game,
across every edition and region: the `store` option only filters `offers`.

`search()` rejects when the game catalog or the pricing data cannot be loaded.
When no game matches, it returns empty offers.

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

When no game matches, `games` is empty. When the game catalog cannot be loaded,
`status` is `'error'` and `message` says why.

## Features
Search for games and get their current prices for each platform

* Search games and get current prices and lows, including official stores and key resellers
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
