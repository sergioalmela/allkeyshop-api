export interface ProductIdsResponse {
    status: string;
    games?: BasicGameResponse[];
    message?: string;
}
export interface BasicGameResponse {
    id: string;
    name: string;
}
declare const getProductIds: (name: string) => Promise<ProductIdsResponse>;
export { getProductIds };
