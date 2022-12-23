import * as fs from 'fs'
import * as path from 'path'

const rootDir = (): string => {
  let currentDir = __dirname
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..')
  }

  return currentDir
}

const downloadDir = (): string => {
  return path.join(rootDir(), 'dist/public/')
}

export {
  rootDir,
  downloadDir
}
