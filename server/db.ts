import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const DB_PATH = join(DATA_DIR, 'evade.db')

let db: SqlJsDatabase

export async function initDb() {
  if (db) return

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

  const SQL = await initSqlJs()

  if (existsSync(DB_PATH)) {
    const buf = readFileSync(DB_PATH)
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      date TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `)

  saveDb()
}

function saveDb() {
  writeFileSync(DB_PATH, Buffer.from(db.export()))
}

export function getDb(): SqlJsDatabase { return db }

export function closeDb() {
  if (db) { saveDb(); db.close() }
}

export function run(sql: string, params?: Record<string, unknown>) {
  db.run(sql, params)
  saveDb()
}

export function get<T>(sql: string, params?: Record<string, unknown>): T | undefined {
  const stmt = db.prepare(sql)
  if (params) stmt.bind(params)
  if (stmt.step()) { const r = stmt.getAsObject() as T; stmt.free(); return r }
  stmt.free()
  return undefined
}

export function all<T>(sql: string, params?: Record<string, unknown>): T[] {
  const results: T[] = []
  const stmt = db.prepare(sql)
  if (params) stmt.bind(params)
  while (stmt.step()) results.push(stmt.getAsObject() as T)
  stmt.free()
  return results
}
