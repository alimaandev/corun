import { lazy, Suspense, Ref } from 'react'
import type { SideRunScreenHandle } from '../game/SideRunScreen'
const SideRunScreen = lazy(() => import('../game/SideRunScreen'))
const ChallengeModal = lazy(() => import('../components/ChallengeModal'))
const HUD = lazy(() => import('../components/HUD'))
import { Challenge, HUDData, Difficulty, Topic } from '../game/types'
import { Mode } from '../features/modes'
import { useBossBattle } from '../features/boss/useBossBattle'
import { colors, fonts, alpha } from '../lib/theme'

interface Props {
  gameRef: Ref<SideRunScreenHandle>
  topic?: Topic
  difficulty: Difficulty
  currentChallenge: Challenge | null
  timeLimit: number
  mode: Mode
  hudData: HUDData
  onChallenge: (challenge: Challenge) => void
  onGameOver: (score: number) => void
  onHUDUpdate: (data: HUDData) => void
  onAnswer: (index: number) => void
  onTimeout: () => void
  onReady?: () => void
  boss: ReturnType<typeof useBossBattle>['boss']
  speedRunTime?: number
  survivalLives?: number
  showCombo: boolean
  comboText: string
  bonusTimeLeft?: number
}

export default function GameRunView({
  gameRef,
  topic,
  difficulty,
  currentChallenge,
  timeLimit,
  mode,
  hudData,
  onChallenge,
  onGameOver,
  onHUDUpdate,
  onAnswer,
  onTimeout,
  onReady,
  boss,
  speedRunTime,
  survivalLives,
  showCombo,
  comboText,
  bonusTimeLeft,
}: Props) {
  return (
    <>
      <Suspense fallback={null}>
        <SideRunScreen
          ref={gameRef}
          topic={topic}
          difficulty={difficulty}
          challengeActive={!!currentChallenge}
          onChallenge={onChallenge}
          onGameOver={onGameOver}
          onHUDUpdate={onHUDUpdate}
          onReady={onReady}
        />
      </Suspense>

      <Suspense fallback={null}>
        <HUD {...hudData} speedRunTime={speedRunTime} survivalLives={survivalLives} />
      </Suspense>

      {currentChallenge && (
        <Suspense fallback={null}>
          <ChallengeModal
            challenge={currentChallenge}
            timeLimit={timeLimit}
            onAnswer={onAnswer}
            onTimeout={onTimeout}
            isBoss={mode === 'boss'}
            isBonus={mode === 'bonus'}
          />
        </Suspense>
      )}

      {boss && (
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
              fontSize: 14,
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
                width: `${(boss.hp / boss.maxHp) * 100}%`,
                height: '100%',
                background: colors.accent,
                transition: 'width 0.3s',
              }}
            />
          </div>
          <div
            style={{
              color: alpha(0.5),
              fontSize: 13,
              fontFamily: fonts.mono,
              marginTop: 3,
              letterSpacing: 1,
            }}
          >
            {boss.hp}/{boss.maxHp} HP
          </div>
        </div>
      )}

      {mode === 'bonus' && bonusTimeLeft !== undefined && (
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
              fontSize: 13,
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
              fontSize: 13,
              fontFamily: fonts.mono,
              marginTop: 4,
              letterSpacing: 1,
            }}
          >
            {Math.ceil(bonusTimeLeft)}s LEFT
          </div>
        </div>
      )}

      {showCombo && (
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
          {comboText}
        </div>
      )}
    </>
  )
}
