import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Celebration from './Celebration'

describe('Celebration', () => {
  it('renders nothing when show is false', () => {
    render(<Celebration show={false} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders a status announcement when show is true', () => {
    render(<Celebration show={true} />)
    expect(screen.getByRole('status', { name: /all habits complete/i })).toBeInTheDocument()
    expect(screen.getByText('All done!')).toBeInTheDocument()
  })
})
