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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductIds = exports.getGameData = void 0;
const axios_1 = __importDefault(require("axios"));
const filter_1 = require("./filter");
const fetch_1 = require("./fetch");
const getGameData = (games, currency, store) => __awaiter(void 0, void 0, void 0, function* () {
    if (games !== undefined && games.length > 0) {
        const gameId = games[0].id;
        const response = yield axios_1.default.get(`https://www.allkeyshop.com/blog/wp-admin/admin-ajax.php?action=get_offers&product=${gameId}&currency=${currency}`);
        if (response.data.success && response.data.offers.length > 0) {
            if (store !== '') {
                response.data.offers = (0, filter_1.filterByStore)(response.data.offers, store);
            }
        }
        return response.data;
    }
    return undefined;
});
exports.getGameData = getGameData;
const noGamesFound = {
    status: 'error',
    games: [],
    message: 'No games found',
};
const getProductIds = (name) => __awaiter(void 0, void 0, void 0, function* () {
    // Read vaks.json file and search for the game name inside games.name
    try {
        const games = yield (0, fetch_1.fetchAllGames)();
        if (games != null) {
            // Search for the game name inside the array of games
            const filteredGames = (0, filter_1.filterByName)(games, name);
            return {
                status: 'success',
                games: filteredGames,
            };
        }
        else {
            return noGamesFound;
        }
    }
    catch (e) {
        return {
            status: 'error',
            games: [],
            message: e.message,
        };
    }
});
exports.getProductIds = getProductIds;
//# sourceMappingURL=gather.js.map