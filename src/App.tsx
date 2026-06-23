import { useState, useEffect } from 'react'
import HabitInput from './HabitInput'
import HabitList from './HabitList'
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

  function completeHabit(id: string) {
    const today = todayISO()
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id && !h.completedDates.includes(today)
          ? { ...h, completedDates: [...h.completedDates, today] }
          : h,
      ),
    )
  }

  return (
    <main className="app">
      <h1 className="app-title">Habit Tracker</h1>
      <HabitInput onAdd={addHabit} />
      <HabitList habits={habits} onComplete={completeHabit} />
    </main>
  )
}

export default App
