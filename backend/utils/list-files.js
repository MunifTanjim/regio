const fs = require('fs')

const listFiles = path => {
  const dirents = fs.readdirSync(path, { withFileTypes: true })

  const files = dirents
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name)

  return files
}

module.exports = listFiles
