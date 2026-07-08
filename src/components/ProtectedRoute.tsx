import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
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

  if (!isSignedIn) return <Navigate to="/sign-in" state={{ from: location }} replace />
  return <>{children}</>
}
