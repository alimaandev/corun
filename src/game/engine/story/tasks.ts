import { CodePuzzle } from '../../types'

export interface StoryTask extends CodePuzzle {
  solution: string
}

function task(
  id: string,
  levelId: number,
  title: string,
  description: string,
  template: string,
  solution: string,
  test: string,
  hint: string,
  successMessage: string,
): StoryTask {
  return { id, levelId, title, description, template, test, hint, successMessage, solution }
}

export const CELL_TASKS: StoryTask[] = [
  task(
    'cell-1',
    1,
    'First Contact',
    'The cell gate asks your name. Return the greeting "Hello, " followed by the name.',
    `function greet(name) {
  // TODO: return "Hello, " + name
}`,
    `function greet(name) {
  return 'Hello, ' + name
}`,
    `return greet('Rin') === 'Hello, Rin' && greet('Warden') === 'Hello, Warden'`,
    'Strings can be joined with +',
    'The gate hums open. One junction down.',
  ),
  task(
    'cell-2',
    1,
    'Shout It',
    'The pipes echo. Return the text in ALL CAPS.',
    `function upper(s) {
  // TODO: return s in uppercase
}`,
    `function upper(s) {
  return s.toUpperCase()
}`,
    `return upper('quiet') === 'QUIET' && upper('ElEna') === 'ELENA'`,
    'Try the toUpperCase() method',
    'The echoes die down. Nice.',
  ),
  task(
    'cell-3',
    1,
    'Word Length',
    'The guard needs a count of characters. Return the length of the string.',
    `function wordLength(s) {
  // TODO: return the length of s
}`,
    `function wordLength(s) {
  return s.length
}`,
    `return wordLength('pipe') === 4 && wordLength('') === 0`,
    'Every string has a length property',
    'Length confirmed. The way forward is clear.',
  ),
  task(
    'cell-4',
    1,
    'Joining Wires',
    'Two wires, one message. Return a and b joined by a single space.',
    `function combine(a, b) {
  // TODO: return a + " " + b
}`,
    `function combine(a, b) {
  return a + ' ' + b
}`,
    `return combine('The', 'Core') === 'The Core' && combine('escape', 'now') === 'escape now'`,
    'Join with + and include the space in between',
    'The wires splice cleanly.',
  ),
  task(
    'cell-5',
    1,
    'Count the Signal',
    'Count how many times the character c appears in the string s.',
    `function countChar(s, c) {
  // TODO: count occurrences of c in s
}`,
    `function countChar(s, c) {
  return s.split(c).length - 1
}`,
    `return countChar('parallax', 'a') === 3 && countChar('cell', 'z') === 0`,
    's.split(c) breaks the string apart at each match',
    'Signal count registered.',
  ),
  task(
    'cell-6',
    1,
    'Final Warning',
    'Sound the alarm: return the text in ALL CAPS with an exclamation mark.',
    `function shout(s) {
  // TODO: return s.toUpperCase() + "!"
}`,
    `function shout(s) {
  return s.toUpperCase() + '!'
}`,
    `return shout('intruder') === 'INTRUDER!' && shout('help') === 'HELP!'`,
    'Combine toUpperCase() with a string concatenation',
    'The alarm blares. The Cell is behind you.',
  ),
]

