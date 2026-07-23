import { CodePuzzle } from './types'

export const ALL_PUZZLES: Record<string, CodePuzzle> = {
  /* ═══ LEVEL 1 — The Cell ═══ */
  'cell-distract': {
    id: 'cell-distract',
    levelId: 1,
    title: 'Distract the Guard',
    description: 'The guard patrols outside your cell. You need to create a distraction. Write a function called `makeSound` that returns the string "BELL".',
    template: 'function makeSound() {\n  // YOUR CODE HERE\n}',
    test: 'return makeSound() === "BELL"',
    hint: 'Try: return "BELL";',
    successMessage: 'A loud bell rings! The guard rushes to investigate, leaving the keys behind.',
  },
  'cell-lockpick': {
    id: 'cell-lockpick',
    levelId: 1,
    title: 'Pick the Lock',
    description: 'The lock mechanism has four tumblers: [3, 1, 4, 2]. Write a function called `pickLock` that sorts the tumbler array in ascending order and returns it.',
    template: 'function pickLock(tumblers) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(pickLock([3,1,4,2])) === JSON.stringify([1,2,3,4])',
    hint: 'Try: return tumblers.sort();',
    successMessage: 'Click! The lock opens. The cell door swings free.',
  },

  /* ═══ LEVEL 2 — The Dungeon ═══ */
  'dungeon-trap': {
    id: 'dungeon-trap',
    levelId: 2,
    title: 'Disarm the Trap',
    description: 'A pressure plate trap blocks the path. The plate triggers on any pressure value above 50. Write a function called `isSafe` that returns `true` if a pressure value is 50 or less.',
    template: 'function isSafe(pressure) {\n  // YOUR CODE HERE\n}',
    test: 'return isSafe(30) === true && isSafe(70) === false',
    hint: 'Try: return pressure <= 50;',
    successMessage: 'The trap disarms with a click. Safe passage ahead.',
  },
  'dungeon-gate': {
    id: 'dungeon-gate',
    levelId: 2,
    title: 'Open the Gate',
    description: 'The iron gate needs the correct key. The keys are [5, 12, 7, 3]. Find the key that is greater than 10. Write a function called `findLargeKey` that returns the first number > 10 from an array.',
    template: 'function findLargeKey(keys) {\n  // YOUR CODE HERE\n}',
    test: 'return findLargeKey([5,12,7,3]) === 12',
    hint: 'Try: return keys.find(k => k > 10);',
    successMessage: 'The massive gate grinds open. The sewers await below.',
  },

  /* ═══ LEVEL 3 — The Sewers ═══ */
  'sewer-valve': {
    id: 'sewer-valve',
    levelId: 3,
    title: 'Reverse the Flow',
    description: 'The sewer water flows too fast. You need to reverse the pipe valve array to redirect the flow. Write a function called `reverseFlow` that returns the array reversed.',
    template: 'function reverseFlow(pipes) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(reverseFlow([1,2,3,4])) === JSON.stringify([4,3,2,1])',
    hint: 'Try: return pipes.reverse();',
    successMessage: 'The water level drops, revealing a dry passage.',
  },
  'sewer-exit': {
    id: 'sewer-exit',
    levelId: 3,
    title: 'Find the Exit',
    description: 'Three tunnels branch off. Only one is safe. The safe tunnel has "exit" in its name. Write a function called `findExit` that returns `true` if the name includes "exit".',
    template: 'function findExit(name) {\n  // YOUR CODE HERE\n}',
    test: 'return findExit("north_exit") === true && findExit("trap") === false',
    hint: 'Try: return name.includes("exit");',
    successMessage: 'Fresh air pours in. You scramble out of the sewers.',
  },

  /* ═══ LEVEL 4 — The Dark Forest ═══ */
  'forest-torches': {
    id: 'forest-torches',
    levelId: 4,
    title: 'Light the Torches',
    description: 'The forest path is pitch black. Five torches line the way. Write a function called `lightAll` that takes an array of torches and sets each one to "lit".',
    template: 'function lightAll(torches) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(lightAll(["unlit","unlit","unlit"])) === JSON.stringify(["lit","lit","lit"])',
    hint: 'Try: return torches.map(t => "lit");',
    successMessage: 'Light floods the path. The forest no longer seems so dark.',
  },
  'forest-beast': {
    id: 'forest-beast',
    levelId: 4,
    title: 'Calm the Beast',
    description: 'A massive wolf blocks the path. It calms if you have more than 3 provisions. Write a function called `hasEnough` that returns `true` if provisions > 3.',
    template: 'function hasEnough(provisions) {\n  // YOUR CODE HERE\n}',
    test: 'return hasEnough(5) === true && hasEnough(2) === false',
    hint: 'Try: return provisions > 3;',
    successMessage: 'The wolf sniffs the air and retreats into the trees.',
  },

  /* ═══ LEVEL 5 — The Village ═══ */
  'village-barter': {
    id: 'village-barter',
    levelId: 5,
    title: 'Fair Trade',
    description: 'The merchant wants 3 coins for a disguise. You have coins in various denominations. Write a function called `canAfford` that returns `true` if your coins total >= 3.',
    template: 'function canAfford(coins) {\n  // YOUR CODE HERE\n}',
    test: 'return canAfford([1,1,1]) === true && canAfford([1]) === false',
    hint: 'Try: return coins.reduce((a,b)=>a+b,0) >= 3;',
    successMessage: 'The merchant hands you a hooded cloak. You blend into the shadows.',
  },
  'village-gate': {
    id: 'village-gate',
    levelId: 5,
    title: 'Open Sesame',
    description: 'The village gate has a word lock. The password is formed by combining the first letters of three scrolls. Write a function called `getPassword` that takes an array of words and returns their first letters joined.',
    template: 'function getPassword(words) {\n  // YOUR CODE HERE\n}',
    test: 'return getPassword(["dawn","ice","tide"]) === "dit"',
    hint: 'Try: return words.map(w => w[0]).join("");',
    successMessage: 'The gate groans open. The mountain pass beckons.',
  },

  /* ═══ LEVEL 6 — The Mountain Pass ═══ */
  'bridge-planks': {
    id: 'bridge-planks',
    levelId: 6,
    title: 'Repair the Bridge',
    description: 'The rope bridge has broken planks. You have replacement planks of varying lengths. Write a function called `totalLength` that returns the sum of all plank lengths.',
    template: 'function totalLength(planks) {\n  // YOUR CODE HERE\n}',
    test: 'return totalLength([3,5,2]) === 10',
    hint: 'Try: return planks.reduce((a,b)=>a+b,0);',
    successMessage: 'The bridge is sturdy. You cross carefully.',
  },
  'bridge-rope': {
    id: 'bridge-rope',
    levelId: 6,
    title: 'Cut the Right Rope',
    description: 'The bridge is held by two ropes. Cut the frayed one (length less than 10). Write a function called `isFrayed` that returns `true` if a rope length is less than 10.',
    template: 'function isFrayed(length) {\n  // YOUR CODE HERE\n}',
    test: 'return isFrayed(7) === true && isFrayed(15) === false',
    hint: 'Try: return length < 10;',
    successMessage: 'The frayed rope snaps. The bridge holds.',
  },

  /* ═══ LEVEL 7 — The Courtyard ═══ */
  'courtyard-patrol': {
    id: 'courtyard-patrol',
    levelId: 7,
    title: 'Time the Patrol',
    description: 'The guard patrols between seconds 10 and 30. Pass only when he is between 15 and 25. Write a function called `isSafe` that returns `true` if time is between 15 and 25 (exclusive).',
    template: 'function isSafe(time) {\n  // YOUR CODE HERE\n}',
    test: 'return isSafe(20) === true && isSafe(10) === false && isSafe(25) === false',
    hint: 'Try: return time > 15 && time < 25;',
    successMessage: 'You slip past the guard unseen.',
  },
  'courtyard-cipher': {
    id: 'courtyard-cipher',
    levelId: 7,
    title: 'Crack the Cipher',
    description: 'The gate code is encrypted. Each letter shifts 1 forward in the alphabet. Write a function called `decode` that shifts a single letter by 1 (assume lowercase a-z).',
    template: 'function decode(letter) {\n  // YOUR CODE HERE\n}',
    test: 'return decode("a") === "b" && decode("z") === "a"',
    hint: 'Try: const code = letter.charCodeAt(0); return String.fromCharCode(code === 122 ? 97 : code + 1);',
    successMessage: 'The gate swings open. The great hall looms ahead.',
  },

  /* ═══ LEVEL 8 — The Great Hall ═══ */
  'hall-riddle': {
    id: 'hall-riddle',
    levelId: 8,
    title: 'Solve the Riddle',
    description: '"I speak without a mouth and hear without ears. I have no body, but I come alive with the wind." Echo is the answer. Write a function called `solveRiddle` that returns the string "echo".',
    template: 'function solveRiddle() {\n  // YOUR CODE HERE\n}',
    test: 'return solveRiddle() === "echo"',
    hint: 'Try: return "echo";',
    successMessage: 'The inscription glows. The path to the throne room reveals itself.',
  },
  'hall-portcullis': {
    id: 'hall-portcullis',
    levelId: 8,
    title: 'Raise the Portcullis',
    description: 'The portcullis requires exactly 100 units of counterweight. Write a function called `canLift` that returns `true` if the sum of an array equals 100.',
    template: 'function canLift(weights) {\n  // YOUR CODE HERE\n}',
    test: 'return canLift([40,30,30]) === true && canLift([10,20]) === false',
    hint: 'Try: return weights.reduce((a,b)=>a+b,0) === 100;',
    successMessage: 'The portcullis rises with a roar. The throne room is before you.',
  },

  /* ═══ LEVEL 9 — The Throne Room ═══ */
  'throne-shield': {
    id: 'throne-shield',
    levelId: 9,
    title: 'Shatter the Shield',
    description: 'The King\'s magic shield reflects all even numbers. Write a function called `shatter` that returns only the odd numbers from an array.',
    template: 'function shatter(numbers) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(shatter([1,2,3,4,5,6])) === JSON.stringify([1,3,5])',
    hint: 'Try: return numbers.filter(n => n % 2 !== 0);',
    successMessage: 'The shield cracks and shatters! The King is vulnerable!',
  },
  'throne-final': {
    id: 'throne-final',
    levelId: 9,
    title: 'The Final Strike',
    description: 'The King\'s health is 100. Your sword strike reduces his health by the number of vowels in a word. Write a function called `strike` that counts vowels (a,e,i,o,u) in a word and returns the remaining health.',
    template: 'function strike(health, word) {\n  // YOUR CODE HERE\n}',
    test: 'return strike(100, "audio") === 96',
    hint: 'Try: const vowels = word.match(/[aeiou]/gi); return health - (vowels ? vowels.length : 0);',
    successMessage: 'The King falls. Elena is free. The kingdom is saved.',
  },
}

export function getPuzzlesForLevel(levelId: number): CodePuzzle[] {
  return Object.values(ALL_PUZZLES).filter(p => p.levelId === levelId)
}

export function getPuzzle(id: string): CodePuzzle | undefined {
  return ALL_PUZZLES[id]
}

export function evaluateCode(userCode: string, testCode: string): Promise<{ success: boolean; output: string }> {
  return new Promise(resolve => {
    const id = crypto.randomUUID()
    const worker = new Worker(new URL('./sandbox.worker.ts', import.meta.url), { type: 'module' })

    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ success: false, output: 'Execution timed out (2s limit)' })
    }, 2000)

    worker.onmessage = (e: MessageEvent<{ id: string; success: boolean; output: string }>) => {
      if (e.data.id === id) {
        clearTimeout(timer)
        worker.terminate()
        resolve({ success: e.data.success, output: e.data.output })
      }
    }

    worker.onerror = () => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ success: false, output: 'Worker error' })
    }

    worker.onmessageerror = () => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ success: false, output: 'Worker communication error' })
    }

    worker.postMessage({ id, userCode, testCode })
  })
}
