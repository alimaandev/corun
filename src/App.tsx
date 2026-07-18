import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'

const Game = lazy(() => import('./components/Game'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))

function Loader() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Roboto', sans-serif",
      color: '#F0EBE3', fontSize: 11, fontWeight: 300, letterSpacing: 4,
    }}>
      LOADING...
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="/sign-up" element={<RegisterPage />} />
            <Route path="/game/*" element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
