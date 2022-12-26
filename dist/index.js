"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allkeyshop_1 = require("./allkeyshop");
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
const allkeyshopService = new allkeyshop_1.AllkeyshopService({
    currency: 'eur',
    platform: 'pc',
    shop: 'all'
});
allkeyshopService.search('Dark Souls').then((data) => {
    console.log(data);
});
//# sourceMappingURL=index.js.map