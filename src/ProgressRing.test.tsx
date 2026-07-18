import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressRing from './ProgressRing'

describe('ProgressRing', () => {
  it('renders the percentage label', () => {
    render(<ProgressRing percentage={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows 0% when no progress is made', () => {
    render(<ProgressRing percentage={0} />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '0% complete')
  })

  it('shows the given percentage', () => {
    render(<ProgressRing percentage={42} />)
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '42% complete')
  })

  it('shows 100% when fully complete', () => {
    render(<ProgressRing percentage={100} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '100% complete')
  })

  it('clamps values below 0 to 0', () => {
    render(<ProgressRing percentage={-10} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('clamps values above 100 to 100', () => {
    render(<ProgressRing percentage={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
