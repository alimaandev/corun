import { ReactNode } from 'react'
import { colors, fonts, radius, transition, alpha } from '../lib/theme'

interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  children: ReactNode
  style?: React.CSSProperties
  disabled?: boolean
}

const sizeMap: Record<string, { p: string; fs: number }> = {
  sm: { p: '6px 14px', fs: 8 },
  md: { p: '10px 24px', fs: 10 },
  lg: { p: '14px 32px', fs: 12 },
}

export default function GlassButton({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  style,
  disabled,
}: Props) {
  const s = sizeMap[size]
  const isPrimary = variant === 'primary'

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        background: isPrimary ? colors.fg : 'transparent',
        color: isPrimary ? colors.bg : colors.fg,
        border: isPrimary ? 'none' : `1px solid ${alpha(0.25)}`,
        padding: s.p,
        fontSize: s.fs,
        fontWeight: 500,
        letterSpacing: 2,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: fonts.body,
        borderRadius: radius.xl,
        transition,
        opacity: disabled ? 0.35 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        textTransform: 'uppercase',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return
        if (isPrimary) {
          e.currentTarget.style.boxShadow = `0 0 24px ${alpha(0.35)}`
        } else {
          e.currentTarget.style.background = alpha(0.08)
        }
        e.currentTarget.style.transform = 'scale(1.03)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        if (!isPrimary) e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
    </button>
  )
}
