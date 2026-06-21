import { describe, it, expect } from 'vitest'
import { computeStreak } from './useStreak'

const TODAY = '2024-06-15'
const YESTERDAY = '2024-06-14'
const TWO_DAYS_AGO = '2024-06-13'
const THREE_DAYS_AGO = '2024-06-12'

describe('computeStreak', () => {
  it('returns 0 when there are no completions', () => {
    expect(computeStreak([], TODAY)).toBe(0)
  })

  it('returns 1 when only today is completed', () => {
    expect(computeStreak([TODAY], TODAY)).toBe(1)
  })

  it('returns 1 when only yesterday is completed (today not done yet)', () => {
    expect(computeStreak([YESTERDAY], TODAY)).toBe(1)
  })

  it('returns 2 when today and yesterday are completed', () => {
    expect(computeStreak([TODAY, YESTERDAY], TODAY)).toBe(2)
  })

  it('returns 3 for three consecutive days ending on today', () => {
    expect(computeStreak([TODAY, YESTERDAY, TWO_DAYS_AGO], TODAY)).toBe(3)
  })

  it('returns 3 for three consecutive days ending on yesterday', () => {
    expect(computeStreak([YESTERDAY, TWO_DAYS_AGO, THREE_DAYS_AGO], TODAY)).toBe(3)
  })

  it('resets (returns 1) when there is a gap: today done but day-before-yesterday missed', () => {
    // completed today and two days ago but NOT yesterday → streak = 1 (only today)
    expect(computeStreak([TODAY, TWO_DAYS_AGO], TODAY)).toBe(1)
  })

  it('returns 0 when the last completion was two days ago (both today and yesterday missed)', () => {
    expect(computeStreak([TWO_DAYS_AGO], TODAY)).toBe(0)
  })

  it('counts each calendar day only once even with duplicate entries', () => {
    expect(computeStreak([TODAY, TODAY, YESTERDAY, YESTERDAY], TODAY)).toBe(2)
  })

  it('ignores future dates beyond today', () => {
    const tomorrow = '2024-06-16'
    // Only yesterday and today are before/on today; tomorrow should be ignored
    expect(computeStreak([YESTERDAY, TODAY, tomorrow], TODAY)).toBe(2)
  })

  it('handles a long unbroken streak', () => {
    const dates: string[] = []
    const base = new Date(TODAY + 'T00:00:00Z')
    for (let i = 0; i < 30; i++) {
      const d = new Date(base.getTime() - i * 86_400_000)
      dates.push(d.toISOString().slice(0, 10))
    }
    expect(computeStreak(dates, TODAY)).toBe(30)
  })

  it('breaks a long streak correctly when one day is missing', () => {
    const dates: string[] = []
    const base = new Date(TODAY + 'T00:00:00Z')
    for (let i = 0; i < 10; i++) {
      if (i === 3) continue // skip day 3 ago → gap
      const d = new Date(base.getTime() - i * 86_400_000)
      dates.push(d.toISOString().slice(0, 10))
    }
    // streak from today backward: today, yesterday, 2-days-ago → then gap at 3 days ago
    expect(computeStreak(dates, TODAY)).toBe(3)
  })
})
