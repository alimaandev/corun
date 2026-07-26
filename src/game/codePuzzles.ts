import { CodePuzzle } from './types'

export const ALL_PUZZLES: Record<string, CodePuzzle> = {
  /* ═══ LEVEL 1 — The Cell ═══ */
  'cell-distract': {
    id: 'cell-distract',
    levelId: 1,
    title: 'Distract the Guard',
    description:
      'The guard patrols outside your cell. You need to create a distraction. Write a function called `makeSound` that returns the string "BELL".',
    template: 'function makeSound() {\n  // YOUR CODE HERE\n}',
    test: 'return makeSound() === "BELL"',
    hint: 'Try: return "BELL";',
    successMessage: 'A loud bell rings! The guard rushes to investigate, leaving the keys behind.',
  },
  'cell-lockpick': {
    id: 'cell-lockpick',
    levelId: 1,
    title: 'Pick the Lock',
    description:
      'The lock mechanism has four tumblers: [3, 1, 4, 2]. Write a function called `pickLock` that sorts the tumbler array in ascending order and returns it.',
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
    description:
      'A pressure plate trap blocks the path. The plate triggers on any pressure value above 50. Write a function called `isSafe` that returns `true` if a pressure value is 50 or less.',
    template: 'function isSafe(pressure) {\n  // YOUR CODE HERE\n}',
    test: 'return isSafe(30) === true && isSafe(70) === false',
    hint: 'Try: return pressure <= 50;',
    successMessage: 'The trap disarms with a click. Safe passage ahead.',
  },
  'dungeon-gate': {
    id: 'dungeon-gate',
    levelId: 2,
    title: 'Open the Gate',
    description:
      'The iron gate needs the correct key. The keys are [5, 12, 7, 3]. Find the key that is greater than 10. Write a function called `findLargeKey` that returns the first number > 10 from an array.',
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
    description:
      'The sewer water flows too fast. You need to reverse the pipe valve array to redirect the flow. Write a function called `reverseFlow` that returns the array reversed.',
    template: 'function reverseFlow(pipes) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(reverseFlow([1,2,3,4])) === JSON.stringify([4,3,2,1])',
    hint: 'Try: return pipes.reverse();',
    successMessage: 'The water level drops, revealing a dry passage.',
  },
  'sewer-exit': {
    id: 'sewer-exit',
    levelId: 3,
    title: 'Find the Exit',
    description:
      'Three tunnels branch off. Only one is safe. The safe tunnel has "exit" in its name. Write a function called `findExit` that returns `true` if the name includes "exit".',
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
    description:
      'The forest path is pitch black. Five torches line the way. Write a function called `lightAll` that takes an array of torches and sets each one to "lit".',
    template: 'function lightAll(torches) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(lightAll(["unlit","unlit","unlit"])) === JSON.stringify(["lit","lit","lit"])',
    hint: 'Try: return torches.map(t => "lit");',
    successMessage: 'Light floods the path. The forest no longer seems so dark.',
  },
  'forest-beast': {
    id: 'forest-beast',
    levelId: 4,
    title: 'Calm the Beast',
    description:
      'A massive wolf blocks the path. It calms if you have more than 3 provisions. Write a function called `hasEnough` that returns `true` if provisions > 3.',
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
    description:
      'The merchant wants 3 coins for a disguise. You have coins in various denominations. Write a function called `canAfford` that returns `true` if your coins total >= 3.',
    template: 'function canAfford(coins) {\n  // YOUR CODE HERE\n}',
    test: 'return canAfford([1,1,1]) === true && canAfford([1]) === false',
    hint: 'Try: return coins.reduce((a,b)=>a+b,0) >= 3;',
    successMessage: 'The merchant hands you a hooded cloak. You blend into the shadows.',
  },
  'village-gate': {
    id: 'village-gate',
    levelId: 5,
    title: 'Open Sesame',
    description:
      'The village gate has a word lock. The password is formed by combining the first letters of three scrolls. Write a function called `getPassword` that takes an array of words and returns their first letters joined.',
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
    description:
      'The rope bridge has broken planks. You have replacement planks of varying lengths. Write a function called `totalLength` that returns the sum of all plank lengths.',
    template: 'function totalLength(planks) {\n  // YOUR CODE HERE\n}',
    test: 'return totalLength([3,5,2]) === 10',
    hint: 'Try: return planks.reduce((a,b)=>a+b,0);',
    successMessage: 'The bridge is sturdy. You cross carefully.',
  },
  'bridge-rope': {
    id: 'bridge-rope',
    levelId: 6,
    title: 'Cut the Right Rope',
    description:
      'The bridge is held by two ropes. Cut the frayed one (length less than 10). Write a function called `isFrayed` that returns `true` if a rope length is less than 10.',
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
    description:
      'The guard patrols between seconds 10 and 30. Pass only when he is between 15 and 25. Write a function called `isSafe` that returns `true` if time is between 15 and 25 (exclusive).',
    template: 'function isSafe(time) {\n  // YOUR CODE HERE\n}',
    test: 'return isSafe(20) === true && isSafe(10) === false && isSafe(25) === false',
    hint: 'Try: return time > 15 && time < 25;',
    successMessage: 'You slip past the guard unseen.',
  },
  'courtyard-cipher': {
    id: 'courtyard-cipher',
    levelId: 7,
    title: 'Crack the Cipher',
    description:
      'The gate code is encrypted. Each letter shifts 1 forward in the alphabet. Write a function called `decode` that shifts a single letter by 1 (assume lowercase a-z).',
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
    description:
      '"I speak without a mouth and hear without ears. I have no body, but I come alive with the wind." Echo is the answer. Write a function called `solveRiddle` that returns the string "echo".',
    template: 'function solveRiddle() {\n  // YOUR CODE HERE\n}',
    test: 'return solveRiddle() === "echo"',
    hint: 'Try: return "echo";',
    successMessage: 'The inscription glows. The path to the throne room reveals itself.',
  },
  'hall-portcullis': {
    id: 'hall-portcullis',
    levelId: 8,
    title: 'Raise the Portcullis',
    description:
      'The portcullis requires exactly 100 units of counterweight. Write a function called `canLift` that returns `true` if the sum of an array equals 100.',
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
    description:
      "The King's magic shield reflects all even numbers. Write a function called `shatter` that returns only the odd numbers from an array.",
    template: 'function shatter(numbers) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(shatter([1,2,3,4,5,6])) === JSON.stringify([1,3,5])',
    hint: 'Try: return numbers.filter(n => n % 2 !== 0);',
    successMessage: 'The shield cracks and shatters! The King is vulnerable!',
  },
  'throne-final': {
    id: 'throne-final',
    levelId: 9,
    title: 'The Final Strike',
    description:
      "The King's health is 100. Your sword strike reduces his health by the number of vowels in a word. Write a function called `strike` that counts vowels (a,e,i,o,u) in a word and returns the remaining health.",
    template: 'function strike(health, word) {\n  // YOUR CODE HERE\n}',
    test: 'return strike(100, "audio") === 96',
    hint: 'Try: const vowels = word.match(/[aeiou]/gi); return health - (vowels ? vowels.length : 0);',
    successMessage: 'The King falls. Elena is free. The kingdom is saved.',
  },

  /* ═══ LEVEL 1 — Bonus Puzzles ═══ */
  'cell-escape': {
    id: 'cell-escape',
    levelId: 1,
    title: 'Escape the Cell',
    description:
      'The guard left his keys! Combine "key" and "hole" to form the lockpick command. Write a function called `combine` that returns the concatenation of two strings.',
    template: 'function combine(a, b) {\n  // YOUR CODE HERE\n}',
    test: 'return combine("key", "hole") === "keyhole"',
    hint: 'Try: return a + b;',
    successMessage: 'The keyhole turns! Freedom is one step closer.',
  },
  'cell-count': {
    id: 'cell-count',
    levelId: 1,
    title: 'Count the Steps',
    description:
      'You count 4 steps to the door, 6 to the window, and 8 to the guard post. Write a function called `totalSteps` that sums three numbers.',
    template: 'function totalSteps(a, b, c) {\n  // YOUR CODE HERE\n}',
    test: 'return totalSteps(4,6,8) === 18',
    hint: 'Try: return a + b + c;',
    successMessage: 'You now know the layout by heart.',
  },
  'cell-signal': {
    id: 'cell-signal',
    levelId: 1,
    title: 'Signal the Coast',
    description:
      'Tap out a message. Write a function called `tap` that returns the string "SOS" repeated `n` times.',
    template: 'function tap(n) {\n  // YOUR CODE HERE\n}',
    test: 'return tap(3) === "SOSSOSSOS"',
    hint: 'Try: return "SOS".repeat(n);',
    successMessage: 'A distant light flashes back. Someone sees you!',
  },
  'cell-barrel': {
    id: 'cell-barrel',
    levelId: 1,
    title: 'Roll the Barrel',
    description:
      'A barrel blocks the door. Roll it away by repeating the roll command. Write a function called `roll` that takes a string and returns it wrapped in "roll()" — e.g., roll("barrel") => "roll(barrel)".',
    template: 'function roll(item) {\n  // YOUR CODE HERE\n}',
    test: 'return roll("barrel") === "roll(barrel)"',
    hint: 'Try: return "roll(" + item + ")";',
    successMessage: 'The barrel rolls aside! The path is clear.',
  },

  /* ═══ LEVEL 2 — Bonus Puzzles ═══ */
  'dungeon-lever': {
    id: 'dungeon-lever',
    levelId: 2,
    title: 'Pull the Right Lever',
    description:
      'Three levers: left, middle, right. Only the middle one (index 1) is safe. Write a function called `isSafeLever` that returns `true` if the index is 1.',
    template: 'function isSafeLever(index) {\n  // YOUR CODE HERE\n}',
    test: 'return isSafeLever(1) === true && isSafeLever(0) === false && isSafeLever(2) === false',
    hint: 'Try: return index === 1;',
    successMessage: 'The wall slides open, revealing a hidden passage.',
  },
  'dungeon-torch': {
    id: 'dungeon-torch',
    levelId: 2,
    title: 'Light the Way',
    description:
      'The dungeon is dark. You need to light every third torch. Write a function called `lightPattern` that creates an array of `n` torches where every third one is "lit" and the rest are "dark".',
    template: 'function lightPattern(n) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(lightPattern(6)) === JSON.stringify(["dark","dark","lit","dark","dark","lit"])',
    hint: 'Try: return Array.from({length:n}, (_,i) => (i+1) % 3 === 0 ? "lit" : "dark");',
    successMessage: 'The path illuminates. No more tripping in the dark.',
  },

  /* ═══ LEVEL 3 — Bonus Puzzles ═══ */
  'sewer-filter': {
    id: 'sewer-filter',
    levelId: 3,
    title: 'Filter the Debris',
    description:
      'The sewer grate is clogged. Remove all debris items that are smaller than 5. Write a function called `filterDebris` that returns items >= 5 from an array.',
    template: 'function filterDebris(items) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(filterDebris([2,7,3,9,1,5])) === JSON.stringify([7,9,5])',
    hint: 'Try: return items.filter(i => i >= 5);',
    successMessage: 'The water flows freely. You wade through.',
  },
  'sewer-rat': {
    id: 'sewer-rat',
    levelId: 3,
    title: 'Outsmart the Rat',
    description:
      'A giant rat blocks the pipe. It fears anything larger than itself (size 8). Write a function called `biggerThan` that returns `true` if a number is greater than 8.',
    template: 'function biggerThan(n) {\n  // YOUR CODE HERE\n}',
    test: 'return biggerThan(9) === true && biggerThan(8) === false',
    hint: 'Try: return n > 8;',
    successMessage: 'The rat scurries away. The pipe is clear.',
  },

  /* ═══ LEVEL 4 — Bonus Puzzles ═══ */
  'forest-path': {
    id: 'forest-path',
    levelId: 4,
    title: 'Find the Path',
    description:
      'The forest has hidden markers. Find the marker at a specific position in the array. Write a function called `getMarker` that returns the element at a given index.',
    template: 'function getMarker(markers, index) {\n  // YOUR CODE HERE\n}',
    test: 'return getMarker(["stone","moss","root","mushroom"], 2) === "root"',
    hint: 'Try: return markers[index];',
    successMessage: 'The hidden path reveals itself through the thicket.',
  },
  'forest-herbs': {
    id: 'forest-herbs',
    levelId: 4,
    title: 'Brew the Potion',
    description:
      'You need 3 herbs: nightshade, wolfsbane, and mandrake. Check if a list includes all three. Write a function called `hasIngredients` that returns `true` if all three are present.',
    template: 'function hasIngredients(herbs) {\n  // YOUR CODE HERE\n}',
    test: 'return hasIngredients(["nightshade","wolfsbane","mandrake","thyme"]) === true && hasIngredients(["thyme","rosemary"]) === false',
    hint: 'Try: return ["nightshade","wolfsbane","mandrake"].every(h => herbs.includes(h));',
    successMessage: 'The potion bubbles and glows green. You drink it and feel stronger.',
  },

  /* ═══ LEVEL 5 — Bonus Puzzles ═══ */
  'village-disguise': {
    id: 'village-disguise',
    levelId: 5,
    title: 'Craft a Disguise',
    description:
      'You need a hat, cloak, and boots. Write a function called `makeDisguise` that takes three items and returns them as a sentence: "A [hat], [cloak], and [boots]".',
    template: 'function makeDisguise(hat, cloak, boots) {\n  // YOUR CODE HERE\n}',
    test: 'return makeDisguise("hood","cape","sandals") === "A hood, cape, and sandals"',
    hint: 'Try: return "A " + hat + ", " + cloak + ", and " + boots;',
    successMessage: 'You look like a wandering merchant. Perfect camouflage.',
  },
  'village-scout': {
    id: 'village-scout',
    levelId: 5,
    title: 'Scout the Village',
    description:
      'Scout the village by mapping building names to their heights. Write a function called `getHeights` that extracts the "height" property from an array of objects.',
    template: 'function getHeights(buildings) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(getHeights([{name:"inn",height:3},{name:"well",height:1},{name:"wall",height:5}])) === JSON.stringify([3,1,5])',
    hint: 'Try: return buildings.map(b => b.height);',
    successMessage: 'You note the tallest buildings. The escape route is clear.',
  },
  'village-map': {
    id: 'village-map',
    levelId: 5,
    title: 'Read the Map',
    description:
      'The map shows distances to three exits. Check if any exit is within 2 units. Write a function called `closeExit` that returns `true` if any distance in an array is less than or equal to 2.',
    template: 'function closeExit(distances) {\n  // YOUR CODE HERE\n}',
    test: 'return closeExit([5,1,8]) === true && closeExit([3,7,9]) === false',
    hint: 'Try: return distances.some(d => d <= 2);',
    successMessage: 'A hidden passage is just 1 unit away! You find the escape route.',
  },

  /* ═══ LEVEL 6 — Bonus Puzzles ═══ */
  'bridge-knot': {
    id: 'bridge-knot',
    levelId: 6,
    title: 'Untie the Knot',
    description:
      'The rope has a knot at position 3. Remove it by extracting a portion of the rope. Write a function called `cutRope` that returns a rope string with the character at `pos` removed.',
    template: 'function cutRope(rope, pos) {\n  // YOUR CODE HERE\n}',
    test: 'return cutRope("knotty", 3) === "knoty"',
    hint: 'Try: return rope.slice(0, pos) + rope.slice(pos + 1);',
    successMessage: 'The knot loosens. The rope is now usable.',
  },
  'bridge-count': {
    id: 'bridge-count',
    levelId: 6,
    title: 'Count the Planks',
    description:
      'You need to replace damaged planks. A plank is damaged if its length is even. Write a function called `countDamaged` that counts how many numbers in an array are even.',
    template: 'function countDamaged(planks) {\n  // YOUR CODE HERE\n}',
    test: 'return countDamaged([2,3,4,5,6]) === 3',
    hint: 'Try: return planks.filter(p => p % 2 === 0).length;',
    successMessage: 'You replace 3 planks. The bridge is solid again.',
  },

  /* ═══ LEVEL 7 — Bonus Puzzles ═══ */
  'courtyard-alarm': {
    id: 'courtyard-alarm',
    levelId: 7,
    title: 'Silence the Alarm',
    description:
      'The alarm triggers if the guard count is NOT 0. Write a function called `allClear` that returns `true` only if the count is 0.',
    template: 'function allClear(guardCount) {\n  // YOUR CODE HERE\n}',
    test: 'return allClear(0) === true && allClear(1) === false',
    hint: 'Try: return guardCount === 0;',
    successMessage: 'The alarm panel goes dark. The courtyard is silent.',
  },
  'courtyard-torch': {
    id: 'courtyard-torch',
    levelId: 7,
    title: 'Extinguish the Torches',
    description:
      'Put out every torch by setting each value to 0. Write a function called `extinguish` that returns an array of the same length filled with 0.',
    template: 'function extinguish(torches) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(extinguish([3,5,2])) === JSON.stringify([0,0,0])',
    hint: 'Try: return torches.map(() => 0);',
    successMessage: 'Darkness falls over the courtyard. Perfect cover.',
  },

  /* ═══ LEVEL 8 — Bonus Puzzles ═══ */
  'hall-puzzle': {
    id: 'hall-puzzle',
    levelId: 8,
    title: 'The Floor Tiles',
    description:
      'The great hall floor has tiles arranged in a grid. Only the safe tiles are true. Write a function called `countSafe` that counts the `true` values in an array.',
    template: 'function countSafe(tiles) {\n  // YOUR CODE HERE\n}',
    test: 'return countSafe([true,false,true,true,false]) === 3',
    hint: 'Try: return tiles.filter(t => t).length;',
    successMessage: 'You step only on the safe tiles. The hall is crossed.',
  },
  'hall-statue': {
    id: 'hall-statue',
    levelId: 8,
    title: 'Move the Statue',
    description:
      'Push the heavy statue to reveal the hidden door. The statue moves `steps` positions. Write a function called `moveStatue` that returns a new array with the first element moved to the given position.',
    template: 'function moveStatue(items, steps) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(moveStatue(["a","b","c","d"], 2)) === JSON.stringify(["b","c","a","d"])',
    hint: 'Try: const [first, ...rest] = items; rest.splice(steps, 0, first); return rest;',
    successMessage: 'The statue grinds across the floor. A secret door is revealed!',
  },
  'hall-armor': {
    id: 'hall-armor',
    levelId: 8,
    title: 'Don the Armor',
    description:
      'The armor set has chest, helm, and greaves. Check if you have all three. Write a function called `hasFullSet` that returns `true` if an array contains "chest", "helm", and "greaves".',
    template: 'function hasFullSet(items) {\n  // YOUR CODE HERE\n}',
    test: 'return hasFullSet(["chest","helm","greaves","sword"]) === true && hasFullSet(["helm","greaves"]) === false',
    hint: 'Try: return items.includes("chest") && items.includes("helm") && items.includes("greaves");',
    successMessage: 'Clad in full armor, you feel invincible.',
  },

  /* ═══ LEVEL 9 — Bonus Puzzles ═══ */
  'throne-guard': {
    id: 'throne-guard',
    levelId: 9,
    title: 'Bypass the Guard',
    description:
      'The royal guard only lets people pass if their name is exactly "Elena". Write a function called `checkName` that returns `true` if the name matches "Elena".',
    template: 'function checkName(name) {\n  // YOUR CODE HERE\n}',
    test: 'return checkName("Elena") === true && checkName("intruder") === false',
    hint: 'Try: return name === "Elena";',
    successMessage: 'The guard steps aside. The throne room is open.',
  },
  'throne-crown': {
    id: 'throne-crown',
    levelId: 9,
    title: 'Claim the Crown',
    description:
      'The crown sits on a pedestal 5 steps away. Write a function called `approach` that takes an array of obstacles and returns `true` if none of them are "spike".',
    template: 'function approach(obstacles) {\n  // YOUR CODE HERE\n}',
    test: 'return approach(["stone","torch","rug"]) === true && approach(["spike","torch"]) === false',
    hint: 'Try: return !obstacles.includes("spike");',
    successMessage: 'You claim the crown. The kingdom is yours!',
  },

  /* ═══ LEVEL 10 — The Library ═══ */
  'library-catalog': {
    id: 'library-catalog',
    levelId: 10,
    title: 'Organize the Catalog',
    description:
      'The library books are in a mess. Sort them alphabetically. Write a function called `sortBooks` that returns a sorted copy of an array of strings.',
    template: 'function sortBooks(books) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(sortBooks(["zoo","ant","map"])) === JSON.stringify(["ant","map","zoo"])',
    hint: 'Try: return [...books].sort();',
    successMessage: 'The bookshelf is organized. A hidden lever is revealed behind it.',
  },
  'library-index': {
    id: 'library-index',
    levelId: 10,
    title: 'Find the Index',
    description:
      'Find a book by its exact title. Write a function called `findBook` that returns the index of the target in an array, or -1 if not found.',
    template: 'function findBook(books, target) {\n  // YOUR CODE HERE\n}',
    test: 'return findBook(["a","b","c"], "b") === 1 && findBook(["a","b","c"], "z") === -1',
    hint: 'Try: return books.indexOf(target);',
    successMessage: 'You pull the book. A section of the wall rotates open.',
  },
  'library-scroll': {
    id: 'library-scroll',
    levelId: 10,
    title: 'Decode the Scroll',
    description:
      'The ancient scroll is written in uppercase. Convert it to lowercase to read it. Write a function called `lowercase` that returns the string in lowercase.',
    template: 'function lowercase(text) {\n  // YOUR CODE HERE\n}',
    test: 'return lowercase("HELLO WORLD") === "hello world"',
    hint: 'Try: return text.toLowerCase();',
    successMessage: 'The scroll reads: "The treasure lies beneath the tower."',
  },
  'library-archive': {
    id: 'library-archive',
    levelId: 10,
    title: 'Archive the Records',
    description:
      'Archive old records (number < 100) into a separate array. Write a function called `archive` that splits an array into two: [[old], [new]] where old are numbers < 100.',
    template: 'function archive(records) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(archive([50,200,30,150])) === JSON.stringify([[50,30],[200,150]])',
    hint: 'Try: return [records.filter(r => r < 100), records.filter(r => r >= 100)];',
    successMessage: 'The archive is ordered. An old map falls out of a dusty file.',
  },

  /* ═══ LEVEL 11 — The Laboratory ═══ */
  'lab-formula': {
    id: 'lab-formula',
    levelId: 11,
    title: 'Mix the Formula',
    description:
      "The alchemist's formula doubles the value of each ingredient. Write a function called `concentrate` that returns a new array with each number doubled.",
    template: 'function concentrate(ingredients) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(concentrate([1,2,3])) === JSON.stringify([2,4,6])',
    hint: 'Try: return ingredients.map(i => i * 2);',
    successMessage: 'The formula glows bright blue. The door dissolves.',
  },
  'lab-sequence': {
    id: 'lab-sequence',
    levelId: 11,
    title: 'Unlock the Sequence',
    description:
      'The lab door needs a code sequence. Check if the first three elements match [1,2,3]. Write a function called `checkSequence` that returns `true` if the first 3 elements of an array equal 1,2,3.',
    template: 'function checkSequence(code) {\n  // YOUR CODE HERE\n}',
    test: 'return checkSequence([1,2,3,4,5]) === true && checkSequence([4,5,6]) === false',
    hint: 'Try: return code[0] === 1 && code[1] === 2 && code[2] === 3;',
    successMessage: 'The door clicks open. The lab is yours to explore.',
  },
  'lab-neutralize': {
    id: 'lab-neutralize',
    levelId: 11,
    title: 'Neutralize the Acid',
    description:
      'The acid vat needs exactly 10 units of base. Each bucket holds `capacity` units. Write a function called `neededBuckets` that returns how many buckets are needed to reach 10 (round up).',
    template: 'function neededBuckets(capacity) {\n  // YOUR CODE HERE\n}',
    test: 'return neededBuckets(3) === 4 && neededBuckets(5) === 2',
    hint: 'Try: return Math.ceil(10 / capacity);',
    successMessage: 'The acid neutralizes. You safely cross the lab floor.',
  },
  'lab-crystal': {
    id: 'lab-crystal',
    levelId: 11,
    title: 'Charge the Crystal',
    description:
      'The power crystal needs a charge of exactly 100. Each battery adds its value. Write a function called `fullyCharged` that returns `true` if the sum of an array equals 100.',
    template: 'function fullyCharged(batteries) {\n  // YOUR CODE HERE\n}',
    test: 'return fullyCharged([30,40,30]) === true && fullyCharged([10,20]) === false',
    hint: 'Try: return batteries.reduce((a,b) => a+b, 0) === 100;',
    successMessage: 'The crystal blazes with light. The final door opens.',
  },

  /* ═══ LEVEL 12 — The Tower ═══ */
  'tower-key': {
    id: 'tower-key',
    levelId: 12,
    title: 'Find the Master Key',
    description:
      'Six floors, one key per floor. Find the floor where the key ID matches the target. Write a function called `findFloor` that returns the first key matching a predicate.',
    template: 'function findFloor(keys, target) {\n  // YOUR CODE HERE\n}',
    test: 'return findFloor([{floor:1,id:"a"},{floor:2,id:"b"}], "b") === "b"',
    hint: 'Try: const found = keys.find(k => k.id === target); return found ? found.id : null;',
    successMessage: 'The master key gleams. The tower roof access is unlocked.',
  },
  'tower-lift': {
    id: 'tower-lift',
    levelId: 12,
    title: 'Power the Lift',
    description:
      'The lift needs a power sequence. Generate a sequence of numbers from 1 to n. Write a function called `generateSequence` that returns an array of numbers 1 through n.',
    template: 'function generateSequence(n) {\n  // YOUR CODE HERE\n}',
    test: 'return JSON.stringify(generateSequence(5)) === JSON.stringify([1,2,3,4,5])',
    hint: 'Try: return Array.from({length:n}, (_,i) => i + 1);',
    successMessage: 'The lift hums to life. Up you go, floor by floor.',
  },
  'tower-roof': {
    id: 'tower-roof',
    levelId: 12,
    title: 'Escape the Tower',
    description:
      'On the roof! You need to signal your position. The signal spell repeats a word n times with spaces. Write a function called `signal` that repeats a word n times separated by spaces.',
    template: 'function signal(word, n) {\n  // YOUR CODE HERE\n}',
    test: 'return signal("help", 3) === "help help help"',
    hint: 'Try: return Array(n).fill(word).join(" ");',
    successMessage: 'The rescue ship sees your signal! You are saved!',
  },
  'tower-clock': {
    id: 'tower-clock',
    levelId: 12,
    title: 'Stop the Clock',
    description:
      'The tower clock activates the alarm. The alarm rings if the time (0-23) is not between 6 and 18 (exclusive). Write a function called `isNight` that returns `true` if the hour is outside the safe range.',
    template: 'function isNight(hour) {\n  // YOUR CODE HERE\n}',
    test: 'return isNight(3) === true && isNight(12) === false && isNight(18) === false',
    hint: 'Try: return hour <= 6 || hour >= 18;',
    successMessage: 'The clock stops ticking. The alarm never rings.',
  },
}

export function getPuzzlesForLevel(levelId: number): CodePuzzle[] {
  return Object.values(ALL_PUZZLES).filter((p) => p.levelId === levelId)
}

export function getPuzzle(id: string): CodePuzzle | undefined {
  return ALL_PUZZLES[id]
}

export function evaluateCode(
  userCode: string,
  testCode: string,
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
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
