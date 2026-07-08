import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '..', 'server', '.env') })

import express from 'express'
import cors from 'cors'
import authRouter from '../server/routes/auth.js'
import challengesRouter from '../server/routes/challenges.js'
import { initDb } from '../server/db.js'

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/challenges', challengesRouter)

await initDb()

export default app
