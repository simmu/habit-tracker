import HabitRow from './HabitRow'
import type { Habit } from './types'

interface Props {
  habits: Habit[]
  onToggle: (id: string) => void
}

function RingIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

export default function HabitList({ habits, onToggle }: Props) {
  if (habits.length === 0) {
    return (
      <p className="habit-empty">
        <span className="habit-empty__mark" aria-hidden="true">
          <RingIcon />
        </span>
        <span>No habits yet. Add one above!</span>
      </p>
    )
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitRow key={habit.id} habit={habit} onToggle={onToggle} />
      ))}
    </ul>
  )
}
