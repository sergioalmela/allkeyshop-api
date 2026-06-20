import { type BasicGameData, type HistoryEntry, type BaseCatalogItem } from './gather';
declare const filterByName: (games: BasicGameData[], name: string) => BasicGameData[];
declare const filterByStore: (history: HistoryEntry[], merchants: Record<string, BaseCatalogItem>, store: string) => HistoryEntry[];
export { filterByName, filterByStore };
