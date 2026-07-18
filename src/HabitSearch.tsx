interface Props {
  value: string
  onChange: (value: string) => void
}

export default function HabitSearch({ value, onChange }: Props) {
  return (
    <div className="habit-search-wrapper">
      <input
        className="habit-search"
        type="search"
        placeholder="Search habits…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search habits"
      />
      {value && (
        <button
          className="habit-search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}
