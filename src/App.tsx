import { useState } from 'react'
import HabitInput from './HabitInput'
import HabitList from './HabitList'
import { todayISO } from './useStreak'
import type { Habit } from './types'
import './App.css'

function App() {
  const [habits, setHabits] = useState<Habit[]>([])

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
