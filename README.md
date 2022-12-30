# AllKeyShop API
Unofficial AllKeyShop API made in typescript

## Installation
```bash
npm install allkeyshop-api
```

## Usage
### Import and initialize
```typescript
import { AllkeyshopService } from "allkeyshop-api"

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
* Store: Filter by selected store. Default: '' (any). Possible values: 'steam', 'origin', 'uplay', 'gog', 'epic' etc.

### Get game keys by name
```typescript
allkeyshopService.search('Borderlands 3').then((data) => {
    console.log(data)
})

// Output:
// {
//     success: true,
//     offers: [
//     {
//         id: 133508130,
//         affiliateUrl: 'https://www.g2a.com/borderlands-3-standard-edition-steam-key-europe-i10000186970058?aid=13344657&gtag=dccb1b16c9&utm_content=COM_GLOBAL_PB_PLUS_GAM_LISTING_NOR_allkeyshopPLUS',
//         isActive: true,
//         merchant: '61616',
//         price: [Object],
//         edition: '1',
//         region: '9',
//         stock: 'InStock',
//         platform: 'steam'
//     },
//     ...
//     ],
//     merchants: {
//     '1': {
//         id: '1',
//             name: 'Steam',
//             aggregateRating: [Object],
//             types: 'Official Store',
//             searchable: 1,
//             paymentMethods: [Object],
//             logoSlug: 'steam',
//             reviewUrl: 'https://www.allkeyshop.com/blog/review/steam/'
//     },
//     ...
//     },
//     editions: {
//         '1': { id: '1', name: 'Standard' },
//         ...
//     },
//     regions: {
//         '1': { id: '1', name: 'GLOBAL', filterName: 'PUBLISHER GLOBAL' },
//         ...
//     }
// }
```

### Get game names without data
```typescript
allkeyshopService.find('FIFA 22').then((data) => {
    console.log(data)
})

// Output:
// {
//     status: 'success', 
//     games: [
//          { id: '83060', name: 'FIFA 22' },
//          { id: '83063', name: 'FIFA 22 PS4' },
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

## Contributing

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!