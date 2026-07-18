import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  colorRef: React.MutableRefObject<THREE.Color>
  scaleRef: React.MutableRefObject<number>
  intensityRef: React.MutableRefObject<number>
}

export default function CoreGeometry({ colorRef, scaleRef, intensityRef }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Sprite>(null)

  const [geometry, edges] = useMemo(() => {
    const geo = new THREE.TorusKnotGeometry(0.8, 0.3, 64, 16)
    const edge = new THREE.EdgesGeometry(geo)
    return [geo, edge]
  }, [])

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current || !wireRef.current || !glowRef.current) return

    const color = colorRef.current
    const scale = scaleRef.current
    const intensity = intensityRef.current

    const t = clock.elapsedTime
    const rotSpeed = 0.15 + intensity * 0.3
    meshRef.current.rotation.x = t * rotSpeed * 0.7
    meshRef.current.rotation.y = t * rotSpeed
    meshRef.current.scale.setScalar(scale)

    wireRef.current.rotation.copy(meshRef.current.rotation)
    wireRef.current.scale.setScalar(scale * 1.02)

    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.color.copy(color)
    mat.emissive.copy(color)
    mat.emissiveIntensity = 0.1 + intensity * 0.4

    const wireMat = wireRef.current.material as THREE.MeshBasicMaterial
    wireMat.color.copy(color)

    glowRef.current.position.set(
      Math.sin(t * 0.3) * 1.2 * scale,
      Math.cos(t * 0.2) * 0.8 * scale,
      Math.sin(t * 0.25) * 1.2 * scale
    )
    glowRef.current.material.color.copy(color)
    glowRef.current.scale.setScalar(1.5 + intensity * 2)
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial roughness={0.3} metalness={0.1} transparent opacity={0.85} />
      </mesh>
      <mesh ref={wireRef} geometry={edges}>
        <meshBasicMaterial transparent opacity={0.4} />
      </mesh>
      <sprite ref={glowRef} scale={[2, 2, 1]}>
        <spriteMaterial
          map={glowTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          opacity={0.6}
        />
      </sprite>
    </group>
  )
}
