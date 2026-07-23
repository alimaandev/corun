import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
}))

const Throw = () => {
  throw new Error('test crash')
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>hello</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>,
    )
    expect(screen.getByText('SOMETHING WENT WRONG')).toBeInTheDocument()
    expect(screen.getByText('test crash')).toBeInTheDocument()
    expect(screen.getByText('RESTART')).toBeInTheDocument()
  })
})
