import { computeStreak, todayISO } from './useStreak'
import type { Habit } from './types'

interface Props {
  habit: Habit
  onToggle: (id: string) => void
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function HabitRow({ habit, onToggle }: Props) {
  const today = todayISO()
  const completedToday = habit.completedDates.includes(today)
  const streak = computeStreak(habit.completedDates)

  return (
    <li className="habit-item">
      <span className="habit-name">{habit.name}</span>

      <div className="habit-actions">
        <span
          className="habit-streak"
          aria-label={`${streak} day streak`}
          title={`${streak}-day streak`}
        >
          🔥 {streak}
        </span>

        <button
          type="button"
          className={`habit-check${completedToday ? ' habit-check--done' : ''}`}
          onClick={() => onToggle(habit.id)}
          aria-label={
            completedToday
              ? `${habit.name} done today, click to undo`
              : `Mark ${habit.name} as done`
          }
          aria-pressed={completedToday}
        >
          {completedToday && <CheckIcon />}
        </button>
      </div>
    </li>
  )
}
