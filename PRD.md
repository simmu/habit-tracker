# PRD: Weekly Stats Chart

## Why
Users have no way to see their habit completion trends over time, making it hard to spot patterns or stay motivated by visible progress.

## What
A "This Week" stats section displayed on the main screen, below the habit list. It shows a bar chart with one bar per day of the current week (Mon–Sun). Each bar's height represents the number of habits completed on that day. The current day is visually highlighted. Days in the future have empty/greyed-out bars. Hovering over (or tapping) a bar shows a tooltip with the exact count (e.g. "3 habits completed").

## Done when (each line must be testable by clicking the app)
- [ ] A bar chart labelled "This Week" is visible on the main screen below the habit list
- [ ] The chart has exactly 7 bars, one for each day of the week (Mon–Sun), each labelled with a short day name (Mon, Tue, … Sun)
- [ ] Completing a habit on today's date causes today's bar to grow taller immediately (without a page refresh)
- [ ] Un-completing a habit on today's date causes today's bar to shrink immediately
- [ ] Today's bar is visually distinct from the other bars (different colour or highlight)
- [ ] Future-day bars are visually greyed out or empty, clearly distinguishable from past/present days
- [ ] Hovering over any bar shows a tooltip displaying the number of habits completed that day

## Out of scope (what we are NOT doing right now)
- Viewing stats for previous or future weeks
- Per-habit breakdown within the chart
- Streak counters or any other aggregate statistics
- Exporting or sharing the chart