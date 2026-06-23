# PRD: Streak Counter

## Why
Users need instant feedback on their consistency so they stay motivated to keep habits going every day. Right now there is no visible record of consecutive days, making it hard to feel the momentum of a streak.

## What
Each habit displays a live streak counter showing how many consecutive calendar days in a row it has been marked done. The counter is shown next to the habit name using a flame emoji (🔥) and a number. Marking a habit done today increases the streak by 1. If a day is skipped (i.e. the habit was not marked done yesterday), the streak resets to 0. Completing a habit more than once in the same day does not inflate the streak. The streak persists across page refreshes.

## Done when (each line must be testable by clicking the app)
- [ ] A newly added habit shows a streak of 🔥 0
- [ ] Clicking "Mark done" on a habit for the first time increments its streak from 0 to 1
- [ ] Clicking "Mark done" again on the same day does not increase the streak beyond 1
- [ ] After the streak is at least 1, the number displayed next to 🔥 matches the count of consecutive days the habit has been checked off
- [ ] The streak value is still correct after the page is refreshed (data persists)
- [ ] Two different habits each show their own independent streak counters that update separately
- [ ] A habit that has never been marked done always shows 🔥 0

## Out of scope (what we are NOT doing right now)
- Manually editing or overriding the streak count
- Notifications or reminders when a streak is about to break
- Longest-streak or best-streak history
- Streak milestones, badges, or animations
- Visualising past check-off history (e.g. calendar heatmap)