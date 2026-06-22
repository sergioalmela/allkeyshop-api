export interface Offer {
    merchant: string;
    edition: string;
    region: string;
    currentPrice: number;
    minDiscountPrice: number;
    couponCode: string | null;
    lastUpdate: string;
}
export interface LowestPrice {
    merchant: string;
    price: number;
    lastUpdate: string;
}
export interface GameOffers {
    offers: Offer[];
    lowestPrices: {
        official: LowestPrice | null;
        keyshops: LowestPrice | null;
    };
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
