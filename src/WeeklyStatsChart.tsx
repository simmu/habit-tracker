import { useState } from 'react'
import { getWeeklyStats } from './useWeeklyStats'
import type { Habit } from './types'

interface Props {
  habits: Habit[]
  /** Injected for testing; defaults to real today. */
  today?: string
}

export default function WeeklyStatsChart({ habits, today }: Props) {
  const stats = getWeeklyStats(habits, today)
  const maxCount = Math.max(...stats.map((d) => d.count), 1)

  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null)

  return (
    <section className="week-chart" aria-label="This Week">
      <h2 className="week-chart__title">This Week</h2>
      <div className="week-chart__bars">
        {stats.map((day, i) => {
          const heightPct = (day.count / maxCount) * 100
          const isHovered = tooltipIndex === i

          const barClass = [
            'week-chart__bar',
            day.isToday ? 'week-chart__bar--today' : '',
            day.isFuture ? 'week-chart__bar--future' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={day.date}
              className="week-chart__col"
              onMouseEnter={() => setTooltipIndex(i)}
              onMouseLeave={() => setTooltipIndex(null)}
              onFocus={() => setTooltipIndex(i)}
              onBlur={() => setTooltipIndex(null)}
            >
              {isHovered && (
                <div className="week-chart__tooltip" role="tooltip">
                  {day.count} {day.count === 1 ? 'habit' : 'habits'} completed
                </div>
              )}
              <div className="week-chart__bar-track">
                <div
                  className={barClass}
                  style={{ height: day.isFuture ? '0%' : `${heightPct}%` }}
                  data-testid={`bar-${day.label.toLowerCase()}`}
                  aria-label={`${day.label}: ${day.count} habits completed`}
                />
              </div>
              <span className="week-chart__label">{day.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
