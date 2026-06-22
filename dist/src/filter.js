"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByStore = exports.filterByName = void 0;
const fuzzy_search_1 = __importDefault(require("fuzzy-search"));
// The game catalog rarely changes between searches, so we reuse the fuzzy
// index and only rebuild it when the underlying list changes.
let nameIndex;
const filterByName = (games, name) => {
    if (nameIndex === undefined || nameIndex.games !== games) {
        nameIndex = {
            games,
            searcher: new fuzzy_search_1.default(games, ['name'], {
                caseSensitive: false,
                sort: true,
            }),
        };
    }
    return nameIndex.searcher.search(name);
};
exports.filterByName = filterByName;
const filterByStore = (offers, store) => {
    const searcher = new fuzzy_search_1.default(offers, ['merchant'], {
        caseSensitive: false,
        sort: true,
    });
    return searcher.search(store);
};
exports.filterByStore = filterByStore;
//# sourceMappingURL=filter.js.map