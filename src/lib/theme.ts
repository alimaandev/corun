export const colors = {
  bg: '#0a0a0a',
  fg: '#F0EBE3',
  accent: '#769826',
  danger: '#ff4444',
  gold: '#ffd700',
}

export const alpha = (opacity: number) => `rgba(240,235,227,${opacity})`

export const fonts = {
  heading: "'Poppins', sans-serif",
  body: "'Roboto', sans-serif",
  mono: "'JetBrains Mono', monospace",
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

export const transition = 'all 0.2s ease'

export const glassPanel: React.CSSProperties = {
  background: 'rgba(0,0,0,0.2)',
  border: `1px solid ${alpha(0.12)}`,
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
  boxShadow: `0 0 30px rgba(240,235,227,0.15)`,
}
