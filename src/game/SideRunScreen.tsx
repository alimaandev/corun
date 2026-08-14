import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { SideViewCanvas, SideViewCanvasHandle, SideHudSnapshot } from './sideView/SideViewCanvas'
import { Challenge, Difficulty, HUDData } from './types'
import { getRandomChallenge } from './engine/data/challenges'
import { generateFreeplayWorld } from './engine/side/freeplayWorld'
import { VIEW_W, VIEW_H } from './engine/side/renderer'

const CHALLENGE_MIN = 500
const CHALLENGE_MAX = 1100
const ANSWER_SCORE = 100
const SEGMENT_CLEAR_SCORE = 500
const MAX_SEGMENT = 5

export interface SideRunScreenHandle {
  restoreScore: (score: number) => void
  handleAnswer: (correct: boolean) => void
  handleTimeout: () => void
  setMultiplier: (mult: number) => void
  setPreferredDifficulty: (diff?: string) => void
  setPaused: (paused: boolean) => void
}

interface Props {
  topic?: string
  difficulty?: Difficulty
  challengeActive?: boolean
  onChallenge: (challenge: Challenge) => void
  onGameOver: (score: number) => void
  onHUDUpdate: (data: HUDData) => void
}

export const SideRunScreen = forwardRef<SideRunScreenHandle, Props>(function SideRunScreen(
  { topic, difficulty = 'medium', challengeActive = false, onChallenge, onGameOver, onHUDUpdate },
  ref,
) {
  const canvasRef = useRef<SideViewCanvasHandle>(null)
  const initialWorld = useMemo(
    () => generateFreeplayWorld({ difficulty, segment: 0 }),
    [difficulty],
  )
  const segmentRef = useRef(0)
  const usedIdsRef = useRef(new Set<number>())
  const lastChallengeX = useRef(0)
  const ownChallengeRef = useRef(false)
  const challengeActiveRef = useRef(false)
  const difficultyRef = useRef(difficulty)
  const topicRef = useRef(topic)
  const multiplierRef = useRef(1)
  const preferDiffRef = useRef<string | undefined>()
  const onGameOverRef = useRef(onGameOver)
  const onHUDUpdateRef = useRef(onHUDUpdate)
  const propsRef = useRef({ difficulty, topic, onChallenge })
  const runningRef = useRef(true)

  useEffect(() => {
    propsRef.current = { difficulty, topic, onChallenge }
    difficultyRef.current = difficulty
    topicRef.current = topic
  }, [difficulty, topic, onChallenge])

  useEffect(() => {
    onGameOverRef.current = onGameOver
    onHUDUpdateRef.current = onHUDUpdate
  }, [onGameOver, onHUDUpdate])

  useEffect(() => {
    challengeActiveRef.current = challengeActive
    if (challengeActive) {
      canvasRef.current?.pause(true)
    } else if (!ownChallengeRef.current) {
      canvasRef.current?.pause(false)
    }
  }, [challengeActive])

  const spawnChallenge = useCallback(() => {
    if (ownChallengeRef.current || challengeActiveRef.current) return
    ownChallengeRef.current = true
    canvasRef.current?.pause(true)
    const { topic, onChallenge } = propsRef.current
    void getRandomChallenge(usedIdsRef.current, topic, preferDiffRef.current).then((c) => {
      if (c) usedIdsRef.current.add(c.id)
      onChallenge(c)
    })
  }, [])

  const resume = useCallback(() => {
    ownChallengeRef.current = false
    if (!challengeActiveRef.current) canvasRef.current?.pause(false)
  }, [])

  const handleHud = useCallback(
    (hud: SideHudSnapshot) => {
      const danger =
        difficultyRef.current === 'easy' ? 1 : difficultyRef.current === 'medium' ? 2 : 3
      onHUDUpdateRef.current({
        score: hud.score,
        gap: 70,
        speed: danger,
        streak: hud.streak,
      })
      if (!ownChallengeRef.current && !challengeActiveRef.current && runningRef.current) {
        const since = hud.x - lastChallengeX.current
        if (since >= CHALLENGE_MIN + Math.random() * (CHALLENGE_MAX - CHALLENGE_MIN)) {
          lastChallengeX.current = hud.x
          spawnChallenge()
        }
      }
    },
    [spawnChallenge],
  )

  const handleEvent = useCallback(
    (event: { type: string }, state: { player: { score: number } }) => {
      if (event.type === 'die') {
        runningRef.current = false
        onGameOverRef.current(state.player.score)
      }
      if (event.type === 'levelComplete') {
        const seg = Math.min(MAX_SEGMENT, segmentRef.current + 1)
        segmentRef.current = seg
        const total = (canvasRef.current?.getScore() ?? 0) + SEGMENT_CLEAR_SCORE
        canvasRef.current?.setWorld(
          generateFreeplayWorld({ difficulty: difficultyRef.current, segment: seg }),
          total,
        )
      }
    },
    [],
  )

  const restoreScore = useCallback((score: number) => {
    canvasRef.current?.setScore(score)
  }, [])

  const handleAnswer = useCallback(
    (correct: boolean) => {
      canvasRef.current?.applyAnswer(correct)
      if (correct) canvasRef.current?.addScore(ANSWER_SCORE * multiplierRef.current)
      resume()
    },
    [resume],
  )

  const handleTimeout = useCallback(() => {
    canvasRef.current?.applyAnswer(false)
    resume()
  }, [resume])

  const setMultiplier = useCallback((mult: number) => {
    multiplierRef.current = mult
  }, [])

  const setPreferredDifficulty = useCallback((diff?: string) => {
    preferDiffRef.current = diff
  }, [])

  const setPaused = useCallback((p: boolean) => {
    canvasRef.current?.pause(p)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      restoreScore,
      handleAnswer,
      handleTimeout,
      setMultiplier,
      setPreferredDifficulty,
      setPaused,
    }),
    [restoreScore, handleAnswer, handleTimeout, setMultiplier, setPreferredDifficulty, setPaused],
  )

  useEffect(() => {
    return () => {
      runningRef.current = false
    }
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05030f',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: `calc(${VIEW_W}px * 2.2)`,
          aspectRatio: `${VIEW_W} / ${VIEW_H}`,
          maxHeight: '100%',
        }}
      >
        <SideViewCanvas
          ref={canvasRef}
          world={initialWorld}
          onEvent={handleEvent}
          onHud={handleHud}
          hudIntervalMs={120}
        />
      </div>
    </div>
  )
})

export default SideRunScreen
