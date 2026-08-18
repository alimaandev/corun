import { colors, fonts, alpha } from '../lib/theme'

const TIPS = [
  'Write real JavaScript, not pseudo-code',
  'Every level has a unique procedural soundtrack',
  'The monster adapts to your skill level',
  'You can create and share your own puzzles',
  'Speed Run mode: 60 seconds. Go.',
  'Survival mode: 3 lives. Make them count',
]

export default function LoadingScreen() {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        background: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        fontFamily: fonts.mono,
        color: colors.fg,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: `2px solid ${alpha(0.15)}`,
          borderTopColor: colors.fg,
          borderRadius: '50%',
          animation: 'lspin 0.8s linear infinite',
        }}
      />
      <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.4 }}>LOADING</div>
      <div
        style={{
          fontSize: 13,
          color: alpha(0.25),
          maxWidth: 300,
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        {tip}
      </div>
      <style>{`
        @keyframes lspin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
