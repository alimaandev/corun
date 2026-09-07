export type Challenge = {
  topic: string
  title: string
  chapter: string
  difficulty: string
  description: string
  task: string
  expected: string
  code: string
  hint: string
  validator: (code: string) => boolean
}

type ChallengeSeed = {
  topic: string
  title: string
  description: string
  task: string
  expected: string
  code: string
  hint: string
  validator: (code: string) => boolean
}

const seeds: ChallengeSeed[] = [
  { topic: 'ARRAYS', title: 'Choose the first tool', description: 'Return the first item so the path crew can repair the bridge.', task: 'chooseTool(["hammer", "rope", "planks"])', expected: '"hammer"', code: 'function chooseTool(tools) {\n  // TODO: return the first tool\n  return null\n}', hint: 'Arrays start at position 0.', validator: (code) => /tools\[0\]|tools\.at\(0\)/.test(code) },
  { topic: 'ARRAYS', title: 'Find the longest plank', description: 'Return the largest number from the plank lengths.', task: 'findLongest([2, 5, 3])', expected: '5', code: 'function findLongest(lengths) {\n  // TODO: find the largest length\n  return null\n}', hint: 'Math.max can compare a spread array.', validator: (code) => /Math\.max|sort/.test(code) },
  { topic: 'ARRAYS', title: 'Count the seeds', description: 'Tell the gardener how many seeds are ready to plant.', task: 'countSeeds(["mint", "corn", "mint"])', expected: '3', code: 'function countSeeds(seeds) {\n  // TODO: count the items\n  return null\n}', hint: 'Every array has a length property.', validator: (code) => /\.length/.test(code) },
  { topic: 'FILTER', title: 'Gather the timber', description: 'Keep only wood from the supply pile.', task: 'collect(["wood", "stone", "wood"])', expected: '["wood", "wood"]', code: 'function collect(materials) {\n  // TODO: keep only wood\n  return []\n}', hint: 'filter keeps values when its callback returns true.', validator: (code) => /\.filter/.test(code) && /wood/.test(code) },
  { topic: 'FILTER', title: 'Spot the ripe fruit', description: 'Keep only fruit marked as ripe.', task: 'ripe([true, false, true])', expected: '[true, true]', code: 'function ripe(fruit) {\n  // TODO: keep the ripe items\n  return []\n}', hint: 'Use filter with a truthy test.', validator: (code) => /\.filter/.test(code) },
  { topic: 'MAP', title: 'Double the lanterns', description: 'Return the brightness of each upgraded lantern.', task: 'upgrade([2, 4, 6])', expected: '[4, 8, 12]', code: 'function upgrade(levels) {\n  // TODO: double each level\n  return []\n}', hint: 'map transforms every item into a new item.', validator: (code) => /\.map/.test(code) },
  { topic: 'MAP', title: 'Name the rooms', description: 'Add the word room to each house number.', task: 'nameRooms([1, 2, 3])', expected: '["room 1", "room 2", "room 3"]', code: 'function nameRooms(numbers) {\n  // TODO: turn each number into a room name\n  return []\n}', hint: 'Template strings can include a value with ${value}.', validator: (code) => /\.map/.test(code) },
  { topic: 'CONDITIONALS', title: 'Open the gate', description: 'The gate opens only when the player has a key.', task: 'canOpen(true)', expected: 'true', code: 'function canOpen(hasKey) {\n  // TODO: return whether the player has a key\n  return false\n}', hint: 'Compare the input with true.', validator: (code) => /return/.test(code) && /true/.test(code) },
  { topic: 'CONDITIONALS', title: 'Check the weather', description: 'Return shelter when rain is coming, otherwise return explore.', task: 'plan(true)', expected: '"shelter"', code: 'function plan(isRaining) {\n  // TODO: choose a plan\n  return ""\n}', hint: 'A ternary chooses between two values.', validator: (code) => /\?/.test(code) || /if/.test(code) },
  { topic: 'LOOPS', title: 'Stack the blocks', description: 'Add every block height to find the tower height.', task: 'tower([1, 2, 3])', expected: '6', code: 'function tower(blocks) {\n  // TODO: add every block\n  return 0\n}', hint: 'Start at zero and add each block in a loop.', validator: (code) => /for|reduce/.test(code) },
  { topic: 'FUNCTIONS', title: 'Pack the satchel', description: 'Return a small object describing the collected item.', task: 'pack("rope", 2)', expected: '{ item: "rope", count: 2 }', code: 'function pack(item, count) {\n  // TODO: create a packed item\n  return {}\n}', hint: 'Object shorthand uses a property name from a variable.', validator: (code) => /return/.test(code) && /item/.test(code) && /count/.test(code) },
  { topic: 'STRINGS', title: 'Read the sign', description: 'Return the sign in uppercase so everyone can read it.', task: 'readSign("north")', expected: '"NORTH"', code: 'function readSign(sign) {\n  // TODO: make the sign uppercase\n  return ""\n}', hint: 'Strings have a toUpperCase method.', validator: (code) => /toUpperCase/.test(code) },
]

const variations = [
  ['Meadow', 'forest', 'The meadow needs a careful coder.'],
  ['River', 'river', 'The river camp has a new coding task.'],
  ['Cedar', 'cedar', 'The cedar grove is ready for your solution.'],
  ['Sunset', 'sunset', 'The sunset outpost needs your help.'],
  ['Moss', 'moss', 'The mossy trail hides another small problem.'],
  ['Ember', 'ember', 'The ember workshop has a task for you.'],
  ['Willow', 'willow', 'The willow village is waiting on this answer.'],
  ['Stone', 'stone', 'The stone yard has a challenge to solve.'],
  ['Cloud', 'cloud', 'The cloud observatory logged a new problem.'],
  ['Dawn', 'dawn', 'The dawn settlement needs a builder-coder.'],
]

export const challenges: Challenge[] = Array.from({ length: 120 }, (_, index) => {
  const seed = seeds[index % seeds.length]
  const variation = variations[Math.floor(index / seeds.length)]
  const number = index + 1
  return {
    ...seed,
    title: `${seed.title} ${variation[0]}`,
    description: `${variation[2]} ${seed.description}`,
    chapter: `CHAPTER ${String(Math.floor(index / 10) + 1).padStart(2, '0')}`,
    difficulty: index < 12 ? 'INTRO' : index < 60 ? 'TRAIL' : 'PATHFINDER',
    task: seed.task,
    code: seed.code,
    hint: seed.hint,
    validator: seed.validator,
    expected: seed.expected,
      topic: `${seed.topic} ${number}`,
  }
})
