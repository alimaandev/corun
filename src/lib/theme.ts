export const colors = {
  bg: '#0a0a0a',
  bgElevated: '#141414',
  bgGlass: 'rgba(0,0,0,0.2)',
  fg: '#F0EBE3',
  fgDim: 'rgba(240,235,227,0.6)',
  fgFaint: 'rgba(240,235,227,0.35)',
  accent: '#769826',
  accentBright: '#8faf2f',
  accentDim: 'rgba(118,152,38,0.15)',
  danger: '#ff4444',
  dangerDim: 'rgba(255,68,68,0.15)',
  gold: '#ffd700',
  border: 'rgba(240,235,227,0.12)',
}

export const alpha = (opacity: number) => `rgba(240,235,227,${opacity})`

export const fonts = {
  heading: "'Poppins', sans-serif",
  body: "'Roboto', sans-serif",
  mono: "'JetBrains Mono', monospace",
}

export const fontSizes = {
  xs: 10,
  sm: 11,
  md: 13,
  lg: 16,
  xl: 22,
  xxl: 32,
}

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  xxl: 12,
  round: '50%',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

/** z-index scale — always reference these, never raw numbers */
export const z = {
  base: 0,
  overlay: 100,
  modal: 200,
  error: 1000,
  toast: 1100,
}

export const shadows = {
  sm: '0 2px 8px rgba(0,0,0,0.4)',
  md: '0 4px 16px rgba(0,0,0,0.5)',
  lg: '0 8px 32px rgba(0,0,0,0.6)',
  glow: '0 0 30px rgba(240,235,227,0.15)',
  glowAccent: '0 0 30px rgba(118,152,38,0.35)',
}

export const transition = 'all 0.2s ease'

export const motion = {
  fast: '0.12s',
  base: '0.2s',
  slow: '0.5s',
}

export const glassPanel: React.CSSProperties = {
  background: colors.bgGlass,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: colors.fg,
  fontFamily: fonts.body,
}

export const ctaButton: React.CSSProperties = {
  background: colors.fg,
  color: colors.bg,
  border: 'none',
  borderRadius: 10,
  padding: '14px 0',
  fontSize: 11,
  fontWeight: 600,
  fontFamily: fonts.heading,
  letterSpacing: 2,
  cursor: 'pointer',
  transition,
  boxShadow: shadows.glow,
}
