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

  it('shows the "Undo" button after clicking "Mark done"', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Stretch{Enter}')

    await userEvent.click(screen.getByRole('button', { name: /mark stretch as done/i }))

    expect(screen.getByRole('button', { name: /undo stretch for today/i })).toBeInTheDocument()
  })

  it('un-completing a habit resets its streak', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Stretch{Enter}')

    await userEvent.click(screen.getByRole('button', { name: /mark stretch as done/i }))
    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /undo stretch for today/i }))
    expect(screen.getByLabelText(/0 day streak/i)).toBeInTheDocument()
  })
})

describe('App – persistence', () => {
  it('restores habits and streaks after a simulated page refresh', async () => {
    // First "session": add a habit and mark it done
    const { unmount } = render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Yoga{Enter}')
    await userEvent.click(screen.getByRole('button', { name: /mark yoga as done/i }))
    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()
    unmount()

    // Second "session": re-mount App – localStorage should restore the habit and streak
    render(<App />)
    expect(screen.getByText('Yoga')).toBeInTheDocument()
    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()
  })

  it('two habits keep independent streaks after a refresh', async () => {
    // First session: add two habits, mark only one done
    const { unmount } = render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Run{Enter}')
    await userEvent.type(input, 'Read{Enter}')
    await userEvent.click(screen.getByRole('button', { name: /mark run as done/i }))
    unmount()

    // Second session: verify independent streaks
    render(<App />)
    expect(screen.getByText('Run')).toBeInTheDocument()
    expect(screen.getByText('Read')).toBeInTheDocument()
    // Run streak = 1, Read streak = 0
    expect(screen.getByLabelText(/^1 day streak$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^0 day streak$/i)).toBeInTheDocument()
  })
})

describe('App – weekly stats chart', () => {
  it('renders the "This Week" chart heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /this week/i })).toBeInTheDocument()
  })

  it('chart has 7 bars', () => {
    render(<App />)
    const bars = screen.getAllByTestId(/^bar-/)
    expect(bars).toHaveLength(7)
  })

  it("completing a habit increases today's bar count in aria-label", async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Run{Enter}')

    // Before completing: today bar shows 0
    // 2024-06-15 is a Saturday
    expect(screen.getByLabelText('Sat: 0 habits completed')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /mark run as done/i }))

    expect(screen.getByLabelText('Sat: 1 habits completed')).toBeInTheDocument()
  })

  it("un-completing a habit decreases today's bar count", async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(input, 'Run{Enter}')

    await userEvent.click(screen.getByRole('button', { name: /mark run as done/i }))
    expect(screen.getByLabelText('Sat: 1 habits completed')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /undo run for today/i }))
    expect(screen.getByLabelText('Sat: 0 habits completed')).toBeInTheDocument()
  })
})
