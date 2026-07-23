import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NameDialog from './NameDialog'

describe('NameDialog', () => {
  it('renders the name input and confirm button', () => {
    render(<NameDialog onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText('Runner')).toBeInTheDocument()
    expect(screen.getByText('CONFIRM')).toBeInTheDocument()
  })

  it('calls onSubmit with trimmed name', () => {
    const onSubmit = vi.fn()
    render(<NameDialog onSubmit={onSubmit} />)
    const input = screen.getByPlaceholderText('Runner')
    fireEvent.change(input, { target: { value: '  Hero  ' } })
    fireEvent.click(screen.getByText('CONFIRM'))
    expect(onSubmit).toHaveBeenCalledWith('Hero')
  })

  it('does not call onSubmit for empty name', () => {
    const onSubmit = vi.fn()
    render(<NameDialog onSubmit={onSubmit} />)
    fireEvent.click(screen.getByText('CONFIRM'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('truncates name to 12 characters', () => {
    const onSubmit = vi.fn()
    render(<NameDialog onSubmit={onSubmit} />)
    const input = screen.getByPlaceholderText('Runner')
    fireEvent.change(input, { target: { value: '1234567890ABCDEF' } })
    fireEvent.click(screen.getByText('CONFIRM'))
    expect(onSubmit).toHaveBeenCalledWith('1234567890AB')
  })

  it('submits on Enter key', () => {
    const onSubmit = vi.fn()
    render(<NameDialog onSubmit={onSubmit} />)
    const input = screen.getByPlaceholderText('Runner')
    fireEvent.change(input, { target: { value: 'Hero' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledWith('Hero')
  })
})
