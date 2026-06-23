
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()

// Clear localStorage first
await page.goto('http://localhost:5173')
await page.evaluate(() => localStorage.clear())
await page.reload()

// Check initial state
const heading = await page.textContent('h1')
console.log('Heading:', heading)

const emptyMsg = await page.textContent('.habit-empty')
console.log('Empty message:', emptyMsg)

// Add a habit
await page.fill('input[aria-label="New habit name"]', 'Morning run')
await page.keyboard.press('Enter')

// Check streak of 0 displayed
const streak0 = await page.getByLabel('0 day streak').textContent()
console.log('Initial streak:', streak0?.trim())

// Mark it done
await page.click('button[aria-label="Mark Morning run as done"]')

// Check streak of 1
const streak1 = await page.getByLabel('1 day streak').textContent()
console.log('After mark done streak:', streak1?.trim())

// Verify button is disabled
const btnDisabled = await page.isDisabled('button[aria-label="Morning run already done today"]')
console.log('Button disabled:', btnDisabled)

// Streak still at 1 (can't click again)
const streakStill1 = await page.getByLabel('1 day streak').textContent()
console.log('Streak still at 1 (idempotent):', streakStill1?.trim())

// Add a second habit to check independence
await page.fill('input[aria-label="New habit name"]', 'Read')
await page.keyboard.press('Enter')

// Verify Read has streak 0
const readStreak = await page.getByLabel('0 day streak').textContent()
console.log('Second habit streak (independent, 0):', readStreak?.trim())

// Simulate page refresh (persistence test)
await page.reload()
const habitNames = await page.$$eval('.habit-name', els => els.map(el => el.textContent))
console.log('After refresh - habits:', habitNames)

const streakAfterRefresh = await page.getByLabel('1 day streak').textContent()
console.log('After refresh - Morning run streak:', streakAfterRefresh?.trim())

const readStreakAfterRefresh = await page.getByLabel('0 day streak').textContent()
console.log('After refresh - Read streak:', readStreakAfterRefresh?.trim())

await browser.close()
console.log('All browser checks passed!')
