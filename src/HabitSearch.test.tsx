import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HabitSearch from './HabitSearch'

describe('HabitSearch', () => {
  it('renders a search input with the correct label', () => {
    render(<HabitSearch value="" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox', { name: /search habits/i })).toBeInTheDocument()
  })

  it('displays the current value in the input', () => {
    render(<HabitSearch value="run" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox', { name: /search habits/i })).toHaveValue('run')
  })

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn()
    render(<HabitSearch value="" onChange={onChange} />)
    const input = screen.getByRole('searchbox', { name: /search habits/i })

    await userEvent.type(input, 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('does NOT show the clear button when the value is empty', () => {
    render(<HabitSearch value="" onChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })

  it('shows the clear button when the value is non-empty', () => {
    render(<HabitSearch value="yoga" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument()
  })

  it('calls onChange with an empty string when the clear button is clicked', async () => {
    const onChange = vi.fn()
    render(<HabitSearch value="yoga" onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: /clear search/i }))

    expect(onChange).toHaveBeenCalledWith('')
  })
})