export const VENTS_TASKS: StoryTask[] = [
  task(
    'vent-1',
    2,
    'Pressure Total',
    'The vents read a stream of pressures. Return their total.',
    `function total(nums) {
  // TODO: return the sum of all numbers
}`,
    `function total(nums) {
  return nums.reduce((a, b) => a + b, 0)
}`,
    `return total([1, 2, 3]) === 6 && total([]) === 0 && total([-5, 5]) === 0`,
    'reduce() with an initial value of 0',
    'Pressure balanced.',
  ),
  task(
    'vent-2',
    2,
    'Biggest Duct',
    'Find the highest pressure reading in the array.',
    `function biggest(nums) {
  // TODO: return the largest number
}`,
    `function biggest(nums) {
  return Math.max(...nums)
}`,
    `return biggest([3, 9, 2]) === 9 && biggest([-1, -5]) === -1`,
    'Math.max with the spread operator',
    'Largest duct located.',
  ),
  task(
    'vent-3',
    2,
    'Even Flow',
    'Count how many readings are even numbers.',
    `function countEven(nums) {
  // TODO: count numbers divisible by 2
}`,
    `function countEven(nums) {
  return nums.filter((n) => n % 2 === 0).length
}`,
    `return countEven([1, 2, 3, 4]) === 2 && countEven([7]) === 0 && countEven([0]) === 1`,
    'filter() keeps values where n % 2 === 0',
    'Even flow detected. Moving on.',
  ),
  task(
    'vent-4',
    2,
    'Reverse Draft',
    'The draft flows backwards. Return the array reversed.',
    `function reverse(items) {
  // TODO: return a reversed copy
}`,
    `function reverse(items) {
  return [...items].reverse()
}`,
    `return JSON.stringify(reverse([1, 2, 3])) === '[3,2,1]' && JSON.stringify(reverse([])) === '[]'`,
    'Copy with spread first, then reverse()',
    'The draft reverses. Perfect.',
  ),
  task(
    'vent-5',
    2,
    'End Caps',
    'The vent has two caps. Return an array with the first and last item.',
    `function firstAndLast(items) {
  // TODO: return [items[0], items[items.length - 1]]
}`,
    `function firstAndLast(items) {
  return [items[0], items[items.length - 1]]
}`,
    `return JSON.stringify(firstAndLast(['a', 'b', 'c'])) === '["a","c"]' && JSON.stringify(firstAndLast(['x'])) === '["x","x"]'`,
    'index 0 and length - 1',
    'Caps sealed.',
  ),
  task(
    'vent-6',
    2,
    'Double Output',
    'Double every reading in the array.',
    `function doubleAll(nums) {
  // TODO: return a new array with each number doubled
}`,
    `function doubleAll(nums) {
  return nums.map((n) => n * 2)
}`,
    `return JSON.stringify(doubleAll([1, 2, 3])) === '[2,4,6]' && JSON.stringify(doubleAll([])) === '[]'`,
    'map() transforms every element',
    'Output doubled. The fans spin faster.',
  ),
  task(
    'vent-7',
    2,
    'Duplicate Echo',
    'Something is repeating in the pipes. Return true if any item appears more than once.',
    `function hasDuplicates(items) {
  // TODO: return true if any item repeats
}`,
    `function hasDuplicates(items) {
  return new Set(items).size !== items.length
}`,
    `return hasDuplicates([1, 2, 2]) === true && hasDuplicates([1, 2, 3]) === false && hasDuplicates([]) === false`,
    'A Set keeps only unique values',
    'Echo identified. It was a ghost.',
  ),
  task(
    'vent-8',
    2,
    'Pressure Buildup',
    'Sum every whole number from 1 to n inclusive.',
    `function rangeSum(n) {
  // TODO: return 1 + 2 + ... + n
}`,
    `function rangeSum(n) {
  return (n * (n + 1)) / 2
}`,
    `return rangeSum(5) === 15 && rangeSum(1) === 1 && rangeSum(100) === 5050`,
    'The closed form is n * (n + 1) / 2',
    'Pressure released safely.',
  ),
]

