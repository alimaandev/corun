import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CODE = [
  'function evadeMonster() {',
  '  const path = findPath();',
  '  while (monster.distance > 0) {',
  '    run();',
  '    if (path.ahead()) {',
  '      const solved = await solve(challenge);',
  '      if (solved) monster.slow(0.3);',
  '    }',
  '  }',
  '  return escape();',
  '}',
  '',
  '// CORUN runtime v2.4.1',
  'const player = new Runner();',
  'player.onChallenge(async (code) => {',
  '  const result = await evaluate(code);',
  '  if (result.passed) {',
  '    score += result.points;',
  '    streak += 1;',
  '  }',
  '});',
  'player.onMonster(evade);',
  'player.onGameOver(submitScore);',
]

const KEYWORDS = new Set(['function', 'const', 'while', 'if', 'return', 'new', 'async', 'let', 'true'])

export default function TerminalScene() {
  const offsetRef = useRef(0)

  const { ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 640
    c.height = 400
    const t = new THREE.CanvasTexture(c)
    t.minFilter = THREE.LinearFilter
    return { ctx: c.getContext('2d')!, texture: t }
  }, [])

  useFrame((_, delta) => {
    offsetRef.current += delta * 6
    if (offsetRef.current >= CODE.length) offsetRef.current = 0

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, 640, 400)

    ctx.strokeStyle = 'rgba(240,235,227,0.12)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(16, 16, 608, 368)

    ctx.fillStyle = 'rgba(240,235,227,0.06)'
    ctx.fillRect(16, 16, 608, 28)

    ctx.fillStyle = 'rgba(240,235,227,0.4)'
    ctx.font = '10px "Courier New", monospace'
    ctx.fillText('corun@terminal:~/chase', 24, 34)

    const offset = Math.floor(offsetRef.current)
    const lineH = 20
    const startY = 58
    ctx.font = '12px "Courier New", monospace'

    for (let i = 0; i < 15; i++) {
      const lineIdx = (offset + i) % CODE.length
      const line = CODE[lineIdx]
      const y = startY + i * lineH

      if (line.startsWith('//')) {
        ctx.fillStyle = 'rgba(240,235,227,0.25)'
        ctx.fillText(line, 28, y)
        continue
      }

      const tokens = line.split(/(\b\w+\b|[{}();.,])/g)
      let x = 28
      for (const token of tokens) {
        if (KEYWORDS.has(token)) {
          ctx.fillStyle = '#769826'
        } else if (token === '{' || token === '}' || token === '(' || token === ')' || token === ';') {
          ctx.fillStyle = 'rgba(240,235,227,0.5)'
        } else {
          ctx.fillStyle = '#F0EBE3'
        }
        ctx.fillText(token, x, y)
        x += ctx.measureText(token).width
      }
    }

    const cursorY = startY + 14 * lineH
    if (Math.floor(Date.now() / 530) % 2 === 0) {
      ctx.fillStyle = '#F0EBE3'
      ctx.fillRect(28, cursorY - 2, 7, 14)
    }

    texture.needsUpdate = true
  })

  return (
    <group>
      <mesh position={[-3.8, 0.6, -1.5]}>
        <planeGeometry args={[4, 2.6]} />
        <meshBasicMaterial map={texture} transparent opacity={0.45} depthWrite={false} />
      </mesh>
      <mesh position={[3.8, 0.6, -1.5]}>
        <planeGeometry args={[4, 2.6]} />
        <meshBasicMaterial map={texture} transparent opacity={0.45} depthWrite={false} />
      </mesh>
    </group>
  )
}
