export interface LevelTheme {
  skyTop: string
  skyBottom: string
  groundColor: string
  hillColor: string
  roadFill: string
  roadStripe: string
  roadEdge: string
  sceneryType: 'walls' | 'pillars' | 'pipes' | 'trees' | 'buildings' | 'columns' | 'grand'
  monsterBody: string
  monsterEye: string
  monsterMouth: string
  monsterTeeth: string
  particleType?: 'torchlight' | 'fireflies' | 'snow' | 'bubbles' | 'embers'
  sceneryColor1: string
  sceneryColor2: string
  accentColor: string
}

export const THEMES: Record<number, LevelTheme> = {
  1: {
    skyTop: '#0a0a1a', skyBottom: '#1a1a3a',
    groundColor: '#2a2a2a', hillColor: '#1a1a2a',
    roadFill: '#3a3a3a', roadStripe: '#666', roadEdge: '#1a1a1a',
    sceneryType: 'walls',
    monsterBody: '#3a1a00', monsterEye: '#ff4400', monsterMouth: '#6a0000', monsterTeeth: '#ddd',
    particleType: 'torchlight',
    sceneryColor1: '#4a4a4a', sceneryColor2: '#5a3a2a', accentColor: '#ff6600',
  },
  2: {
    skyTop: '#0a0a0a', skyBottom: '#1a1a1a',
    groundColor: '#2a2a2a', hillColor: '#1a1a1a',
    roadFill: '#333', roadStripe: '#555', roadEdge: '#111',
    sceneryType: 'pillars',
    monsterBody: '#2a0a0a', monsterEye: '#ff0000', monsterMouth: '#5a0000', monsterTeeth: '#ccc',
    particleType: 'torchlight',
    sceneryColor1: '#3a3a3a', sceneryColor2: '#4a2a1a', accentColor: '#ff4400',
  },
  3: {
    skyTop: '#0a1a0a', skyBottom: '#1a2a1a',
    groundColor: '#2a3a2a', hillColor: '#1a2a1a',
    roadFill: '#3a4a3a', roadStripe: '#5a6a5a', roadEdge: '#1a2a1a',
    sceneryType: 'pipes',
    monsterBody: '#1a3a1a', monsterEye: '#00ff00', monsterMouth: '#005a00', monsterTeeth: '#aea',
    particleType: 'bubbles',
    sceneryColor1: '#3a4a3a', sceneryColor2: '#4a5a2a', accentColor: '#33cc33',
  },
  4: {
    skyTop: '#0a0a2a', skyBottom: '#1a1a3a',
    groundColor: '#1a2a1a', hillColor: '#0a1a0a',
    roadFill: '#2a3a2a', roadStripe: '#4a5a4a', roadEdge: '#0a1a0a',
    sceneryType: 'trees',
    monsterBody: '#1a0a00', monsterEye: '#ff6600', monsterMouth: '#3a1a00', monsterTeeth: '#bbb',
    particleType: 'fireflies',
    sceneryColor1: '#1a3a1a', sceneryColor2: '#2a4a1a', accentColor: '#aaff88',
  },
  5: {
    skyTop: '#1a1a2a', skyBottom: '#3a3a4a',
    groundColor: '#3a3a3a', hillColor: '#2a2a2a',
    roadFill: '#4a4a4a', roadStripe: '#7a7a7a', roadEdge: '#2a2a2a',
    sceneryType: 'buildings',
    monsterBody: '#2a1a1a', monsterEye: '#ff4444', monsterMouth: '#4a1a1a', monsterTeeth: '#ccc',
    particleType: 'torchlight',
    sceneryColor1: '#5a4a3a', sceneryColor2: '#6a5a4a', accentColor: '#ff8844',
  },
  6: {
    skyTop: '#1a1a2a', skyBottom: '#3a3a4a',
    groundColor: '#4a4a4a', hillColor: '#3a3a3a',
    roadFill: '#5a5a5a', roadStripe: '#8a8a8a', roadEdge: '#3a3a3a',
    sceneryType: 'trees',
    monsterBody: '#3a3a3a', monsterEye: '#ffaaaa', monsterMouth: '#5a5a5a', monsterTeeth: '#eee',
    particleType: 'snow',
    sceneryColor1: '#4a4a4a', sceneryColor2: '#5a5a5a', accentColor: '#ffffff',
  },
  7: {
    skyTop: '#1a1a2a', skyBottom: '#2a2a4a',
    groundColor: '#3a3a3a', hillColor: '#2a2a2a',
    roadFill: '#4a4a4a', roadStripe: '#6a6a6a', roadEdge: '#2a2a2a',
    sceneryType: 'walls',
    monsterBody: '#2a0a0a', monsterEye: '#ff0000', monsterMouth: '#5a0000', monsterTeeth: '#ddd',
    particleType: 'torchlight',
    sceneryColor1: '#5a4a3a', sceneryColor2: '#6a3a2a', accentColor: '#ff4444',
  },
  8: {
    skyTop: '#1a0a0a', skyBottom: '#2a1a1a',
    groundColor: '#3a2a2a', hillColor: '#2a1a1a',
    roadFill: '#4a3a3a', roadStripe: '#6a4a4a', roadEdge: '#2a1a1a',
    sceneryType: 'columns',
    monsterBody: '#2a0000', monsterEye: '#ff2222', monsterMouth: '#6a0000', monsterTeeth: '#ddd',
    particleType: 'embers',
    sceneryColor1: '#5a3a3a', sceneryColor2: '#7a4a3a', accentColor: '#ff6644',
  },
  9: {
    skyTop: '#1a0a1a', skyBottom: '#2a1a2a',
    groundColor: '#3a2a3a', hillColor: '#2a1a2a',
    roadFill: '#4a3a4a', roadStripe: '#6a4a6a', roadEdge: '#2a1a2a',
    sceneryType: 'grand',
    monsterBody: '#3a0000', monsterEye: '#ff0000', monsterMouth: '#8a0000', monsterTeeth: '#ffd700',
    particleType: 'embers',
    sceneryColor1: '#5a3a4a', sceneryColor2: '#8a4a3a', accentColor: '#ffd700',
  },
}
