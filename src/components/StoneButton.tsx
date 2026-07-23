import { useRef, type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
}

const base: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  transformStyle: 'preserve-3d',
  perspective: '200px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  fontWeight: 500,
}

const variants: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(180deg, #2a3a1a 0%, #1a2a0a 50%, #0a1a00 100%)',
    color: '#F0EBE3',
    boxShadow: '0 4px 0 #0a0a0a, 0 0 12px rgba(118,152,38,0.2)',
  },
  secondary: {
    background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
    color: 'rgba(240,235,227,0.6)',
    boxShadow: '0 4px 0 #000',
  },
  danger: {
    background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
    color: '#F0EBE3',
    boxShadow: '0 4px 0 #000, 0 0 12px rgba(240,235,227,0.15)',
  },
  gold: {
    background: 'linear-gradient(180deg, #3a3a1a 0%, #2a2a0a 50%, #1a1a00 100%)',
    color: '#F0EBE3',
    boxShadow: '0 4px 0 #000, 0 0 12px rgba(240,235,227,0.2)',
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
