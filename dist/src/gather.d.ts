export interface HistoryEntry {
    product_id: number;
    merchant_id: number;
    edition: string;
    region: string;
    last_price: number;
    min_discount_price: number;
    best_discount_code: string | null;
    start: string;
    end: string;
    merchantName?: string;
}
export interface BaseCatalogItem {
    id: string;
    name: string;
}
export interface PriceSummary {
    merchant_id: number;
    price: string;
    last_update: string;
}
export interface ProductSellingDetails {
    officialMerchants: string;
    history: HistoryEntry[];
    editions: Record<string, BaseCatalogItem>;
    regions: Record<string, BaseCatalogItem>;
    merchants: Record<string, BaseCatalogItem>;
    lower_official_price: PriceSummary;
    lower_keyshops_price: PriceSummary;
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
