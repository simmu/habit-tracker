import type { Habit } from './types'

/** Short day labels in week order. */
export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export interface DayStat {
  /** Short label, e.g. "Mon" */
  label: (typeof DAY_LABELS)[number]
  /** ISO date string for that day, e.g. "2024-06-10" */
  date: string
  /** Number of habits completed on that day */
  count: number
  /** Whether this day is today */
  isToday: boolean
  /** Whether this day is in the future (after today) */
  isFuture: boolean
}

/**
 * Returns stats for each day of the current ISO week (Mon–Sun).
 *
 * @param habits  The full list of habits.
 * @param today   Today's ISO date string (YYYY-MM-DD). Defaults to real today.
 */
export function getWeeklyStats(habits: Habit[], today?: string): DayStat[] {
  const todayStr = today ?? new Date().toISOString().slice(0, 10)
  const todayDate = new Date(todayStr + 'T00:00:00Z')

  // ISO week starts on Monday (day-of-week 1).
  // getUTCDay() returns 0=Sun, 1=Mon … 6=Sat.
  const dow = todayDate.getUTCDay() // 0–6
  const daysSinceMonday = (dow + 6) % 7 // 0=Mon … 6=Sun
  const monday = new Date(todayDate.getTime() - daysSinceMonday * 86_400_000)

  return DAY_LABELS.map((label, i) => {
    const date = new Date(monday.getTime() + i * 86_400_000)
    const dateStr = date.toISOString().slice(0, 10)
    const count = habits.filter((h) => h.completedDates.includes(dateStr)).length
    return {
      label,
      date: dateStr,
      count,
      isToday: dateStr === todayStr,
      isFuture: dateStr > todayStr,
    }
  })
}
