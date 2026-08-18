import { useState, useRef, useCallback, useEffect, useMemo, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import GameRunView from './GameRunView'
import type { SideRunScreenHandle } from '../game/SideRunScreen'
const PuzzleEditor = lazy(() => import('../components/PuzzleEditor'))
const CommunityPuzzles = lazy(() => import('../components/CommunityPuzzles'))
import { playGameOver, playSuccess, playError } from '../game/sound'
import { startMusic, stopMusic } from '../game/audio'
import { Challenge, HUDData, Difficulty, Topic, CodePuzzle } from '../game/types'
import { getDailyChallenge } from '../game/engine/data/challenges'
import {
  getHighScore,
  setHighScore as persistHighScore,
  addToLeaderboard,
  getRunSession,
  saveRunSession,
  clearRunSession,
  initSession,
  submitScore,
  updatePlayerName,
  getLocalPlayerName,
  getGlobalLeaderboard,
  RunSession,
  PlayerProfile,
} from '../lib/store'
import { importPuzzleFromUrl } from '../game/puzzleShare'
import { useBossBattle } from '../features/boss/useBossBattle'
import { useBonusRound } from '../features/bonus/useBonusRound'
import { useEndless, Badge } from '../features/endless/useEndless'
import { useSpeedRun } from '../features/speedrun/useSpeedRun'
import { useSurvival } from '../features/survival/useSurvival'
import { useDailyChallenge } from '../features/daily/useDailyChallenge'
import { BOSS_THRESHOLD, BONUS_THRESHOLD, getTimeLimit, Mode } from '../features/modes'
import { StoryLevelNode } from '../game/engine/story/levels'
import { completeStoryLevel, getStoryProgress, StoryProgress } from '../game/engine/story/progress'

const StartScreen = lazy(() => import('../components/StartScreen'))
const GameOverScreen = lazy(() => import('../components/GameOverScreen'))
const NameDialog = lazy(() => import('../components/NameDialog'))
const CodePuzzlePlaytest = lazy(() => import('../components/CodePuzzlePlaytest'))
const LoadingScreen = lazy(() => import('../components/LoadingScreen'))
const SidePlayground = lazy(() => import('../components/SidePlayground'))
const StoryLevelSelect = lazy(() => import('../components/StoryLevelSelect'))
const StoryRunScreen = lazy(() => import('../components/StoryRunScreen'))

type Screen = 'start' | 'storyselect' | 'story' | 'playing' | 'gameover'

export default function Game() {
  const [screen, setScreen] = useState<Screen>('start')
  const [hudData, setHudData] = useState<HUDData>({ score: 0, streak: 0, multiplier: 1 })
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [timeLimit, setTimeLimit] = useState(5)
  const [mode, setMode] = useState<Mode>('normal')
  const [highScore, setHighScore] = useState(0)
  useEffect(() => {
    getHighScore().then(setHighScore)
  }, [])
  const [finalScore, setFinalScore] = useState(0)
  const [finalBadges, setFinalBadges] = useState<Badge[]>([])
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')

  const [resumeSession, setResumeSession] = useState<RunSession | null>(null)
  useEffect(() => {
    getRunSession().then(setResumeSession)
  }, [])
  const lastSessionSaveRef = useRef(0)
  const pendingResumeRef = useRef<RunSession | null>(null)

  const gameRef = useRef<SideRunScreenHandle>(null)
  const challengeRef = useRef(false)
  const lastBossScore = useRef(0)
  const lastBonusScore = useRef(0)
  const modeRef = useRef<Mode>('normal')
  const gameOverRef = useRef<(score: number) => void>(() => {})
  const hudScoreRef = useRef(0)
  useEffect(() => {
    hudScoreRef.current = hudData.score
  }, [hudData.score])
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const profileRef = useRef<PlayerProfile | null>(null)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [playerRank, setPlayerRank] = useState(0)
  const [showPuzzleEditor, setShowPuzzleEditor] = useState(false)
  const [showCustomPuzzles, setShowCustomPuzzles] = useState(false)
  const [customPuzzle, setCustomPuzzle] = useState<CodePuzzle | null>(null)
  const [storyProgress, setStoryProgress] = useState<StoryProgress | null>(null)
  const [storyNode, setStoryNode] = useState<StoryLevelNode | null>(null)

  useEffect(() => {
    getStoryProgress().then(setStoryProgress)
  }, [screen])

  const handleStoryPlay = useCallback((node: StoryLevelNode) => {
    setStoryNode(node)
    setScreen('story')
  }, [])

  const handleStoryComplete = useCallback(
    (stars: number, score: number) => {
      const node = storyNode
      if (node) {
        completeStoryLevel(node, stars, score).then(setStoryProgress)
      }
      if (profileRef.current) {
        submitScore(profileRef.current.id, score, 'story')
      }
      setScreen('storyselect')
    },
    [storyNode],
  )

  const hudDataRef = useRef<HUDData>(hudData)

  useEffect(() => {
    hudDataRef.current = hudData
  }, [hudData])

  const prevScreen = useRef<Screen | null>(null)
  useEffect(() => {
    if (screen === prevScreen.current) return
    const prev = prevScreen.current
    prevScreen.current = screen
    if (prev === 'playing' || prev === 'story') stopMusic()
    if (screen === 'start') {
      startMusic(0, 0.15)
    } else if (screen === 'gameover') {
      startMusic(1, 0.1)
    } else if (screen === 'playing' || screen === 'story') {
      startMusic(0, 0.3)
    }
  }, [screen])

  const showChallenge = useCallback((challenge: Challenge, timeLimitSeconds: number) => {
    setCurrentChallenge(challenge)
    setTimeLimit(timeLimitSeconds)
    challengeRef.current = true
  }, [])

  const bossCtx = useMemo(
    () => ({
      gameRef,
      modeRef,
      setMode,
      topic: selectedTopic,
      showChallenge,
    }),
    [selectedTopic, showChallenge],
  )

  const bossBattle = useBossBattle(bossCtx)

  const bonusCtx = useMemo(
    () => ({
      gameRef,
      modeRef,
      setMode,
      topic: selectedTopic,
      showChallenge,
      active: mode === 'bonus' && screen === 'playing',
    }),
    [selectedTopic, showChallenge, mode, screen],
  )

  const bonusRound = useBonusRound(bonusCtx)

  const endless = useEndless()

  const onModeTimeUp = useCallback(() => {
    gameOverRef.current(hudScoreRef.current)
  }, [])

  const speedRunCtx = useMemo(() => ({ onTimeUp: onModeTimeUp }), [onModeTimeUp])
  const speedRun = useSpeedRun(speedRunCtx)

  const survivalCtx = useMemo(() => ({ onGameOver: onModeTimeUp }), [onModeTimeUp])
  const survival = useSurvival(survivalCtx)

  const daily = useDailyChallenge()

  // Persist the run snapshot so a refresh can resume it (throttled).
  useEffect(() => {
    if (screen !== 'playing') return
    if (hudData.score === 0 && pendingResumeRef.current === null) return
    const now = Date.now()
    if (now - lastSessionSaveRef.current < 2000) return
    lastSessionSaveRef.current = now
    void saveRunSession({
      mode:
        modeRef.current === 'speedrun'
          ? 'speedrun'
          : modeRef.current === 'survival'
            ? 'survival'
            : 'normal',
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      score: hudData.score,
      isDaily: daily.isDailyRef.current,
    })
  }, [hudData.score, screen, selectedTopic, selectedDifficulty, daily])

  interface GameStateOverrides {
    mode: Mode
    modeRef: Mode
    isDaily: boolean
    hudData: Partial<HUDData>
  }

  const resetGameState = useCallback(
    (overrides?: Partial<GameStateOverrides>) => {
      setHudData({ score: 0, streak: 0, multiplier: 1, ...overrides?.hudData })
      setCurrentChallenge(null)
      setMode(overrides?.mode ?? 'normal')
      setFinalScore(0)
      setFinalBadges([])
      challengeRef.current = false
      lastBossScore.current = 0
      lastBonusScore.current = 0
      modeRef.current = overrides?.modeRef ?? 'normal'
      bossBattle.reset()
      bonusRound.reset()
      endless.reset()
      speedRun.reset()
      survival.reset()
      daily.reset(overrides?.isDaily ?? false)
    },
    [bossBattle, bonusRound, endless, speedRun, survival, daily],
  )

  const handleChallenge = useCallback((challenge: Challenge) => {
    if (challengeRef.current) return
    challengeRef.current = true
    setCurrentChallenge(challenge)
    setTimeLimit(getTimeLimit(challenge.difficulty))
  }, [])

  const finishChallenge = useCallback(() => {
    challengeRef.current = false
    setCurrentChallenge(null)
  }, [])

  const handleStart = useCallback(
    (topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => {
      setSelectedTopic(topic)
      setSelectedDifficulty(difficulty)
      setScreen('playing')
      resetGameState({ isDaily: !!isDaily })
      setResumeSession(null)
      void saveRunSession({
        mode: 'normal',
        topic,
        difficulty,
        score: 0,
        isDaily: !!isDaily,
      })
      if (isDaily) {
        const dc = getDailyChallenge()
        daily.start(dc, (challenge, time) => {
          handleChallenge(challenge)
          setTimeLimit(time)
        })
      }
    },
    [resetGameState, daily, handleChallenge],
  )

  const handleSpeedRun = useCallback(() => {
    setSelectedTopic(null)
    setSelectedDifficulty('easy')
    setScreen('playing')
    resetGameState({ mode: 'speedrun', modeRef: 'speedrun' })
    setResumeSession(null)
    void saveRunSession({
      mode: 'speedrun',
      topic: null,
      difficulty: 'easy',
      score: 0,
      isDaily: false,
    })
    speedRun.start()
  }, [resetGameState, speedRun])

  const handleSurvival = useCallback(() => {
    setSelectedTopic(null)
    setSelectedDifficulty('easy')
    setScreen('playing')
    resetGameState({ mode: 'survival', modeRef: 'survival' })
    setResumeSession(null)
    void saveRunSession({
      mode: 'survival',
      topic: null,
      difficulty: 'easy',
      score: 0,
      isDaily: false,
    })
  }, [resetGameState])

  const handleResume = useCallback(
    (session: RunSession) => {
      setResumeSession(null)
      void clearRunSession()
      setSelectedTopic(session.topic)
      setSelectedDifficulty(session.difficulty)
      resetGameState({
        mode: session.mode,
        modeRef: session.mode,
        isDaily: session.isDaily,
        hudData: { score: session.score },
      })
      pendingResumeRef.current = session
      setScreen('playing')
    },
    [resetGameState],
  )

  // Applies the restored score once SideRunScreen has mounted (lazy-loaded, so
  // the ref is only valid after mount — the screen reports readiness via onReady).
  const handleRunReady = useCallback(() => {
    const session = pendingResumeRef.current
    if (!session) return
    pendingResumeRef.current = null
    gameRef.current?.restoreScore(session.score)
    if (session.mode === 'speedrun') speedRun.start()
  }, [speedRun])

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (!currentChallenge) return
      const correct = answerIndex === currentChallenge.correct

      if (modeRef.current === 'boss') {
        bossBattle.handleBossAnswer(correct)
        finishChallenge()
        return
      }
      if (modeRef.current === 'bonus') {
        bonusRound.handleBonusAnswer(correct)
        finishChallenge()
        return
      }

      if (modeRef.current === 'survival') {
        if (!correct) {
          const dead = survival.loseLife()
          if (dead) {
            finishChallenge()
            return
          }
        }
        gameRef.current?.handleAnswer(correct)
        finishChallenge()
        return
      }

      if (modeRef.current === 'speedrun') {
        gameRef.current?.handleAnswer(correct)
        finishChallenge()
        return
      }

      gameRef.current?.handleAnswer(correct)
      if (correct) playSuccess()
      else playError()
      const { multiplier, adaptDiff } = endless.registerAnswer(
        correct,
        currentChallenge.topic,
        selectedDifficulty,
      )
      gameRef.current?.setPreferredDifficulty(adaptDiff)
      gameRef.current?.setMultiplier(multiplier)

      finishChallenge()
    },
    [
      currentChallenge,
      selectedDifficulty,
      finishChallenge,
      bossBattle,
      bonusRound,
      endless,
      survival,
    ],
  )

  const handleTimeout = useCallback(() => {
    if (modeRef.current === 'boss') {
      bossBattle.handleBossAnswer(false)
      finishChallenge()
      return
    }
    if (modeRef.current === 'bonus') {
      bonusRound.handleBonusAnswer(false)
      finishChallenge()
      return
    }
    gameRef.current?.handleTimeout()
    const adaptDiff = endless.registerTimeout(selectedDifficulty)
    gameRef.current?.setPreferredDifficulty(adaptDiff)
    gameRef.current?.setMultiplier(1)
    finishChallenge()
  }, [finishChallenge, bossBattle, bonusRound, endless, selectedDifficulty])

  const handleNameSubmit = useCallback(async (name: string) => {
    setShowNameDialog(false)
    if (profileRef.current) {
      const ok = await updatePlayerName(profileRef.current.id, name)
      if (ok) {
        profileRef.current.player_name = name
        setProfile({ ...profileRef.current })
      }
    }
  }, [])

  const handleGameOver = useCallback(
    (score: number) => {
      playGameOver()
      setFinalScore(score)
      setFinalBadges(endless.getBadges())
      const prevHigh = isNaN(highScore) ? 0 : highScore
      setIsNewHighScore(score > prevHigh && score > 0)
      setScreen('gameover')
      challengeRef.current = false
      setCurrentChallenge(null)
      void clearRunSession()
      setResumeSession(null)
      setHighScore((prev) => {
        const safePrev = isNaN(prev) ? 0 : prev
        const nh = Math.max(safePrev, score)
        if (nh > safePrev && !isNaN(nh)) {
          void persistHighScore(nh)
        }
        return nh
      })
      if (score > 0) {
        void addToLeaderboard(
          Math.floor(score),
          daily.isDailyRef.current ? ('daily' as const) : ('freeplay' as const),
        )
      }
      daily.complete(score)
      if (profileRef.current && score > 0) {
        const mode = daily.isDailyRef.current ? ('daily' as const) : ('freeplay' as const)
        submitScore(profileRef.current.id, Math.floor(score), mode)
          .then(() => getGlobalLeaderboard(profileRef.current!.id))
          .then((res) => setPlayerRank(res.yourRank))
          .catch(() => console.debug('[Game] leaderboard submit failed'))
      }
    },
    [endless, daily, highScore],
  )

  const handleRestart = useCallback(() => {
    setScreen('start')
    setFinalScore(0)
    challengeRef.current = false
    void clearRunSession()
    setResumeSession(null)
  }, [])

  useEffect(() => {
    gameOverRef.current = handleGameOver
  }, [handleGameOver])

  useEffect(() => {
    const local = getLocalPlayerName()
    if (!local || local === 'Runner') {
      setShowNameDialog(true)
    }
    initSession()
      .then((p) => {
        if (p) {
          profileRef.current = p
          setProfile(p)
        }
      })
      .catch(() => console.debug('[Game] initSession failed'))
  }, [])

  useEffect(() => {
    const imported = importPuzzleFromUrl()
    if (imported) {
      const p: CodePuzzle = { id: 'url_import', ...imported }
      setCustomPuzzle(p)
      const url = new URL(window.location.href)
      url.searchParams.delete('puzzle')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  useEffect(() => {
    return () => {
      speedRun.dispose()
      survival.dispose()
    }
  }, [speedRun, survival])

  useEffect(() => {
    if (screen !== 'playing' || hudData.score <= 0) return
    if (mode !== 'normal') return

    if (hudData.score - lastBossScore.current >= BOSS_THRESHOLD) {
      lastBossScore.current = hudData.score
      bossBattle.triggerBossBattle()
      return
    }

    if (hudData.score - lastBonusScore.current >= BONUS_THRESHOLD) {
      lastBonusScore.current = hudData.score
      bonusRound.triggerBonusRound()
      return
    }
  }, [hudData.score, screen, mode, bossBattle, bonusRound])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return
      }
      if (e.key === 'Enter') {
        if (screen === 'start') handleStart(null, 'medium')
        else if (screen === 'gameover') handleRestart()
      }
      if (e.key === 'Escape') {
        if (currentChallenge) {
          setCurrentChallenge(null)
          return
        }
        if (showNameDialog) {
          setShowNameDialog(false)
          return
        }
      }
      if (!currentChallenge || !gameRef.current) return
      if (currentChallenge.type === 'fill-blank') return
      const n = parseInt(e.key)
      if (n >= 1 && n <= 4 && n <= currentChallenge.options.length) {
        handleAnswer(n - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, handleStart, handleRestart, currentChallenge, handleAnswer, showNameDialog])

  return (
    <>
      <Helmet>
        <title>Corun — Play</title>
        <meta
          name="description"
          content="Play Corun — a free open-source coding game. Story campaign, endless runner, speed run, survival, and daily challenge modes."
        />
      </Helmet>
      <div style={styles.root}>
        {screen === 'playing' && (
          <GameRunView
            gameRef={gameRef}
            topic={selectedTopic ?? undefined}
            difficulty={selectedDifficulty}
            currentChallenge={currentChallenge}
            timeLimit={timeLimit}
            mode={mode}
            hudData={hudData}
            onChallenge={handleChallenge}
            onGameOver={handleGameOver}
            onHUDUpdate={setHudData}
            onAnswer={handleAnswer}
            onTimeout={handleTimeout}
            onReady={handleRunReady}
            boss={bossBattle.boss}
            speedRunTime={mode === 'speedrun' ? speedRun.timeLeft : undefined}
            survivalLives={mode === 'survival' ? survival.lives : undefined}
            showCombo={endless.showCombo}
            comboText={endless.comboText}
            bonusTimeLeft={mode === 'bonus' ? bonusRound.bonusTimeLeft : undefined}
          />
        )}

        {screen === 'start' && (
          <Suspense fallback={<LoadingScreen />}>
            <StartScreen
              highScore={highScore}
              onStart={handleStart}
              onSpeedRun={handleSpeedRun}
              onSurvival={handleSurvival}
              onPuzzleEditor={() => setShowPuzzleEditor(true)}
              onCustomPuzzles={() => setShowCustomPuzzles(true)}
              onStory={() => setScreen('storyselect')}
              playerName={profile?.player_name}
              profileId={profile?.id}
              resumeSession={resumeSession}
              onResume={handleResume}
            />
          </Suspense>
        )}

        {screen === 'storyselect' && (
          <Suspense fallback={<LoadingScreen />}>
            <StoryLevelSelect
              progress={storyProgress ?? { unlockedUpTo: 0, completed: {} }}
              onPlay={handleStoryPlay}
              onBack={() => setScreen('start')}
            />
          </Suspense>
        )}

        {screen === 'story' && storyNode && (
          <Suspense fallback={<LoadingScreen />}>
            <StoryRunScreen
              node={storyNode}
              onComplete={handleStoryComplete}
              onExit={() => setScreen('storyselect')}
            />
          </Suspense>
        )}

        {screen === 'gameover' && (
          <Suspense fallback={<LoadingScreen />}>
            <GameOverScreen
              score={finalScore}
              isNewHighScore={isNewHighScore}
              onRestart={handleRestart}
              badges={finalBadges}
              playerRank={playerRank}
            />
          </Suspense>
        )}

        {showNameDialog && (
          <Suspense fallback={null}>
            <NameDialog onSubmit={handleNameSubmit} />
          </Suspense>
        )}

        {showPuzzleEditor && (
          <Suspense fallback={null}>
            <PuzzleEditor
              onClose={() => setShowPuzzleEditor(false)}
              onSave={(p) => {
                setShowPuzzleEditor(false)
                setCustomPuzzle(p)
              }}
            />
          </Suspense>
        )}

        {showCustomPuzzles && (
          <Suspense fallback={null}>
            <CommunityPuzzles
              onSelect={(p) => {
                setShowCustomPuzzles(false)
                setCustomPuzzle(p)
              }}
              onClose={() => setShowCustomPuzzles(false)}
            />
          </Suspense>
        )}

        {customPuzzle && (
          <Suspense fallback={null}>
            <CodePuzzlePlaytest puzzle={customPuzzle} onClose={() => setCustomPuzzle(null)} />
          </Suspense>
        )}

        {import.meta.env.DEV && location.hash === '#side-debug' && (
          <Suspense fallback={null}>
            <SidePlayground />
          </Suspense>
        )}
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
}
