import { Challenge } from './types'

const E: Challenge[] = [
  {
    id: 1, difficulty: 'easy',
    question: 'Which data structure follows the FIFO principle?',
    options: ['Stack', 'Queue', 'Array', 'Set'],
    correct: 1,
    explanation: 'Queue uses First-In-First-Out ordering.',
  },
  {
    id: 2, difficulty: 'easy',
    question: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'],
    correct: 1,
    explanation: 'CSS stands for Cascading Style Sheets.',
  },
  {
    id: 3, difficulty: 'easy',
    question: 'Which method adds an element to the end of an array in JavaScript?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correct: 0,
    explanation: 'push() appends one or more elements to the end of an array.',
  },
  {
    id: 4, difficulty: 'easy',
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Automated Program Integration', 'Application Process Integration', 'Advanced Programming Interface'],
    correct: 0,
    explanation: 'API allows different software systems to communicate.',
  },
  {
    id: 5, difficulty: 'easy',
    question: 'Which HTML tag creates a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correct: 1,
    explanation: 'The <a> tag defines a hyperlink.',
  },
  {
    id: 6, difficulty: 'easy',
    question: 'What does SQL stand for?',
    options: ['Simple Query Language', 'Structured Query Language', 'Standard Query Logic', 'Sequential Query Language'],
    correct: 1,
    explanation: 'SQL is the standard language for relational database management.',
  },
  {
    id: 7, difficulty: 'easy',
    question: 'Which data structure follows the LIFO principle?',
    options: ['Queue', 'Stack', 'List', 'Tree'],
    correct: 1,
    explanation: 'Stack uses Last-In-First-Out ordering.',
  },
  {
    id: 8, difficulty: 'easy',
    question: 'What is the file extension for Python source files?',
    options: ['.js', '.py', '.java', '.rb'],
    correct: 1,
    explanation: 'Python source files use the .py extension.',
  },
  {
    id: 9, difficulty: 'easy',
    question: 'What is the purpose of git commit?',
    options: [
      'Delete files from the repository',
      'Save changes to the local repository',
      'Push changes to a remote server',
      'Create a new branch',
    ],
    correct: 1,
    explanation: 'git commit saves staged changes to the local repository.',
  },
  {
    id: 10, difficulty: 'easy',
    question: 'Which method parses a JSON string in JavaScript?',
    options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.toObject()'],
    correct: 1,
    explanation: 'JSON.parse() converts a JSON string to a JavaScript object.',
  },
  {
    id: 11, difficulty: 'easy',
    question: 'What does DOM stand for?',
    options: ['Document Object Model', 'Data Object Management', 'Document Orientation Model', 'Dynamic Object Manipulation'],
    correct: 0,
    explanation: 'The DOM is the programming interface for web documents.',
  },
  {
    id: 12, difficulty: 'easy',
    question: 'What does HTTP stand for?',
    options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyper Transfer Text Protocol', 'HyperText Transmission Protocol'],
    correct: 0,
    explanation: 'HTTP is the foundation of data communication on the web.',
  },
  {
    id: 13, difficulty: 'easy',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correct: 0,
    explanation: 'Array access by index is constant time O(1).',
  },
  {
    id: 14, difficulty: 'easy',
    question: 'Which symbol starts a single-line comment in JavaScript?',
    options: ['//', '/*', '#', '--'],
    correct: 0,
    explanation: '// is used for single-line comments in JavaScript.',
  },
  {
    id: 15, difficulty: 'easy',
    question: 'What does IDE stand for?',
    options: ['Integrated Development Environment', 'Internal Development Engine', 'Interactive Design Editor', 'Integrated Debug Environment'],
    correct: 0,
    explanation: 'An IDE provides comprehensive tools for software development.',
  },
  {
    id: 16, difficulty: 'easy',
    question: 'What is the result of 5 > 3 && 2 < 4?',
    options: ['false', 'true', 'undefined', 'Error'],
    correct: 1,
    explanation: 'Both conditions are true, so AND returns true.',
  },
  {
    id: 17, difficulty: 'easy',
    question: 'What is the time complexity of linear search?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correct: 1,
    explanation: 'Linear search may need to check every element.',
  },
  {
    id: 18, difficulty: 'easy',
    question: 'Which HTTP status code means "Not Found"?',
    options: ['200', '301', '404', '500'],
    correct: 2,
    explanation: 'HTTP 404 indicates the requested resource was not found.',
  },
  {
    id: 19, difficulty: 'easy',
    question: 'Which command initializes a new Node.js project?',
    options: ['npm start', 'npm init', 'npm install', 'npm run'],
    correct: 1,
    explanation: 'npm init creates a new package.json file.',
  },
  {
    id: 20, difficulty: 'easy',
    question: 'What does CRUD stand for?',
    options: ['Create, Read, Update, Delete', 'Compile, Run, Update, Debug', 'Create, Render, Update, Display', 'Copy, Read, Update, Delete'],
    correct: 0,
    explanation: 'CRUD describes the four basic operations of persistent storage.',
  },
]

