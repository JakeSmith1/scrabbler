import { getAllSuffixesFromPrefix } from '../dawg/index'
import dictionary from '../dawg/dictionary'

const [prefix] = process.argv.slice(2)

if (!prefix) {
  console.log('Please enter a prefix like: ', 'npm run find-prefix establish\n')
  process.exit(1)
}

console.log(
  `All words beginning with ${prefix}:`,
  `\n\t${getAllSuffixesFromPrefix(prefix, dictionary.root).join(',\n\t')}`
)
