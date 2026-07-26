import { useAuth, IS_AUTH_CONFIGURED } from '../lib/auth'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (!IS_AUTH_CONFIGURED) return <>{children}</>

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#F0EBE3',
          fontFamily: "'Roboto', sans-serif",
          fontSize: 11,
          fontWeight: 300,
          letterSpacing: 4,
        }}
      >
        LOADING...
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}
