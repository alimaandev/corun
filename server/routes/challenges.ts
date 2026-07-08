import { Router, Request, Response } from 'express'
import { generateChallenge } from '../groq.js'

const router = Router()

router.post('/generate', async (req: Request, res: Response) => {
  const { topic, difficulty, usedIds } = req.body

  const challenge = await generateChallenge({ topic, difficulty, usedIds })
  if (!challenge) {
    res.status(503).json({ error: 'AI generation unavailable' })
    return
  }

  res.json({ challenge })
})

export default router
