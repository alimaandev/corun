import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  style?: React.CSSProperties
  glow?: string
  onClick?: () => void
  hover?: boolean
}

export default function GlassPanel({ children, style, glow, onClick, hover = true }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(240,235,227,0.12)',
        borderRadius: 12,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: 16,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...(glow ? { boxShadow: `0 0 24px ${glow}22, inset 0 0 24px ${glow}11` } : {}),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover && onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          if (glow) e.currentTarget.style.boxShadow = `0 0 36px ${glow}33, inset 0 0 24px ${glow}11`
          else e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)'
          if (glow) e.currentTarget.style.boxShadow = `0 0 24px ${glow}22, inset 0 0 24px ${glow}11`
          else e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {children}
    </div>
  )
}
