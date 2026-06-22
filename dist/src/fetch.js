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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllGames = void 0;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const file_1 = require("./file");
const CATALOG_FILE = 'vaks.json';
const CATALOG_URL = 'https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
let cachedGames;
let pendingLoad;
const catalogPath = () => path.join((0, file_1.cacheDir)(), CATALOG_FILE);
// The on-disk catalog is considered fresh for one day.
const isCacheFresh = () => {
    const file = catalogPath();
    if (!fs.existsSync(file)) {
        return false;
    }
    const ageMs = Date.now() - fs.statSync(file).mtime.getTime();
    return ageMs < ONE_DAY_MS;
};
const readCachedCatalog = () => {
    const data = JSON.parse(fs.readFileSync(catalogPath(), 'utf8'));
    return data.games;
};
const downloadCatalog = async () => {
    const response = await fetch(CATALOG_URL);
    const data = await response.json();
    // Only persist a successful response so we never cache an error payload.
    if (data.status !== 'success' || data.games === undefined) {
        return undefined;
    }
    fs.mkdirSync((0, file_1.cacheDir)(), { recursive: true });
    fs.writeFileSync(catalogPath(), JSON.stringify(data));
    return data.games;
};
const loadGames = async () => isCacheFresh() ? readCachedCatalog() : downloadCatalog();
const fetchAllGames = async () => {
    if (cachedGames !== undefined) {
        return cachedGames;
    }
    // Share a single in-flight load between concurrent callers so the catalog
    // is never downloaded more than once.
    if (pendingLoad === undefined) {
        pendingLoad = loadGames();
    }
    try {
        cachedGames = await pendingLoad;
        return cachedGames;
    }
    finally {
        pendingLoad = undefined;
    }
};
exports.fetchAllGames = fetchAllGames;
//# sourceMappingURL=fetch.js.map