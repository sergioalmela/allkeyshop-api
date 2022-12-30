import { BasicGameResponse } from './search';
import { Offer } from './gather';
declare const filterByName: (list: BasicGameResponse[], name: string) => BasicGameResponse[];
declare const filterByStore: (list: Offer[], store: string) => Offer[];
export { filterByName, filterByStore };
