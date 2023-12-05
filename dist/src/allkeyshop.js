"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllkeyshopService = void 0;
const gather_1 = require("./gather");
const constants_1 = require("../config/constants");
class AllkeyshopService {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f;
        this.currency = (_b = (_a = options === null || options === void 0 ? void 0 : options.currency) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : constants_1.defaultOptions.currency;
        this.platform = (_d = (_c = options === null || options === void 0 ? void 0 : options.platform) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : constants_1.defaultOptions.platform;
        this.platform = this.platform === 'pc' ? '' : this.platform;
        this.store = (_f = (_e = options === null || options === void 0 ? void 0 : options.store) === null || _e === void 0 ? void 0 : _e.toLowerCase()) !== null && _f !== void 0 ? _f : constants_1.defaultOptions.store;
    }
    // Search data for a game by name and return the first result (best matching)
    search(name) {
        return __awaiter(this, void 0, void 0, function* () {
            name = this.appendPlatform(name);
            const games = yield (0, gather_1.getProductIds)(name);
            if (games.status === 'error') {
                return yield new Promise((resolve, reject) => {
                    reject(new Error('No games found'));
                });
            }
            const response = yield (0, gather_1.getGameData)(games.games, this.currency, this.store);
            if ((response === null || response === void 0 ? void 0 : response.success) === true) {
                return response;
            }
            return yield new Promise((resolve, reject) => {
                reject(new Error('No games found'));
            });
        });
    }
    // Return all matching results for a game name without data
    find(name) {
        return __awaiter(this, void 0, void 0, function* () {
            name = this.appendPlatform(name);
            return yield (0, gather_1.getProductIds)(name);
        });
    }
    appendPlatform(name) {
        return this.platform !== '' ? `${name} ${this.platform}` : name;
    }
}
exports.AllkeyshopService = AllkeyshopService;
//# sourceMappingURL=allkeyshop.js.map