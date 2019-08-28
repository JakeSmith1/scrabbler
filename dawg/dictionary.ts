import fs from 'fs'
import path from 'path'
import { createDawg } from './index'

const wordsFilePath = path.join(__dirname, '..', '..', 'twl06.txt')

const words = fs
  .readFileSync(wordsFilePath)
  .toString()
  .split('\n')

const dawg = createDawg(words)

export default dawg
