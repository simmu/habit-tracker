# PRD: Habit Search / Filter

## Why
As the habit list grows, it becomes hard to find a specific habit quickly. A search box lets users instantly narrow the list to just the habits they care about.

## What
A search box appears prominently above the habit list. As the user types, the habit list filters in real time to show only habits whose names contain the typed text (case-insensitive). When the search box is empty, all habits are shown as normal. A small clear ("×") button appears inside the search box whenever there is text, allowing the user to reset the filter with one click. If no habits match the search query, a friendly "No habits match your search" message is shown in place of the list.

## Done when (each line must be testable by clicking the app)
- [ ] A search input box is visible above the habit list on the main screen
- [ ] Typing a partial name into the search box immediately hides habits that do not match and shows only habits whose names contain the typed text (case-insensitive)
- [ ] Clearing the search box (manually or via the × button) restores the full habit list
- [ ] A × button appears inside the search box when it contains text, and clicking it clears the box and restores all habits
- [ ] When the search term matches no habits, a "No habits match your search" message is displayed instead of a blank list
- [ ] Adding a new habit while a search is active either shows the new habit if its name matches the current filter, or hides it if it does not
- [ ] The habit-add input and the search box are visually distinct so users can tell them apart

## Out of scope (what we are NOT doing right now)
- Searching by tags, notes, or any field other than habit name
- Saving or persisting the last search term across page reloads
- Fuzzy / typo-tolerant matching
- Highlighting the matched portion of the habit name in the results