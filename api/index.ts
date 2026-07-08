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
