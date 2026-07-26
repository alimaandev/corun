import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX_PARTICLES = 500

interface ParticleData {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
  maxLife: number
  size: number
  r: number
  g: number
  b: number
}

let burstFn: ((x: number, y: number, z: number, count?: number) => void) | null = null

export function emitBurst(x: number, y: number, z: number, count = 30) {
  if (burstFn) burstFn(x, y, z, count)
}

export default function Particles3D() {
  const geoRef = useRef<THREE.BufferGeometry>(null)
  const particles = useRef<ParticleData[]>([])
  const burstQueue = useRef<{ x: number; y: number; z: number; count: number }[]>([])

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLES * 3)
    const col = new Float32Array(MAX_PARTICLES * 3)
    const siz = new Float32Array(MAX_PARTICLES)
    return { positions: pos, colors: col, sizes: siz }
  }, [])

  useEffect(() => {
    burstFn = (x: number, y: number, z: number, count = 30) => {
      burstQueue.current.push({ x, y, z, count })
    }
    const p = particles.current
    for (let i = 0; i < MAX_PARTICLES; i++) {
      p[i] = {
        position: new THREE.Vector3(0, -100, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        life: 0,
        maxLife: 1,
        size: 0,
        r: 1,
        g: 1,
        b: 1,
      }
    }
    return () => {
      burstFn = null
    }
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const p = particles.current

    for (const burst of burstQueue.current) {
      let spawned = 0
      for (let i = 0; i < MAX_PARTICLES && spawned < burst.count; i++) {
        if (p[i].life <= 0) {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const speed = 0.5 + Math.random() * 1.5
          p[i].position.set(burst.x, burst.y, burst.z)
          p[i].velocity.set(
            Math.sin(theta) * Math.cos(phi) * speed,
            Math.sin(phi) * speed + 0.5,
            Math.cos(theta) * Math.cos(phi) * speed,
          )
          p[i].life = 0.6 + Math.random() * 0.4
          p[i].maxLife = p[i].life
          p[i].size = 0.08 + Math.random() * 0.12
          p[i].r = 0.46
          p[i].g = 0.6
          p[i].b = 0.15
          spawned++
        }
      }
    }
    burstQueue.current = []

    const pos = positions
    const col = colors
    const siz = sizes

    let activeCount = 0

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (p[i].life > 0) {
        p[i].life -= dt
        p[i].velocity.y -= 1.5 * dt
        p[i].position.x += p[i].velocity.x * dt
        p[i].position.y += p[i].velocity.y * dt
        p[i].position.z += p[i].velocity.z * dt

        const lifeRatio = Math.max(0, p[i].life / p[i].maxLife)
        const idx3 = i * 3
        pos[idx3] = p[i].position.x
        pos[idx3 + 1] = p[i].position.y
        pos[idx3 + 2] = p[i].position.z
        col[idx3] = p[i].r
        col[idx3 + 1] = p[i].g
        col[idx3 + 2] = p[i].b
        siz[i] = p[i].size * lifeRatio

        if (p[i].life <= 0) {
          p[i].position.y = -100
        }
        activeCount++
      } else {
        const idx3 = i * 3
        pos[idx3] = 0
        pos[idx3 + 1] = -100
        pos[idx3 + 2] = 0
        siz[i] = 0
      }
    }

    const geo = geoRef.current
    if (geo) {
      geo.attributes.position.needsUpdate = true
      geo.attributes.color.needsUpdate = true
      geo.attributes.size.needsUpdate = true
      geo.setDrawRange(0, activeCount)
    }
  })

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return g
  }, [positions, colors, sizes])

  return (
    <points ref={geoRef} geometry={geo}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
