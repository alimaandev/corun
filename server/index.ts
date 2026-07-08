import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import challengesRouter from './routes/challenges.js'
import { initDb, closeDb } from './db.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000

app.use(cors({ origin: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/challenges', challengesRouter)

if (process.env.NODE_ENV === 'production') {
  const dist = join(__dirname, '..', 'dist')
  app.use(express.static(dist))
  app.get('*', (_req, res) => {
    res.sendFile(join(dist, 'index.html'))
  })
}

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})

process.on('SIGINT', () => { closeDb(); process.exit() })
process.on('SIGTERM', () => { closeDb(); process.exit() })
