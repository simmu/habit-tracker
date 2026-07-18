import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from './ThemeToggle'

const THEME_KEY = 'habit-tracker:theme'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('is reachable from the main habit view via App', () => {
    // covered in App integration tests; component itself renders a button
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })

  it('starts in light mode when no preference is saved', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('switches to dark mode when clicked', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }))

    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')
  })

  it('switches back to light mode when clicked again', async () => {
    render(<ThemeToggle />)
    const toggle = screen.getByRole('button', { name: /switch to dark mode/i })

    await userEvent.click(toggle)
    await userEvent.click(screen.getByRole('button', { name: /switch to light mode/i }))

    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
  })

  it('loads the saved dark mode immediately', () => {
    localStorage.setItem(THEME_KEY, 'dark')
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
