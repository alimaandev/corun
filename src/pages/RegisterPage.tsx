import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth, IS_AUTH_CONFIGURED } from '../lib/auth'
import { Navigate, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const { loginWithRedirect } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (IS_AUTH_CONFIGURED) {
      loginWithRedirect({
        authorizationParams: { screen_hint: 'signup' },
      }).catch(() => setError(true))
    }
  }, [loginWithRedirect])

  if (!IS_AUTH_CONFIGURED) return <Navigate to="/game" replace />

  if (error) {
    return (
      <div style={wrap}>
        <Helmet>
          <title>Sign Up — Corun</title>
          <meta
            name="description"
            content="Create your Corun account and start your coding adventure."
          />
        </Helmet>
        <div
          style={{
            color: '#F0EBE3',
            fontSize: 11,
            fontFamily: "'Roboto', sans-serif",
            textAlign: 'center',
            lineHeight: 2,
            letterSpacing: 2,
          }}
        >
          AUTHENTICATION FAILED
          <br />
          <span
            style={{ color: '#769826', fontSize: 11, cursor: 'pointer' }}
            onClick={() => setError(false)}
          >
            TRY AGAIN
          </span>
          <br />
          <br />
          <span
            style={{ color: 'rgba(240,235,227,0.5)', fontSize: 11, cursor: 'pointer' }}
            onClick={() => navigate('/game')}
          >
            PLAY AS GUEST
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={wrap}>
      <Helmet>
        <title>Sign Up — Corun</title>
        <meta
          name="description"
          content="Create your Corun account and start your coding adventure."
        />
      </Helmet>
      <div style={spinner} />
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0a0a0a',
}

const spinner: React.CSSProperties = {
  width: 24,
  height: 24,
  border: '3px solid #2a2a2a',
  borderTop: '3px solid #769826',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}
