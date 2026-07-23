import { useState } from 'react'

interface Props {
  onSubmit: (name: string) => void
}

export default function NameDialog({ onSubmit }: Props) {
  const [name, setName] = useState('')

  function handleSubmit() {
    const trimmed = name.trim().slice(0, 12)
    if (trimmed.length < 1) return
    onSubmit(trimmed)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(240,235,227,0.15)',
        borderRadius: 16,
        padding: 32,
        maxWidth: 400,
        width: '90%',
        textAlign: 'center',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
        <div style={{ color: '#F0EBE3', fontSize: 20, marginBottom: 8, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
          NAME YOURSELF
        </div>
        <div style={{ color: 'rgba(240,235,227,0.5)', fontSize: 9, marginBottom: 20, lineHeight: 1.6, fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}>
          This name will appear on the global leaderboard.
        </div>
        <input
          autoFocus
          maxLength={12}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Runner"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(240,235,227,0.15)',
            color: '#F0EBE3', padding: '12px 16px', borderRadius: 10,
            fontSize: 16, fontFamily: "'Poppins', sans-serif", fontWeight: 500,
            outline: 'none', textAlign: 'center',
            marginBottom: 16,
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            background: '#F0EBE3', border: 'none', borderRadius: 10,
            color: '#0a0a0a', padding: '10px 24px',
            fontSize: 9, cursor: 'pointer', letterSpacing: 2,
            fontFamily: "'Roboto', sans-serif", fontWeight: 500,
            opacity: name.trim().length < 1 ? 0.35 : 1,
          }}
        >
          CONFIRM
        </button>
      </div>
    </div>
  )
}
