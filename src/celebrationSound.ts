let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Constructor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Constructor) return null
  if (!audioCtx) {
    audioCtx = new Constructor()
  }
  return audioCtx
}

export function playCelebrationSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    const now = ctx.currentTime
    const duration = 0.7

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.1, now + 0.03)
    master.gain.exponentialRampToValueAtTime(0.001, now + duration)
    master.connect(ctx.destination)

    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(523.25, now)
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.35)
    osc1.connect(master)
    osc1.start(now)
    osc1.stop(now + duration)

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(659.25, now + 0.08)
    osc2.frequency.exponentialRampToValueAtTime(987.77, now + 0.45)
    osc2.connect(master)
    osc2.start(now + 0.08)
    osc2.stop(now + duration)
  } catch {
    // Audio is optional; ignore failures.
  }
}
