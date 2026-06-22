import type { BasicGameData, Offer } from './gather';
declare const filterByName: (games: BasicGameData[], name: string) => BasicGameData[];
declare const filterByStore: (offers: Offer[], store: string) => Offer[];
export { filterByName, filterByStore };
