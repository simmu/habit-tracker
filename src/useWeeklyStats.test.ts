import { describe, it, expect } from 'vitest'
import { getWeeklyStats } from './useWeeklyStats'
import type { Habit } from './types'

function makeHabit(id: string, completedDates: string[]): Habit {
  return { id, name: id, completedDates }
}

// 2024-06-12 is a Wednesday
const WEDNESDAY = '2024-06-12'
// Week of 2024-06-12: Mon 06-10 … Sun 06-16
const MON = '2024-06-10'
const TUE = '2024-06-11'
const WED = '2024-06-12'
const THU = '2024-06-13'
const FRI = '2024-06-14'
const SAT = '2024-06-15'
const SUN = '2024-06-16'

describe('getWeeklyStats', () => {
  it('returns exactly 7 entries labelled Mon–Sun', () => {
    const stats = getWeeklyStats([], WEDNESDAY)
    expect(stats).toHaveLength(7)
    expect(stats.map((s) => s.label)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  })

  it('returns the correct ISO dates for each day of the week', () => {
    const stats = getWeeklyStats([], WEDNESDAY)
    expect(stats[0].date).toBe(MON)
    expect(stats[1].date).toBe(TUE)
    expect(stats[2].date).toBe(WED)
    expect(stats[3].date).toBe(THU)
    expect(stats[4].date).toBe(FRI)
    expect(stats[5].date).toBe(SAT)
    expect(stats[6].date).toBe(SUN)
  })

  it('marks only today as isToday', () => {
    const stats = getWeeklyStats([], WEDNESDAY)
    expect(stats.filter((s) => s.isToday)).toHaveLength(1)
    expect(stats[2].isToday).toBe(true) // Wednesday
    expect(stats[0].isToday).toBe(false)
  })

  it('marks days after today as isFuture', () => {
    const stats = getWeeklyStats([], WEDNESDAY)
    // Wednesday is index 2; Thu, Fri, Sat, Sun should be future
    expect(stats[0].isFuture).toBe(false) // Mon
    expect(stats[1].isFuture).toBe(false) // Tue
    expect(stats[2].isFuture).toBe(false) // Wed (today)
    expect(stats[3].isFuture).toBe(true)  // Thu
    expect(stats[4].isFuture).toBe(true)  // Fri
    expect(stats[5].isFuture).toBe(true)  // Sat
    expect(stats[6].isFuture).toBe(true)  // Sun
  })

  it('counts 0 habits when no habits exist', () => {
    const stats = getWeeklyStats([], WEDNESDAY)
    expect(stats.every((s) => s.count === 0)).toBe(true)
  })

  it('counts habits completed on a given day', () => {
    const habits = [
      makeHabit('a', [MON, WED]),
      makeHabit('b', [MON]),
      makeHabit('c', []),
    ]
    const stats = getWeeklyStats(habits, WEDNESDAY)
    expect(stats[0].count).toBe(2) // Mon: a + b
    expect(stats[1].count).toBe(0) // Tue
    expect(stats[2].count).toBe(1) // Wed: a
  })

  it('works when today is Monday', () => {
    const stats = getWeeklyStats([], MON)
    expect(stats[0].isToday).toBe(true)
    expect(stats[0].isFuture).toBe(false)
    expect(stats.slice(1).every((s) => s.isFuture)).toBe(true)
  })

  it('works when today is Sunday', () => {
    const stats = getWeeklyStats([], SUN)
    expect(stats[6].isToday).toBe(true)
    expect(stats.slice(0, 6).every((s) => s.isFuture === false)).toBe(true)
    expect(stats[6].isFuture).toBe(false)
  })
})
