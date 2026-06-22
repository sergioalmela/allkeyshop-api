"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductIds = exports.getGameData = void 0;
const fetch_1 = require("./fetch");
const filter_1 = require("./filter");
const resolveName = (catalog, id) => catalog?.[String(id)]?.name ?? '';
const toOffer = (entry, raw) => ({
    merchant: resolveName(raw.merchants, entry.merchant_id),
    edition: resolveName(raw.editions, entry.edition),
    region: resolveName(raw.regions, entry.region),
    currentPrice: entry.last_price,
    minDiscountPrice: entry.min_discount_price,
    couponCode: entry.best_discount_code,
    lastUpdate: entry.start,
});
const toLowestPrice = (summary, raw) => {
    if (!summary || summary.merchant_id === 0) {
        return null;
    }
    return {
        merchant: resolveName(raw.merchants, summary.merchant_id),
        price: Number.parseFloat(summary.price),
        lastUpdate: summary.last_update,
    };
};
const getGameData = async (games, currency, store) => {
    if (games === undefined || games.length === 0) {
        return undefined;
    }
    const gameId = games[0].id;
    const response = await fetch(`https://www.allkeyshop.com/api/price_history_api.php?normalised_name=${gameId}&currency=${currency.toUpperCase()}&database=allkeyshop.com&v2=1`);
    const raw = await response.json();
    let offers = (raw.history ?? []).map((entry) => toOffer(entry, raw));
    if (store !== '') {
        offers = (0, filter_1.filterByStore)(offers, store);
    }
    return {
        offers,
        lowestPrices: {
            official: toLowestPrice(raw.lower_official_price, raw),
            keyshops: toLowestPrice(raw.lower_keyshops_price, raw),
        },
    };
};
exports.getGameData = getGameData;
const noGamesFound = {
    status: 'error',
    games: [],
    message: 'No games found',
};
const getProductIds = async (name) => {
    try {
        const games = await (0, fetch_1.fetchAllGames)();
        if (games == null) {
            return noGamesFound;
        }
        return {
            status: 'success',
            games: (0, filter_1.filterByName)(games, name),
        };
    }
    catch (e) {
        return {
            status: 'error',
            games: [],
            message: e instanceof Error ? e.message : 'Unknown error',
        };
    }
};
exports.getProductIds = getProductIds;
//# sourceMappingURL=gather.js.map