export const CORE_TASKS: StoryTask[] = [
  task(
    'core-1',
    3,
    'Identity Record',
    'The Core stores people as objects. Return "first last" from a user object.',
    `function fullName(user) {
  // TODO: return user.first + " " + user.last
}`,
    `function fullName(user) {
  return user.first + ' ' + user.last
}`,
    `return fullName({ first: 'Elena', last: 'Voss' }) === 'Elena Voss'`,
    'Read properties with dot notation',
    'Identity confirmed. Proceeding.',
  ),
  task(
    'core-2',
    3,
    'Score Update',
    "Add n points to the user's score without mutating the original object.",
    `function addScore(user, n) {
  // TODO: return a new object with the updated score
}`,
    `function addScore(user, n) {
  return { ...user, score: user.score + n }
}`,
    `const u = { score: 10 };
return JSON.stringify(addScore(u, 5)) === '{"score":15}' && u.score === 10`,
    'Spread the object, then override score',
    'Score committed. The original record is untouched.',
  ),
  task(
    'core-3',
    3,
    'Key Retrieval',
    'List the keys of an object as an array.',
    `function objectKeys(obj) {
  // TODO: return Object.keys(obj)
}`,
    `function objectKeys(obj) {
  return Object.keys(obj)
}`,
    `return JSON.stringify(objectKeys({ a: 1, b: 2 })) === '["a","b"]' && JSON.stringify(objectKeys({})) === '[]'`,
    'Object.keys returns string arrays',
    'Keys retrieved from the vault.',
  ),
  task(
    'core-4',
    3,
    'Locked Counter',
    'Return a function that counts upward from 1 each time it is called.',
    `function makeCounter() {
  // TODO: return a function that counts up
}`,
    `function makeCounter() {
  let n = 0
  return () => ++n
}`,
    `const c = makeCounter();
return c() === 1 && c() === 2 && c() === 3`,
    'A closure captures the counter variable',
    'The counter ticks. Each call increments.',
  ),
  task(
    'core-5',
    3,
    'Memory Merge',
    'Merge two objects into one. Values from b win on conflicts.',
    `function merge(a, b) {
  // TODO: return { ...a, ...b }
}`,
    `function merge(a, b) {
  return { ...a, ...b }
}`,
    `return JSON.stringify(merge({ x: 1 }, { y: 2 })) === '{"x":1,"y":2}' && JSON.stringify(merge({ x: 1 }, { x: 9 })) === '{"x":9}'`,
    'Spreading b after a overrides shared keys',
    'Memories merged into one coherent whole.',
  ),
  task(
    'core-6',
    3,
    'Value Dump',
    'Extract all values of an object into an array.',
    `function objectValues(obj) {
  // TODO: return Object.values(obj)
}`,
    `function objectValues(obj) {
  return Object.values(obj)
}`,
    `return JSON.stringify(objectValues({ a: 1, b: 2 })) === '[1,2]' && JSON.stringify(objectValues({})) === '[]'`,
    'Object.values returns values in key order',
    'Values dumped. Nothing hidden remains.',
  ),
  task(
    'core-7',
    3,
    'Access Check',
    'Return true only if the user has the role "admin".',
    `function isAdmin(user) {
  // TODO: return user.role === "admin"
}`,
    `function isAdmin(user) {
  return user.role === 'admin'
}`,
    `return isAdmin({ role: 'admin' }) === true && isAdmin({ role: 'guard' }) === false && isAdmin({}) === false`,
    'Compare the role property with ===',
    'Access granted to the inner chamber.',
  ),
  task(
    'core-8',
    3,
    'Person Card',
    'Describe a user as "name (age)" using a template literal.',
    `function describeUser(user) {
  // TODO: return \`\${user.name} (\${user.age})\`
}`,
    `function describeUser(user) {
  return \`\${user.name} (\${user.age})\`
}`,
    `return describeUser({ name: 'Elena', age: 29 }) === 'Elena (29)'`,
    'Template literals use backticks and ${} to interpolate',
    'Card printed. The Core recognizes you.',
  ),
  task(
    'core-9',
    3,
    'Tick Clock',
    'Return a new object with its n property increased by 1, without mutating the input.',
    `function increment(obj) {
  // TODO: return { ...obj, n: obj.n + 1 }
}`,
    `function increment(obj) {
  return { ...obj, n: obj.n + 1 }
}`,
    `const o = { n: 1 };
return JSON.stringify(increment(o)) === '{"n":2}' && o.n === 1`,
    'Spread then override n',
    'The clock ticks forward. Original stays still.',
  ),
  task(
    'core-10',
    3,
    'Rank the Runners',
    'Sort an array of user objects by score, highest first. Do not mutate the input.',
    `function sortByScore(users) {
  // TODO: return a sorted copy
}`,
    `function sortByScore(users) {
  return [...users].sort((a, b) => b.score - a.score)
}`,
    `return JSON.stringify(sortByScore([{ score: 2 }, { score: 9 }, { score: 5 }])) === '[{"score":9},{"score":5},{"score":2}]'`,
    'Copy with spread, sort with a comparator',
    'The ranks settle. You are on top.',
  ),
]

