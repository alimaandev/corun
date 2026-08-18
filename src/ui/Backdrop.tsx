import { useMemo } from 'react'
import { colors, alpha } from '../lib/theme'

/**
 * DOM/CSS-only animated backdrop (perspective grid + floating particles).
 * Replaces the former three.js scenes — zero WebGL, cheap on mobile.
 */

function Particles({ count = 24 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${10 + Math.random() * 80}%`,
        size: 2 + Math.random() * 3,
        delay: `${Math.random() * 6}s`,
        duration: `${6 + Math.random() * 8}s`,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [count],
  )
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: colors.fg,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function Backdrop({
  tint = 'rgba(118,152,38,0.06)',
  grid = true,
  particles = true,
  children,
}: {
  tint?: string
  grid?: boolean
  particles?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `radial-gradient(1200px 800px at 50% -10%, ${tint}, transparent 60%), ${colors.bg}`,
      }}
      aria-hidden="true"
    >
      {grid && (
        <div
          style={{
            position: 'absolute',
            left: '-25%',
            right: '-25%',
            bottom: '-10%',
            height: '55%',
            backgroundImage: `linear-gradient(${alpha(0.06)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(0.06)} 1px, transparent 1px)`,
            backgroundSize: '42px 42px',
            transform: 'perspective(500px) rotateX(60deg)',
            animation: 'gridScroll 3s linear infinite',
            transformOrigin: 'top',
          }}
        />
      )}
      {particles && <Particles />}
      {children}
    </div>
  )
}
