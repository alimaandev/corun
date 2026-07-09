import { useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import PixelBackground from '../components/PixelBackground'

const NAV_SECTIONS = ['home', 'features', 'how', 'diff', 'cta']

export default function LandingPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const navigate = useNavigate()
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (isAuthenticated) navigate('/game', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      for (const id of NAV_SECTIONS) {
        const el = refs.current[id]
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= 250 && r.bottom >= 250) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const tick = () => {
      const card = cardRef.current
      if (card) {
        const r = card.getBoundingClientRect()
        const dx = (mouse.x - (r.left + r.width / 2)) / r.width
        const dy = (mouse.y - (r.top + r.height / 2)) / r.height
        card.style.transform = `perspective(800px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg)`
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [mouse])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const go = (id: string) => refs.current[id]?.scrollIntoView({ behavior: 'smooth' })

  const s = (el: string) => ({
    ref: (r: HTMLDivElement | null) => { refs.current[el] = r },
  })

  return (
    <div className="lp-root" style={root}>
      {/* NAV */}
      <nav style={{ ...nav, background: scrolled ? 'rgba(10,10,26,0.96)' : 'transparent', borderBottom: scrolled ? '4px solid rgba(79,195,247,0.1)' : '4px solid transparent' }}>
        <div style={navIn}>
          <button onClick={() => go('home')} style={logoBtn}>
            <span style={logoText}>CODE RUN</span>
            <span style={logoBadge}>β</span>
          </button>
          <div className="lp-links" style={navLinks}>
            {['home', 'features', 'how', 'diff'].map(id => (
              <button key={id} onClick={() => go(id)} style={{ ...navLink, color: active === id ? '#4FC3F7' : '#555' }}>
                {id === 'how' ? 'HOW IT WORKS' : id === 'diff' ? 'WHY US' : id.toUpperCase()}
              </button>
            ))}
            <button onClick={() => loginWithRedirect()} style={navCta}>LOGIN</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" {...s('home')} style={sec}>
        <PixelBackground />
        <div style={heroOverlay} />

        <div style={heroInner}>
          <div ref={cardRef} style={heroCard}>
            <div style={cornerTL} /><div style={cornerTR} />
            <div style={cornerBL} /><div style={cornerBR} />
            <div style={heroBadge}>v1.0</div>

            <div style={titleBlock}>
              <div className="lp-title" style={heroTitle}>CODE RUN</div>
              <div style={heroSub}>ESCAPE THE MONSTER</div>
            </div>

            <div style={divider} />

            <p style={tagline}>
              A RETRO CODING GAME<br />
              WHERE SPEED MEETS LOGIC<br />
              & SURVIVAL IS THE ONLY RULE
            </p>

            <div style={heroBtns}>
              <button onClick={() => loginWithRedirect()} style={primaryBtn}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a3a5a'; e.currentTarget.style.transform = 'scale(1.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a2a3a'; e.currentTarget.style.transform = 'scale(1)' }}
              >▶ PLAY NOW</button>
              <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} style={ghostBtn}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4FC3F7'; e.currentTarget.style.color = '#4FC3F7' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#666' }}
              >SIGN UP</button>
            </div>

            <div style={scrollHint}>↓ SCROLL</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" {...s('features')} style={sec}>
        <div style={secIn}>
          <div style={secHdr}>
            <div style={secTag}>FEATURES</div>
            <h2 style={secTitle}>WHAT YOU GET</h2>
            <p style={secDesc}>Six core features that make CODE RUN different from every other coding tool.</p>
          </div>

          <div className="lp-grid" style={grid3}>
            {[
              ['⚡', 'REAL-TIME CODING', 'Solve programming challenges while running from the monster. Every second counts — answer fast or get caught.'],
              ['⚔', 'BOSS BATTLES', 'Face SYNTAX ERROR, NULL POINTER, INFINITE LOOP and more. Answer correctly to drain their HP and claim bonus points.'],
              ['🔥', 'COMBO SYSTEM', 'Chain correct answers to build streak multipliers up to 4x. One wrong answer and your combo resets to zero.'],
              ['📈', 'ADAPTIVE DIFFICULTY', 'The game watches your performance. Getting hot? It gets harder. Struggling? It adjusts. You\'re always in the sweet spot.'],
              ['🏆', 'DAILY CHALLENGES', 'A fresh challenge every 24 hours. One shot, one score. Compete against yourself and the leaderboard.'],
              ['🎮', 'BOSS RUSH', 'Endless boss gauntlet mode. Wave after wave of coding bosses with increasing difficulty. How far can you go?'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="fade-in" style={card}>
                <div style={cardIcon}>{icon}</div>
                <div style={cardTitle}>{title}</div>
                <div style={cardDesc}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" {...s('how')} style={{ ...sec, background: '#0d0d20' }}>
        <div style={secIn}>
          <div style={secHdr}>
            <div style={secTag}>HOW IT WORKS</div>
            <h2 style={secTitle}>FOUR STEPS TO<br />YOUR FIRST RUN</h2>
            <p style={secDesc}>Getting started takes less than a minute.</p>
          </div>

          <div className="lp-steps" style={stepsRow}>
            {[
              ['01', 'PICK', 'Choose a topic — JavaScript, Python, Web Dev, or go ALL for random questions. Then pick your difficulty.'],
              ['02', 'RUN', 'Control your character, dodge obstacles, and solve coding challenges that pop up in your path.'],
              ['03', 'COMBO', 'Get answers right to build your streak. Each milestone unlocks a higher score multiplier.'],
              ['04', 'DEFEAT', 'Every 150 points triggers a boss fight. Answer correctly to damage the boss and earn massive bonuses.'],
            ].map(([num, title, desc], i) => (
              <div key={i} className="fade-in" style={stepCard}>
                <div style={stepNum}>{num}</div>
                <div style={stepTitle}>{title}</div>
                <div style={stepDesc}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="diff" {...s('diff')} style={sec}>
        <div style={secIn}>
          <div style={secHdr}>
            <div style={secTag}>WHAT SETS US APART</div>
            <h2 style={secTitle}>NOT A QUIZ.<br />A GAME.</h2>
            <p style={secDesc}>We built CODE RUN for developers who are bored of multiple choice and want something that feels real.</p>
          </div>

          <div style={diffsCol}>
            {[
              ['GAME, NOT A TEST', 'You don\'t just answer questions. You run, dodge, and fight. Coding is the weapon, not the exam.'],
              ['ADAPTIVE CHALLENGE', 'The game watches your performance and adjusts difficulty in real-time. Always challenging, never overwhelming.'],
              ['BOSS MECHANICS', 'Real boss battles with HP bars, timed attacks, and bonus rewards. This isn\'t flashcards — it\'s a fight for survival.'],
              ['NO DISTRACTIONS', 'Pixel art, chiptune vibes, minimal UI. Everything is built for speed and focus. No fluff, no animations that waste your time.'],
            ].map(([title, desc], i) => (
              <div key={i} className="fade-in" style={diffCard}>
                <div style={diffNum}>0{i + 1}</div>
                <div>
                  <div style={diffTitle}>{title}</div>
                  <div style={diffDesc}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" {...s('cta')} style={{ ...sec, padding: '120px 20px' }}>
        <div style={secIn}>
          <div className="fade-in" style={ctaCard}>
            <div style={cornerTL} /><div style={cornerTR} />
            <div style={cornerBL} /><div style={cornerBR} />
            <div style={ctaTitle}>READY TO RUN?</div>
            <p style={ctaDesc}>Start your first coding escape. No credit card. No commitment. Just pure code.</p>
            <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} style={primaryBtn}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a3a5a'; e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a2a3a'; e.currentTarget.style.transform = 'scale(1)' }}
            >▶ CREATE FREE ACCOUNT</button>
            <div style={ctaSub}>ALREADY HAVE ONE? <button onClick={() => loginWithRedirect()} style={ctaLink}>LOGIN</button></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        <div className="lp-footer" style={footerIn}>
          <div style={footerCol}>
            <div style={footerLogo}>CODE RUN</div>
            <div style={footerDesc}>A retro-styled coding game that makes practice feel like an arcade escape. Built for developers who want to level up.</div>
          </div>
          <div style={footerCol}>
            <div style={footerLabel}>NAV</div>
            {['HOME', 'FEATURES', 'HOW IT WORKS', 'WHY US'].map((l, i) => (
              <button key={i} onClick={() => go(NAV_SECTIONS[i])} style={footerLink}>{l}</button>
            ))}
          </div>
          <div style={footerCol}>
            <div style={footerLabel}>ACCOUNT</div>
            <button onClick={() => loginWithRedirect()} style={footerLink}>LOGIN</button>
            <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} style={footerLink}>SIGN UP</button>
          </div>
        </div>
        <div style={footerBar}>
          <span>© 2026 CODE RUN</span>
          <span style={footerMade}>MADE WITH ☕ & CODE</span>
        </div>
      </footer>
    </div>
  )
}

// ─── STYLES ─────────────────────────────────────────────────

const font = "'Press Start 2P', monospace"

const root: React.CSSProperties = {
  background: '#0a0a1a',
  color: '#fff',
  fontFamily: font,
  minHeight: '100vh',
  touchAction: 'auto',
}

// nav
const nav: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
  transition: 'all 0.3s',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}
const navIn: React.CSSProperties = {
  maxWidth: 1000, margin: '0 auto',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 20px',
}
const logoBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }
const logoText: React.CSSProperties = { color: '#4FC3F7', fontSize: 14, fontFamily: font, letterSpacing: 3 }
const logoBadge: React.CSSProperties = { color: '#555', fontSize: 7, fontFamily: font, marginTop: -6 }

const navLinks: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 2 }
const navLink: React.CSSProperties = { background: 'none', border: 'none', fontSize: 7, fontFamily: font, letterSpacing: 1, padding: '6px 8px', cursor: 'pointer', transition: 'color 0.2s' }
const navCta: React.CSSProperties = { background: 'transparent', border: '3px solid rgba(79,195,247,0.3)', color: '#4FC3F7', fontSize: 7, fontFamily: font, letterSpacing: 1, padding: '6px 14px', cursor: 'pointer', marginLeft: 6, transition: 'all 0.2s' }

// hero
const sec: React.CSSProperties = { position: 'relative', zIndex: 1, padding: '100px 20px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }
const secIn: React.CSSProperties = { maxWidth: 960, margin: '0 auto', width: '100%' }
const heroOverlay: React.CSSProperties = { position: 'absolute', inset: 0, background: 'rgba(10,10,26,0.7)', zIndex: 1 }
const heroInner: React.CSSProperties = { position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }

const heroCard: React.CSSProperties = {
  position: 'relative',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  padding: '36px 32px 28px',
  background: 'rgba(0,0,0,0.75)',
  border: '4px solid rgba(79,195,247,0.3)',
  maxWidth: 400, width: '100%',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.05s',
}

const cornerTL: React.CSSProperties = { position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '2px solid #4FC3F7', borderLeft: '2px solid #4FC3F7', pointerEvents: 'none' }
const cornerTR: React.CSSProperties = { position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: '2px solid #4FC3F7', borderRight: '2px solid #4FC3F7', pointerEvents: 'none' }
const cornerBL: React.CSSProperties = { position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: '2px solid #4FC3F7', borderLeft: '2px solid #4FC3F7', pointerEvents: 'none' }
const cornerBR: React.CSSProperties = { position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '2px solid #4FC3F7', borderRight: '2px solid #4FC3F7', pointerEvents: 'none' }
const heroBadge: React.CSSProperties = { position: 'absolute', top: 10, right: 32, color: '#4FC3F7', fontSize: 6, fontFamily: font, letterSpacing: 1, opacity: 0.35 }

const titleBlock: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }
const heroTitle: React.CSSProperties = {
  color: '#4FC3F7', fontSize: 32, fontWeight: 900,
  letterSpacing: 6, fontFamily: font, lineHeight: 1.4,
  textShadow: '0 0 20px rgba(79,195,247,0.3), 3px 3px 0 #1a3a4a',
  animation: 'titleGlow 3s ease-in-out infinite',
}
const heroSub: React.CSSProperties = { color: '#888', fontSize: 8, letterSpacing: 4, fontFamily: font, marginTop: 6 }

const divider: React.CSSProperties = { width: '60%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.2), transparent)', marginBottom: 14 }
const tagline: React.CSSProperties = { color: '#666', fontSize: 7, fontFamily: font, letterSpacing: 2, lineHeight: 2.2, textAlign: 'center', marginBottom: 20 }

const heroBtns: React.CSSProperties = { display: 'flex', gap: 8, width: '100%', marginBottom: 16 }

const primaryBtn: React.CSSProperties = {
  flex: 1, padding: '12px 0',
  border: '4px solid rgba(79,195,247,0.5)',
  background: '#1a2a3a', color: '#4FC3F7',
  fontSize: 10, fontFamily: font,
  letterSpacing: 3, cursor: 'pointer',
  transition: 'all 0.2s',
}
const ghostBtn: React.CSSProperties = {
  flex: 1, padding: '12px 0',
  border: '3px solid #3a3a3a',
  background: 'transparent', color: '#666',
  fontSize: 8, fontFamily: font,
  letterSpacing: 2, cursor: 'pointer',
  transition: 'all 0.2s',
}

const scrollHint: React.CSSProperties = { color: '#333', fontSize: 7, fontFamily: font, animation: 'pulse 2s ease-in-out infinite', letterSpacing: 2 }

// section shared
const secHdr: React.CSSProperties = { textAlign: 'center', marginBottom: 48 }
const secTag: React.CSSProperties = { color: '#4FC3F7', fontSize: 8, fontFamily: font, letterSpacing: 3, marginBottom: 12, opacity: 0.6 }
const secTitle: React.CSSProperties = { color: '#fff', fontSize: 22, fontFamily: font, lineHeight: 1.6, letterSpacing: 2, marginBottom: 14 }
const secDesc: React.CSSProperties = { color: '#666', fontSize: 8, fontFamily: font, lineHeight: 2, letterSpacing: 1, maxWidth: 480, margin: '0 auto' }

// features grid
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }

const card: React.CSSProperties = {
  padding: '24px 18px 20px',
  border: '4px solid rgba(79,195,247,0.08)',
  background: 'rgba(0,0,0,0.3)',
}
const cardIcon: React.CSSProperties = { fontSize: 24, marginBottom: 12 }
const cardTitle: React.CSSProperties = { color: '#4FC3F7', fontSize: 9, fontFamily: font, letterSpacing: 1, marginBottom: 10, lineHeight: 1.6 }
const cardDesc: React.CSSProperties = { color: '#777', fontSize: 7, fontFamily: font, lineHeight: 2, letterSpacing: 0.5 }

// steps
const stepsRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }
const stepCard: React.CSSProperties = {
  padding: '20px 14px',
  border: '3px solid rgba(79,195,247,0.06)',
  background: 'rgba(0,0,0,0.2)',
}
const stepNum: React.CSSProperties = { color: '#4FC3F7', fontSize: 22, fontFamily: font, opacity: 0.2, marginBottom: 10 }
const stepTitle: React.CSSProperties = { color: '#ccc', fontSize: 8, fontFamily: font, letterSpacing: 1, marginBottom: 8, lineHeight: 1.6 }
const stepDesc: React.CSSProperties = { color: '#666', fontSize: 7, fontFamily: font, lineHeight: 2, letterSpacing: 0.5 }

// diffs
const diffsCol: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }
const diffCard: React.CSSProperties = {
  display: 'flex', gap: 20, alignItems: 'flex-start',
  padding: '22px 20px',
  border: '3px solid rgba(79,195,247,0.06)',
  background: 'rgba(0,0,0,0.2)',
}
const diffNum: React.CSSProperties = { color: '#4FC3F7', fontSize: 14, fontFamily: font, opacity: 0.25, minWidth: 32, lineHeight: 1.3 }
const diffTitle: React.CSSProperties = { color: '#ddd', fontSize: 9, fontFamily: font, letterSpacing: 1, marginBottom: 8 }
const diffDesc: React.CSSProperties = { color: '#777', fontSize: 7, fontFamily: font, lineHeight: 2, letterSpacing: 0.5 }

// cta
const ctaCard: React.CSSProperties = {
  position: 'relative',
  textAlign: 'center',
  padding: '44px 36px 36px',
  border: '4px solid rgba(79,195,247,0.2)',
  background: 'rgba(0,0,0,0.5)',
  maxWidth: 520, margin: '0 auto',
}
const ctaTitle: React.CSSProperties = { color: '#4FC3F7', fontSize: 20, fontFamily: font, letterSpacing: 3, marginBottom: 12 }
const ctaDesc: React.CSSProperties = { color: '#888', fontSize: 8, fontFamily: font, lineHeight: 2, letterSpacing: 1, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }
const ctaSub: React.CSSProperties = { color: '#555', fontSize: 7, fontFamily: font, marginTop: 12 }
const ctaLink: React.CSSProperties = { background: 'none', border: 'none', color: '#4FC3F7', fontSize: 7, fontFamily: font, cursor: 'pointer', textDecoration: 'underline', padding: 0 }

// footer
const footer: React.CSSProperties = { borderTop: '4px solid rgba(79,195,247,0.06)', padding: '40px 20px 20px' }
const footerIn: React.CSSProperties = { maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 36, marginBottom: 28 }
const footerCol: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 }
const footerLogo: React.CSSProperties = { color: '#4FC3F7', fontSize: 12, fontFamily: font, letterSpacing: 2, marginBottom: 4 }
const footerDesc: React.CSSProperties = { color: '#555', fontSize: 7, fontFamily: font, lineHeight: 2, letterSpacing: 0.5 }
const footerLabel: React.CSSProperties = { color: '#888', fontSize: 7, fontFamily: font, letterSpacing: 2, marginBottom: 4 }
const footerLink: React.CSSProperties = { background: 'none', border: 'none', color: '#444', fontSize: 7, fontFamily: font, textAlign: 'left', padding: 0, cursor: 'pointer', letterSpacing: 1, transition: 'color 0.2s' }
const footerBar: React.CSSProperties = { maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '3px solid rgba(255,255,255,0.03)', color: '#333', fontSize: 6, fontFamily: font, letterSpacing: 1 }
const footerMade: React.CSSProperties = { color: '#222' }
