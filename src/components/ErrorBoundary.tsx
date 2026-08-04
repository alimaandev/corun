import { Component, ErrorInfo, ReactNode } from 'react'
import * as Sentry from '@sentry/react'
import { colors, fonts, radius, z } from '../lib/theme'

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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: z.error,
            background: colors.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            fontFamily: fonts.body,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚠</div>
          <div
            style={{
              color: colors.fg,
              fontSize: 14,
              marginBottom: 12,
              textAlign: 'center',
              fontFamily: fonts.heading,
              fontWeight: 600,
            }}
          >
            SOMETHING WENT WRONG
          </div>
          <div
            style={{
              color: colors.fgDim,
              fontSize: 11,
              marginBottom: 24,
              textAlign: 'center',
              maxWidth: 400,
              lineHeight: 1.6,
              wordBreak: 'break-word',
              fontFamily: fonts.body,
              fontWeight: 300,
            }}
          >
            {this.state.error?.message}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              location.href = '/game'
            }}
            style={{
              background: colors.fg,
              border: 'none',
              color: colors.bg,
              padding: '12px 24px',
              fontSize: 10,
              cursor: 'pointer',
              fontWeight: 500,
              letterSpacing: 2,
              fontFamily: fonts.body,
              borderRadius: radius.xl,
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
