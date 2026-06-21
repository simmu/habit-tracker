import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HabitInput from './HabitInput'

describe('HabitInput', () => {
  it('renders the text input', () => {
    render(<HabitInput onAdd={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: /new habit name/i })).toBeInTheDocument()
  })

  it('calls onAdd with the trimmed value when Enter is pressed', async () => {
    const onAdd = vi.fn()
    render(<HabitInput onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })

    await userEvent.type(input, '  Exercise  {Enter}')

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith('Exercise')
  })

  it('clears the input after adding a habit', async () => {
    render(<HabitInput onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })

    await userEvent.type(input, 'Read{Enter}')

    expect(input).toHaveValue('')
  })

  it('does not call onAdd when the input is blank or whitespace', async () => {
    const onAdd = vi.fn()
    render(<HabitInput onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })

    await userEvent.type(input, '   {Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('does not call onAdd when a non-Enter key is pressed', async () => {
    const onAdd = vi.fn()
    render(<HabitInput onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /new habit name/i })

    await userEvent.type(input, 'Meditate')
    await userEvent.keyboard('{Tab}')

    expect(onAdd).not.toHaveBeenCalled()
  })
})
