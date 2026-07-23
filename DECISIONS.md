# Decisions

## 2026-07-22 — Welcome-to-list transition

- The welcome view is shown on every app load, not only the first launch, to create a small "arrival" moment.
- It is implemented as an overlay (`position: fixed; inset: 0`) covering the main habit list so the list can render behind it and become interactive immediately once the overlay is removed.
- Motion preference (`prefers-reduced-motion: reduce`) skips the welcome and removes CSS transitions so the list appears immediately/calmly.
- The main content wrapper uses `aria-hidden` and `inert` while the welcome is visible to prevent screen-reader/keyboard access to the hidden list.
- Tests default to reduced motion so existing habit-list tests remain fast and do not need to wait for the transition; dedicated welcome tests opt into normal motion with fake timers.
