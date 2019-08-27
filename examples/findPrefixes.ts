const fs = require('fs')
const path = require('path')
const wordsFilePath = path.join(__dirname, '..', '..', 'twl06.txt')
const { createDawg, getAllSuffixesFromPrefix } = require('../dawg/index')

const [prefix] = process.argv.slice(2)

if (!prefix) {
  console.log('Please enter a prefix like: ', 'npm run find-prefix establish\n')
  process.exit(1)
}

const words = fs
  .readFileSync(wordsFilePath)
  .toString()
  .split('\n')

const dawg = createDawg(words)

console.log(
  `All words beginning with ${prefix}:`,
  `\n\t${getAllSuffixesFromPrefix(prefix, dawg.root).join(',\n\t')}`
)
