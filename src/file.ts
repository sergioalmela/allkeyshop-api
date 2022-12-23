const fs = require('fs')
const path = require('path')

const rootDir = () => {
  let currentDir = __dirname
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..')
  }
  return currentDir
}

const downloadDir = () => {
  return path.join(rootDir(), 'dist/public/')
}

export {
  rootDir,
  downloadDir
}
