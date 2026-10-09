"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductIds = exports.getGameData = void 0;
const fetch_1 = require("./fetch");
const filter_1 = require("./filter");
// Upstream keeps years of history; a listing missing for a week is no longer
// offered.
const CURRENT_OFFER_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isPrice = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const isMerchantId = (value) => typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
// Upstream timestamps are UTC.
const toEpochMs = (timestamp) => Date.parse(`${timestamp.replace(' ', 'T')}Z`);
const isTimestamp = (value) => {
    if (typeof value !== 'string' ||
        !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(toEpochMs(value));
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
const toListing = (entry, raw) => {
    if (!isRecord(entry) ||
        !isMerchantId(entry.merchant_id) ||
        typeof entry.edition !== 'string' ||
        !/^[1-9]\d*$/.test(entry.edition) ||
        typeof entry.region !== 'string' ||
        !/^[a-z0-9]+$/i.test(entry.region) ||
        (entry.last_price != null && !isPrice(entry.last_price)) ||
        !isPrice(entry.min_discount_price) ||
        !isTimestamp(entry.start) ||
        !isTimestamp(entry.end) ||
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
        merchantId: entry.merchant_id,
        offer: {
            merchant,
            edition,
            region,
            currentPrice: isPrice(entry.last_price) ? entry.last_price : null,
            minDiscountPrice: entry.min_discount_price,
            couponCode: entry.best_discount_code ?? null,
            lastUpdate: entry.start,
            lastSeen: entry.end,
        },
    };
};
// Timestamps share one fixed-width format, so string order is time order.
const isNewer = (candidate, current) => candidate.lastSeen > current.lastSeen ||
    (candidate.lastSeen === current.lastSeen &&
        candidate.lastUpdate > current.lastUpdate);
const toCurrentListings = (history, raw) => {
    const lastSeenByKey = new Map();
    const newest = new Map();
    for (const entry of history) {
        if (!isRecord(entry) ||
            !isMerchantId(entry.merchant_id) ||
            !isTimestamp(entry.end)) {
            continue;
        }
        const key = `${entry.merchant_id}|${entry.edition}|${entry.region}`;
        const lastSeen = lastSeenByKey.get(key);
        if (lastSeen === undefined || entry.end > lastSeen) {
            lastSeenByKey.set(key, entry.end);
        }
        const listing = toListing(entry, raw);
        if (listing === undefined) {
            continue;
        }
        const known = newest.get(key);
        if (known === undefined || isNewer(listing.offer, known.offer)) {
            newest.set(key, listing);
        }
    }
    // An invalid newest record drops the listing rather than presenting an
    // older price as current.
    const cutoff = Date.now() - CURRENT_OFFER_MAX_AGE_MS;
    return [...newest.entries()]
        .filter(([key, listing]) => listing.offer.lastSeen === lastSeenByKey.get(key) &&
        toEpochMs(listing.offer.lastSeen) >= cutoff)
        .map(([, listing]) => listing);
};
const toOfficialMerchantIds = (value) => {
    if (typeof value !== 'string' || !/^(?:\d+(?:,\d+)*)?$/.test(value)) {
        return undefined;
    }
    const ids = value === '' ? [] : value.split(',').map(Number);
    return ids.every(isMerchantId) ? new Set(ids) : undefined;
};
// Uses `minDiscountPrice`: the open record, which is usually the newest,
// has no `currentPrice`. `lastUpdate` is when that price was last seen.
const toCheapest = (listings) => {
    let cheapest = null;
    for (const { offer } of listings) {
        if (cheapest === null || offer.minDiscountPrice < cheapest.price) {
            cheapest = {
                merchant: offer.merchant,
                price: offer.minDiscountPrice,
                lastUpdate: offer.lastSeen,
            };
        }
    }
    return cheapest;
};
const toCurrentLows = (listings, officialMerchants) => {
    const officialIds = toOfficialMerchantIds(officialMerchants);
    // Without the official merchant list, offers cannot be split by store type.
    if (officialIds === undefined) {
        return { official: null, keyshops: null };
    }
    return {
        official: toCheapest(listings.filter((listing) => officialIds.has(listing.merchantId))),
        keyshops: toCheapest(listings.filter((listing) => !officialIds.has(listing.merchantId))),
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
    const listings = toCurrentListings(raw.history, raw);
    let offers = listings.map((listing) => listing.offer);
    if (store !== '') {
        offers = (0, filter_1.filterByStore)(offers, store);
    }
    return {
        offers,
        lowestPrices: toCurrentLows(listings, raw.officialMerchants),
        historicalLows: {
            official: toLowestPrice(raw.lower_official_price, raw),
            keyshops: toLowestPrice(raw.lower_keyshops_price, raw),
        },
    };
};
exports.getGameData = getGameData;
const catalogUnavailable = {
    status: 'error',
    games: [],
    message: 'Game catalog unavailable',
};
const getProductIds = async (name) => {
    try {
        const games = await (0, fetch_1.fetchAllGames)();
        if (games == null) {
            return catalogUnavailable;
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