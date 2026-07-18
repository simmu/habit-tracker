import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HabitRow from './HabitRow'
import type { Habit } from './types'

const TODAY = '2024-06-15'
const YESTERDAY = '2024-06-14'

// Only fake the Date object – leave setTimeout/Promise intact so userEvent works.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(TODAY + 'T12:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
})

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'habit-1',
    name: 'Exercise',
    completedDates: [],
    ...overrides,
  }
}

function renderRow(habit: Habit, onToggle = vi.fn()) {
  return render(
    <ul>
      <HabitRow habit={habit} onToggle={onToggle} />
    </ul>,
  )
}

describe('HabitRow', () => {
  it('renders the habit name', () => {
    renderRow(makeHabit())
    expect(screen.getByText('Exercise')).toBeInTheDocument()
  })

  it('shows streak of 0 when no dates are completed', () => {
    renderRow(makeHabit())
    expect(screen.getByLabelText(/0 day streak/i)).toBeInTheDocument()
  })

  it('shows streak of 1 when only today is completed', () => {
    renderRow(makeHabit({ completedDates: [TODAY] }))
    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()
  })

  it('shows streak of 2 when today and yesterday are completed', () => {
    renderRow(makeHabit({ completedDates: [TODAY, YESTERDAY] }))
    expect(screen.getByLabelText(/2 day streak/i)).toBeInTheDocument()
  })

  it('shows streak of 1 when only yesterday is completed', () => {
    renderRow(makeHabit({ completedDates: [YESTERDAY] }))
    expect(screen.getByLabelText(/1 day streak/i)).toBeInTheDocument()
  })

  it('shows a "Mark done" button when not yet completed today', () => {
    renderRow(makeHabit())
    expect(screen.getByRole('button', { name: /mark exercise as done/i })).toBeInTheDocument()
  })

  it('shows a "✓ Done" button when already completed today', () => {
    renderRow(makeHabit({ completedDates: [TODAY] }))
    expect(
      screen.getByRole('button', { name: /exercise done today, click to undo/i }),
    ).toBeInTheDocument()
  })

  it('calls onToggle with the habit id when the button is clicked', async () => {
    const onToggle = vi.fn()
    renderRow(makeHabit(), onToggle)
    await userEvent.click(screen.getByRole('button', { name: /mark exercise as done/i }))
    expect(onToggle).toHaveBeenCalledOnce()
    expect(onToggle).toHaveBeenCalledWith('habit-1')
  })

  it('calls onToggle with the habit id when undoing a completed habit', async () => {
    const onToggle = vi.fn()
    renderRow(makeHabit({ completedDates: [TODAY] }), onToggle)
    await userEvent.click(screen.getByRole('button', { name: /exercise done today, click to undo/i }))
    expect(onToggle).toHaveBeenCalledOnce()
    expect(onToggle).toHaveBeenCalledWith('habit-1')
  })
})
