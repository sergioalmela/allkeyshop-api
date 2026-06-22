import * as os from 'node:os'
import * as path from 'node:path'

const CACHE_DIR_NAME = 'allkeyshop-api'

// Directory where the game catalog is cached. It lives in the OS temp
// directory so the cache keeps working when the package is installed as a
// read-only dependency inside node_modules.
const cacheDir = (): string => path.join(os.tmpdir(), CACHE_DIR_NAME)

export { cacheDir }
