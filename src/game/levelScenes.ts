import { LevelSceneData } from './types'

const GY = 450
const GH = 50
const PW = 20
const PH = 30

function scene(id: number, ww: number, startX: number, triggers: { x: number; pid: string; text: string }[], guards: { id: string; x: number; patrol?: [number, number]; y?: number; dir?: 'left' | 'right' }[], exitX: number): LevelSceneData {
  return {
    levelId: id,
    worldWidth: ww,
    playerStart: { x: startX, y: GY - PH },
    ground: [{ x: 0, y: GY, w: ww, h: GH }],
    blockers: [
      { x: 0, y: GY - 250, w: 18, h: 250 },
      { x: ww - 18, y: GY - 250, w: 18, h: 250 },
    ],
    triggers: triggers.map(t => ({
      x: t.x, y: GY - 75, w: 36, h: 55, puzzleId: t.pid, promptText: t.text,
    })),
    npcs: guards.map(g => ({
      npcId: g.id, x: g.x, y: g.y ?? GY - 40, dir: g.dir ?? 'left', patrol: g.patrol,
    })),
    exitZone: { x: exitX, y: GY - 75, w: 36, h: 75 },
  }
}

export const LEVEL_SCENES: Record<number, LevelSceneData> = {
  1: scene(1, 900, 80,
    [
      { x: 200, pid: 'cell-distract', text: 'Distract the guard' },
      { x: 420, pid: 'cell-lockpick', text: 'Pick the lock' },
    ],
    [{ id: 'guard', x: 700, patrol: [580, 780] }],
    840,
  ),

  2: scene(2, 1100, 80,
    [
      { x: 260, pid: 'dungeon-trap', text: 'Disarm the trap' },
      { x: 620, pid: 'dungeon-gate', text: 'Open the gate' },
    ],
    [{ id: 'warden', x: 850, patrol: [740, 960] }],
    1040,
  ),

  3: scene(3, 1200, 80,
    [
      { x: 280, pid: 'sewer-valve', text: 'Reverse the flow' },
      { x: 650, pid: 'sewer-exit', text: 'Find the exit' },
    ],
    [{ id: 'deepOne', x: 900, patrol: [780, 1080] }],
    1140,
  ),

  4: scene(4, 1200, 80,
    [
      { x: 260, pid: 'forest-torches', text: 'Light the torches' },
      { x: 680, pid: 'forest-beast', text: 'Calm the beast' },
    ],
    [],
    1140,
  ),

  5: scene(5, 1300, 80,
    [
      { x: 300, pid: 'village-barter', text: 'Barter with merchant' },
      { x: 750, pid: 'village-gate', text: 'Open the gate' },
    ],
    [{ id: 'bandit', x: 550, patrol: [460, 650] }],
    1240,
  ),

  6: scene(6, 1400, 80,
    [
      { x: 340, pid: 'bridge-planks', text: 'Repair the bridge' },
      { x: 800, pid: 'bridge-rope', text: 'Cut the rope' },
    ],
    [],
    1340,
  ),

  7: scene(7, 1400, 80,
    [
      { x: 320, pid: 'courtyard-patrol', text: 'Time the patrol' },
      { x: 900, pid: 'courtyard-cipher', text: 'Crack the cipher' },
    ],
    [
      { id: 'guard', x: 620, patrol: [520, 780] },
      { id: 'commander', x: 1150, patrol: [1040, 1260] },
    ],
    1340,
  ),

  8: scene(8, 1500, 100,
    [
      { x: 300, pid: 'hall-riddle', text: 'Solve the riddle' },
      { x: 850, pid: 'hall-portcullis', text: 'Raise the portcullis' },
    ],
    [
      { id: 'vark', x: 550, patrol: [440, 660] },
      { id: 'stoneheart', x: 1200, patrol: [1080, 1320] },
    ],
    1440,
  ),

  9: scene(9, 1600, 100,
    [
      { x: 380, pid: 'throne-shield', text: 'Shatter the shield' },
      { x: 1100, pid: 'throne-final', text: 'Final strike' },
    ],
    [
      { id: 'draven', x: 200, patrol: [120, 280] },
      { id: 'king', x: 1420, y: GY - 50, dir: 'left' },
      { id: 'elena', x: 1300, patrol: [1240, 1380] },
    ],
    1520,
  ),
}

export function getLevelScene(levelId: number): LevelSceneData | undefined {
  return LEVEL_SCENES[levelId]
}
