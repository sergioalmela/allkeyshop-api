"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByStore = exports.filterByName = void 0;
const fuzzy_search_1 = __importDefault(require("fuzzy-search"));
const filterByName = (games, name) => {
    const searcher = new fuzzy_search_1.default(games, ['name'], {
        caseSensitive: false,
        sort: true,
    });
    return searcher.search(name);
};
exports.filterByName = filterByName;
const filterByStore = (history, merchants, store) => {
    const enrichedHistory = history.map((item) => {
        var _a, _b;
        const merchantIdStr = (_a = item.merchant_id) === null || _a === void 0 ? void 0 : _a.toString();
        const merchantName = merchantIdStr && merchants ? ((_b = merchants[merchantIdStr]) === null || _b === void 0 ? void 0 : _b.name) || '' : '';
        return Object.assign(Object.assign({}, item), { merchantName });
    });
    const searcher = new fuzzy_search_1.default(enrichedHistory, ['merchantName'], {
        caseSensitive: false,
        sort: true,
    });
    return searcher.search(store);
};
exports.filterByStore = filterByStore;
//# sourceMappingURL=filter.js.map