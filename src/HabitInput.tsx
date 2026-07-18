import { useState } from 'react'

interface Props {
  onAdd: (name: string) => void
}

function RingIcon() {
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
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

export default function HabitInput({ onAdd }: Props) {
  const [value, setValue] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmed = value.trim()
      if (trimmed) {
        onAdd(trimmed)
        setValue('')
      }
    }
  }

  return (
    <div className="habit-input-wrap">
      <span className="habit-input__icon" aria-hidden="true">
        <RingIcon />
      </span>
      <input
        className="habit-input"
        type="text"
        placeholder="Type a habit name and press Enter…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="New habit name"
      />
    </div>
  )
}
