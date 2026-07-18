import HabitRow from './HabitRow'
import type { Habit } from './types'

interface Props {
  habits: Habit[]
  onToggle: (id: string) => void
}

export default function HabitList({ habits, onToggle }: Props) {
  if (habits.length === 0) {
    return <p className="habit-empty">No habits yet. Add one above!</p>
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitRow key={habit.id} habit={habit} onToggle={onToggle} />
      ))}
    </ul>
  )
}
