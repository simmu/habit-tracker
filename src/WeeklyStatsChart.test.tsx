import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WeeklyStatsChart from './WeeklyStatsChart'
import type { Habit } from './types'

// Fix "today" to a Wednesday so we have known past / future days
const TODAY = '2024-06-12' // Wednesday

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(TODAY + 'T12:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
})

function makeHabit(id: string, completedDates: string[]): Habit {
  return { id, name: id, completedDates }
}

describe('WeeklyStatsChart', () => {
  it('renders a "This Week" heading', () => {
    render(<WeeklyStatsChart habits={[]} today={TODAY} />)
    expect(screen.getByRole('heading', { name: /this week/i })).toBeInTheDocument()
  })

  it('renders exactly 7 bars', () => {
    render(<WeeklyStatsChart habits={[]} today={TODAY} />)
    const bars = screen.getAllByTestId(/^bar-/)
    expect(bars).toHaveLength(7)
  })

  it('renders all day labels Mon–Sun', () => {
    render(<WeeklyStatsChart habits={[]} today={TODAY} />)
    for (const label of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('today\'s bar has the --today modifier class', () => {
    render(<WeeklyStatsChart habits={[]} today={TODAY} />)
    const todayBar = screen.getByTestId('bar-wed')
    expect(todayBar.className).toContain('week-chart__bar--today')
  })

  it('future bars have the --future modifier class', () => {
    render(<WeeklyStatsChart habits={[]} today={TODAY} />)
    // Thu, Fri, Sat, Sun are future (indices 3–6)
    for (const day of ['thu', 'fri', 'sat', 'sun']) {
      const bar = screen.getByTestId(`bar-${day}`)
      expect(bar.className).toContain('week-chart__bar--future')
    }
  })

  it('past/today bars do NOT have the --future modifier class', () => {
    render(<WeeklyStatsChart habits={[]} today={TODAY} />)
    for (const day of ['mon', 'tue', 'wed']) {
      const bar = screen.getByTestId(`bar-${day}`)
      expect(bar.className).not.toContain('week-chart__bar--future')
    }
  })

  it('bar aria-label reflects the completion count', () => {
    const habits = [
      makeHabit('a', ['2024-06-10']), // Mon
      makeHabit('b', ['2024-06-10']), // Mon
    ]
    render(<WeeklyStatsChart habits={habits} today={TODAY} />)
    expect(screen.getByLabelText('Mon: 2 habits completed')).toBeInTheDocument()
  })

  it('shows a tooltip on hover with the correct count', () => {
    const habits = [makeHabit('a', [TODAY])]
    render(<WeeklyStatsChart habits={habits} today={TODAY} />)

    const wedCol = screen.getByTestId('bar-wed').closest('.week-chart__col')!
    fireEvent.mouseEnter(wedCol)

    expect(screen.getByRole('tooltip')).toHaveTextContent('1 habit completed')
  })

  it('tooltip disappears on mouse leave', () => {
    render(<WeeklyStatsChart habits={[]} today={TODAY} />)
    const monCol = screen.getByTestId('bar-mon').closest('.week-chart__col')!

    fireEvent.mouseEnter(monCol)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseLeave(monCol)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('uses plural "habits" in tooltip when count != 1', () => {
    const habits = [makeHabit('a', [TODAY]), makeHabit('b', [TODAY])]
    render(<WeeklyStatsChart habits={habits} today={TODAY} />)

    const wedCol = screen.getByTestId('bar-wed').closest('.week-chart__col')!
    fireEvent.mouseEnter(wedCol)

    expect(screen.getByRole('tooltip')).toHaveTextContent('2 habits completed')
  })

  it('uses singular "habit" in tooltip when count is 1', () => {
    const habits = [makeHabit('a', [TODAY])]
    render(<WeeklyStatsChart habits={habits} today={TODAY} />)

    const wedCol = screen.getByTestId('bar-wed').closest('.week-chart__col')!
    fireEvent.mouseEnter(wedCol)

    expect(screen.getByRole('tooltip')).toHaveTextContent('1 habit completed')
  })
})
