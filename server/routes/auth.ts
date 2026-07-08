import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { run, get } from '../db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'evade-dev-secret-2024'
const SALT_ROUNDS = 10

interface UserRow {
  id: number
  username: string
  password: string
}

router.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' })
    return
  }
  if (username.length < 3 || username.length > 20) {
    res.status(400).json({ error: 'Username must be 3-20 characters' })
    return
  }
  if (password.length < 4) {
    res.status(400).json({ error: 'Password must be at least 4 characters' })
    return
  }

  const existing = get<UserRow>('SELECT id FROM users WHERE username = $u', { $u: username })
  if (existing) {
    res.status(409).json({ error: 'Username already taken' })
    return
  }

  const hash = bcrypt.hashSync(password, SALT_ROUNDS)
  run('INSERT INTO users (username, password) VALUES ($u, $p)', { $u: username, $p: hash })

  const user = get<UserRow>('SELECT id, username FROM users WHERE username = $u', { $u: username })!
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })

  res.json({ token, user: { id: user.id, username: user.username } })
})

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' })
    return
  }

  const user = get<UserRow>('SELECT id, username, password FROM users WHERE username = $u', { $u: username })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ error: 'Invalid username or password' })
    return
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, username: user.username } })
})

router.get('/me', (req: Request, res: Response) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { id: number; username: string }
    res.json({ user: { id: payload.id, username: payload.username } })
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
})

export default router
