import '@testing-library/jest-dom'

const store = new Map<string, string>()
const ls = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
  get length() {
    return store.size
  },
  key: (i: number) => [...store.keys()][i] ?? null,
} as Storage

Object.defineProperty(globalThis, 'localStorage', { value: ls, writable: true })
