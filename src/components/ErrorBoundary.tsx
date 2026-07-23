import { Component, ErrorInfo, ReactNode } from 'react'
import * as Sentry from '@sentry/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
    try {
      Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0,
          background: '#0a0a0a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 20,
          fontFamily: "'Roboto', sans-serif",
        }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>⚠</div>
          <div style={{ color: '#F0EBE3', fontSize: 14, marginBottom: 12, textAlign: 'center', fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            SOMETHING WENT WRONG
          </div>
          <div style={{
            color: 'rgba(240,235,227,0.6)', fontSize: 9, marginBottom: 24,
            textAlign: 'center', maxWidth: 400, lineHeight: 1.6,
            wordBreak: 'break-word', fontFamily: "'Roboto', sans-serif", fontWeight: 300,
          }}>
            {this.state.error?.message}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              location.href = '/game'
            }}
            style={{
              background: '#F0EBE3', border: 'none',
              color: '#0a0a0a', padding: '12px 24px',
              fontSize: 10, cursor: 'pointer', fontWeight: 500, letterSpacing: 2,
              fontFamily: "'Roboto', sans-serif", borderRadius: 10,
            }}
          >
            RESTART
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
