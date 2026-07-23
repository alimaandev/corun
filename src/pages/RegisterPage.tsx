import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function RegisterPage() {
  const { loginWithRedirect } = useAuth0()
  const [error, setError] = useState(false)

  useEffect(() => {
    loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    }).catch(() => setError(true))
  }, [loginWithRedirect])

  if (error) {
    return (
      <div style={wrap}>
        <div style={{ color: '#F0EBE3', fontSize: 9, fontFamily: "'Roboto', sans-serif", textAlign: 'center', lineHeight: 2, letterSpacing: 2 }}>
          AUTHENTICATION FAILED<br />
          <span style={{ color: '#769826', fontSize: 8, cursor: 'pointer' }} onClick={() => setError(false)}>TRY AGAIN</span>
        </div>
      </div>
    )
  }

  return (
    <div style={wrap}>
      <div style={spinner} />
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#0a0a0a',
}

const spinner: React.CSSProperties = {
  width: 24, height: 24,
  border: '3px solid #2a2a2a',
  borderTop: '3px solid #769826',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}
