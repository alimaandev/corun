import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  style?: React.CSSProperties
  glow?: string
  onClick?: () => void
  hover?: boolean
}

export default function StonePanel({ children, style, glow, onClick, hover = true }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(240,235,227,0.12)',
        padding: 16,
        fontFamily: "'Roboto', sans-serif",
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 12,
        boxShadow: glow
          ? `0 0 20px ${glow}, inset 0 0 20px ${glow}22`
          : 'none',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...(hover ? {
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: glow ? `0 0 30px ${glow}` : '0 6px 0 #0a0a1a',
          } as React.CSSProperties,
        } : {}),
        ...style,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
