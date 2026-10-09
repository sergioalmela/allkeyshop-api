/** The newest record of one merchant/edition/region listing seen recently. */
export interface Offer {
    merchant: string;
    edition: string;
    region: string;
    /** Upstream fills this when a record closes, so the open record has `null`. */
    currentPrice: number | null;
    /** Best recorded price after coupon; always present. */
    minDiscountPrice: number;
    /** `null` without a coupon, and on the open record like `currentPrice`. */
    couponCode: string | null;
    lastUpdate: string;
    lastSeen: string;
}
/** A lowest price across all stores, independent of the store filter. */
export interface LowestPrice {
    merchant: string;
    price: number;
    lastUpdate: string;
}
export interface LowestPrices {
    official: LowestPrice | null;
    keyshops: LowestPrice | null;
}
export interface GameOffers {
    offers: Offer[];
    lowestPrices: LowestPrices;
    historicalLows: LowestPrices;
}
export declare const getGameData: (games: BasicGameData[], currency: string, store: string) => Promise<GameOffers | undefined>;
export interface ProductIdsResponse {
    status: string;
    games: BasicGameData[];
    message?: string;
}
export interface BasicGameData {
    id: string;
    name: string;
}
export declare const getProductIds: (name: string) => Promise<ProductIdsResponse>;
