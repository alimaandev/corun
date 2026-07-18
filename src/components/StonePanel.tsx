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
        background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 50%, #12121e 100%)',
        border: '1px solid #3a3a4a',
        padding: 16,
        fontFamily: "'Press Start 2P', monospace",
        transformStyle: 'preserve-3d',
        perspective: '400px',
        boxShadow: glow
          ? `0 0 20px ${glow}, inset 0 0 20px ${glow}22`
          : '0 4px 0 #0a0a1a',
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
