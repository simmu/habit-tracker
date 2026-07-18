import { useState, useEffect, useRef } from 'react'
import HabitInput from './HabitInput'
import HabitList from './HabitList'
import ProgressRing from './ProgressRing'
import ThemeToggle from './ThemeToggle'
import Celebration from './Celebration'
import { playCelebrationSound } from './celebrationSound'
import { todayISO } from './useStreak'
import type { Habit } from './types'
import './App.css'

const STORAGE_KEY = 'habit-tracker:habits'
const CELEBRATION_DURATION_MS = 4000

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
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationKey, setCelebrationKey] = useState(0)
  const celebratedRef = useRef(false)
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  useEffect(() => {
    return () => {
      if (celebrationTimerRef.current) {
        clearTimeout(celebrationTimerRef.current)
      }
    }
  }, [])

  const { percentage, completed, total } = computeTodayProgress(habits)

  function clearCelebration() {
    setShowCelebration(false)
    celebratedRef.current = false
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current)
      celebrationTimerRef.current = null
    }
  }

  function triggerCelebration() {
    if (celebratedRef.current) return
    celebratedRef.current = true
    setCelebrationKey((prev) => prev + 1)
    setShowCelebration(true)
    playCelebrationSound()
    celebrationTimerRef.current = setTimeout(() => {
      setShowCelebration(false)
    }, CELEBRATION_DURATION_MS)
  }

  function addHabit(name: string) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      completedDates: [],
    }
    setHabits((prev) => [...prev, newHabit])
    clearCelebration()
  }

  function toggleHabit(id: string) {
    const today = todayISO()
    const nextHabits = habits.map((h) => {
      if (h.id !== id) return h
      const completedToday = h.completedDates.includes(today)
      if (completedToday) {
        return { ...h, completedDates: h.completedDates.filter((d) => d !== today) }
      }
      return { ...h, completedDates: [...h.completedDates, today] }
    })

    setHabits(nextHabits)

    const { completed: nextCompleted, total: nextTotal } = computeTodayProgress(nextHabits)
    const allDone = nextTotal > 0 && nextCompleted === nextTotal

    if (!allDone) {
      clearCelebration()
    } else {
      triggerCelebration()
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">Habit Tracker</h1>
        <ThemeToggle />
      </header>
      <HabitInput onAdd={addHabit} />
      <section className="progress-section" aria-label="Today's progress">
        <ProgressRing percentage={percentage} />
        <span className="progress-text">{completed} of {total} habits done</span>
      </section>
      <Celebration key={celebrationKey} show={showCelebration} />
      <HabitList habits={habits} onToggle={toggleHabit} />
    </main>
  )
}

export default App
