"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductIds = exports.getGameData = void 0;
const fetch_1 = require("./fetch");
const filter_1 = require("./filter");
const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isPrice = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const isMerchantId = (value) => typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const isTimestamp = (value) => {
    if (typeof value !== 'string' ||
        !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(`${value.replace(' ', 'T')}Z`);
    return (Number.isFinite(date.getTime()) &&
        date.toISOString().slice(0, 19).replace('T', ' ') === value);
};
const resolveName = (catalog, id) => {
    if (!isRecord(catalog)) {
        return '';
    }
    const item = catalog[String(id)];
    return isRecord(item) && typeof item.name === 'string' ? item.name : '';
};
const toOffer = (entry, raw) => {
    if (!isRecord(entry) ||
        !isMerchantId(entry.merchant_id) ||
        typeof entry.edition !== 'string' ||
        !/^[1-9]\d*$/.test(entry.edition) ||
        typeof entry.region !== 'string' ||
        !/^[a-z0-9]+$/i.test(entry.region) ||
        !isPrice(entry.last_price) ||
        !isPrice(entry.min_discount_price) ||
        !isTimestamp(entry.start) ||
        (entry.best_discount_code != null &&
            typeof entry.best_discount_code !== 'string')) {
        return undefined;
    }
    const merchant = resolveName(raw.merchants, entry.merchant_id);
    const edition = resolveName(raw.editions, entry.edition);
    const region = resolveName(raw.regions, entry.region);
    if (merchant.trim() === '' || edition.trim() === '' || region.trim() === '') {
        return undefined;
    }
    return {
        merchant,
        edition,
        region,
        currentPrice: entry.last_price,
        minDiscountPrice: entry.min_discount_price,
        couponCode: entry.best_discount_code ?? null,
        lastUpdate: entry.start,
    };
};
const toLowestPrice = (summary, raw) => {
    if (!isRecord(summary) ||
        !isMerchantId(summary.merchant_id) ||
        typeof summary.price !== 'string' ||
        !/^\d+(?:\.\d+)?$/.test(summary.price) ||
        !isPrice(Number(summary.price)) ||
        !isTimestamp(summary.last_update)) {
        return null;
    }
    const merchant = resolveName(raw.merchants, summary.merchant_id);
    if (merchant.trim() === '') {
        return null;
    }
    return {
        merchant,
        price: Number(summary.price),
        lastUpdate: summary.last_update,
    };
};
const getGameData = async (games, currency, store) => {
    if (games === undefined || games.length === 0) {
        return undefined;
    }
    const gameId = games[0].id;
    const url = new URL('https://www.allkeyshop.com/api/price_history_api.php');
    url.search = new URLSearchParams({
        normalised_name: gameId,
        currency: currency.toUpperCase(),
        database: 'allkeyshop.com',
        v2: '1',
    }).toString();
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Failed to fetch game pricing: HTTP ${response.status}`);
    }
    const raw = await response.json();
    if (!isRecord(raw) || !Array.isArray(raw.history)) {
        throw new Error('Invalid game pricing response');
    }
    let offers = [];
    for (const entry of raw.history) {
        const offer = toOffer(entry, raw);
        if (offer !== undefined) {
            offers.push(offer);
        }
    }
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