const M: Challenge[] = [
  {
    id: 21, difficulty: 'medium',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
    correct: 1,
    explanation: 'Binary search halves the search space each iteration.',
  },
  {
    id: 22, difficulty: 'medium',
    question: 'Which keyword declares a constant in JavaScript?',
    options: ['var', 'let', 'const', 'static'],
    correct: 2,
    explanation: 'const declares block-scoped constants that cannot be reassigned.',
  },
  {
    id: 23, difficulty: 'medium',
    question: 'Which sorting algorithm has O(n log n) average-case time complexity?',
    options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
    correct: 1,
    explanation: 'Merge Sort consistently achieves O(n log n) time complexity.',
  },
  {
    id: 24, difficulty: 'medium',
    question: 'What is a Promise in JavaScript?',
    options: [
      'A function that runs synchronously',
      'An object representing eventual completion of an async operation',
      'A type of loop',
      'A DOM event handler',
    ],
    correct: 1,
    explanation: 'Promises handle asynchronous operations in JavaScript.',
  },
  {
    id: 25, difficulty: 'medium',
    question: 'What does the === operator check in JavaScript?',
    options: ['Value only', 'Type only', 'Value and type', 'Reference equality'],
    correct: 2,
    explanation: '=== checks both value and type (strict equality).',
  },
  {
    id: 26, difficulty: 'medium',
    question: 'Which method removes the last element from an array in JavaScript?',
    options: ['pop()', 'push()', 'shift()', 'splice()'],
    correct: 0,
    explanation: 'This is a trick! pop() removes and returns the last element.',
  },
  {
    id: 27, difficulty: 'medium',
    question: 'Which loop always executes its body at least once?',
    options: ['for', 'while', 'do-while', 'for...of'],
    correct: 2,
    explanation: 'A do-while loop checks the condition after the body executes.',
  },
  {
    id: 28, difficulty: 'medium',
    question: 'Which Python keyword defines a function?',
    options: ['function', 'def', 'func', 'define'],
    correct: 1,
    explanation: 'Python uses the def keyword to define functions.',
  },
  {
    id: 29, difficulty: 'medium',
    question: 'Which data structure uses key-value pairs?',
    options: ['Array', 'Set', 'Map', 'Queue'],
    correct: 2,
    explanation: 'A Map stores key-value pairs with unique keys.',
  },
  {
    id: 30, difficulty: 'medium',
    question: 'What does the map() method return in JavaScript?',
    options: ['A new array', 'The original array modified', 'A boolean', 'A string'],
    correct: 0,
    explanation: 'map() creates a new array with transformed elements.',
  },
  {
    id: 31, difficulty: 'medium',
    question: 'What does MVC stand for?',
    options: ['Model View Controller', 'Multiple View Component', 'Module View Configuration', 'Model Version Control'],
    correct: 0,
    explanation: 'MVC is a software architectural pattern.',
  },
  {
    id: 32, difficulty: 'medium',
    question: 'What is the ternary operator in JavaScript?',
    options: ['if-else', '?:', '??', '&&'],
    correct: 1,
    explanation: 'The ternary operator: condition ? exprIfTrue : exprIfFalse',
  },
]

const H: Challenge[] = [
  {
    id: 33, difficulty: 'hard',
    question: 'What does typeof null return in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correct: 2,
    explanation: 'This is a well-known legacy bug in JavaScript.',
  },
  {
    id: 34, difficulty: 'hard',
    question: 'What is the result of "2" + 2 in JavaScript?',
    options: ['4', '"22"', '22', 'Error'],
    correct: 1,
    explanation: 'Number is coerced to a string, resulting in concatenation.',
  },
  {
    id: 35, difficulty: 'hard',
    question: 'What does typeof [] return in JavaScript?',
    options: ['"array"', '"object"', '"list"', '"undefined"'],
    correct: 1,
    explanation: 'Arrays are objects in JavaScript. Use Array.isArray() to check.',
  },
  {
    id: 36, difficulty: 'hard',
    question: 'What is the result of 2 + "2" - 1 in JavaScript?',
    options: ['21', '"21"', '21', 'NaN'],
    correct: 0,
    explanation: '2 + "2" = "22", then "22" - 1 coerces to 22 - 1 = 21.',
  },
  {
    id: 37, difficulty: 'hard',
    question: 'Which method creates a new array with elements that pass a test?',
    options: ['map()', 'filter()', 'reduce()', 'find()'],
    correct: 1,
    explanation: 'filter() creates a new array with elements that pass the provided function.',
  },
  {
    id: 38, difficulty: 'hard',
    question: 'What is a closure in JavaScript?',
    options: [
      'A function that runs immediately',
      'A function with access to its outer scope',
      'A way to close a browser tab',
      'A type of loop',
    ],
    correct: 1,
    explanation: 'A closure is a function that retains access to its lexical scope.',
  },
  {
    id: 39, difficulty: 'hard',
    question: 'What does the spread operator (...) do?',
    options: [
      'Creates a random number',
      'Expands iterables into individual elements',
      'Concatenates strings',
      'Multiplies numbers',
    ],
    correct: 1,
    explanation: 'The spread operator expands arrays/objects into individual elements.',
  },
]

export const CHALLENGES: Challenge[] = [...E, ...M, ...H]

export function getRandomChallenge(usedIds: Set<number>): Challenge {
  const available = CHALLENGES.filter(c => !usedIds.has(c.id))
  if (available.length === 0) {
    usedIds.clear()
    return CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]
  }
  return available[Math.floor(Math.random() * available.length)]
}
