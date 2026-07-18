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

function getProgressRing() {
  return screen.getByRole('img', { name: /% complete/i })
}

function getProgressText() {
  return screen.getByText(/of \d+ habits done/i)
}

function addHabit(name: string) {
  return userEvent.type(screen.getByRole('textbox', { name: /new habit name/i }), `${name}{Enter}`)
}

function markDone(name: string) {
  return userEvent.click(screen.getByRole('button', { name: new RegExp(`mark ${name} as done`, 'i') }))
}

function undo(name: string) {
  return userEvent.click(screen.getByRole('button', { name: new RegExp(`${name} done today, click to undo`, 'i') }))
}

function getThemeToggle() {
  return screen.getByRole('button', { name: /switch to (light|dark) mode/i })
}

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
    await addHabit('Morning run')

    expect(screen.getByText('Morning run')).toBeInTheDocument()
    expect(screen.queryByText(/no habits yet/i)).not.toBeInTheDocument()
  })

  it('can add multiple habits one after another', async () => {
    render(<App />)
    await addHabit('Drink water')
    await addHabit('Stretch')

    expect(screen.getByText('Drink water')).toBeInTheDocument()
    expect(screen.getByText('Stretch')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})

describe('App – streak flow', () => {
  it('shows a streak of 0 for a newly added habit', async () => {
    render(<App />)
    await addHabit('Read')

    expect(screen.getByLabelText(/0 day streak/i)).toBeInTheDocument()
  })

  it('increments the streak to 1 after marking a habit done', async () => {
    render(<App />)
    await addHabit('Meditate')

    await markDone('Meditate')

    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()
  })

  it('allows toggling a habit back off', async () => {
    render(<App />)
    await addHabit('Stretch')

    await markDone('Stretch')
    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()

    await undo('Stretch')
    expect(screen.getByLabelText(/0 day streak/i)).toBeInTheDocument()
  })
})

describe('App – progress ring', () => {
  it('appears on the main habit list screen', () => {
    render(<App />)
    expect(getProgressRing()).toBeInTheDocument()
  })

  it('shows 0% complete when no habits are checked in today', async () => {
    render(<App />)
    await addHabit('Read')

    expect(getProgressRing()).toHaveAttribute('aria-label', '0% complete')
    expect(getProgressText()).toHaveTextContent('0 of 1 habits done')
  })

  it('increases the ring fill and percentage when a habit is checked', async () => {
    render(<App />)
    await addHabit('Read')
    await addHabit('Run')

    await markDone('Read')

    expect(getProgressRing()).toHaveAttribute('aria-label', '50% complete')
    expect(getProgressText()).toHaveTextContent('1 of 2 habits done')
  })

  it('decreases the ring fill and percentage when a habit is unchecked', async () => {
    render(<App />)
    await addHabit('Read')
    await addHabit('Run')

    await markDone('Read')
    await markDone('Run')
    expect(getProgressRing()).toHaveAttribute('aria-label', '100% complete')

    await undo('Run')

    expect(getProgressRing()).toHaveAttribute('aria-label', '50% complete')
    expect(getProgressText()).toHaveTextContent('1 of 2 habits done')
  })

  it('shows 100% complete when all habits are checked in today', async () => {
    render(<App />)
    await addHabit('Read')
    await addHabit('Run')

    await markDone('Read')
    await markDone('Run')

    expect(getProgressRing()).toHaveAttribute('aria-label', '100% complete')
    expect(getProgressText()).toHaveTextContent('2 of 2 habits done')
  })

  it('keeps the percentage text matching the fill level', async () => {
    render(<App />)
    await addHabit('A')
    await addHabit('B')
    await addHabit('C')

    await markDone('A')
    expect(getProgressRing()).toHaveAttribute('aria-label', '33% complete')
    expect(screen.getByText('33%')).toBeInTheDocument()

    await markDone('B')
    expect(getProgressRing()).toHaveAttribute('aria-label', '67% complete')
    expect(screen.getByText('67%')).toBeInTheDocument()
  })
})

describe('App – persistence', () => {
  it('restores habits and streaks after a simulated page refresh', async () => {
    // First "session": add a habit and mark it done
    const { unmount } = render(<App />)
    await addHabit('Yoga')
    await markDone('Yoga')
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
    await addHabit('Run')
    await addHabit('Read')
    await markDone('Run')
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

describe('App – dark mode toggle', () => {
  it('shows a theme toggle on the main habit view', () => {
    render(<App />)
    expect(getThemeToggle()).toBeInTheDocument()
  })

  it('toggles the whole app to dark mode and back', async () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: /switch to dark mode/i })

    await userEvent.click(toggle)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    await userEvent.click(screen.getByRole('button', { name: /switch to light mode/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('remembers the chosen mode across reloads', async () => {
    const { unmount } = render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }))
    unmount()

    render(<App />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })
})
