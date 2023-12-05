export interface Offer {
    id: number;
    affiliateUrl: string;
    isActive: boolean;
    merchant: string;
    price: {
        eur: {
            bestCoupon: {
                code: string;
                discountValue: string;
                discountStrategy: string;
                isCashback: boolean;
            } | null;
            currency: string;
            price: number;
            priceWithoutCoupon: number;
        };
    };
    edition: string;
    region: string;
    stock: string;
    platform: string;
}
export interface Merchant {
    id: string;
    name: string;
    aggregateRating: {
        value: number;
        count: number;
    };
    types: string;
    paymentMethods: string[];
    logoSlug: string;
    reviewUrl: string;
}
export interface Edition {
    id: string;
    name: string;
}
export interface Region {
    id: string;
    name: string;
    filterName: string;
}
export interface ProductSellingDetails {
    success: boolean;
    offers: Offer[];
    merchants: Record<string, Merchant>;
    editions: Record<string, Edition>;
    regions: Record<string, Region>;
}
export declare const getGameData: (games: BasicGameData[], currency: string, store: string) => Promise<ProductSellingDetails | undefined>;
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
