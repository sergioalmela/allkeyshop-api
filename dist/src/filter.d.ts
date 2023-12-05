import { type BasicGameData, type Offer } from './gather';
declare const filterByName: (games: BasicGameData[], name: string) => BasicGameData[];
declare const filterByStore: (offers: Offer[], store: string) => Offer[];
export { filterByName, filterByStore };
