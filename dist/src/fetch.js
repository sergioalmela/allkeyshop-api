"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.fetchAllGames = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const file_1 = require("./file");
let cachedGames;
const fetchAllGames = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedGames !== undefined) {
        return cachedGames;
    }
    // Check if vaks.json file is in dist folder, if not, create it
    if (!fileGamesExistsAndIsValid()) {
        const response = yield axios_1.default.get('https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur');
        const data = response.data;
        fs.writeFileSync(path.join((0, file_1.downloadDir)(), 'vaks.json'), JSON.stringify(data));
        if (data.status === 'success') {
            cachedGames = data.games;
            return data.games;
        }
    }
    else {
        const data = JSON.parse(fs.readFileSync(path.join((0, file_1.downloadDir)(), 'vaks.json'), 'utf8'));
        cachedGames = data.games;
        return data.games;
    }
    return undefined;
});
exports.fetchAllGames = fetchAllGames;
// Check if vaks.json file has more than 1 day old, if so, fetch again
const fileGamesExistsAndIsValid = () => {
    const file = path.join((0, file_1.downloadDir)(), 'vaks.json');
    if (!fs.existsSync(file)) {
        return false;
    }
    const stats = fs.statSync(file);
    const now = new Date();
    const diff = Math.abs(now.getTime() - stats.mtime.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays <= 1;
};
//# sourceMappingURL=fetch.js.map