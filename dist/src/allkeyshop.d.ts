import { type GameOffers, type ProductIdsResponse } from './gather';
export declare class AllkeyshopService {
    private readonly currency;
    private readonly platform;
    private readonly store;
    constructor(options?: {
        currency?: string;
        platform?: string;
        store?: string;
    });
    search(name: string): Promise<GameOffers>;
    find(name: string): Promise<ProductIdsResponse>;
    private appendPlatform;
    private emptyData;
}
