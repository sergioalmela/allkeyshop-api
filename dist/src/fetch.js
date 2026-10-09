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
const node_crypto_1 = require("node:crypto");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const file_1 = require("./file");
const CATALOG_FILE = 'vaks.json';
const CATALOG_URL = 'https://www.allkeyshop.com/api/v2/vaks.php?action=gameNames&currency=eur';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
let cachedCatalog;
let pendingLoad;
const catalogPath = () => path.join((0, file_1.cacheDir)(), CATALOG_FILE);
const parseCatalog = (data) => {
    if (typeof data !== 'object' ||
        data === null ||
        !('status' in data) ||
        data.status !== 'success' ||
        !('games' in data) ||
        !Array.isArray(data.games)) {
        return undefined;
    }
    const games = [];
    for (const game of data.games) {
        if (typeof game !== 'object' ||
            game === null ||
            !('id' in game) ||
            !('name' in game) ||
            typeof game.name !== 'string' ||
            game.name.trim() === '') {
            return undefined;
        }
        // Some catalog entries have no usable pricing product id.
        if (game.id === 0 || game.id === '0') {
            continue;
        }
        if (!((typeof game.id === 'string' && /^[1-9]\d*$/.test(game.id)) ||
            (typeof game.id === 'number' &&
                Number.isSafeInteger(game.id) &&
                game.id > 0))) {
            return undefined;
        }
        games.push({ id: String(game.id), name: game.name });
    }
    return data.games.length > 0 && games.length === 0 ? undefined : games;
};
const readCachedCatalog = () => {
    try {
        const file = catalogPath();
        const modifiedAt = fs.statSync(file).mtime.getTime();
        const expiresAt = modifiedAt + ONE_DAY_MS;
        if (modifiedAt > Date.now() || expiresAt <= Date.now()) {
            return undefined;
        }
        const games = parseCatalog(JSON.parse(fs.readFileSync(file, 'utf8')));
        return games === undefined ? undefined : { games, expiresAt };
    }
    catch {
        return undefined;
    }
};
// Atomic replacement keeps other processes from reading a partial catalog.
// The disk cache is optional: filesystem failures must not break a lookup.
const persistCatalog = (games) => {
    const file = catalogPath();
    const temporaryFile = `${file}.${(0, node_crypto_1.randomUUID)()}.tmp`;
    try {
        fs.mkdirSync((0, file_1.cacheDir)(), { recursive: true });
        fs.writeFileSync(temporaryFile, JSON.stringify({ status: 'success', games }));
        fs.renameSync(temporaryFile, file);
    }
    catch {
        try {
            fs.unlinkSync(temporaryFile);
        }
        catch {
            return;
        }
    }
};
const loadGames = async () => {
    const diskCatalog = readCachedCatalog();
    if (diskCatalog !== undefined) {
        return diskCatalog;
    }
    const response = await fetch(CATALOG_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch game catalog: HTTP ${response.status}`);
    }
    const games = parseCatalog(await response.json());
    if (games === undefined) {
        return undefined;
    }
    persistCatalog(games);
    return { games, expiresAt: Date.now() + ONE_DAY_MS };
};
const fetchAllGames = async () => {
    if (cachedCatalog !== undefined && cachedCatalog.expiresAt > Date.now()) {
        return cachedCatalog.games;
    }
    // Share a single in-flight load between concurrent callers so the catalog
    // is never downloaded more than once.
    if (pendingLoad === undefined) {
        pendingLoad = loadGames()
            .then((catalog) => {
            cachedCatalog = catalog;
            return catalog?.games;
        })
            .finally(() => {
            pendingLoad = undefined;
        });
    }
    return pendingLoad;
};
exports.fetchAllGames = fetchAllGames;
//# sourceMappingURL=fetch.js.map