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
exports.getGameData = void 0;
const axios_1 = __importDefault(require("axios"));
const search_1 = require("./search");
const getGameData = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield (0, search_1.getProductIds)(name);
    if (gameList.games) {
        const gameId = gameList.games[0].id;
        const response = yield axios_1.default.get(`https://www.allkeyshop.com/blog/wp-admin/admin-ajax.php?action=get_offers&product=${gameId}&currency=eur`);
        return response.data;
    }
    return undefined;
});
exports.getGameData = getGameData;
//# sourceMappingURL=gather.js.map