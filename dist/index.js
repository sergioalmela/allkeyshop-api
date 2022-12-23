"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gather_1 = require("./gather");
// TODO: Remove this file, test only
/* fetchAllGames().then((data) => {
  console.log('Fetched')
}).catch((e) => {
  console.error(e)
}) */
(0, gather_1.getGameData)('ark survival').then((data) => {
    console.log(data);
}).catch((e) => {
    console.error(e);
});
//# sourceMappingURL=index.js.map