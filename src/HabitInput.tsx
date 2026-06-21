import { useState } from 'react'

interface Props {
  onAdd: (name: string) => void
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
    <input
      className="habit-input"
      type="text"
      placeholder="Type a habit name and press Enter…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      aria-label="New habit name"
    />
  )
}
