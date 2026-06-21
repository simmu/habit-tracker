/**
 * Computes the current streak for a habit given its list of completed dates.
 *
 * Rules:
 *  - A "streak" is the number of consecutive calendar days ending on today
 *    (or yesterday, if today has not been completed yet).
 *  - If the most recent completion is before yesterday the streak is 0.
 *  - Each unique calendar day counts once regardless of how many times it
 *    appears in completedDates.
 *
 * @param completedDates  ISO-8601 date strings (YYYY-MM-DD), order irrelevant.
 * @param today           The reference date (defaults to the current day).
 *                        Injected as a parameter so tests are deterministic.
 */
export function computeStreak(completedDates: string[], today?: string): number {
  const todayStr = today ?? new Date().toISOString().slice(0, 10)

  // Build a Set of unique date strings
  const dateSet = new Set(completedDates)

  // Walk backwards from today counting consecutive days
  let streak = 0
  let cursor = new Date(todayStr + 'T00:00:00Z')

  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor = new Date(cursor.getTime() - 86_400_000) // go back one day
  }

  // If today wasn't completed, allow streak to still show from yesterday
  if (streak === 0) {
    cursor = new Date(new Date(todayStr + 'T00:00:00Z').getTime() - 86_400_000)
    while (dateSet.has(cursor.toISOString().slice(0, 10))) {
      streak++
      cursor = new Date(cursor.getTime() - 86_400_000)
    }
  }

  return streak
}

/** Returns today's ISO date string (YYYY-MM-DD). */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
