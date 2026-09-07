import { ReactNode } from 'react'
import { colors, fonts, alpha, radius, transition, fontSizes } from '../lib/theme'
import { useFocusTrap } from '../lib/useFocusTrap'

/** Primary button with variants. */
export function GlassButton({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  style,
  disabled,
}: {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  children: ReactNode
  style?: React.CSSProperties
  disabled?: boolean
}) {
  const s = sizeMap[size]
  const isPrimary = variant === 'primary'
  const isDanger = variant === 'danger'
  const bg = isPrimary ? colors.fg : isDanger ? colors.danger : 'transparent'
  const fg = isPrimary || isDanger ? colors.bg : colors.fg
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      style={{
        background: bg,
        color: fg,
        border:
          variant === 'secondary' || variant === 'ghost' ? `1px solid ${alpha(0.25)}` : 'none',
        padding: s.p,
        fontSize: s.fs,
        fontWeight: 600,
        letterSpacing: 2,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: fonts.heading,
        borderRadius: radius.lg,
        transition,
        opacity: disabled ? 0.35 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        textTransform: 'uppercase',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return
        e.currentTarget.style.boxShadow = isPrimary
          ? `0 0 28px ${alpha(0.4)}`
          : `0 0 18px ${alpha(0.12)}`
        e.currentTarget.style.transform = 'scale(1.03)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
    </button>
  )
}

const sizeMap: Record<string, { p: string; fs: number }> = {
  sm: { p: '8px 16px', fs: 13 },
  md: { p: '12px 28px', fs: 14 },
  lg: { p: '16px 40px', fs: 16 },
}

/** Glassy surface panel. */
export function GlassPanel({
  children,
  style,
  onClick,
  hover = true,
}: {
  children: ReactNode
  style?: React.CSSProperties
  onClick?: () => void
  hover?: boolean
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(0,0,0,0.25)',
        border: `1px solid ${alpha(0.12)}`,
        borderRadius: radius.lg,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: colors.fg,
        fontFamily: fonts.body,
        padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover && onClick) e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        if (hover) e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {children}
    </div>
  )
}

/** Modal shell with overlay + focus trap + Esc-to-close. */
export function Modal({
  title,
  onClose,
  children,
  maxWidth = 560,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: number
}) {
  const trapRef = useFocusTrap(true)
  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflow: 'auto',
          background: '#0d0d0d',
          border: `1px solid ${alpha(0.14)}`,
          borderRadius: radius.lg,
          padding: 24,
          boxShadow: '0 16px 64px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <h2
            style={{
              color: colors.fg,
              fontSize: fontSizes.lg,
              fontFamily: fonts.heading,
              fontWeight: 700,
              letterSpacing: 1,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: alpha(0.5),
              fontSize: 20,
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/** Small uppercase section label. */
export function SectionLabel({
  children,
  color = colors.accent,
  style,
}: {
  children: ReactNode
  color?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        color,
        fontSize: fontSizes.sm,
        fontWeight: 600,
        letterSpacing: 3,
        fontFamily: fonts.heading,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Stat block (SCORE / TIME / MULTIPLIER style). */
export function StatBox({
  label,
  value,
  color,
  align = 'left',
}: {
  label: string
  value: ReactNode
  color?: string
  align?: 'left' | 'right'
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          color: alpha(0.5),
          fontSize: fontSizes.xs,
          fontFamily: fonts.body,
          fontWeight: 400,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: color ?? colors.fg,
          fontSize: fontSizes.lg,
          fontWeight: 700,
          lineHeight: 1.1,
          fontFamily: fonts.mono,
          letterSpacing: 1,
        }}
      >
        {value}
      </div>
    </div>
  )
}
