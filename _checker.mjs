
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// ── Screenshot: full visual check with a seeded multi-day streak ──
const today = new Date();
const toISO = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => { const d = new Date(today); d.setDate(today.getDate() - n); return toISO(d); };

const habits = [
  { id: '1', name: 'Morning Run', completedDates: [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3)] },
  { id: '2', name: 'Read 30min', completedDates: [daysAgo(1)] },
  { id: '3', name: 'Meditate', completedDates: [] },
];

await page.goto('http://localhost:5173');
await page.evaluate((data) => {
  localStorage.setItem('habit-tracker:habits', JSON.stringify(data));
}, habits);
await page.reload();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);

await page.screenshot({ path: '/tmp/streak-visual.png', fullPage: true });
console.log('VISUAL SCREENSHOT SAVED');

// Verify all rendered correctly
const names = await page.$$eval('.habit-name', els => els.map(el => el.textContent.trim()));
const streaks = await page.$$eval('.habit-streak', els => els.map(el => el.textContent.trim()));
const btnTexts = await page.$$eval('.habit-done-btn', els => els.map(el => el.textContent.trim()));
const btnDisableds = await page.$$eval('.habit-done-btn', els => els.map(el => el.disabled));

for (let i = 0; i < names.length; i++) {
  console.log(`${names[i]} | streak: ${streaks[i]} | btn: "${btnTexts[i]}" | disabled: ${btnDisableds[i]}`);
}

// Check streak badge bounding boxes relative to button (should be to the left of button)
const streakBoxes = await page.$$eval('.habit-streak', els => els.map(el => {
  const r = el.getBoundingClientRect();
  return { left: Math.round(r.left), right: Math.round(r.right) };
}));
const btnBoxes = await page.$$eval('.habit-done-btn', els => els.map(el => {
  const r = el.getBoundingClientRect();
  return { left: Math.round(r.left), right: Math.round(r.right) };
}));

for (let i = 0; i < names.length; i++) {
  const streakIsLeftOfBtn = streakBoxes[i].right <= btnBoxes[i].left;
  console.log(`${names[i]} | streak right:${streakBoxes[i].right} btn left:${btnBoxes[i].left} | streak left of btn: ${streakIsLeftOfBtn}`);
}

await browser.close();
