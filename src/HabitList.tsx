import HabitRow from './HabitRow'
import type { Habit } from './types'

interface Props {
  habits: Habit[]
  onComplete: (id: string) => void
  /** True when a search query is active, used to show the correct empty message. */
  searchActive?: boolean
}

export default function HabitList({ habits, onComplete, searchActive = false }: Props) {
  if (habits.length === 0) {
    return searchActive ? (
      <p className="habit-empty">No habits match your search</p>
    ) : (
      <p className="habit-empty">No habits yet. Add one above!</p>
    )
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitRow key={habit.id} habit={habit} onComplete={onComplete} />
      ))}
    </ul>
  )
}
