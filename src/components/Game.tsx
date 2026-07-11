import { useState, useRef, useCallback, useEffect } from 'react'
import PixelRunner, { PixelRunnerHandle } from '../game/PixelRunner'
import ChallengeModal from './ChallengeModal'
import HUD from './HUD'
import StartScreen from './StartScreen'
import GameOverScreen from './GameOverScreen'
import PixelBackground from './PixelBackground'
import LevelSelect from './LevelSelect'
import SceneCanvas from './SceneCanvas'
import SceneEngine from './SceneEngine'
import { Challenge, HUDData, Difficulty, Topic, LevelConfig, LevelProgress } from '../game/types'
import { getRandomChallenge, getDailyChallenge, markDailyCompleted, addToLeaderboard } from '../game/challenges'
import { ALL_LEVELS, ENDING_SCENE, getLevelProgress, saveLevelProgress } from '../game/levels'
import { saveClip, downloadClip, getAllClips, deleteClip } from '../game/clips'

type Screen = 'start' | 'playing' | 'gameover' | 'levelselect' | 'levelintro' | 'leveloutro' | 'ending'
type Mode = 'normal' | 'boss' | 'bonus'

interface BossState {
  hp: number
  maxHp: number
  name: string
  questionsLeft: number
  correctCount: number
}

interface Badge {
  topic: Topic
  label: string
  count: number
}

const BOSS_THRESHOLD = 150
const BONUS_THRESHOLD = 80
const BONUS_DURATION = 5
const COMBO_MULTIPLIERS = [0, 0, 0, 1.5, 1.5, 2, 2, 3, 3, 4]
const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard']

const BOSS_NAMES = [
  { name: 'SYNTAX ERROR', hp: 3 },
  { name: 'NULL POINTER', hp: 3 },
  { name: 'INFINITE LOOP', hp: 4 },
  { name: 'MEMORY LEAK', hp: 3 },
  { name: 'DEADLOCK', hp: 4 },
  { name: 'RUNTIME ERROR', hp: 3 },
]

function getTimeLimit(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':   return 4
    case 'medium': return 6
    case 'hard':   return 8
  }
}

