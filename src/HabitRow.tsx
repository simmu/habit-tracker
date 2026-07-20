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

const SKIP_DELETE_CONFIRMATION_KEY = 'habit-tracker:skipDeleteConfirmation'

function loadSkipDeleteConfirmation(): boolean {
  try {
    return localStorage.getItem(SKIP_DELETE_CONFIRMATION_KEY) === 'true'
  } catch {
    return false
  }
}

function saveSkipDeleteConfirmation(skip: boolean): void {
  try {
    if (skip) {
      localStorage.setItem(SKIP_DELETE_CONFIRMATION_KEY, 'true')
    } else {
      localStorage.removeItem(SKIP_DELETE_CONFIRMATION_KEY)
    }
  } catch {
    // ignore storage errors
  }
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
  const [doNotAskAgain, setDoNotAskAgain] = useState(false)
  const [skipConfirmation, setSkipConfirmation] = useState(() => loadSkipDeleteConfirmation())

  const handleConfirm = useCallback(() => {
    setShowConfirm(false)
    if (doNotAskAgain) {
      saveSkipDeleteConfirmation(true)
      setSkipConfirmation(true)
    }
    onDelete(habit.id)
  }, [onDelete, habit.id, doNotAskAgain])

  const handleCancel = useCallback(() => {
    setShowConfirm(false)
    setDoNotAskAgain(false)
  }, [])

  const handleDeleteClick = useCallback(() => {
    if (skipConfirmation) {
      onDelete(habit.id)
    } else {
      setShowConfirm(true)
    }
  }, [skipConfirmation, onDelete, habit.id])

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
            onClick={handleDeleteClick}
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
          showDoNotAskAgain
          doNotAskAgain={doNotAskAgain}
          onDoNotAskAgainChange={setDoNotAskAgain}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />,
        document.body,
      )}
    </>
  )
}
