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
          background: '#0a0a1a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 20,
          fontFamily: "'Press Start 2P', monospace",
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚠</div>
          <div style={{ color: '#FF5252', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
            CRASH
          </div>
          <div style={{
            color: '#888', fontSize: 8, marginBottom: 24,
            textAlign: 'center', maxWidth: 400, lineHeight: 1.6,
            wordBreak: 'break-word',
          }}>
            {this.state.error?.message}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              location.href = '/game'
            }}
            style={{
              background: '#4FC3F7', border: 'none',
              color: '#0a0a1a', padding: '12px 24px',
              fontSize: 10, cursor: 'pointer',
              fontFamily: "'Press Start 2P', monospace",
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
