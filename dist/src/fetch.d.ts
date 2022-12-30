import { BasicGameResponse } from './search';
export interface ProductListResponse {
    status: string;
    games?: BasicGameResponse[];
}
declare const fetchAllGames: () => Promise<BasicGameResponse[] | undefined>;
export { fetchAllGames };
