const PARTICLE_COUNT = 8
const PARTICLE_DISTANCE = 48

interface Props {
  show: boolean
}

export default function Celebration({ show }: Props) {
  if (!show) return null

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2
    return {
      x: Math.round(Math.cos(angle) * PARTICLE_DISTANCE),
      y: Math.round(Math.sin(angle) * PARTICLE_DISTANCE),
      i,
    }
  })

  return (
    <div className="celebration" role="status" aria-live="polite" aria-label="All habits complete">
      <div className="celebration__burst">
        {particles.map((p) => (
          <span
            key={p.i}
            className="celebration__particle"
            style={{
              '--tx': `${p.x}px`,
              '--ty': `${p.y}px`,
              '--i': p.i,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <span className="celebration__label">All done!</span>
    </div>
  )
}
