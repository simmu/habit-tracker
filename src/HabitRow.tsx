import { computeStreak, todayISO } from './useStreak'
import type { Habit } from './types'

interface Props {
  habit: Habit
  onToggle: (id: string) => void
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
          className={`habit-done-btn${completedToday ? ' habit-done-btn--done' : ''}`}
          onClick={() => onToggle(habit.id)}
          aria-label={
            completedToday
              ? `${habit.name} done today, click to undo`
              : `Mark ${habit.name} as done`
          }
        >
          {completedToday ? '✓ Done' : 'Mark done'}
        </button>
      </div>
    </li>
  )
}
