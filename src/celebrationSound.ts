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
    const duration = 0.55

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.06, now + 0.04)
    master.gain.exponentialRampToValueAtTime(0.001, now + duration)
    master.connect(ctx.destination)

    const freqs = [523.25, 659.25, 783.99]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = i === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.05)
      osc.connect(master)
      osc.start(now + i * 0.05)
      osc.stop(now + duration)
    })
  } catch {
    // Audio is optional; ignore failures.
  }
}
