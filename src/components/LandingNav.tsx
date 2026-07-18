interface Props {
  sections: string[]
  currentSection: number
  onNavigate?: (idx: number) => void
}

const labels: Record<string, string> = {
  hero: 'CORUN',
  story: 'STORY',
  modes: 'MODES',
  arcs: 'ARCS',
}

export default function LandingNav({ sections, currentSection, onNavigate }: Props) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 32px',
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(118,152,38,0.15)',
    }}>
      <span style={{
        fontSize: 13, fontWeight: 800, letterSpacing: 2,
        color: '#F0EBE3',
        textShadow: '0 0 20px rgba(240,235,227,0.3)',
              fontFamily: "'Poppins', sans-serif",
      }}>
        CORUN
      </span>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {sections.map((s, i) => (
          <button
            key={s}
            onClick={() => onNavigate?.(i)}
            style={{
              background: 'none',
              border: 'none',
              color: currentSection === i ? '#F0EBE3' : 'rgba(255,255,255,0.7)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 2,
              cursor: 'pointer',
              padding: '4px 0',
              position: 'relative',
        fontFamily: "'Roboto', sans-serif",
              transition: 'color 0.3s ease',
            }}
          >
            {labels[s] || s.toUpperCase()}
            {currentSection === i && (
              <div style={{
                position: 'absolute', bottom: -2, left: 0, right: 0,
                height: 2, background: '#F0EBE3', borderRadius: 1,
              }} />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
