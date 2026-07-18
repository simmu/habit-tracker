# DESIGN.md — how this app should look

The guide for the app's *appearance*, the way `AGENTS.md` is the guide for its *code*.
Build toward this; the Design Reviewer grades against it. When in doubt, do less.

## Mood
**Calm and minimal.** A quiet tool you'd happily open every morning. Restraint over
decoration. It should feel considered and intentional, never busy, never "templated."

## Palette — near-monochrome + ONE restrained accent
Use a grayscale foundation with a single muted accent. No second accent.

```
--bg:        #fbfbfa   /* soft off-white, not pure #fff */
--surface:   #f4f4f2   /* cards / rows, barely raised from bg */
--border:    #e4e3e0   /* hairline separators */
--text:      #2b2a28   /* near-black body text, warm not blue */
--text-soft: #6b6a67   /* secondary text, labels */
--accent:    #3f6153   /* muted sage/ink green — calm, not loud */
--accent-soft: #eaf0ec /* accent tint for subtle fills */
```

## Hard rules (the reviewer penalizes these heavily)
- **No purple.** No `#aa3bff`, no `#646cff`, none of the default Vite/AI palette.
- **No gradients.** Flat fills only.
- **No heavy drop shadows.** Separate elements with hairline borders or a whisper of
  shadow at most (`0 1px 2px rgba(0,0,0,0.04)`). Never a chunky card shadow.
- **One accent color, used sparingly** — for the primary action and active state only.

## Typography
- System sans (`system-ui, -apple-system, Segoe UI, Roboto, sans-serif`). No web fonts.
- Clear hierarchy from **weight and size**, not color: title ~1.5rem/600, body 1rem/400,
  labels 0.85rem/500 in `--text-soft`.
- Generous line-height (~1.5). Comfortable, not cramped.

## Spacing & shape
- Space on an **8px scale** (8 / 16 / 24 / 32). Be generous with whitespace — it's the
  main design element here.
- Corner radius: a consistent, gentle `8px` everywhere. No mixing radii.
- Roomy tap targets (min ~40px tall) so it feels calm to use, not fiddly.

## The bar it must clear
Someone should look at a screen and think "clean and intentional," not "default template."
If a choice adds visual noise without adding clarity, remove it.
