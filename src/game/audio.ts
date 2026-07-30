const MUTED_KEY = 'corun_muted'

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null

let droneNodes: { osc: OscillatorNode; gain: GainNode }[] = []
let droneFilter: BiquadFilterNode | null = null
let droneGain: GainNode | null = null

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === 'true'
  } catch {
    return false
  }
}

export function setMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTED_KEY, muted ? 'true' : 'false')
  } catch {}
  if (masterGain) {
    masterGain.gain.setValueAtTime(muted ? 0 : 0.3, ctx?.currentTime || 0)
  }
}

export function toggleMute(): boolean {
  const next = !isMuted()
  setMuted(next)
  return next
}

let beatInterval: number | null = null
let beatTimeoutId: ReturnType<typeof setTimeout> | null = null
let currentIntensity = 0.3
let activeLevel = 0

function getCtx(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext()
    return ctx
  } catch {
    return null
  }
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', resumeAudio, { once: true })
  document.addEventListener('touchstart', resumeAudio, { once: true })
  document.addEventListener('keydown', resumeAudio, { once: true })
}

interface DronePreset {
  baseFreq: number
  detune: number
  filterFreq: number
  filterQ: number
  gain: number
}

const DRONE_PRESETS: Record<number, DronePreset> = {
  1: { baseFreq: 55, detune: 7, filterFreq: 200, filterQ: 0.5, gain: 0.05 },
  2: { baseFreq: 45, detune: 5, filterFreq: 150, filterQ: 0.8, gain: 0.06 },
  3: { baseFreq: 65, detune: 12, filterFreq: 400, filterQ: 0.3, gain: 0.04 },
  4: { baseFreq: 80, detune: 3, filterFreq: 500, filterQ: 0.2, gain: 0.035 },
  5: { baseFreq: 100, detune: 4, filterFreq: 600, filterQ: 0.4, gain: 0.03 },
  6: { baseFreq: 70, detune: 8, filterFreq: 350, filterQ: 0.6, gain: 0.05 },
  7: { baseFreq: 60, detune: 6, filterFreq: 250, filterQ: 0.7, gain: 0.055 },
  8: { baseFreq: 90, detune: 10, filterFreq: 450, filterQ: 0.5, gain: 0.04 },
  9: { baseFreq: 50, detune: 15, filterFreq: 180, filterQ: 1.0, gain: 0.07 },
  10: { baseFreq: 75, detune: 3, filterFreq: 300, filterQ: 0.3, gain: 0.03 },
  11: { baseFreq: 110, detune: 9, filterFreq: 550, filterQ: 0.6, gain: 0.05 },
  12: { baseFreq: 85, detune: 11, filterFreq: 400, filterQ: 0.7, gain: 0.055 },
}

export function startMusic(levelId: number, intensity = 0.3) {
  const c = getCtx()
  if (!c) return
  stopMusic()
  activeLevel = levelId
  currentIntensity = intensity

  masterGain = c.createGain()
  masterGain.gain.setValueAtTime(isMuted() ? 0 : 0.3, c.currentTime)
  masterGain.connect(c.destination)

  const preset = DRONE_PRESETS[levelId] || DRONE_PRESETS[1]

  droneGain = c.createGain()
  droneGain.gain.setValueAtTime(0, c.currentTime)
  droneGain.gain.linearRampToValueAtTime(preset.gain, c.currentTime + 1.5)
  droneGain.connect(masterGain)

  droneFilter = c.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.setValueAtTime(preset.filterFreq, c.currentTime)
  droneFilter.Q.setValueAtTime(preset.filterQ, c.currentTime)
  droneGain.connect(droneFilter)
  droneFilter.connect(masterGain)

  const layers = [
    { freq: preset.baseFreq, detune: 0, type: 'sawtooth' as OscillatorType },
    { freq: preset.baseFreq * 0.5, detune: preset.detune, type: 'sine' as OscillatorType },
    { freq: preset.baseFreq * 2, detune: -preset.detune * 0.5, type: 'sine' as OscillatorType },
  ]

  for (const layer of layers) {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = layer.type
    osc.frequency.setValueAtTime(layer.freq, c.currentTime)
    osc.detune.setValueAtTime(layer.detune, c.currentTime)
    gain.gain.setValueAtTime(0.5, c.currentTime)
    osc.connect(gain)
    gain.connect(droneGain)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 86400)
    droneNodes.push({ osc, gain })
  }

  scheduleBeat(c)
}

function scheduleBeat(c: AudioContext) {
  let beatTime = c.currentTime + 0.5

  function playBeat() {
    const now = c.currentTime
    if (beatTime < now) beatTime = now + 0.05

    const bpm = 60 + currentIntensity * 80
    const interval = 60 / bpm

    for (let i = 0; i < 4; i++) {
      const t = beatTime + i * interval
      if (i % 4 === 0) playKick(c, t)
      if (i % 2 === 0) playSnare(c, t + interval * 0.5)
      playHihat(c, t + interval * 0.25)
      playHihat(c, t + interval * 0.75)
    }

    beatTime += interval * 4
    beatTimeoutId = setTimeout(playBeat, (interval * 4 - 0.1) * 1000)
  }

  playBeat()
}

function playKick(c: AudioContext, t: number) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, t)
  osc.frequency.exponentialRampToValueAtTime(30, t + 0.08)
  gain.gain.setValueAtTime(0.25 * currentIntensity * 2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  osc.connect(gain)
  if (masterGain) gain.connect(masterGain)
  osc.start(t)
  osc.stop(t + 0.12)
}

function playSnare(c: AudioContext, t: number) {
  const buffer = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  }
  const source = c.createBufferSource()
  source.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.12 * currentIntensity * 2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
  source.connect(gain)
  if (masterGain) gain.connect(masterGain)
  source.start(t)
  source.stop(t + 0.1)
}

function playHihat(c: AudioContext, t: number) {
  const buffer = c.createBuffer(1, c.sampleRate * 0.02, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  }
  const source = c.createBufferSource()
  source.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.06 * currentIntensity * 2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02)
  source.connect(gain)
  if (masterGain) gain.connect(masterGain)
  source.start(t)
  source.stop(t + 0.03)
}

export function setIntensity(intensity: number) {
  currentIntensity = Math.max(0.1, Math.min(1, intensity))
}

export function stopMusic() {
  if (beatTimeoutId) {
    clearTimeout(beatTimeoutId)
    beatTimeoutId = null
  }
  beatInterval = null
  activeLevel = 0

  for (const node of droneNodes) {
    try {
      node.osc.stop()
    } catch {}
    try {
      node.osc.disconnect()
    } catch {}
    try {
      node.gain.disconnect()
    } catch {}
  }
  droneNodes = []

  if (droneFilter) {
    try {
      droneFilter.disconnect()
    } catch {}
    droneFilter = null
  }
  if (droneGain) {
    try {
      droneGain.disconnect()
    } catch {}
    droneGain = null
  }
  if (masterGain) {
    try {
      masterGain.disconnect()
    } catch {}
    masterGain = null
  }
}
