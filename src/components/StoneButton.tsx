import { useRef, type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
}

const base: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  transformStyle: 'preserve-3d',
  perspective: '200px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
}

const variants: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(180deg, #3a3a4a 0%, #2a2a3a 50%, #1a1a2a 100%)',
    color: '#4FC3F7',
    boxShadow: '0 4px 0 #0a0a1a, 0 0 12px rgba(79,195,247,0.2)',
  },
  secondary: {
    background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 50%, #0a0a1a 100%)',
    color: '#8a8a9a',
    boxShadow: '0 4px 0 #0a0a1a',
  },
  danger: {
    background: 'linear-gradient(180deg, #4a1a1a 0%, #3a0a0a 50%, #2a0000 100%)',
    color: '#ff4444',
    boxShadow: '0 4px 0 #1a0000, 0 0 12px rgba(255,68,68,0.2)',
  },
  gold: {
    background: 'linear-gradient(180deg, #5a4a1a 0%, #4a3a0a 50%, #3a2a00 100%)',
    color: '#ffd700',
    boxShadow: '0 4px 0 #2a1a00, 0 0 12px rgba(255,215,0,0.2)',
  },
}

const sizes: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 8 },
  md: { padding: '10px 20px', fontSize: 10 },
  lg: { padding: '14px 28px', fontSize: 12 },
}

export default function StoneButton({ variant = 'primary', size = 'md', style, children, ...rest }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const downRef = useRef(false)
  const handlers = useRef(rest)
  handlers.current = rest

  return (
    <button
      ref={btnRef}
      style={{ ...base, ...variants[variant], ...sizes[size], ...style } as React.CSSProperties}
      onMouseDown={() => {
        downRef.current = true
        btnRef.current && (btnRef.current.style.transform = 'translateY(3px)')
        btnRef.current && (btnRef.current.style.boxShadow = '0 1px 0 #0a0a1a')
      }}
      onMouseUp={() => {
        downRef.current = false
        btnRef.current && (btnRef.current.style.transform = '')
        btnRef.current && (btnRef.current.style.boxShadow = '')
      }}
      onMouseLeave={() => {
        if (downRef.current) {
          downRef.current = false
          btnRef.current && (btnRef.current.style.transform = '')
          btnRef.current && (btnRef.current.style.boxShadow = '')
        }
      }}
      {...handlers.current}
    >
      {children}
    </button>
  )
}
