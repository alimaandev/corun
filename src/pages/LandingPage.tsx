import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingNav from '../components/LandingNav'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const ARCS = [
  { id: 'escape', label: 'SHIBUYA', sub: 'Arc I — Escape', desc: 'Sprint through Shibuya crossing. Alleyways, rooftop chases, and the subway tunnels await.' },
  { id: 'journey', label: 'ASAKUSA', sub: 'Arc II — The Journey', desc: 'Cross through Asakusa. Temple grounds, market stalls, and the Sumida river stand between you and safety.' },
  { id: 'castle', label: 'THE PALACE', sub: 'Arc III — The Castle', desc: 'Reach the Imperial Palace. Elite guards, a cursed captain, and the source of the monster await.' },
]

const MODES = [
  { id: 'story', label: 'STORY MODE', desc: 'Explore 9 levels across 3 arcs. Solve coding puzzles, evade the monster, and escape.' },
  { id: 'endless', label: 'ENDLESS RUNNER', desc: 'Run forever through Tokyo. Answer challenges to keep the monster at bay. How far can you go?' },
  { id: 'daily', label: 'DAILY CHALLENGE', desc: 'One challenge per day. Compete on the global leaderboard for the highest rank.' },
]

const glassPanel: React.CSSProperties = {
  background: 'rgba(0,0,0,0.25)',
  border: '1px solid rgba(118,152,38,0.3)',
  borderRadius: 16,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  padding: 32,
}

