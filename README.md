# Scrabble Helpers

_Tools to help you cheat in Scrabble_

## Table of Contents

1. [Word List](#word-list)
2. [DAWG](#dawg)

## Word List

This app uses the TWL06 word list from [wordgamedictionary.com](https://www.wordgamedictionary.com/twl06/)

## DAWG

A [directed acyclic word graph](https://en.wikipedia.org/wiki/Deterministic_acyclic_finite_state_automaton) implemented in JavaScript. A DAWG was chosen over a Trie because a DAWG greatly reduces the number of nodes, and we do not need to store any extra information about the words on the nodes.
