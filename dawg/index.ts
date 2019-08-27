// Types
interface Edges {
  [letter: string]: DawgNode
}

interface DawgNode {
  id: number
  final: boolean
  edges: Edges
}

type UncheckedNode = [DawgNode, string, DawgNode]

interface MinimizedNodes {
  [letter: string]: DawgNode
}

// Functions
let id = 1
const nextId = () => id++

function createNode(): DawgNode {
  return {
    id: nextId(),
    final: false,
    edges: {}
  }
}

function createDawg(words: string[]) {
  // State
  let previousWord = ''
  const root = createNode()
  const uncheckedNodes: UncheckedNode[] = []
  const minimizedNodes: MinimizedNodes = {}

  // Methods
  const insert = (word: string) => {
    // Implementation details adapted from http://stevehanov.ca/blog/index.php?id=115 (python)
    if (word < previousWord) {
      throw new Error('alphabetical order required')
    }

    // find common prefix with previous word
    let commonPrefix = 0
    const minLength = Math.min(word.length, previousWord.length)

    for (let i = 0; i < minLength; i += 1) {
      if (word.charAt(i) !== previousWord.charAt(i)) {
        break
      }
      commonPrefix += 1
    }

    // check uncheckednodes for redudant nodes
    _minimize(commonPrefix)

    // add suffix to the graph starting at the shared prefix if there is one
    let node: DawgNode
    if (uncheckedNodes.length === 0) {
      node = root
    } else {
      const lastIndex = uncheckedNodes.length - 1
      const [_node, _letter, nextNode] = uncheckedNodes[lastIndex]
      node = nextNode
    }

    // add all letters that were not shared to the unchecked nodes
    for (let i = commonPrefix; i < word.length; i += 1) {
      const letter = word[i]
      const nextNode = createNode()
      node.edges[letter] = nextNode
      uncheckedNodes.push([node, letter, nextNode])
      node = nextNode
    }

    node.final = true
    previousWord = word
  }

  const _minimize = (to: number) => {
    for (let i = uncheckedNodes.length - 1; i > to - 1; i -= 1) {
      const [parent, letter, child] = uncheckedNodes[i]
      if (minimizedNodes[child.id]) {
        parent.edges[letter] = minimizedNodes[child.id]
      } else {
        minimizedNodes[child.id] = child
      }
      uncheckedNodes.pop()
    }
  }

  const minimize = () => _minimize(0)

  const lookup = (word: string) => {
    let node = root

    for (const letter of word) {
      if (!node.edges[letter]) {
        return false
      }
      node = node.edges[letter]
    }

    return node.final
  }

  const nodeCount = () => Object.keys(minimizedNodes).length

  const edgeCount = () =>
    Object.keys(minimizedNodes).reduce(
      (acc, nodeKey) => acc + Object.keys(minimizedNodes[nodeKey].edges).length,
      0
    )

  // Initialization
  words.forEach(word => insert(word))

  minimize()

  // Expose methods
  return {
    insert,
    minimize,
    lookup,
    nodeCount,
    edgeCount,
    root
  }
}

function getAllSuffixesFromPrefix(prefix: string, node: DawgNode) {
  const words = []

  for (const letter of prefix.slice(0, prefix.length - 1)) {
    if (!node.edges[letter]) {
      return []
    }
    node = node.edges[letter]
  }

  type StackEntry = [string, DawgNode]
  const stack: Array<StackEntry> = [[prefix, node]]

  while (stack.length) {
    const [currentPrefix, currentNode] = stack.pop() as StackEntry
    for (const [letter, edgeNode] of Object.entries(currentNode.edges)) {
      const word = `${currentPrefix}${letter}`
      if (edgeNode.final) {
        words.push(word)
      }
      stack.push([word, edgeNode])
    }
  }

  return words
}

export { createDawg, getAllSuffixesFromPrefix }
