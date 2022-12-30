"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByStore = exports.filterByName = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
const filterByName = (list, name) => {
    const fuse = new fuse_js_1.default(list, {
        keys: ['name']
    });
    const result = fuse.search(name);
    return result.map((item) => item.item);
};
exports.filterByName = filterByName;
const filterByStore = (list, store) => {
    const fuse = new fuse_js_1.default(list, {
        keys: ['platform']
    });
    const result = fuse.search(store);
    return result.map((item) => item.item);
};
exports.filterByStore = filterByStore;
//# sourceMappingURL=filter.js.map