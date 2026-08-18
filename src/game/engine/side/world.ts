import { SideWorld } from './types'

export const WORLD = {
  tile: 16,
  groundY: 210,
} as const

export const CELL_LEVEL: SideWorld = {
  bounds: { minX: 0, maxX: 2400 },
  groundY: WORLD.groundY,
  spawn: { x: 48, y: WORLD.groundY - 24 },
  platforms: [
    { x: 0, y: WORLD.groundY, w: 2400, h: 64 },
    { x: 320, y: 150, w: 96, h: 16 },
    { x: 480, y: 110, w: 96, h: 16 },
    { x: 700, y: 150, w: 128, h: 16 },
    { x: 900, y: 100, w: 96, h: 16 },
    { x: 1050, y: 160, w: 96, h: 16 },
    { x: 1250, y: 130, w: 128, h: 16 },
    { x: 1450, y: 90, w: 96, h: 16 },
    { x: 1600, y: 150, w: 128, h: 16 },
    { x: 1850, y: 120, w: 96, h: 16 },
    { x: 2050, y: 150, w: 96, h: 16 },
  ],
  hazards: [
    { x: 560, y: WORLD.groundY - 12, w: 48, h: 12 },
    { x: 880, y: WORLD.groundY - 12, w: 64, h: 12 },
    { x: 1200, y: WORLD.groundY - 12, w: 48, h: 12 },
    { x: 1520, y: WORLD.groundY - 12, w: 64, h: 12 },
    { x: 1780, y: WORLD.groundY - 12, w: 48, h: 12 },
    { x: 2100, y: WORLD.groundY - 12, w: 64, h: 12 },
  ],
  coins: [
    { id: 1, aabb: { x: 328, y: 128, w: 12, h: 12 }, taken: false },
    { id: 2, aabb: { x: 488, y: 88, w: 12, h: 12 }, taken: false },
    { id: 3, aabb: { x: 708, y: 128, w: 12, h: 12 }, taken: false },
    { id: 4, aabb: { x: 908, y: 78, w: 12, h: 12 }, taken: false },
    { id: 5, aabb: { x: 1058, y: 138, w: 12, h: 12 }, taken: false },
    { id: 6, aabb: { x: 1258, y: 108, w: 12, h: 12 }, taken: false },
    { id: 7, aabb: { x: 1458, y: 68, w: 12, h: 12 }, taken: false },
    { id: 8, aabb: { x: 1608, y: 128, w: 12, h: 12 }, taken: false },
    { id: 9, aabb: { x: 1858, y: 98, w: 12, h: 12 }, taken: false },
    { id: 10, aabb: { x: 2058, y: 128, w: 12, h: 12 }, taken: false },
  ],
  exit: { x: 2280, y: WORLD.groundY - 40, w: 48, h: 40 },
  enemies: [
    { id: 1, x: 700, y: WORLD.groundY - 16, patrol: [660, 800], speed: 60 },
    { id: 2, x: 1300, y: WORLD.groundY - 16, patrol: [1240, 1400], speed: 75 },
    { id: 3, x: 1900, y: WORLD.groundY - 16, patrol: [1840, 2000], speed: 85 },
  ],
}

export const WARDEN_ARENA: SideWorld = {
  bounds: { minX: 0, maxX: 1500 },
  groundY: WORLD.groundY,
  spawn: { x: 80, y: WORLD.groundY - 24 },
  platforms: [
    { x: 0, y: WORLD.groundY, w: 1500, h: 64 },
    { x: 280, y: 150, w: 110, h: 16 },
    { x: 560, y: 105, w: 110, h: 16 },
    { x: 820, y: 150, w: 110, h: 16 },
    { x: 1090, y: 105, w: 110, h: 16 },
    { x: 1250, y: 160, w: 110, h: 16 },
  ],
  hazards: [],
  coins: [],
  exit: { x: -100, y: WORLD.groundY - 40, w: 48, h: 40 },
  enemies: [],
  boss: { x: 900, y: 70, w: 44, h: 64, maxHp: 12 },
}
