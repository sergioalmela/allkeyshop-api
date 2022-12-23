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
exports.getProductIds = void 0;
const fetch_1 = require("./fetch");
// Get all product IDs from a game name
const getProductIds = (name) => __awaiter(void 0, void 0, void 0, function* () {
    // Read vaks.json file and search for the game name inside games.name
    try {
        const games = yield (0, fetch_1.fetchAllGames)();
        if (games != null) {
            // Search for the game name inside the array of games
            const filteredGames = games.filter((game) => game.name.toLowerCase().includes(name.toLowerCase()));
            return {
                status: 'success',
                games: filteredGames
            };
        }
        else {
            return {
                status: 'error',
                message: 'No games found'
            };
        }
    }
    catch (e) {
        return {
            status: 'error',
            message: e.message
        };
    }
});
exports.getProductIds = getProductIds;
//# sourceMappingURL=search.js.map