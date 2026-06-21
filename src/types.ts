export interface Habit {
  id: string
  name: string
  /** ISO-8601 date strings (YYYY-MM-DD) for each day the habit was completed. */
  completedDates: string[]
}
