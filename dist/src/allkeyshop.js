"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllkeyshopService = void 0;
const constants_1 = require("../config/constants");
const gather_1 = require("./gather");
class AllkeyshopService {
    currency;
    platform;
    store;
    constructor(options) {
        this.currency = options?.currency?.toLowerCase() ?? constants_1.defaultOptions.currency;
        this.platform = options?.platform?.toLowerCase() ?? constants_1.defaultOptions.platform;
        this.platform = this.platform === 'pc' ? '' : this.platform;
        this.store = options?.store?.toLowerCase() ?? constants_1.defaultOptions.store;
    }
    async search(name) {
        name = this.appendPlatform(name);
        const games = await (0, gather_1.getProductIds)(name);
        // A lookup error is a failure, not a missing game: no match is `success`.
        if (games.status === 'error') {
            throw new Error(games.message ?? 'Game lookup failed');
        }
        const response = await (0, gather_1.getGameData)(games.games, this.currency, this.store);
        return response ?? this.emptyData();
    }
    async find(name) {
        name = this.appendPlatform(name);
        return await (0, gather_1.getProductIds)(name);
    }
    appendPlatform(name) {
        return this.platform !== '' ? `${name} ${this.platform}` : name;
    }
    emptyData() {
        return {
            offers: [],
            lowestPrices: {
                official: null,
                keyshops: null,
            },
            historicalLows: {
                official: null,
                keyshops: null,
            },
        };
    }
}
exports.AllkeyshopService = AllkeyshopService;
//# sourceMappingURL=allkeyshop.js.map