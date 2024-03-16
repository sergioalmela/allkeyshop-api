"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByStore = exports.filterByName = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
const fuzzy_search_1 = __importDefault(require("fuzzy-search"));
const filterByName = (games, name) => {
    /* const fuse = new Fuse(games, {
      keys: ['name'],
    })
  
    const result = fuse.search(name)
    console.log(result) */
    try {
        const searcher = new fuzzy_search_1.default(games, ['name'], {
            caseSensitive: false,
            sort: true,
        });
        const result = searcher.search(name);
        return result;
    }
    catch (e) {
        console.log(e);
    }
    return [];
};
exports.filterByName = filterByName;
const filterByStore = (offers, store) => {
    const fuse = new fuse_js_1.default(offers, {
        keys: ['platform'],
    });
    const result = fuse.search(store);
    return result.map((item) => item.item);
};
exports.filterByStore = filterByStore;
//# sourceMappingURL=filter.js.map