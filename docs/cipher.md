# Cipher of the Cosmic Colonists

## Introduction

In the world of "DeepvoidGate", interplanetary communication is a key element for the survival of colonies. Due to threats from space pirates and hostile factions, the colonists have developed a unique message encryption system known as the "Cipher of the Cosmic Colonists" (CCC). This document outlines the principles of the cipher, which players will need to decrypt during exploration of abandoned stations, unlocking secret documents, or communicating with other factions.

## Cipher Basics

The Cipher of the Cosmic Colonists combines elements of several classic encryption methods with a futuristic space context.

### 1. Galactic Substitution Table

At the core of the cipher is a 6x6 substitution table containing Latin alphabet letters and digits:

```
    | 1 | 2 | 3 | 4 | 5 | 6 |
----|---|---|---|---|---|---|
  1 | A | B | C | D | E | F |
  2 | G | H | I | J | K | L |
  3 | M | N | O | P | Q | R |
  4 | S | T | U | V | W | X |
  5 | Y | Z | 0 | 1 | 2 | 3 |
  6 | 4 | 5 | 6 | 7 | 8 | 9 |
```

Each letter/digit is represented by a pair of coordinates in the table. For example:

- "A" = 11 (row 1, column 1)
- "P" = 34 (row 3, column 4)
- "7" = 64 (row 6, column 4)

### 2. Orbital Keying

Each message is encrypted using an "orbital key", which is a sequence of numbers from 1 to 6 representing the planetary orbits in the colony's star system.

Example orbital key: `3-1-5-2-4-6`

The orbital key affects encryption as follows:

1. The first number in the key (3) is added to the first coordinate of the first character
2. The second number (1) is added to the second coordinate of the first character
3. The process repeats for the following characters, cyclically using the key

If a sum exceeds 6, it wraps around back to 1 (modulo 6 operation, with 6 instead of 0).

### 3. Stellar Transformation

After transforming all characters, special stellar symbols are added between digit pairs:

- ⋆ (star) – between digits of the same character
- ≋ (triple equals) – between different characters
- ⊛ (circled star) – every 5 characters, for easier reading

## Encryption Example

Let's encrypt the word "BASE" using the orbital key `3-1-5-2-4-6`:

1. B = 12 (row 1, column 2)

   - Add first key element (3,1): 1+3=4, 2+1=3
   - B → 43

2. A = 11 (row 1, column 1)

   - Add second key element (5,2): 1+5=6, 1+2=3
   - A → 63

3. S = 41 (row 4, column 1)

   - Add third key element (4,6): 4+4=8→2 (over 6), 1+6=7→1
   - S → 21

4. E = 15 (row 1, column 5)
   - Add fourth key element (2,4): 1+2=3, 5+4=9→3
   - E → 33

With stellar symbols:
`4⋆3≋6⋆3≋2⋆1≋3⋆3`

And with circled star every 5 characters for readability:
`4⋆3≋6⋆3⊛≋2⋆1≋3⋆3`

## In-Game Usage

### Secret Documents

Players will encounter encrypted messages in abandoned research stations, containing valuable info about rare resources, technologies, or hidden colony coordinates.

### Mission System

Some quests will require players to decrypt messages to discover the location of mission objectives or critical details.

### Faction Interactions

When first contacting unknown factions, communications will initially be encrypted. Decrypting messages helps understand intentions and gain diplomatic advantage.

### Gameplay Elements

- Players can collect fragments of orbital keys during exploration
- Special crew members (cryptographers) can speed up the decryption process
- Upgrades to the colony's communication center unlock automatic decryption tools

## Obtaining Keys

Orbital keys can be acquired through:

1. Studying ancient artifacts
2. Analyzing orbital patterns in unknown star systems
3. Hacking enemy faction computers
4. Diplomatic exchange with friendly colonies

## Implementation in Game Interface

When a player encounters an encrypted message, the game UI should:

1. Display the encrypted text with proper stellar symbols
2. Provide a field for entering the orbital key (if the player has it)
3. Show the decryption process after entering the correct key
4. Optionally: offer hints for a resource cost

---

This document is the intellectual property of the creators of the game "DeepVoidGate". Use is permitted only with the author mark
