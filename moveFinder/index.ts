const Table = require('cli-table')
import dictionary from '../dawg/dictionary'
import { DawgNode } from '../dawg/index'

// board is 15x15
enum BoardDimensions {
  Width = 15,
  Height = 15
}

interface Tile {
  letter: string
  letterMultiplier?: (letterScore: number) => number
  wordMultiplier?: (wordScore: number) => number
}

type Board = Tile[][]

const createTile = (): Tile => ({
  letter: '',
  letterMultiplier: undefined,
  wordMultiplier: undefined
})
const createRow = (): Tile[] =>
  new Array(BoardDimensions.Width).fill(null).map(createTile)

const createBoard = (): Board =>
  new Array(BoardDimensions.Height).fill(null).map(createRow)

const board = createBoard()

type Coordinate = [number, number]

const isInBounds = ([x, y]: Coordinate) =>
  x < BoardDimensions.Width - 1 &&
  x > 0 &&
  y < BoardDimensions.Height - 1 &&
  y > 0

const validPlacement = (
  letters: string[],
  start: Coordinate,
  end: Coordinate
) => {
  const wordLength = letters.length
  const [startX, startY] = start
  const [endX, endY] = end
  if (!isInBounds(start) || !isInBounds(end)) {
    throw new Error('invalid word placement')
  }

  if (startX !== endX && startY !== endY) {
    throw new Error('words must be placed vertically or horizontally')
  }

  if (
    Math.abs(startX - endX) !== wordLength &&
    Math.abs(startY - endY) !== wordLength
  ) {
    throw new Error('word length and coordinates do not match')
  }
}

const isHorizontal = ([startX]: Coordinate, [endX]: Coordinate) =>
  startX !== endX

const placeWord = (word: string, start: Coordinate, end: Coordinate) => {
  const letters = word.split('')

  validPlacement(letters, start, end)

  const startX = start[0] - 1
  const startY = start[1] - 1
  const endX = end[0] - 1
  const endY = start[1] - 1

  let letterIndex = 0
  if (isHorizontal(start, end)) {
    for (let x = startX; x < endX; x += 1, letterIndex += 1) {
      board[startY][x].letter = letters[letterIndex]
    }
  } else {
    for (let y = startY; y < endY; y += 1, letterIndex += 1) {
      board[y][startX].letter = letters[letterIndex]
    }
  }
}

placeWord('cat', [7, 7], [10, 7])

// const renderBoard = (board: Board) =>
//   board.reduce((display, row) => {
//     const letters = row.map(({ letter }) => letter).join(' | ')
//     console.log('row', row)
//     return `${display}\n${letters}`
//   }, '')

const renderBoard = (board: Board) => {
  const table = new Table()

  table.push(...board.map(row => row.map(({ letter }) => letter)))

  return table.toString()
}

console.log(renderBoard(board))

type TraverseCallback = (
  tile: Tile,
  board: Board,
  coordinates: Coordinate
) => void

const traverseBoard = (callback: TraverseCallback) => {
  for (let y = 0; y < BoardDimensions.Height - 1; y += 1) {
    for (let x = 0; x < BoardDimensions.Width - 1; x += 1) {
      const tile = board[y][x]
      callback(tile, board, [x, y])
    }
  }
}

const removeOne = (l: string, letters: string[]) => {
  const results = []
  let didRemove = false
  for (let i = 0; i < letters.length; i += 1) {
    if (letters[i] === l && !didRemove) {
      didRemove = true
    } else {
      results.push(letters[i])
    }
  }
  return results
}

// LeftPart(PartialWord, node N in dawg, limit) =
//   3.3.1 Placing Left Parts.The left part is either alBecause all of the squares covered by the left part
// ExtendRight(PartialWord, N, Anchorsquare)
// if limit > 0 then
// for each edge E out of N
// if the letter 1 labeling edge E is
// remove a tile labeled 1 from the
// let N' be the node reached by
// Leftpart(PartialWord. 1, N',
// put the tile 1 back into the rack

// anchor - a tile adjacent to an already placed tile

// find all possible left parts
// for each left part find all possible right parts

const extendRight = (partialWord: string, node: DawgNode, tile: Tile) => {}

const leftPart = (
  partialWord: string,
  node: DawgNode,
  limit: number,
  tile: Tile,
  rack: string[]
): string[] => {
  extendRight(partialWord, node, tile)
  if (limit === 0 && node.final) {
    return [partialWord]
  }

  const words = []

  for (const letter in node.edges) {
    if (!rack.includes(letter)) {
      continue
    }

    const nextRack = removeOne(letter, rack)
    const nextNode = node.edges[letter]
    words.push(
      ...leftPart(partialWord + letter, nextNode, limit - 1, tile, nextRack)
    )
  }

  return words
}
const parts = leftPart('', dictionary.root, 5, board[6][5], [
  'a',
  'c',
  'j',
  'k',
  'e',
  'r'
])
console.log('parts:', parts)
