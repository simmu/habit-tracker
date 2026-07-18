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

function renderRow(habit: Habit, onComplete = vi.fn()) {
  return render(
    <ul>
      <HabitRow habit={habit} onComplete={onComplete} />
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

  it('shows an "Undo" button when already completed today', () => {
    renderRow(makeHabit({ completedDates: [TODAY] }))
    expect(
      screen.getByRole('button', { name: /undo exercise for today/i }),
    ).toBeInTheDocument()
  })

  it('calls onComplete with the habit id when the "Mark done" button is clicked', async () => {
    const onComplete = vi.fn()
    renderRow(makeHabit(), onComplete)
    await userEvent.click(screen.getByRole('button', { name: /mark exercise as done/i }))
    expect(onComplete).toHaveBeenCalledOnce()
    expect(onComplete).toHaveBeenCalledWith('habit-1')
  })

  it('calls onComplete with the habit id when the "Undo" button is clicked', async () => {
    const onComplete = vi.fn()
    renderRow(makeHabit({ completedDates: [TODAY] }), onComplete)
    await userEvent.click(screen.getByRole('button', { name: /undo exercise for today/i }))
    expect(onComplete).toHaveBeenCalledOnce()
    expect(onComplete).toHaveBeenCalledWith('habit-1')
  })

  it('the done button is not disabled so it can be toggled', () => {
    renderRow(makeHabit({ completedDates: [TODAY] }))
    expect(screen.getByRole('button', { name: /undo exercise for today/i })).not.toBeDisabled()
  })
})
