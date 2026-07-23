interface Props {
  fading: boolean
}

export default function Welcome({ fading }: Props) {
  return (
    <div
      className={`welcome ${fading ? 'welcome--fading' : ''}`}
      aria-hidden={fading || undefined}
    >
      <div className="welcome__content">
        <svg
          className="welcome__mark"
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        <h2 className="welcome__title">Welcome back</h2>
        <p className="welcome__subtitle">Habit Tracker</p>
      </div>
    </div>
  )
}
