import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const err = await login(username, password)
    setBusy(false)
    if (err) setError(err)
    else navigate('/')
  }

  return (
    <div style={wrap}>
      <form onSubmit={handleSubmit} style={card}>
        <div style={title}>LOGIN</div>

        {error && <div style={errBox}>{error}</div>}

        <input
          style={input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={busy} style={btn}>
          {busy ? '...' : '▶ LOGIN'}
        </button>

        <div style={foot}>
          No account? <Link to="/register" style={link}>REGISTER</Link>
        </div>
      </form>
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 20, background: '#0a0a1a',
}
const card: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 12,
  maxWidth: 360, width: '100%',
  padding: '28px 24px',
  border: '4px solid rgba(79,195,247,0.3)',
  background: 'rgba(0,0,0,0.8)',
}
const title: React.CSSProperties = {
  color: '#4FC3F7', fontSize: 24, fontWeight: 900, letterSpacing: 4,
  textAlign: 'center', fontFamily: "'Press Start 2P', monospace", marginBottom: 8,
}
const input: React.CSSProperties = {
  padding: '10px 12px',
  border: '3px solid #2a2a2a', background: '#0d0d0d', color: '#fff',
  fontSize: 14, fontFamily: "'JetBrains Mono', monospace", outline: 'none',
}
const btn: React.CSSProperties = {
  padding: '10px 24px',
  border: '4px solid rgba(79,195,247,0.4)',
  background: '#1a2a3a', color: '#4FC3F7',
  fontSize: 11, fontFamily: "'Press Start 2P', monospace",
  cursor: 'pointer', letterSpacing: 3, transition: 'all 0.1s',
}
const errBox: React.CSSProperties = {
  padding: '6px 10px', border: '3px solid rgba(244,67,54,0.3)',
  color: '#F44336', fontSize: 9, textAlign: 'center',
  fontFamily: "'Press Start 2P', monospace",
}
const foot: React.CSSProperties = {
  color: '#666', fontSize: 9, textAlign: 'center',
  fontFamily: "'Press Start 2P', monospace",
}
const link: React.CSSProperties = {
  color: '#4FC3F7', textDecoration: 'none',
}
