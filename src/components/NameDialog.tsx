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
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{
        background: '#0a0a1a',
        border: '2px solid #4FC3F7',
        padding: 32,
        maxWidth: 400,
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 0 40px rgba(79,195,247,0.15)',
      }}>
        <div style={{ color: '#4FC3F7', fontSize: 14, marginBottom: 16 }}>
          ENTER YOUR NAME
        </div>
        <div style={{ color: '#888', fontSize: 8, marginBottom: 20, lineHeight: 1.6 }}>
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
            background: '#111', border: '1px solid #333',
            color: '#8BC34A', padding: '12px 16px',
            fontSize: 14, fontFamily: "'Press Start 2P', monospace",
            outline: 'none', textAlign: 'center',
            marginBottom: 16,
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            background: '#4FC3F7', border: 'none',
            color: '#0a0a1a', padding: '10px 24px',
            fontSize: 10, cursor: 'pointer',
            fontFamily: "'Press Start 2P', monospace",
            opacity: name.trim().length < 1 ? 0.5 : 1,
          }}
        >
          CONFIRM
        </button>
      </div>
    </div>
  )
}
