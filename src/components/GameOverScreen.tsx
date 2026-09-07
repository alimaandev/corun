import Backdrop from '../ui/Backdrop'
import { GlassButton } from '../ui/primitives'
import { colors, fonts, alpha, fontSizes } from '../lib/theme'

interface Props {
  score: number
  isNewHighScore: boolean
  playerRank: number | null
  badges?: { topic: string; label: string; count: number }[]
  onRestart?: () => void
}

export default function GameOverScreen({
  score,
  isNewHighScore,
  playerRank,
  badges = [],
  onRestart,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        color: colors.fg,
        fontFamily: fonts.body,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Backdrop tint="rgba(255,45,120,0.07)" />

      <div
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          textAlign: 'center',
          padding: 24,
          animation: 'fadeIn 0.4s ease-out',
        }}
      >
        <div
          style={{
            fontSize: fontSizes.sm,
            color: alpha(0.5),
            letterSpacing: 6,
            fontFamily: fonts.heading,
            fontWeight: 600,
          }}
        >
          GAME OVER
        </div>
        <div
          style={{
            fontSize: fontSizes.md,
            color: alpha(0.55),
            fontFamily: fonts.body,
            fontWeight: 300,
          }}
        >
          YOUR RUN ENDED HERE
        </div>
        <div
          style={{
            fontSize: fontSizes.display,
            color: colors.fg,
            fontFamily: fonts.mono,
            fontWeight: 700,
            lineHeight: 1,
            marginTop: 4,
            textShadow: `0 0 40px ${alpha(0.25)}`,
          }}
        >
          {score.toLocaleString()}
        </div>

        {isNewHighScore && (
          <div
            style={{
              fontSize: fontSizes.sm,
              color: colors.gold,
              letterSpacing: 3,
              fontFamily: fonts.heading,
              fontWeight: 600,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            ★ NEW HIGH SCORE ★
          </div>
        )}
        {playerRank !== null && playerRank > 0 && (
          <div
            style={{
              fontSize: fontSizes.sm,
              color: colors.accentBright,
              letterSpacing: 2,
              fontFamily: fonts.body,
              fontWeight: 600,
            }}
          >
            RANK: #{playerRank}
          </div>
        )}

        {badges.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 8,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {badges.slice(0, 4).map((b) => (
              <span
                key={b.topic}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${alpha(0.2)}`,
                  borderRadius: 20,
                  fontSize: fontSizes.xs,
                  fontFamily: fonts.heading,
                  color: alpha(0.8),
                  letterSpacing: 1,
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                {b.topic}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <GlassButton variant="primary" size="lg" onClick={onRestart}>
            PLAY AGAIN
          </GlassButton>
        </div>

        <div style={{ fontSize: fontSizes.xs, color: alpha(0.4) }}>PRESS ENTER</div>
      </div>

      <a
        href="https://github.com/alimaandev/corun"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          color: alpha(0.25),
          textDecoration: 'none',
          fontFamily: fonts.body,
          fontSize: fontSizes.xs,
          letterSpacing: 1,
        }}
      >
        ★ STAR ON GITHUB
      </a>
    </div>
  )
}
