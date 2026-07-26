import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('Welcome transition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a centered welcome view with a greeting and app identity', () => {
    mockMatchMedia(false)
    render(<App />)

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByText('Habit Tracker', { selector: 'p' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /new habit name/i })).not.toBeInTheDocument()
  })

  it('transitions from the welcome view to the habit list', () => {
    mockMatchMedia(false)
    render(<App />)

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(screen.queryByRole('heading', { name: /welcome back/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /habit tracker/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /new habit name/i })).toBeInTheDocument()
  })

  it('skips the welcome transition when reduced motion is preferred', () => {
    mockMatchMedia(true)
    render(<App />)

    expect(screen.queryByRole('heading', { name: /welcome back/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /habit tracker/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /new habit name/i })).toBeInTheDocument()
  })

  it('leaves the habit list fully interactive after the transition', async () => {
    mockMatchMedia(false)
    vi.useRealTimers()
    render(<App />)

    await screen.findByRole('textbox', { name: /new habit name/i }, { timeout: 3000 })
    expect(screen.queryByRole('heading', { name: /welcome back/i })).not.toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox', { name: /new habit name/i }), 'Read{Enter}')
    expect(screen.getByText('Read')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /mark read as done/i }))
    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()
  })
})