function getComboMultiplier(streak: number): number {
  if (streak >= 10) return 4
  return COMBO_MULTIPLIERS[streak] ?? 1
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export default function Game() {
  const [screen, setScreen] = useState<Screen>('start')
  const [hudData, setHudData] = useState<HUDData>({ score: 0, gap: 70, speed: 1, streak: 0 })
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [timeLimit, setTimeLimit] = useState(5)
  const [mode, setMode] = useState<Mode>('normal')
  const [boss, setBoss] = useState<BossState | null>(null)
  const [bonusTimeLeft, setBonusTimeLeft] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const [comboText, setComboText] = useState('')
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('coderun_highscore') || '0', 10) }
    catch { return 0 }
  })
  const [finalScore, setFinalScore] = useState(0)
  const [finalBadges, setFinalBadges] = useState<Badge[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')
  const [recording, setRecording] = useState(false)
  const [clipBlob, setClipBlob] = useState<Blob | null>(null)
  const [savedClips, setSavedClips] = useState<{id: number; url: string; score: number; date: string}[]>([])

  // Level state
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null)
  const [levelProgress, setLevelProgressState] = useState<LevelProgress>(getLevelProgress)
  const [finalStars, setFinalStars] = useState(0)

  const gameRef = useRef<PixelRunnerHandle>(null)
  const challengeRef = useRef(false)
  const lastBossScore = useRef(0)
  const lastBonusScore = useRef(0)
  const recentCorrect = useRef<boolean[]>([])
  const topicCounts = useRef<Record<string, number>>({})
  const earnedBadges = useRef<Set<string>>(new Set())
  const modeRef = useRef<Mode>('normal')
  const bossRef = useRef<BossState | null>(null)
  const bonusTimerRef = useRef<number>(0)
  const bonusQuestionsRef = useRef(0)
  const bonusTimeLeftRef = useRef(0)
  const comboTimeoutRef = useRef<number>(0)
  const dailyTimeoutRef = useRef<number>(0)
  const streakRef = useRef(0)
  const isDailyRef = useRef(false)
  // Level refs
  const activeLevelRef = useRef<LevelConfig | null>(null)
  const isLevelBossRef = useRef(false)
  const levelTargetReached = useRef(false)
  const hudDataRef = useRef<HUDData>(hudData)

  useEffect(() => { hudDataRef.current = hudData }, [hudData])

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

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    activeLevelRef.current = level
    setActiveLevel(level)
    setScreen('levelintro')
  }, [])

  const handleStoryDone = useCallback(() => {
    const level = activeLevelRef.current
    if (!level) { setScreen('levelselect'); return }
    isLevelBossRef.current = false
    levelTargetReached.current = false
    setScreen('playing')
    setHudData({ score: 0, gap: 70, speed: 1, streak: 0 })
    setCurrentChallenge(null)
    setMode('normal')
    setBoss(null)
    setBonusTimeLeft(0)
    setShowCombo(false)
    setComboText('')
    setRecording(false)
    setClipBlob(null)
    setSavedClips([])
    setFinalScore(0)
    setFinalBadges([])
    challengeRef.current = false
    lastBossScore.current = 0
    lastBonusScore.current = 0
    recentCorrect.current = []
    topicCounts.current = {}
    earnedBadges.current = new Set()
    modeRef.current = 'normal'
    bossRef.current = null
    streakRef.current = 0
    isDailyRef.current = false
    clearTimeout(bonusTimerRef.current)
    clearTimeout(comboTimeoutRef.current)
  }, [])

  const handleLevelComplete = useCallback((correctCount?: number) => {
    const level = activeLevelRef.current
    if (!level) return
    let stars = 3
    if (correctCount !== undefined) {
      const gap = hudDataRef.current.gap
      const gapPct = (gap / 70) * 100
      if (gapPct > 60) stars = 3
      else if (gapPct > 30) stars = 2
      else stars = 1
    }
    const progress = getLevelProgress()
    if (!progress.completed.includes(level.id)) progress.completed.push(level.id)
    progress.stars[String(level.id)] = Math.max(progress.stars[String(level.id)] || 0, stars)
    if (level.id >= progress.unlockedUpTo) progress.unlockedUpTo = level.id + 1
    saveLevelProgress(progress)
    setLevelProgressState(progress)
    setFinalStars(stars)
    setScreen('leveloutro')
  }, [])

  const [showEndingScene, setShowEndingScene] = useState(true)

  const handleOutroDone = useCallback(() => {
    const isLast = activeLevelRef.current?.id === ALL_LEVELS.length
    if (isLast) { setShowEndingScene(true); setScreen('ending') }
    else goToLevelSelectWithProgress(getLevelProgress())
  }, [goToLevelSelectWithProgress])

  const handleEndingDone = useCallback(() => {
    setShowEndingScene(false)
  }, [])

  const handleStart = useCallback((topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => {
    setSelectedTopic(topic)
    setSelectedDifficulty(difficulty)
    setScreen('playing')
    setHudData({ score: 0, gap: 70, speed: 1, streak: 0 })
    setCurrentChallenge(null)
    setMode('normal')
    setBoss(null)
    setBonusTimeLeft(0)
    setShowCombo(false)
    setComboText('')
    setRecording(false)
    setClipBlob(null)
    setSavedClips([])
    challengeRef.current = false
    lastBossScore.current = 0
    lastBonusScore.current = 0
    recentCorrect.current = []
    topicCounts.current = {}
    earnedBadges.current = new Set()
    modeRef.current = 'normal'
    bossRef.current = null
    streakRef.current = 0
    clearTimeout(bonusTimerRef.current)
    clearTimeout(comboTimeoutRef.current)
    if (isDaily) {
      isDailyRef.current = true
      const dc = getDailyChallenge()
      dailyTimeoutRef.current = window.setTimeout(() => {
        challengeRef.current = true
        setCurrentChallenge(dc)
        setTimeLimit(8)
      }, 200)
    } else {
      isDailyRef.current = false
    }
  }, [])

  function getAdaptiveDifficulty(base: Difficulty): Difficulty | undefined {
    const recent = recentCorrect.current
    if (recent.length >= 3) {
      const last3 = recent.slice(-3)
      const allCorrect = last3.every(r => r)
      const allWrong = last3.every(r => !r)
      const baseIdx = DIFFICULTY_ORDER.indexOf(base)
      if (allCorrect && baseIdx < DIFFICULTY_ORDER.length - 1) return DIFFICULTY_ORDER[baseIdx + 1]
      if (allWrong && baseIdx > 0) return DIFFICULTY_ORDER[baseIdx - 1]
    }
    return undefined
  }

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

  function showComboNotification(level: number) {
    clearTimeout(comboTimeoutRef.current)
    const texts = ['', '', '', '🔥 COMBO x1.5', '', '🔥🔥 COMBO x2', '', '🔥🔥🔥 COMBO x3', '', '🔥🔥🔥🔥 COMBO x4']
    setComboText(texts[level] || '')
    setShowCombo(true)
    comboTimeoutRef.current = window.setTimeout(() => setShowCombo(false), 1200)
  }

  function triggerBossBattle() {
    const b = pick(BOSS_NAMES)
    const bs: BossState = { hp: b.hp, maxHp: b.hp, name: b.name, questionsLeft: b.hp, correctCount: 0 }
    bossRef.current = bs
    setBoss(bs)
    modeRef.current = 'boss'
    setMode('boss')
    gameRef.current?.setPaused(true)
    scheduleBossQuestion(bs)
  }

  function triggerLevelBoss() {
    const lev = activeLevelRef.current
    if (!lev) { triggerBossBattle(); return }
    isLevelBossRef.current = true
    const bossCfg = lev.boss
    const bs: BossState = { hp: bossCfg.hp, maxHp: bossCfg.hp, name: bossCfg.name, questionsLeft: bossCfg.hp, correctCount: 0 }
    bossRef.current = bs
    setBoss(bs)
    modeRef.current = 'boss'
    setMode('boss')
    gameRef.current?.setPaused(true)
    scheduleBossQuestion(bs)
  }

  async function scheduleBossQuestion(bs: BossState) {
    if (bs.questionsLeft <= 0) return finishBossBattle(bs)
    const diff = activeLevelRef.current?.boss.difficulty ?? 'hard'
    const q = await getRandomChallenge(new Set(), selectedTopic ?? undefined, diff)
    setCurrentChallenge(q)
    setTimeLimit(getTimeLimit(diff))
    challengeRef.current = true
  }

  async function handleBossAnswer(correct: boolean) {
    const bs = bossRef.current
    if (!bs) return
    if (correct) { bs.hp--; bs.correctCount++ }
    bs.questionsLeft--
    if (bs.questionsLeft <= 0) { finishBossBattle(bs); return }
    setBoss({ ...bs })
    const diff = activeLevelRef.current?.boss.difficulty ?? 'hard'
    const q = await getRandomChallenge(new Set(), selectedTopic ?? undefined, diff)
    setCurrentChallenge(q)
    setTimeLimit(getTimeLimit(diff))
    challengeRef.current = true
  }

  function finishBossBattle(bs: BossState) {
    bossRef.current = null
    setBoss(null)
    modeRef.current = 'normal'
    setMode('normal')
    gameRef.current?.setPaused(false)
    gameRef.current?.setMultiplier(1)

    if (isLevelBossRef.current) {
      isLevelBossRef.current = false
      handleLevelComplete(bs.correctCount)
      return
    }

    for (let i = 0; i < bs.correctCount; i++) {
      gameRef.current?.handleAnswer(true)
    }
  }

  function triggerBonusRound() {
    modeRef.current = 'bonus'
    setMode('bonus')
    bonusTimeLeftRef.current = BONUS_DURATION
    setBonusTimeLeft(BONUS_DURATION)
    bonusQuestionsRef.current = 0
    gameRef.current?.setPaused(true)
    gameRef.current?.setMultiplier(2)
    scheduleBonusQuestion()
  }

  async function scheduleBonusQuestion() {
    const q = await getRandomChallenge(new Set(), selectedTopic ?? undefined, 'easy')
    setCurrentChallenge(q)
    setTimeLimit(BONUS_DURATION - (bonusQuestionsRef.current * 0.3))
    challengeRef.current = true
  }

  async function handleBonusAnswer(correct: boolean) {
    if (correct) bonusQuestionsRef.current++
    if (bonusTimeLeftRef.current <= 0 || bonusQuestionsRef.current >= 6) { finishBonusRound(); return }
    const q = await getRandomChallenge(new Set(), selectedTopic ?? undefined, 'easy')
    setCurrentChallenge(q)
    setTimeLimit(Math.max(2, bonusTimeLeftRef.current - 0.5))
    challengeRef.current = true
  }

  function finishBonusRound() {
    clearInterval(bonusTimerRef.current)
    modeRef.current = 'normal'
    setMode('normal')
    setBonusTimeLeft(0)
    gameRef.current?.setMultiplier(1)
    gameRef.current?.setPaused(false)
  }

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!currentChallenge) return
    const correct = answerIndex === currentChallenge.correct

    if (modeRef.current === 'boss') { handleBossAnswer(correct); finishChallenge(); return }
    if (modeRef.current === 'bonus') { handleBonusAnswer(correct); finishChallenge(); return }

    gameRef.current?.handleAnswer(correct)
    recentCorrect.current.push(correct)
    if (recentCorrect.current.length > 6) recentCorrect.current.shift()
    const adaptDiff = getAdaptiveDifficulty(selectedDifficulty)
    gameRef.current?.setPreferredDifficulty(adaptDiff)

    const topic = currentChallenge.topic
    if (correct) {
      topicCounts.current[topic] = (topicCounts.current[topic] || 0) + 1
      if (topicCounts.current[topic] >= 5 && !earnedBadges.current.has(topic)) {
        earnedBadges.current.add(topic)
      }
    }

    streakRef.current = correct ? streakRef.current + 1 : 0
    const mult = getComboMultiplier(streakRef.current)
    gameRef.current?.setMultiplier(mult)
    if (mult >= 1.5 && correct) showComboNotification(streakRef.current)

    finishChallenge()
  }, [currentChallenge, selectedDifficulty, finishChallenge])

  const handleTimeout = useCallback(() => {
    if (modeRef.current === 'boss') { handleBossAnswer(false); finishChallenge(); return }
    if (modeRef.current === 'bonus') { handleBonusAnswer(false); finishChallenge(); return }
    gameRef.current?.handleTimeout()
    recentCorrect.current.push(false)
    if (recentCorrect.current.length > 6) recentCorrect.current.shift()
    const adaptDiff = getAdaptiveDifficulty(selectedDifficulty)
    gameRef.current?.setPreferredDifficulty(adaptDiff)
    gameRef.current?.setMultiplier(1)
    finishChallenge()
  }, [finishChallenge])

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score)
    setFinalBadges(Array.from(earnedBadges.current).map(t => ({
      topic: t as Topic,
      label: t,
      count: topicCounts.current[t] || 0,
    })))
    setScreen('gameover')
    challengeRef.current = false
    setCurrentChallenge(null)
    clearTimeout(bonusTimerRef.current)
    clearTimeout(comboTimeoutRef.current)
    setHighScore(prev => {
      const nh = Math.max(prev, score)
      if (nh > prev) { try { localStorage.setItem('coderun_highscore', String(nh)) } catch {} }
      return nh
    })
    if (score > 0) addToLeaderboard(Math.floor(score))
    if (isDailyRef.current && score > 0) markDailyCompleted()
    getAllClips().then(clips => {
      setSavedClips(clips.map(c => ({ id: c.id!, url: c.url!, score: c.score, date: c.date })))
    })
  }, [])

  const handleRestart = useCallback(() => {
    setScreen('start')
    setFinalScore(0)
    setClipBlob(null)
    setRecording(false)
    challengeRef.current = false
    clearTimeout(bonusTimerRef.current)
    clearTimeout(comboTimeoutRef.current)
    clearTimeout(dailyTimeoutRef.current)
  }, [])

  const handleRetryLevel = useCallback(() => {
    const level = activeLevelRef.current
    if (level) handleSelectLevel(level)
  }, [handleSelectLevel])

  useEffect(() => {
    return () => {
      clearTimeout(bonusTimerRef.current)
      clearTimeout(comboTimeoutRef.current)
      clearTimeout(dailyTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (mode !== 'bonus') return
    bonusTimeLeftRef.current = BONUS_DURATION
    const id = window.setInterval(() => {
      bonusTimeLeftRef.current = Math.max(0, bonusTimeLeftRef.current - 0.3)
      setBonusTimeLeft(bonusTimeLeftRef.current)
      if (bonusTimeLeftRef.current <= 0) finishBonusRound()
    }, 300)
    bonusTimerRef.current = id
    return () => { clearInterval(id); bonusTimerRef.current = 0 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    if (screen !== 'playing' || hudData.score <= 0) return
    if (mode !== 'normal') return

    if (activeLevel && !levelTargetReached.current && hudData.score >= activeLevel.scoreTarget) {
      levelTargetReached.current = true
      triggerLevelBoss()
      return
    }

    if (hudData.score - lastBossScore.current >= BOSS_THRESHOLD) {
      lastBossScore.current = hudData.score
      triggerBossBattle()
      return
    }

    if (hudData.score - lastBonusScore.current >= BONUS_THRESHOLD) {
      lastBonusScore.current = hudData.score
      triggerBonusRound()
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hudData.score, screen, mode])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (screen === 'start') handleStart(null, 'medium')
        else if (screen === 'gameover') {
          const level = activeLevelRef.current
          if (level) handleRetryLevel()
          else handleRestart()
        }
        else if (screen === 'levelintro') handleStoryDone()
        else if (screen === 'leveloutro') handleOutroDone()
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
  }, [screen, handleStart, handleRestart, handleRetryLevel, handleStoryDone, handleOutroDone, currentChallenge, handleAnswer])

  function renderBossBar() {
    if (!boss) return null
    const pct = (boss.hp / boss.maxHp) * 100
    return (
      <div style={{
        position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
        zIndex: 90, textAlign: 'center', width: '90%', maxWidth: 400,
      }}>
        <div style={{
          color: '#F44336', fontSize: 12, fontFamily: "'Press Start 2P', monospace",
          letterSpacing: 2, marginBottom: 6,
        }}>
          ⚔ {boss.name}
        </div>
        <div style={{
          height: 8, background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(244,67,54,0.3)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: pct > 50 ? '#F44336' : pct > 25 ? '#FFA000' : '#fff',
            transition: 'width 0.3s',
          }} />
        </div>
        <div style={{
          color: '#888', fontSize: 8, fontFamily: "'Press Start 2P', monospace",
          marginTop: 3, letterSpacing: 1,
        }}>
          {boss.hp}/{boss.maxHp} HP
        </div>
      </div>
    )
  }

  function renderBonusTimer() {
    if (mode !== 'bonus') return null
    return (
      <div style={{
        position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
        zIndex: 90, textAlign: 'center',
      }}>
        <div style={{
          color: '#FFD700', fontSize: 10, fontFamily: "'Press Start 2P', monospace",
          letterSpacing: 2,
        }}>
          ⚡ BONUS ROUND x2 ⚡
        </div>
        <div style={{
          color: '#ccc', fontSize: 9, fontFamily: "'Press Start 2P', monospace",
          marginTop: 4, letterSpacing: 1,
        }}>
          {Math.ceil(bonusTimeLeft)}s LEFT
        </div>
      </div>
    )
  }

  function renderComboNotification() {
    if (!showCombo) return null
    return (
      <div style={{
        position: 'fixed', top: '45%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 150, pointerEvents: 'none',
        color: '#FFD700', fontSize: 18,
        fontFamily: "'Press Start 2P', monospace",
        textShadow: '0 0 20px rgba(255,215,0,0.5)',
        animation: 'fadeIn 0.3s ease-out',
      }}>
        {comboText}
      </div>
    )
  }

  return (
    <div style={styles.root}>
      {screen === 'playing' && !activeLevel && (
        <PixelRunner
          ref={gameRef}
          topic={selectedTopic ?? undefined}
          difficulty={selectedDifficulty}
          themeId={activeLevel?.id}
          onChallenge={handleChallenge}
          onGameOver={handleGameOver}
          onHUDUpdate={setHudData}
        />
      )}

      {screen === 'playing' && activeLevel && (
        <SceneEngine
          levelId={activeLevel.id}
          onComplete={handleLevelComplete}
        />
      )}

      {screen === 'playing' && (
        <button className="rec-btn"
          onClick={() => {
            if (gameRef.current?.isRecording()) {
              gameRef.current.stopRecording().then(blob => {
                if (blob) {
                  downloadClip(blob, hudData.score)
                  saveClip(blob, hudData.score)
                  setClipBlob(blob)
                }
              })
              setRecording(false)
            } else {
              gameRef.current?.startRecording()
              setRecording(true)
            }
          }}
          style={{
            position: 'fixed', bottom: 16, right: 16, zIndex: 100,
            padding: '6px 12px', fontSize: 9,
            fontFamily: "'Press Start 2P', monospace",
            border: `3px solid ${recording ? '#F44336' : '#555'}`,
            background: recording ? '#3a1111' : '#111',
            color: recording ? '#F44336' : '#888',
            cursor: 'pointer',
          }}
        >
          {recording ? '● STOP' : '○ REC'}
        </button>
      )}

      {screen === 'playing' && (
        <HUD {...hudData} isBoss={mode === 'boss'} isBonus={mode === 'bonus'} levelName={activeLevel?.name} />
      )}

      {screen === 'playing' && currentChallenge && (
        <ChallengeModal
          challenge={currentChallenge}
          timeLimit={timeLimit}
          onAnswer={handleAnswer}
          onTimeout={handleTimeout}
          isBoss={mode === 'boss'}
          isBonus={mode === 'bonus'}
        />
      )}

      {screen === 'playing' && renderBossBar()}
      {screen === 'playing' && renderBonusTimer()}
      {renderComboNotification()}

      {screen === 'start' && (
        <>
          <PixelBackground />
          <StartScreen highScore={highScore} onStart={handleStart} onStoryMode={goToLevelSelect} />
        </>
      )}

      {screen === 'levelselect' && (
        <LevelSelect onSelectLevel={handleSelectLevel} onBack={() => setScreen('start')} />
      )}

      {screen === 'levelintro' && activeLevel?.sceneIntro && (
        <SceneCanvas scene={activeLevel.sceneIntro} onDone={handleStoryDone} />
      )}

      {screen === 'leveloutro' && activeLevel?.sceneOutro && (
        <SceneCanvas scene={activeLevel.sceneOutro} onDone={handleOutroDone} />
      )}

      {screen === 'ending' && showEndingScene && (
        <SceneCanvas scene={ENDING_SCENE} onDone={handleEndingDone} />
      )}

      {screen === 'ending' && !showEndingScene && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: '#0a0a1a', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 300,
          fontFamily: "'Press Start 2P', monospace",
          padding: 20, overflow: 'auto',
        }}>
          <div style={{
            color: '#FFD700', fontSize: 14,
            textShadow: '0 0 20px rgba(255,215,0,0.5)',
            marginBottom: 30,
          }}>
            ✦ THE END ✦
          </div>
          <div style={{
            color: '#aaa', fontSize: 10, lineHeight: 2, marginBottom: 30,
            textAlign: 'center' as const,
          }}>
            <div style={{ color: '#4FC3F7', marginBottom: 12 }}>STORY COMPLETE</div>
            <div>Created by — Ali Sher</div>
            <div style={{ marginTop: 8, color: '#666', fontSize: 8 }}>
              Built with React · TypeScript · Vite
            </div>
            <div style={{ marginTop: 16, color: '#888', fontSize: 9 }}>
              "Every line of code brought you home."
            </div>
          </div>
          <button
            onClick={() => { setShowEndingScene(true); setScreen('start') }}
            style={{
              background: '#0a1a2a', border: '2px solid #4FC3F7',
              color: '#4FC3F7', fontFamily: "'Press Start 2P', monospace",
              fontSize: 10, padding: '12px 24px', cursor: 'pointer',
            }}
          >
            ◀ BACK TO MENU
          </button>
        </div>
      )}

      {screen === 'gameover' && (
        <>
          <PixelBackground />
          <GameOverScreen
            score={finalScore}
            highScore={highScore}
            onRestart={handleRestart}
            badges={finalBadges}
            clipBlob={clipBlob}
            savedClips={savedClips}
            onDeleteClip={(id) => {
              deleteClip(id)
              setSavedClips(prev => prev.filter(c => c.id !== id))
            }}
            levelMode={!!activeLevelRef.current}
            levelName={activeLevelRef.current?.name}
            onRetryLevel={handleRetryLevel}
            onBackToLevels={() => goToLevelSelectWithProgress(getLevelProgress())}
          />
        </>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
}
