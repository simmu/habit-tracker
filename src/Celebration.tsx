import { useMemo } from 'react'

const CONFETTI_COUNT = 50
const COLORS = ['var(--accent)', 'var(--text-soft)']

interface ConfettiPiece {
  id: number
  left: number
  color: string
  size: number
  delay: number
  duration: number
  rise: string
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
    duration: 3 + Math.random() * 1.5,
    rise: `${-30 - Math.random() * 55}svh`,
    drift: (Math.random() - 0.5) * 160,
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
    <>
      <div
        className="celebration"
        role="status"
        aria-live="polite"
        aria-label="All habits complete"
      >
        <span className="celebration__label">All caught up</span>
      </div>
      <div className="celebration__overlay" aria-hidden="true">
        <div className="celebration__confetti">
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
                '--rise': c.rise,
                '--drift': `${c.drift}px`,
                '--rotate-dir': c.rotateDir,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </>
  )
}
