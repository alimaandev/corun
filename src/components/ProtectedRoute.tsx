import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a1a', color: '#4FC3F7',
        fontFamily: "'Press Start 2P', monospace", fontSize: 10,
      }}>
        LOADING...
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}
