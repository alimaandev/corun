import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import LandingNav from '../components/LandingNav'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const MODES = [
  {
    id: 'freeplay',
    label: 'FREE PLAY',
    desc: 'Endless side-scrolling run. Answer coding challenges to survive hazards, trigger boss battles, and stack combo multipliers.',
  },
  {
    id: 'story',
    label: 'STORY MODE',
    desc: 'A four-node campaign — The Cell, The Vents, The Core... and the Warden himself. Solve his algorithms to break his core.',
  },
  {
    id: 'speedrun',
    label: 'SPEED RUN',
    desc: '60 seconds on the clock. Answer fast, answer right — wrong answers cost points.',
  },
  {
    id: 'survival',
    label: 'SURVIVAL',
    desc: 'Three lives. Every mistake costs one. The questions only get harder.',
  },
  {
    id: 'daily',
    label: 'DAILY CHALLENGE',
    desc: 'One seeded run per day. Compete on the global leaderboard for the highest rank.',
  },
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
  padding: '16px 40px',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 3,
  cursor: 'pointer',
  fontFamily: "'Roboto', sans-serif",
  transition: 'all 0.3s ease',
  boxShadow: '0 0 30px rgba(240,235,227,0.2)',
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { lenis, sectionProgressRef, section, sections } = useScrollProgress()
  const { sectionStyle } = useScrollAnimation()

  const handleNavClick = useCallback(
    (idx: number) => {
      const target = (idx / sections.length) * document.documentElement.scrollHeight
      lenis.current?.scrollTo(target, { duration: 1.5 })
    },
    [lenis, sections.length],
  )

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Helmet>
        <title>Corun — Escape the Monster</title>
        <meta
          name="description"
          content="Corun — a free open-source coding game. Story campaign, endless runner, speed run, survival, and daily challenge modes with JavaScript, Python and TypeScript puzzles."
        />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Corun",
            "description": "A free open-source coding adventure game. Solve JavaScript, Python and TypeScript challenges across story, endless, speed run, survival and daily modes.",
            "applicationCategory": "GameApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "author": { "@type": "Person", "name": "Ali Sher" }
          }
        `}</script>
      </Helmet>
      <LandingNav sections={sections} currentSection={section} onNavigate={handleNavClick} />

      <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{ textAlign: 'center', ...sectionStyle(0, section, sectionProgressRef.current) }}
          >
            <h1
              style={{
                fontSize: 96,
                letterSpacing: 4,
                color: '#F0EBE3',
                textShadow: '0 0 80px rgba(240,235,227,0.2), 0 4px 0 rgba(118,152,38,0.4)',
                marginBottom: 16,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              CORUN
            </h1>
            <p
              style={{
                fontSize: 14,
                color: '#F0EBE3',
                letterSpacing: 8,
                marginBottom: 48,
                fontWeight: 300,
                fontFamily: "'Roboto', sans-serif",
                opacity: 0.6,
              }}
            >
              ESCAPE THE MONSTER
            </p>
            <button
              style={{ ...ctaStyle, pointerEvents: 'auto' }}
              onClick={() => navigate('/game')}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 50px rgba(240,235,227,0.4)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(240,235,227,0.2)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              START THE RUN
            </button>
          </div>
        </section>

        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{ textAlign: 'center', ...sectionStyle(1, section, sectionProgressRef.current) }}
          >
            <p
              style={{
                fontSize: 14,
                color: '#F0EBE3',
                letterSpacing: 6,
                marginBottom: 32,
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300,
                opacity: 0.5,
              }}
            >
              GAME MODES
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
                maxWidth: 1000,
                padding: 8,
              }}
            >
              {MODES.map((mode, i) => (
                <div
                  key={mode.id}
                  style={{
                    ...glassPanel,
                    padding: 28,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    pointerEvents: 'auto',
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: '#F0EBE3',
                      letterSpacing: 2,
                      marginBottom: 10,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      opacity: 0.5,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3
                    style={{
                      fontSize: 17,
                      color: '#FFFFFF',
                      marginBottom: 12,
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: 1,
                    }}
                  >
                    {mode.label}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.8,
                      fontWeight: 300,
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {mode.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer
          style={{
            padding: '40px 24px',
            textAlign: 'center',
            borderTop: '1px solid rgba(118,152,38,0.1)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ ...glassPanel, padding: 24, maxWidth: 400, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 14,
                color: '#FFFFFF',
                letterSpacing: 3,
                marginBottom: 12,
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300,
                opacity: 0.7,
              }}
            >
              READY TO RUN?
            </p>
            <button
              style={{ ...ctaStyle, padding: '12px 32px', fontSize: 13 }}
              onClick={() => navigate('/game')}
            >
              PLAY NOW
            </button>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.3)',
                marginTop: 16,
                letterSpacing: 1,
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300,
              }}
            >
              CORUN &copy; 2026 &nbsp;·&nbsp;
              <a
                href="https://github.com/alimaandev/corun"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(240,235,227,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F0EBE3'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(240,235,227,0.4)'
                }}
              >
                ★ STAR ON GITHUB
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
