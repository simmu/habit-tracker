import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Only fake the Date object – leave setTimeout/Promise intact so userEvent works.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
})

describe('App – add habit flow', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /habit tracker/i })).toBeInTheDocument()
  })

  it('shows the empty-state message on first load', () => {
    render(<App />)
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument()
  })

  it('adds a habit to the list when the user types and presses Enter', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })

    await userEvent.type(input, 'Morning run{Enter}')

    expect(screen.getByText('Morning run')).toBeInTheDocument()
    expect(screen.queryByText(/no habits yet/i)).not.toBeInTheDocument()
  })

  it('can add multiple habits one after another', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })

    await userEvent.type(input, 'Drink water{Enter}')
    await userEvent.type(input, 'Stretch{Enter}')

    expect(screen.getByText('Drink water')).toBeInTheDocument()
    expect(screen.getByText('Stretch')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})

describe('App – streak flow', () => {
  it('shows a streak of 0 for a newly added habit', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Read{Enter}')

    expect(screen.getByLabelText(/0 day streak/i)).toBeInTheDocument()
  })

  it('increments the streak to 1 after marking a habit done', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Meditate{Enter}')

    await userEvent.click(screen.getByRole('button', { name: /mark meditate as done/i }))

    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()
  })

  it('disables the "Mark done" button after clicking it', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Stretch{Enter}')

    const btn = screen.getByRole('button', { name: /mark stretch as done/i })
    await userEvent.click(btn)

    expect(screen.getByRole('button', { name: /stretch already done today/i })).toBeDisabled()
  })
})
