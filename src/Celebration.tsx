import { useMemo } from 'react'

const CONFETTI_COUNT = 60
const COLORS = ['var(--accent)', 'var(--accent)', 'var(--accent)', 'var(--text-soft)']

interface ConfettiPiece {
  id: number
  left: number
  color: string
  size: number
  delay: number
  duration: number
  drift: number
  rotateDir: number
  shape: 'rect' | 'circle'
}

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 120,
    rotateDir: Math.random() > 0.5 ? 1 : -1,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }))
}

interface Props {
  show: boolean
}

export default function Celebration({ show }: Props) {
  const confetti = useMemo(() => generateConfetti(CONFETTI_COUNT), [])

  if (!show) return null

  return (
    <div className="celebration" role="status" aria-live="polite" aria-label="All habits complete">
      <span className="celebration__label">All done!</span>
      <div className="celebration__confetti" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className={`celebration__piece ${c.shape === 'circle' ? 'celebration__piece--circle' : ''}`}
            style={{
              '--left': `${c.left}%`,
              '--color': c.color,
              '--size': `${c.size}px`,
              '--delay': `${c.delay}s`,
              '--duration': `${c.duration}s`,
              '--drift': `${c.drift}px`,
              '--rotate-dir': c.rotateDir,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}
