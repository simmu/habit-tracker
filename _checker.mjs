
// Final visual + UX sweep: screenshot, layout, aria, edge cases in the actual UI
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5173');
await page.waitForTimeout(800);

// ── Add two habits ────────────────────────────────────────────────────────────
const input = page.locator('input').first();
await input.fill('Morning Run');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
await input.fill('Meditate');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);

// ── Streaks should start at 0 ────────────────────────────────────────────────
const initialStreaks = await page.locator('.habit-streak').allTextContents();
console.log('Initial streaks (both should be 🔥 0):', initialStreaks.map(s => s.trim()));

// ── Mark both done → both should become 🔥 1 ────────────────────────────────
await page.locator('.habit-done-btn').nth(0).click();
await page.waitForTimeout(200);
await page.locator('.habit-done-btn').nth(1).click();
await page.waitForTimeout(200);

const streaksAfterDone = await page.locator('.habit-streak').allTextContents();
console.log('Streaks after marking both done (should both be 🔥 1):', streaksAfterDone.map(s => s.trim()));

// ── Verify buttons are disabled after marking done ──────────────────────────
const btn0Disabled = await page.locator('.habit-done-btn').nth(0).isDisabled();
const btn1Disabled = await page.locator('.habit-done-btn').nth(1).isDisabled();
console.log('Btn 0 disabled after done:', btn0Disabled);
console.log('Btn 1 disabled after done:', btn1Disabled);

// ── Try clicking a disabled button (should not change streak) ───────────────
await page.locator('.habit-done-btn').nth(0).click({ force: true });
await page.waitForTimeout(200);
const streakAfterDoubleClick = await page.locator('.habit-streak').nth(0).textContent();
console.log('Streak after forced double-click on disabled btn (should still be 🔥 1):', streakAfterDoubleClick?.trim());

// ── aria-label correctness ───────────────────────────────────────────────────
const ariaLabel0 = await page.locator('.habit-streak').nth(0).getAttribute('aria-label');
const ariaLabel1 = await page.locator('.habit-streak').nth(1).getAttribute('aria-label');
console.log('Aria-label habit 0 (expect "1 day streak"):', ariaLabel0);
console.log('Aria-label habit 1 (expect "1 day streak"):', ariaLabel1);

// ── Check that ✓ Done class is applied ──────────────────────────────────────
const btn0Class = await page.locator('.habit-done-btn').nth(0).getAttribute('class');
console.log('Btn 0 class (should contain habit-done-btn--done):', btn0Class);

// ── Visual: check streak color (amber/orange for fire emoji context) ─────────
const streakColor = await page.locator('.habit-streak').nth(0).evaluate(el => {
  return window.getComputedStyle(el).color;
});
console.log('Streak text color:', streakColor);

// ── Whitespace-only input should not add habit ────────────────────────────────
await input.fill('   ');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
const habitCount = await page.locator('.habit-item').count();
console.log('Habit count after whitespace-only input (should still be 2):', habitCount);

// ── Duplicate name: does it allow adding? ────────────────────────────────────
await input.fill('Morning Run');
await page.keyboard.press('Enter');
await page.waitForTimeout(200);
const habitCountAfterDup = await page.locator('.habit-item').count();
console.log('Habit count after duplicate name (3 = duplicates allowed, 2 = blocked):', habitCountAfterDup);

// ── Full page text at end ──────────────────────────────────────────────────
const allText = await page.evaluate(() => document.body.innerText);
console.log('\nFull page text:\n', allText);

await browser.close();
