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
  const c = getAudioContext()
  const mg = getMasterGain()
  if (c && mg) {
    mg.gain.setValueAtTime(muted ? 0 : 0.3, c.currentTime)
  }
}

export function toggleMute(): boolean {
  const next = !isMuted()
  setMuted(next)
  return next
}

let beatTimeoutId: ReturnType<typeof setTimeout> | null = null
let currentIntensity = 0.3

let initResume = false
export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
}
if (typeof document !== 'undefined' && !initResume) {
  initResume = true
  document.addEventListener('click', resumeAudio, { once: true })
  document.addEventListener('touchstart', resumeAudio, { once: true })
  document.addEventListener('keydown', resumeAudio, { once: true })
}

export function getAudioContext(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext()
    return ctx
  } catch {
    return null
  }
}

export function getMasterGain(): GainNode | null {
  const c = getAudioContext()
  if (!c) return null
  if (!masterGain) {
    masterGain = c.createGain()
    masterGain.gain.setValueAtTime(isMuted() ? 0 : 0.3, c.currentTime)
    masterGain.connect(c.destination)
  }
  return masterGain
}

interface DronePreset {
  baseFreq: number
  detune: number
  filterFreq: number
  filterQ: number
  gain: number
}

const DRONE_PRESET: DronePreset = {
  baseFreq: 55,
  detune: 7,
  filterFreq: 200,
  filterQ: 0.5,
  gain: 0.05,
}

export function startMusic(theme: number, intensity = 0.3) {
  const c = getAudioContext()
  if (!c) return
  stopMusic()
  currentIntensity = intensity

  const mg = getMasterGain()
  if (!mg) return

  const preset = DRONE_PRESET

  droneGain = c.createGain()
  droneGain.gain.setValueAtTime(0, c.currentTime)
  droneGain.gain.linearRampToValueAtTime(preset.gain, c.currentTime + 1.5)
  droneGain.connect(mg)

  droneFilter = c.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.setValueAtTime(preset.filterFreq, c.currentTime)
  droneFilter.Q.setValueAtTime(preset.filterQ, c.currentTime)
  droneGain.connect(droneFilter)
  droneFilter.connect(mg)

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
  const mg = getMasterGain()
  if (!mg) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, t)
  osc.frequency.exponentialRampToValueAtTime(30, t + 0.08)
  gain.gain.setValueAtTime(0.25 * currentIntensity * 2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  osc.connect(gain)
  gain.connect(mg)
  osc.start(t)
  osc.stop(t + 0.12)
}

function playSnare(c: AudioContext, t: number) {
  const mg = getMasterGain()
  if (!mg) return
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
  gain.connect(mg)
  source.start(t)
  source.stop(t + 0.1)
}

function playHihat(c: AudioContext, t: number) {
  const mg = getMasterGain()
  if (!mg) return
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
  gain.connect(mg)
  source.start(t)
  source.stop(t + 0.03)
}

export function setIntensity(intensity: number) {
  currentIntensity = Math.max(0.1, Math.min(1, intensity))
}

export function stopMusic() {
  const c = getAudioContext()

  if (beatTimeoutId) {
    clearTimeout(beatTimeoutId)
    beatTimeoutId = null
  }

  if (droneGain && droneGain.gain && c) {
    droneGain.gain.setValueAtTime(droneGain.gain.value, c.currentTime)
    droneGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.1)
  }

  if (c) {
    const fadeTime = c.currentTime + 0.15
    for (const node of droneNodes) {
      try {
        node.gain.gain.setValueAtTime(node.gain.gain.value, c.currentTime)
      } catch {}
      try {
        node.gain.gain.linearRampToValueAtTime(0, fadeTime)
      } catch {}
    }
  }

  setTimeout(() => {
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
  }, 200)
}