const ctaStyle: React.CSSProperties = {
  background: '#F0EBE3',
  color: '#769826',
  border: 'none',
  padding: '14px 36px',
  borderRadius: 12,
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: 3,
  cursor: 'pointer',
  fontFamily: "'Roboto', sans-serif",
  transition: 'all 0.3s ease',
  boxShadow: '0 0 30px rgba(240,235,227,0.2)',
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { lenis, progressRef, sectionRef, sectionProgressRef, section, sections } = useScrollProgress()
  const { sectionStyle } = useScrollAnimation()

  const handleNavClick = useCallback((idx: number) => {
    const target = (idx / sections.length) * document.documentElement.scrollHeight
    lenis.current?.scrollTo(target, { duration: 1.5 })
  }, [lenis, sections.length])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <LandingNav sections={sections} currentSection={section} onNavigate={handleNavClick} />

      <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', ...sectionStyle(0, section, sectionProgressRef.current) }}>
            <h1 style={{
              fontSize: 96, letterSpacing: 4, color: '#F0EBE3',
              textShadow: '0 0 80px rgba(240,235,227,0.2), 0 4px 0 rgba(118,152,38,0.4)',
              marginBottom: 16, fontFamily: "'Poppins', sans-serif", fontWeight: 800, lineHeight: 1,
            }}>
              CORUN
            </h1>
            <p style={{
              fontSize: 10, color: '#F0EBE3', letterSpacing: 8,
              marginBottom: 48, fontWeight: 300, fontFamily: "'Roboto', sans-serif", opacity: 0.6,
            }}>
              ESCAPE THE MONSTER
            </p>
            <button
              style={{ ...ctaStyle, pointerEvents: 'auto' }}
              onClick={() => navigate('/sign-in')}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 50px rgba(240,235,227,0.4)'; e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(240,235,227,0.2)'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              START THE RUN
            </button>
          </div>
        </section>

        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', pointerEvents: 'none' }}>
          <div style={{ maxWidth: 600, textAlign: 'center', ...sectionStyle(1, section, sectionProgressRef.current) }}>
            <p style={{ fontSize: 9, color: '#F0EBE3', letterSpacing: 6, marginBottom: 16, fontFamily: "'Roboto', sans-serif", fontWeight: 300, opacity: 0.5 }}>
              THE STORY
            </p>
            <h2 style={{ fontSize: 32, color: '#FFFFFF', marginBottom: 24, fontWeight: 600, fontFamily: "'Poppins', sans-serif", letterSpacing: 1, lineHeight: 1.2 }}>
              Tokyo Streets.<br />A Monster. A Chase.
            </h2>
            <p style={{
              fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 2.2,
              marginBottom: 40, fontWeight: 300, fontFamily: "'Roboto', sans-serif",
            }}>
              You're running through the backstreets of Tokyo. The monster is always behind you.
              Code your way through neon alleys, quiet shrines, and bustling markets.
              Solve puzzles. Evade the monster. Escape.
            </p>
            <button
              style={{ ...ctaStyle, pointerEvents: 'auto', background: 'transparent', border: '2px solid rgba(240,235,227,0.3)', color: '#F0EBE3', boxShadow: 'none' }}
              onClick={() => navigate('/sign-in')}
            >
              START YOUR RUN
            </button>
          </div>
        </section>

        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', ...sectionStyle(2, section, sectionProgressRef.current) }}>
            <p style={{ fontSize: 9, color: '#F0EBE3', letterSpacing: 6, marginBottom: 32, fontFamily: "'Roboto', sans-serif", fontWeight: 300, opacity: 0.5 }}>
              GAME MODES
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16, maxWidth: 800, padding: 8,
            }}>
              {MODES.map(mode => (
                <div key={mode.id} style={{
                  ...glassPanel, padding: 28, textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.3s ease', pointerEvents: 'auto',
                }}>
                    <p style={{ fontSize: 9, color: '#F0EBE3', letterSpacing: 2, marginBottom: 10, fontFamily: "'Poppins', sans-serif", fontWeight: 700, opacity: 0.5 }}>
                      {mode.id === 'story' ? '01' : mode.id === 'endless' ? '02' : '03'}
                  </p>
                  <h3 style={{ fontSize: 12, color: '#FFFFFF', marginBottom: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", letterSpacing: 1 }}>
                    {mode.label}
                  </h3>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', lineHeight: 2, fontWeight: 300, fontFamily: "'Roboto', sans-serif" }}>
                    {mode.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', ...sectionStyle(3, section, sectionProgressRef.current) }}>
            <p style={{ fontSize: 9, color: '#F0EBE3', letterSpacing: 6, marginBottom: 32, fontFamily: "'Roboto', sans-serif", fontWeight: 300, opacity: 0.5 }}>
              THREE ARCS
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16, maxWidth: 800, padding: 8,
            }}>
              {ARCS.map(arc => (
                <div key={arc.id} style={{
                  ...glassPanel, padding: 28, textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.3s ease', pointerEvents: 'auto',
                }}>
                    <p style={{ fontSize: 9, color: '#769826', letterSpacing: 2, marginBottom: 10, fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
                      {arc.sub}
                  </p>
                  <h3 style={{ fontSize: 12, color: '#FFFFFF', marginBottom: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", letterSpacing: 1 }}>
                    {arc.label}
                  </h3>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', lineHeight: 2, fontWeight: 300, fontFamily: "'Roboto', sans-serif" }}>
                    {arc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer style={{
          padding: '40px 24px', textAlign: 'center',
          borderTop: '1px solid rgba(118,152,38,0.1)',
          pointerEvents: 'auto',
        }}>
          <div style={{ ...glassPanel, padding: 24, maxWidth: 400, margin: '0 auto' }}>
            <p style={{ fontSize: 10, color: '#FFFFFF', letterSpacing: 3, marginBottom: 12, fontFamily: "'Roboto', sans-serif", fontWeight: 300, opacity: 0.7 }}>
              READY TO RUN?
            </p>
            <button
              style={{ ...ctaStyle, padding: '10px 28px', fontSize: 9 }}
              onClick={() => navigate('/sign-in')}
            >
              PLAY NOW
            </button>
            <p style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', marginTop: 16, letterSpacing: 1, fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}>
              CORUN &copy; 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
