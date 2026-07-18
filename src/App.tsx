import { useState, useEffect } from 'react'
import HabitInput from './HabitInput'
import HabitList from './HabitList'
import ProgressRing from './ProgressRing'
import { todayISO } from './useStreak'
import type { Habit } from './types'
import './App.css'

const STORAGE_KEY = 'habit-tracker:habits'

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Habit[]
  } catch {
    return []
  }
}

function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}

function computeTodayProgress(habits: Habit[]): { percentage: number; completed: number; total: number } {
  const today = todayISO()
  const total = habits.length
  const completed = habits.filter((h) => h.completedDates.includes(today)).length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { percentage, completed, total }
}

function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits)

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  function addHabit(name: string) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      completedDates: [],
    }
    setHabits((prev) => [...prev, newHabit])
  }

  function toggleHabit(id: string) {
    const today = todayISO()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const completedToday = h.completedDates.includes(today)
        if (completedToday) {
          return { ...h, completedDates: h.completedDates.filter((d) => d !== today) }
        }
        return { ...h, completedDates: [...h.completedDates, today] }
      }),
    )
  }

  const { percentage, completed, total } = computeTodayProgress(habits)

  return (
    <main className="app">
      <h1 className="app-title">Habit Tracker</h1>
      <HabitInput onAdd={addHabit} />
      <section className="progress-section" aria-label="Today's progress">
        <ProgressRing percentage={percentage} />
        <span className="progress-text">{completed} of {total} habits done</span>
      </section>
      <HabitList habits={habits} onToggle={toggleHabit} />
    </main>
  )
}

export default App
