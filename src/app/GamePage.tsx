import { useState, useRef, useCallback, useEffect, useMemo, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import type { PixelRunnerHandle } from '../game/PixelRunner'
const PixelRunner = lazy(() => import('../game/PixelRunner'))
const ChallengeModal = lazy(() => import('../components/ChallengeModal'))
const StoryLevelCanvas = lazy(() => import('../features/story/StoryLevelCanvas'))
const PuzzleEditor = lazy(() => import('../components/PuzzleEditor'))
const CommunityPuzzles = lazy(() => import('../components/CommunityPuzzles'))
import { playGameOver, playSuccess, playError } from '../game/sound'
import { startMusic, stopMusic } from '../game/audio'
import {
  Challenge,
  HUDData,
  Difficulty,
  Topic,
  LevelConfig,
  LevelProgress,
  CodePuzzle,
} from '../game/types'
import { getRandomChallenge, getDailyChallenge } from '../game/engine/data/challenges'
import { ALL_LEVELS, ENDING_SCENE } from '../game/engine/data/levels'
import { getLevelScene } from '../game/engine/data/levelScenes'
import {
  getHighScore,
  setHighScore as persistHighScore,
  getLevelProgress,
  saveLevelProgress,
  addToLeaderboard,
} from '../lib/storage'
import {
  initSession,
  submitScore,
  updatePlayerName,
  getLocalPlayerName,
  setLocalPlayerName,
  getGlobalLeaderboard,
  PlayerProfile,
} from '../lib/leaderboard'
import { importPuzzleFromUrl } from '../game/puzzleShare'
import { colors, fonts, alpha, radius } from '../lib/theme'
import { useBossBattle } from '../features/boss/useBossBattle'
import { useBonusRound } from '../features/bonus/useBonusRound'
import { useEndless, Badge } from '../features/endless/useEndless'
import { useSpeedRun } from '../features/speedrun/useSpeedRun'
import { useSurvival } from '../features/survival/useSurvival'
import { useDailyChallenge } from '../features/daily/useDailyChallenge'
import { BOSS_THRESHOLD, BONUS_THRESHOLD, getTimeLimit, Mode } from '../features/modes'

const HUD = lazy(() => import('../components/HUD'))
const StartScreen = lazy(() => import('../components/StartScreen'))
const GameOverScreen = lazy(() => import('../components/GameOverScreen'))
const LevelSelect = lazy(() => import('../components/LevelSelect'))
const SceneCanvas = lazy(() => import('../components/SceneCanvas'))
const NameDialog = lazy(() => import('../components/NameDialog'))
const CodePuzzlePlaytest = lazy(() => import('../components/CodePuzzlePlaytest'))
const LoadingScreen = lazy(() => import('../components/LoadingScreen'))

type Screen =
  'start' | 'playing' | 'gameover' | 'levelselect' | 'levelintro' | 'leveloutro' | 'ending'

export default function Game() {
  const [screen, setScreen] = useState<Screen>('start')
  const [hudData, setHudData] = useState<HUDData>({ score: 0, gap: 70, speed: 1, streak: 0 })
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [timeLimit, setTimeLimit] = useState(5)
  const [mode, setMode] = useState<Mode>('normal')
  const [highScore, setHighScore] = useState(0)
  useEffect(() => {
    getHighScore().then(setHighScore)
  }, [])
  const [finalScore, setFinalScore] = useState(0)
  const [finalBadges, setFinalBadges] = useState<Badge[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')

  // Level state
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null)
  const [levelProgress, setLevelProgressState] = useState<LevelProgress>({
    unlockedUpTo: 1,
    completed: [],
    stars: {},
  })
  useEffect(() => {
    getLevelProgress().then(setLevelProgressState)
  }, [])
  const [finalStars, setFinalStars] = useState(0)

  const gameRef = useRef<PixelRunnerHandle>(null)
  const challengeRef = useRef(false)
  const lastBossScore = useRef(0)
  const lastBonusScore = useRef(0)
  const modeRef = useRef<Mode>('normal')
  const gameOverRef = useRef<(score: number) => void>(() => {})
  const hudScoreRef = useRef(0)
  useEffect(() => {
    hudScoreRef.current = hudData.score
  }, [hudData.score])
  // Supabase
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const profileRef = useRef<PlayerProfile | null>(null)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [playerRank, setPlayerRank] = useState(0)
  const [showPuzzleEditor, setShowPuzzleEditor] = useState(false)
  const [showCustomPuzzles, setShowCustomPuzzles] = useState(false)
  const [customPuzzle, setCustomPuzzle] = useState<CodePuzzle | null>(null)

  // Level refs
  const activeLevelRef = useRef<LevelConfig | null>(null)
  const levelTargetReached = useRef(false)
  const hudDataRef = useRef<HUDData>(hudData)

  useEffect(() => {
    hudDataRef.current = hudData
  }, [hudData])

  const prevScreen = useRef<Screen | null>(null)
  useEffect(() => {
    if (screen === prevScreen.current) return
    const prev = prevScreen.current
    prevScreen.current = screen
    if (prev === 'playing') stopMusic()
    if (screen === 'start' || screen === 'levelselect') {
      startMusic(0, 0.15)
    } else if (screen === 'gameover') {
      startMusic(1, 0.1)
    } else if (screen === 'playing' && !activeLevel) {
      startMusic(0, 0.3)
    } else if (screen === 'levelintro' || screen === 'leveloutro' || screen === 'ending') {
      startMusic(activeLevelRef.current?.id || 1, 0.2)
    }
  }, [screen, activeLevel])

  const goToLevelSelect = useCallback(() => {
    setScreen('levelselect')
    setActiveLevel(null)
    activeLevelRef.current = null
  }, [])

  const goToLevelSelectWithProgress = useCallback((progress: LevelProgress) => {
    setLevelProgressState(progress)
    setScreen('levelselect')
    setActiveLevel(null)
    activeLevelRef.current = null
  }, [])

  const handleSelectLevel = useCallback((levelId: number) => {
    const level = ALL_LEVELS.find((l) => l.id === levelId)
    if (!level) return
    activeLevelRef.current = level
    setActiveLevel(level)
    setScreen('levelintro')
  }, [])

  const handleLevelComplete = useCallback(async (correctCount?: number) => {
    const level = activeLevelRef.current
    if (!level) return
    let stars = 3
    if (correctCount !== undefined) {
      const scene = getLevelScene(level.id)
      const total = Math.max(1, scene?.triggers.length ?? 1)
      const accuracy = correctCount / total
      const scoreRatio = Math.min(1, hudDataRef.current.score / level.scoreTarget)
      const combined = (accuracy + scoreRatio) / 2
      if (combined >= 0.8) stars = 3
      else if (combined >= 0.5) stars = 2
      else stars = 1
    }
    const progress = await getLevelProgress()
    if (!progress.completed.includes(level.id)) progress.completed.push(level.id)
    progress.stars[String(level.id)] = Math.max(progress.stars[String(level.id)] || 0, stars)
    if (level.id >= progress.unlockedUpTo) progress.unlockedUpTo = level.id + 1
    await saveLevelProgress(progress)
    setLevelProgressState(progress)
    setFinalStars(stars)
    setScreen('leveloutro')
  }, [])

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
      onLevelComplete: handleLevelComplete,
      getLevel: () => activeLevelRef.current,
    }),
    [selectedTopic, showChallenge, handleLevelComplete],
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

  interface GameStateOverrides {
    mode: Mode
    modeRef: Mode
    isDaily: boolean
    hudData: Partial<HUDData>
  }

  const resetGameState = useCallback(
    (overrides?: Partial<GameStateOverrides>) => {
      setHudData({ score: 0, gap: 70, speed: 1, streak: 0, ...overrides?.hudData })
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

  const handleStoryDone = useCallback(() => {
    const level = activeLevelRef.current
    if (!level) {
      setScreen('levelselect')
      return
    }
    levelTargetReached.current = false
    setScreen('playing')
    resetGameState()
  }, [resetGameState])

  const [showEndingScene, setShowEndingScene] = useState(true)

  const handleOutroDone = useCallback(async () => {
    const isLast = activeLevelRef.current?.id === ALL_LEVELS.length
    if (isLast) {
      setShowEndingScene(true)
      setScreen('ending')
    } else goToLevelSelectWithProgress(await getLevelProgress())
  }, [goToLevelSelectWithProgress])

  const handleEndingDone = useCallback(() => {
    setShowEndingScene(false)
  }, [])

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
    speedRun.start()
  }, [resetGameState, speedRun])

  const handleSurvival = useCallback(() => {
    setSelectedTopic(null)
    setSelectedDifficulty('easy')
    setScreen('playing')
    resetGameState({ mode: 'survival', modeRef: 'survival' })
  }, [resetGameState])

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
  }, [finishChallenge, bossBattle, bonusRound, endless])

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
      setScreen('gameover')
      challengeRef.current = false
      setCurrentChallenge(null)
      setHighScore((prev) => {
        const safePrev = isNaN(prev) ? 0 : prev
        const nh = Math.max(safePrev, score)
        if (nh > safePrev && !isNaN(nh)) {
          void persistHighScore(nh)
        }
        return nh
      })
      if (score > 0) void addToLeaderboard(Math.floor(score))
      daily.complete(score)
      if (profileRef.current && score > 0) {
        const mode = activeLevelRef.current
          ? 'story'
          : daily.isDailyRef.current
            ? 'daily'
            : ('freeplay' as const)
        submitScore(profileRef.current.id, Math.floor(score), mode, activeLevelRef.current?.id || 0)
          .then(() => getGlobalLeaderboard(profileRef.current!.id))
          .then((res) => setPlayerRank(res.yourRank))
          .catch(() => console.debug('[Game] leaderboard submit failed'))
      }
    },
    [endless, daily],
  )

  const handleRestart = useCallback(() => {
    setScreen('start')
    setFinalScore(0)
    challengeRef.current = false
  }, [])

  const handleRetryLevel = useCallback(() => {
    const level = activeLevelRef.current
    if (level) handleSelectLevel(level.id)
  }, [handleSelectLevel])

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

    if (
      activeLevelRef.current &&
      !levelTargetReached.current &&
      hudData.score >= activeLevelRef.current.scoreTarget
    ) {
      levelTargetReached.current = true
      bossBattle.triggerLevelBoss()
      return
    }

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
      if (e.key === 'Enter') {
        if (screen === 'start') handleStart(null, 'medium')
        else if (screen === 'gameover') {
          const level = activeLevelRef.current
          if (level) handleRetryLevel()
          else handleRestart()
        } else if (screen === 'levelintro') handleStoryDone()
        else if (screen === 'leveloutro') handleOutroDone()
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
  }, [
    screen,
    handleStart,
    handleRestart,
    handleRetryLevel,
    handleStoryDone,
    handleOutroDone,
    currentChallenge,
    handleAnswer,
    showNameDialog,
  ])

  function renderBossBar() {
    const boss = bossBattle.boss
    if (!boss) return null
    const pct = (boss.hp / boss.maxHp) * 100
    return (
      <div
        style={{
          position: 'fixed',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          textAlign: 'center',
          width: '90%',
          maxWidth: 400,
        }}
      >
        <div
          style={{
            color: colors.fg,
            fontSize: 12,
            fontFamily: fonts.heading,
            fontWeight: 600,
            letterSpacing: 2,
            marginBottom: 6,
          }}
        >
          ⚔ {boss.name}
        </div>
        <div
          style={{
            height: 8,
            background: alpha(0.05),
            border: `1px solid ${alpha(0.2)}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: colors.accent,
              transition: 'width 0.3s',
            }}
          />
        </div>
        <div
          style={{
            color: alpha(0.5),
            fontSize: 10,
            fontFamily: fonts.mono,
            marginTop: 3,
            letterSpacing: 1,
          }}
        >
          {boss.hp}/{boss.maxHp} HP
        </div>
      </div>
    )
  }

  function renderBonusTimer() {
    if (mode !== 'bonus') return null
    return (
      <div
        style={{
          position: 'fixed',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: colors.accent,
            fontSize: 10,
            fontFamily: fonts.heading,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          ⚡ BONUS ROUND x2 ⚡
        </div>
        <div
          style={{
            color: colors.fg,
            fontSize: 11,
            fontFamily: fonts.mono,
            marginTop: 4,
            letterSpacing: 1,
          }}
        >
          {Math.ceil(bonusRound.bonusTimeLeft)}s LEFT
        </div>
      </div>
    )
  }

  function renderComboNotification() {
    if (!endless.showCombo) return null
    return (
      <div
        style={{
          position: 'fixed',
          top: '45%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 150,
          pointerEvents: 'none',
          color: colors.fg,
          fontSize: 18,
          fontFamily: fonts.heading,
          fontWeight: 700,
          textShadow: `0 0 20px ${alpha(0.3)}`,
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        {endless.comboText}
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Corun — Play</title>
        <meta
          name="description"
          content="Play Corun — a free open-source coding game. Story mode with 12 levels, endless runner, speed run, and survival modes."
        />
      </Helmet>
      <div style={styles.root}>
        {screen === 'playing' && !activeLevel && (
          <Suspense fallback={<LoadingScreen />}>
            <PixelRunner
              ref={gameRef}
              topic={selectedTopic ?? undefined}
              difficulty={selectedDifficulty}
              onChallenge={handleChallenge}
              onGameOver={handleGameOver}
              onHUDUpdate={setHudData}
            />
          </Suspense>
        )}

        {screen === 'playing' && activeLevel && (
          <Suspense fallback={<LoadingScreen />}>
            <StoryLevelCanvas levelId={activeLevel.id} onComplete={handleLevelComplete} />
          </Suspense>
        )}

        {screen === 'playing' && !activeLevel && (
          <Suspense fallback={null}>
            <HUD
              {...hudData}
              isBoss={mode === 'boss'}
              isBonus={mode === 'bonus'}
              levelName={undefined}
              speedRunTime={mode === 'speedrun' ? speedRun.timeLeft : undefined}
              survivalLives={mode === 'survival' ? survival.lives : undefined}
            />
          </Suspense>
        )}

        {screen === 'playing' && currentChallenge && !activeLevel && (
          <Suspense fallback={null}>
            <ChallengeModal
              challenge={currentChallenge}
              timeLimit={timeLimit}
              onAnswer={handleAnswer}
              onTimeout={handleTimeout}
              isBoss={mode === 'boss'}
              isBonus={mode === 'bonus'}
            />
          </Suspense>
        )}

        {screen === 'playing' && !activeLevel && renderBossBar()}
        {screen === 'playing' && !activeLevel && renderBonusTimer()}
        {renderComboNotification()}

        {screen === 'start' && (
          <Suspense fallback={<LoadingScreen />}>
            <StartScreen
              highScore={highScore}
              onStart={handleStart}
              onStoryMode={goToLevelSelect}
              onSpeedRun={handleSpeedRun}
              onSurvival={handleSurvival}
              onPuzzleEditor={() => setShowPuzzleEditor(true)}
              onCustomPuzzles={() => setShowCustomPuzzles(true)}
              playerName={profile?.player_name}
              profileId={profile?.id}
            />
          </Suspense>
        )}

        {screen === 'levelselect' && (
          <Suspense fallback={<LoadingScreen />}>
            <LevelSelect
              progress={levelProgress}
              onSelectLevel={handleSelectLevel}
              onBack={() => setScreen('start')}
            />
          </Suspense>
        )}

        {screen === 'levelintro' && activeLevel?.sceneIntro && (
          <Suspense fallback={<LoadingScreen />}>
            <SceneCanvas scene={activeLevel.sceneIntro} onDone={handleStoryDone} />
          </Suspense>
        )}

        {screen === 'leveloutro' && activeLevel?.sceneOutro && (
          <Suspense fallback={<LoadingScreen />}>
            <SceneCanvas scene={activeLevel.sceneOutro} onDone={handleOutroDone} />
          </Suspense>
        )}

        {screen === 'ending' && showEndingScene && (
          <Suspense fallback={<LoadingScreen />}>
            <SceneCanvas scene={ENDING_SCENE} onDone={handleEndingDone} />
          </Suspense>
        )}

        {screen === 'ending' && !showEndingScene && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: colors.bg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 300,
              fontFamily: fonts.body,
              padding: 20,
              overflow: 'auto',
            }}
          >
            <div
              style={{
                color: colors.fg,
                fontSize: 16,
                fontFamily: fonts.heading,
                fontWeight: 700,
                letterSpacing: 6,
                marginBottom: 30,
              }}
            >
              ✦ THE END ✦
            </div>
            <div
              style={{
                color: alpha(0.6),
                fontSize: 10,
                lineHeight: 2,
                marginBottom: 30,
                textAlign: 'center' as const,
                fontFamily: fonts.body,
                fontWeight: 300,
              }}
            >
              <div style={{ color: colors.accent, marginBottom: 12, fontWeight: 500 }}>
                STORY COMPLETE
              </div>
              <div>Created by — Ali Sher</div>
              <div style={{ marginTop: 8, color: alpha(0.3), fontSize: 11 }}>
                Built with React · TypeScript · Vite
              </div>
              <div
                style={{
                  marginTop: 16,
                  color: alpha(0.4),
                  fontSize: 11,
                  fontStyle: 'italic',
                }}
              >
                "Every line of code brought you home."
              </div>
            </div>
            <button
              onClick={() => {
                setShowEndingScene(true)
                setScreen('start')
              }}
              style={{
                background: 'transparent',
                border: `1px solid ${alpha(0.3)}`,
                color: colors.fg,
                fontFamily: fonts.body,
                fontWeight: 500,
                fontSize: 10,
                padding: '12px 24px',
                cursor: 'pointer',
                borderRadius: radius.sm,
              }}
            >
              ◀ BACK TO MENU
            </button>
          </div>
        )}

        {screen === 'gameover' && (
          <Suspense fallback={<LoadingScreen />}>
            <GameOverScreen
              score={finalScore}
              highScore={highScore}
              onRestart={handleRestart}
              badges={finalBadges}
              levelMode={!!activeLevelRef.current}
              levelName={activeLevelRef.current?.name}
              onRetryLevel={handleRetryLevel}
              onBackToLevels={() => {
                void getLevelProgress().then(goToLevelSelectWithProgress)
              }}
              playerRank={playerRank}
              playerName={profile?.player_name}
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
