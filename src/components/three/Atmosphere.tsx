import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CoreGeometry from './CoreGeometry'
import ParticleField from './ParticleField'
import RimRings from './RimRings'

const SECTION_COLORS = [
  new THREE.Color('#F0EBE3'),
  new THREE.Color('#769826'),
  new THREE.Color('#F0EBE3'),
  new THREE.Color('#769826'),
]

const SECTION_CAM = [
  { angle: -0.25, height: 2.5, dist: 7 },
  { angle: 0, height: 2.8, dist: 7.5 },
  { angle: 0.15, height: 3.2, dist: 8 },
  { angle: 0.25, height: 3.5, dist: 9 },
]

const CAM_TARGETS = [
  new THREE.Vector3(0, 0.5, 0),
  new THREE.Vector3(0, 0.8, 0),
  new THREE.Vector3(0, 0.5, 0),
  new THREE.Vector3(0, 0.2, 0),
]

interface Props {
  scrollRef: React.MutableRefObject<number>
  sectionRef: React.MutableRefObject<number>
  sectionProgressRef: React.MutableRefObject<number>
}

export default function Atmosphere({ scrollRef, sectionRef, sectionProgressRef }: Props) {
  const colorRef = useRef(new THREE.Color('#F0EBE3'))
  const intensityRef = useRef(0.5)
  const scaleRef = useRef(1)
  const spreadRef = useRef(1)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ camera }, delta) => {
    const progress = scrollRef.current
    const section = sectionRef.current
    const sp = sectionProgressRef.current

    const idx = Math.min(3, section)
    const nextIdx = Math.min(3, section + 1)
    const cFrom = SECTION_COLORS[idx]
    const cTo = SECTION_COLORS[nextIdx]
    colorRef.current.lerpColors(cFrom, cTo, sp)

    intensityRef.current += (0.3 + sp * 0.7 - intensityRef.current) * 0.05
    scaleRef.current += (1 + sp * 0.6 - scaleRef.current) * 0.03
    spreadRef.current += (0.8 + sp * 0.4 - spreadRef.current) * 0.03

    if (lightRef.current) lightRef.current.color.copy(colorRef.current)

    const cam = SECTION_CAM[idx]
    const nextCam = SECTION_CAM[nextIdx]
    const angle = cam.angle + (nextCam.angle - cam.angle) * sp
    const height = cam.height + (nextCam.height - cam.height) * sp
    const dist = cam.dist + (nextCam.dist - cam.dist) * sp

    const target = CAM_TARGETS[idx].clone().lerp(CAM_TARGETS[nextIdx], sp)

    const x = Math.sin(angle) * dist
    const z = Math.cos(angle) * dist
    const targetPos = new THREE.Vector3(target.x + x, height, target.z + z)
    camera.position.lerp(targetPos, 1 - Math.exp(-3 * delta))
    camera.lookAt(target.x, target.y, target.z)
  })

  return (
    <>
      <ambientLight color="#F0EBE3" intensity={0.15} />
      <pointLight ref={lightRef} color="#F0EBE3" intensity={1.5} distance={20} position={[0, 3, 0]} />

      <CoreGeometry colorRef={colorRef} scaleRef={scaleRef} intensityRef={intensityRef} />
      <ParticleField colorRef={colorRef} spreadRef={spreadRef} intensityRef={intensityRef} />
      <RimRings colorRef={colorRef} intensityRef={intensityRef} sectionRef={sectionRef} />
    </>
  )
}
