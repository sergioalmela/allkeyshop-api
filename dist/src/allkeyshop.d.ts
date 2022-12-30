import { ProductRes } from './gather';
import { ProductIdsResponse } from "./search";
export declare class AllkeyshopService {
    private readonly currency;
    private readonly platform;
    private readonly store;
    constructor(options?: {
        currency?: string;
        platform?: string;
        store?: string;
    });
    search(name: string): Promise<ProductRes>;
    find(name: string): Promise<ProductIdsResponse>;
    private addPlatform;
}
