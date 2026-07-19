import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HabitList from './HabitList'
import type { Habit } from './types'

function makeHabit(name: string, completedDates: string[] = []): Habit {
  return { id: name, name, completedDates }
}

describe('HabitList', () => {
  it('shows an empty-state message when there are no habits', () => {
    render(<HabitList habits={[]} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument()
  })

  it('renders each habit as a list item', () => {
    const habits = [makeHabit('Exercise'), makeHabit('Read'), makeHabit('Meditate')]
    render(<HabitList habits={habits} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Exercise')).toBeInTheDocument()
    expect(screen.getByText('Read')).toBeInTheDocument()
    expect(screen.getByText('Meditate')).toBeInTheDocument()
  })

  it('does not show the empty-state message when habits exist', () => {
    render(<HabitList habits={[makeHabit('Hydrate')]} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/no habits yet/i)).not.toBeInTheDocument()
  })

  it('renders the correct number of list items', () => {
    const habits = [makeHabit('A'), makeHabit('B'), makeHabit('C')]
    render(<HabitList habits={habits} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
