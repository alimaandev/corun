let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function playSuccess() {
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'square'
  o.frequency.setValueAtTime(523, c.currentTime)
  o.frequency.setValueAtTime(659, c.currentTime + 0.1)
  o.frequency.setValueAtTime(784, c.currentTime + 0.2)
  g.gain.setValueAtTime(0.15, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime)
  o.stop(c.currentTime + 0.4)
}

export function playError() {
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(150, c.currentTime)
  o.frequency.setValueAtTime(100, c.currentTime + 0.2)
  g.gain.setValueAtTime(0.12, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime)
  o.stop(c.currentTime + 0.3)
}

export function playInteract() {
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(440, c.currentTime)
  o.frequency.setValueAtTime(660, c.currentTime + 0.08)
  g.gain.setValueAtTime(0.1, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime)
  o.stop(c.currentTime + 0.2)
}

export function playStep() {
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'square'
  o.frequency.setValueAtTime(200, c.currentTime)
  g.gain.setValueAtTime(0.06, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime)
  o.stop(c.currentTime + 0.05)
}

export function playLevelComplete() {
  const c = getCtx()
  if (!c) return
  const notes = [523, 587, 659, 784, 880, 1047]
  notes.forEach((freq, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'square'
    o.frequency.setValueAtTime(freq, c.currentTime + i * 0.1)
    g.gain.setValueAtTime(0.12, c.currentTime + i * 0.1)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.1 + 0.3)
    o.connect(g).connect(c.destination)
    o.start(c.currentTime + i * 0.1)
    o.stop(c.currentTime + i * 0.1 + 0.3)
  })
}

export function playBossAppear() {
  const c = getCtx()
  if (!c) return
  for (let i = 0; i < 4; i++) {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'square'
    const freq = 220 + i * 60
    o.frequency.setValueAtTime(freq, c.currentTime + i * 0.15)
    o.frequency.setValueAtTime(freq * 1.5, c.currentTime + i * 0.15 + 0.1)
    g.gain.setValueAtTime(0.15, c.currentTime + i * 0.15)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.15 + 0.25)
    o.connect(g).connect(c.destination)
    o.start(c.currentTime + i * 0.15)
    o.stop(c.currentTime + i * 0.15 + 0.25)
  }
}

export function playGameOver() {
  const c = getCtx()
  if (!c) return
  const notes = [440, 370, 330, 262]
  notes.forEach((freq, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'square'
    o.frequency.setValueAtTime(freq, c.currentTime + i * 0.2)
    g.gain.setValueAtTime(0.12, c.currentTime + i * 0.2)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.2 + 0.4)
    o.connect(g).connect(c.destination)
    o.start(c.currentTime + i * 0.2)
    o.stop(c.currentTime + i * 0.2 + 0.4)
  })
}
