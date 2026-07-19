import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import ConfirmDialog from './ConfirmDialog'
import { computeStreak, todayISO } from './useStreak'
import type { Habit } from './types'

interface Props {
  habit: Habit
  onToggle: (id: string) => void
  onDelete: (id: string) => void
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

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

export default function HabitRow({ habit, onToggle, onDelete }: Props) {
  const today = todayISO()
  const completedToday = habit.completedDates.includes(today)
  const streak = computeStreak(habit.completedDates)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirm = useCallback(() => {
    setShowConfirm(false)
    onDelete(habit.id)
  }, [onDelete, habit.id])

  const handleCancel = useCallback(() => {
    setShowConfirm(false)
  }, [])

  return (
    <>
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
            className="habit-delete"
            onClick={() => setShowConfirm(true)}
            aria-label={`Delete ${habit.name}`}
            title={`Delete ${habit.name}`}
          >
            <TrashIcon />
          </button>

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
      {createPortal(
        <ConfirmDialog
          isOpen={showConfirm}
          title={`Delete "${habit.name}"?`}
          message={`This will permanently delete "${habit.name}" and its entire check-in history. This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />,
        document.body,
      )}
    </>
  )
}
