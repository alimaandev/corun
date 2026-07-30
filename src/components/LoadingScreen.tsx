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
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F0EBE3',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: '2px solid rgba(240,235,227,0.15)',
          borderTopColor: '#F0EBE3',
          borderRadius: '50%',
          animation: 'lspin 0.8s linear infinite',
        }}
      />
      <div style={{ fontSize: 10, letterSpacing: 3, opacity: 0.4 }}>LOADING</div>
      <div
        style={{
          fontSize: 9,
          color: 'rgba(240,235,227,0.25)',
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
