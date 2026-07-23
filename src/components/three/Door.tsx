import * as THREE from 'three'

interface Props {
  position: [number, number, number]
  label: string
  color: string
  open?: boolean
}

export default function Door({ position, label, color, open }: Props) {
  return (
    <group position={position}>
      {/* Door frame */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.4, 2.4, 0.2]} />
        <meshBasicMaterial color="rgba(240,235,227,0.08)" />
      </mesh>
      {/* Arch cutout visual — a dark inset */}
      <mesh position={[0, 1.1, 0.02]}>
        <planeGeometry args={[1, 2]} />
        <meshBasicMaterial color={open ? '#769826' : '#0a0a0a'} />
      </mesh>
      {/* Door slab */}
      {!open && (
        <mesh position={[0, 1.1, 0.15]}>
          <boxGeometry args={[1, 2, 0.08]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
      {/* Label glow */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
