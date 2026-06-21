import HabitRow from './HabitRow'
import type { Habit } from './types'

interface Props {
  habits: Habit[]
  onComplete: (id: string) => void
}

export default function HabitList({ habits, onComplete }: Props) {
  if (habits.length === 0) {
    return <p className="habit-empty">No habits yet. Add one above!</p>
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitRow key={habit.id} habit={habit} onComplete={onComplete} />
      ))}
    </ul>
  )
}