export const WARDEN_TASKS: StoryTask[] = [
  task(
    'warden-1',
    4,
    'Growth Pattern',
    'The Warden grows. Return the nth Fibonacci number (fib(0)=0, fib(1)=1).',
    `function fib(n) {
  // TODO: return the nth Fibonacci number
}`,
    `function fib(n) {
  let a = 0
  let b = 1
  for (let i = 0; i < n; i++) {
    ;[a, b] = [b, a + b]
  }
  return a
}`,
    `return fib(0) === 0 && fib(1) === 1 && fib(10) === 55 && fib(20) === 6765`,
    'Walk the sequence iteratively, no recursion',
    'The pattern snaps. Growth halts.',
  ),
  task(
    'warden-2',
    4,
    'Mirror Trap',
    'Return true if the string is a palindrome, ignoring case and non-letters.',
    `function isPalindrome(s) {
  // TODO: return true if s reads the same backwards
}`,
    `function isPalindrome(s) {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  return t === [...t].reverse().join('')
}`,
    `return isPalindrome('racecar') === true && isPalindrome('A man, a plan, a canal: Panama') === true && isPalindrome('escape') === false`,
    'Clean the string with a regex, then compare to its reverse',
    'The mirror cracks. You pass through.',
  ),
  task(
    'warden-3',
    4,
    'Precision Search',
    'Binary search: return the index of target in a sorted array, or -1.',
    `function binarySearch(arr, target) {
  // TODO: return the index or -1
}`,
    `function binarySearch(arr, target) {
  let lo = 0
  let hi = arr.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] === target) return mid
    if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}`,
    `return binarySearch([1, 3, 5, 7, 9], 7) === 3 && binarySearch([1, 3, 5, 7, 9], 4) === -1 && binarySearch([], 2) === -1`,
    'Halve the range every step',
    'Found in one cut. Efficient.',
  ),
  task(
    'warden-4',
    4,
    'Twin Keys',
    'Return the indices of two numbers that sum to target (any valid pair).',
    `function twoSum(arr, target) {
  // TODO: return [i, j] where arr[i] + arr[j] === target
}`,
    `function twoSum(arr, target) {
  const seen = new Map()
  for (let i = 0; i < arr.length; i++) {
    const need = target - arr[i]
    if (seen.has(need)) return [seen.get(need), i]
    seen.set(arr[i], i)
  }
  return []
}`,
    `const t = [2, 7, 11, 15]; const r = twoSum(t, 9); return r.length === 2 && r[0] !== r[1] && t[r[0]] + t[r[1]] === 9`,
    'Remember seen values in a Map as you go',
    'The twin keys unlock the vault door.',
  ),
  task(
    'warden-5',
    4,
    'Pressure Wave',
    "Return the largest sum of any contiguous subarray (Kadane's algorithm).",
    `function maxSubarray(nums) {
  // TODO: return the max contiguous sum
}`,
    `function maxSubarray(nums) {
  let best = -Infinity
  let cur = 0
  for (const n of nums) {
    cur = Math.max(n, cur + n)
    best = Math.max(best, cur)
  }
  return best
}`,
    `return maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) === 6 && maxSubarray([-3, -1]) === -1 && maxSubarray([5]) === 5`,
    'Keep a running sum; restart it when it goes negative',
    'The wave peaks. The pipes survive.',
  ),
  task(
    'warden-6',
    4,
    'Anagram Barrier',
    'Return true if two strings use exactly the same letters.',
    `function isAnagram(a, b) {
  // TODO: return true if a and b are anagrams
}`,
    `function isAnagram(a, b) {
  const s = (x) => [...x].sort().join('')
  return s(a) === s(b)
}`,
    `return isAnagram('listen', 'silent') === true && isAnagram('core', 'roce') === true && isAnagram('code', 'coda') === false`,
    'Sort both strings and compare',
    'The barrier dissolves letter by letter.',
  ),
  task(
    'warden-7',
    4,
    'Ghost Echoes',
    'Remove duplicate values from an array, keeping first occurrences.',
    `function dedupe(arr) {
  // TODO: return an array with duplicates removed
}`,
    `function dedupe(arr) {
  return [...new Set(arr)]
}`,
    `return JSON.stringify(dedupe([1, 2, 2, 3, 1])) === '[1,2,3]' && JSON.stringify(dedupe([])) === '[]'`,
    'A Set removes duplicates automatically',
    'The echoes fade. Only you remain.',
  ),
  task(
    'warden-8',
    4,
    'First Unique',
    'Return the first character that appears only once, or null.',
    `function firstNonRepeating(s) {
  // TODO: return the first unique character
}`,
    `function firstNonRepeating(s) {
  const seen = new Map()
  for (const c of s) seen.set(c, (seen.get(c) || 0) + 1)
  for (const c of s) if (seen.get(c) === 1) return c
  return null
}`,
    `return firstNonRepeating('stress') === 't' && firstNonRepeating('aabb') === null && firstNonRepeating('x') === 'x'`,
    'Count first, then scan in order',
    'The unique signal shines through.',
  ),
  task(
    'warden-9',
    4,
    'Cage of Brackets',
    'Return true if the brackets in the string are properly balanced.',
    `function isBalanced(s) {
  // TODO: return true if ()[]{} are balanced
}`,
    `function isBalanced(s) {
  const stack = []
  const pairs = { ')': '(', ']': '[', '}': '{' }
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c)
    else if (stack.pop() !== pairs[c]) return false
  }
  return stack.length === 0
}`,
    `return isBalanced('()[]{}') === true && isBalanced('([{}])') === true && isBalanced('(]') === false && isBalanced('') === true`,
    'Push openers onto a stack; pop to match closers',
    'The cage springs open.',
  ),
  task(
    'warden-10',
    4,
    'Endless Loop',
    'Return the length of the longest run of identical values.',
    `function longestRun(nums) {
  // TODO: return the longest run length
}`,
    `function longestRun(nums) {
  if (nums.length === 0) return 0
  let best = 1
  let cur = 1
  for (let i = 1; i < nums.length; i++) {
    cur = nums[i] === nums[i - 1] ? cur + 1 : 1
    best = Math.max(best, cur)
  }
  return best
}`,
    `return longestRun([1, 1, 2, 2, 2, 3]) === 3 && longestRun([]) === 0 && longestRun([7]) === 1`,
    'Compare each value to the previous one',
    'The loop closes on itself. You slip free.',
  ),
  task(
    'warden-11',
    4,
    'Missing Piece',
    'The array holds numbers 0..n with exactly one missing. Return the missing number.',
    `function missingNumber(arr) {
  // TODO: return the missing value
}`,
    `function missingNumber(arr) {
  const n = arr.length
  const total = (n * (n + 1)) / 2
  return total - arr.reduce((a, b) => a + b, 0)
}`,
    `return missingNumber([3, 0, 1]) === 2 && missingNumber([0, 1]) === 2 && missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]) === 8`,
    'Compare the expected sum to the actual sum',
    'The missing piece clicks into place.',
  ),
  task(
    'warden-12',
    4,
    'Two Rivers',
    'Merge two sorted arrays into one sorted array.',
    `function mergeSorted(a, b) {
  // TODO: return a merged sorted array
}`,
    `function mergeSorted(a, b) {
  const out = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    out.push(a[i] <= b[j] ? a[i++] : b[j++])
  }
  return out.concat(a.slice(i), b.slice(j))
}`,
    `return JSON.stringify(mergeSorted([1, 3, 5], [2, 4, 6])) === '[1,2,3,4,5,6]' && JSON.stringify(mergeSorted([], [1])) === '[1]'`,
    'Walk both arrays with two pointers',
    "The rivers join. The Warden's domain breaks.",
  ),
]

export const STORY_TASKS: Record<string, StoryTask[]> = {
  cell: CELL_TASKS,
  vents: VENTS_TASKS,
  core: CORE_TASKS,
  warden: WARDEN_TASKS,
}

export function getStoryTasks(nodeId: string): StoryTask[] {
  return STORY_TASKS[nodeId] ?? []
}

export function runTaskInJs(
  userCode: string,
  testCode: string,
): { success: boolean; output: string } {
  const output: string[] = []
  const mockConsole = { log: (...args: unknown[]) => output.push(args.map(String).join(' ')) }
  const fullCode = userCode + '\n' + testCode
  try {
    const fn = new Function('console', fullCode)
    const result = fn(mockConsole)
    return { success: result === true, output: output.join('\n') }
  } catch (e: unknown) {
    return { success: false, output: e instanceof Error ? e.message : String(e) }
  }
}
