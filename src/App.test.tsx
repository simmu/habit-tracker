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

describe('App – search / filter', () => {
  it('renders the search box above the habit list', () => {
    render(<App />)
    expect(screen.getByRole('searchbox', { name: /search habits/i })).toBeInTheDocument()
  })

  it('filters habits by the typed search text (case-insensitive)', async () => {
    render(<App />)
    const addInput = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(addInput, 'Morning run{Enter}')
    await userEvent.type(addInput, 'Evening yoga{Enter}')

    const searchBox = screen.getByRole('searchbox', { name: /search habits/i })
    await userEvent.type(searchBox, 'RUN')

    expect(screen.getByText('Morning run')).toBeInTheDocument()
    expect(screen.queryByText('Evening yoga')).not.toBeInTheDocument()
  })

  it('shows all habits when the search box is empty', async () => {
    render(<App />)
    const addInput = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(addInput, 'Morning run{Enter}')
    await userEvent.type(addInput, 'Evening yoga{Enter}')

    const searchBox = screen.getByRole('searchbox', { name: /search habits/i })
    await userEvent.type(searchBox, 'run')
    await userEvent.clear(searchBox)

    expect(screen.getByText('Morning run')).toBeInTheDocument()
    expect(screen.getByText('Evening yoga')).toBeInTheDocument()
  })

  it('shows "No habits match your search" when nothing matches', async () => {
    render(<App />)
    const addInput = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(addInput, 'Morning run{Enter}')

    const searchBox = screen.getByRole('searchbox', { name: /search habits/i })
    await userEvent.type(searchBox, 'zzz')

    expect(screen.getByText(/no habits match your search/i)).toBeInTheDocument()
  })

  it('the × button clears the search and restores all habits', async () => {
    render(<App />)
    const addInput = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(addInput, 'Morning run{Enter}')
    await userEvent.type(addInput, 'Evening yoga{Enter}')

    const searchBox = screen.getByRole('searchbox', { name: /search habits/i })
    await userEvent.type(searchBox, 'run')

    expect(screen.queryByText('Evening yoga')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /clear search/i }))

    expect(screen.getByText('Morning run')).toBeInTheDocument()
    expect(screen.getByText('Evening yoga')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })

  it('× button is absent when the search box is empty', async () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })

  it('shows a new habit that matches the active search filter', async () => {
    render(<App />)
    const addInput = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(addInput, 'Morning run{Enter}')

    const searchBox = screen.getByRole('searchbox', { name: /search habits/i })
    await userEvent.type(searchBox, 'run')

    // Adding a matching habit while search is active
    await userEvent.type(addInput, 'Evening run{Enter}')
    expect(screen.getByText('Evening run')).toBeInTheDocument()
  })

  it('hides a new habit that does not match the active search filter', async () => {
    render(<App />)
    const addInput = screen.getByRole('textbox', { name: /new habit name/i })
    await userEvent.type(addInput, 'Morning run{Enter}')

    const searchBox = screen.getByRole('searchbox', { name: /search habits/i })
    await userEvent.type(searchBox, 'run')

    // Adding a non-matching habit while search is active
    await userEvent.type(addInput, 'Evening yoga{Enter}')
    expect(screen.queryByText('Evening yoga')).not.toBeInTheDocument()
    expect(screen.getByText('Morning run')).toBeInTheDocument()
  })

  it('search box and add-habit input are visually distinct (different CSS classes)', () => {
    render(<App />)
    const addInput = screen.getByRole('textbox', { name: /new habit name/i })
    const searchBox = screen.getByRole('searchbox', { name: /search habits/i })

    expect(addInput.className).not.toBe(searchBox.className)
  })
})
