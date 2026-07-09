import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function RegisterPage() {
  const { loginWithRedirect } = useAuth0()

  useEffect(() => {
    loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    })
  }, [loginWithRedirect])

  return (
    <div style={wrap}>
      <div style={spinner} />
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#0a0a1a',
}

const spinner: React.CSSProperties = {
  width: 24, height: 24,
  border: '3px solid #2a2a2a',
  borderTop: '3px solid #4FC3F7',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}
