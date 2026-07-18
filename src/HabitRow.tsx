import { computeStreak, todayISO } from './useStreak'
import type { Habit } from './types'

interface Props {
  habit: Habit
  onComplete: (id: string) => void
}

export default function HabitRow({ habit, onComplete }: Props) {
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
          onClick={() => onComplete(habit.id)}
          aria-label={
            completedToday
              ? `Undo ${habit.name} for today`
              : `Mark ${habit.name} as done`
          }
        >
          {completedToday ? '✓ Done' : 'Mark done'}
        </button>
      </div>
    </li>
  )
}
