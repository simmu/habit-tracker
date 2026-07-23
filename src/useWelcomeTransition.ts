import { useState, useEffect } from 'react'

const WELCOME_DURATION_MS = 1500
const WELCOME_TRANSITION_MS = 600

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface WelcomeTransitionState {
  showWelcome: boolean
  welcomeFading: boolean
}

export function useWelcomeTransition(): WelcomeTransitionState {
  const [showWelcome, setShowWelcome] = useState(() => !prefersReducedMotion())
  const [welcomeFading, setWelcomeFading] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const holdTimer = setTimeout(() => {
      setWelcomeFading(true)
    }, WELCOME_DURATION_MS)

    const removeTimer = setTimeout(() => {
      setShowWelcome(false)
    }, WELCOME_DURATION_MS + WELCOME_TRANSITION_MS)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  return { showWelcome, welcomeFading }
}
