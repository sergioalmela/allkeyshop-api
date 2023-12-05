import { type BasicGameData } from './gather';
export interface ProductListResponse {
    status: string;
    games?: BasicGameData[];
}
declare const fetchAllGames: () => Promise<BasicGameData[] | undefined>;
export { fetchAllGames };
