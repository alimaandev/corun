import { useRef, useCallback } from 'react'

const SIZE = 100
const THUMB_SIZE = 40
const DEAD_ZONE = 0.15

interface Props {
  keysDown: React.MutableRefObject<Set<string>>
  onInteract: () => void
}

export default function Joystick({ keysDown, onInteract }: Props) {
  const baseRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const baseRect = useRef({ x: 0, y: 0, cx: 0, cy: 0 })

  const updateThumb = useCallback(
    (x: number, y: number) => {
      const dx = x - baseRect.current.cx
      const dy = y - baseRect.current.cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxR = SIZE / 2 - THUMB_SIZE / 2
      const clamped = Math.min(dist, maxR)
      const angle = Math.atan2(dy, dx)
      const tx = Math.cos(angle) * clamped
      const ty = Math.sin(angle) * clamped

      if (thumbRef.current) {
        thumbRef.current.style.transform = `translate(${tx}px, ${ty}px)`
      }

      const normX = dist > 0 ? dx / dist : 0
      if (normX < -DEAD_ZONE) {
        keysDown.current.add('arrowleft')
        keysDown.current.delete('arrowright')
      } else if (normX > DEAD_ZONE) {
        keysDown.current.add('arrowright')
        keysDown.current.delete('arrowleft')
      } else {
        keysDown.current.delete('arrowleft')
        keysDown.current.delete('arrowright')
      }
    },
    [keysDown],
  )

  const resetThumb = useCallback(() => {
    activeRef.current = false
    if (thumbRef.current) {
      thumbRef.current.style.transform = 'translate(0px, 0px)'
    }
    keysDown.current.delete('arrowleft')
    keysDown.current.delete('arrowright')
  }, [keysDown])

  const onStart = useCallback(
    (clientX: number, clientY: number) => {
      const el = baseRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      baseRect.current = {
        x: rect.left,
        y: rect.top,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      }
      activeRef.current = true
      updateThumb(clientX, clientY)
    },
    [updateThumb],
  )

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!activeRef.current) return
      updateThumb(clientX, clientY)
    },
    [updateThumb],
  )

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 220,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <div
        ref={baseRef}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          background: 'rgba(240,235,227,0.06)',
          border: '1px solid rgba(240,235,227,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          const t = e.changedTouches[0]
          onStart(t.clientX, t.clientY)
        }}
        onTouchMove={(e) => {
          e.preventDefault()
          const t = e.changedTouches[0]
          onMove(t.clientX, t.clientY)
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          resetThumb()
        }}
        onTouchCancel={(e) => {
          e.preventDefault()
          resetThumb()
        }}
        onMouseDown={(e) => {
          onStart(e.clientX, e.clientY)
        }}
        onMouseMove={(e) => {
          onMove(e.clientX, e.clientY)
        }}
        onMouseUp={() => resetThumb()}
        onMouseLeave={() => resetThumb()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          ref={thumbRef}
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: '50%',
            background: 'rgba(240,235,227,0.15)',
            border: '1px solid rgba(240,235,227,0.3)',
            transition: 'none',
            position: 'absolute',
            top: (SIZE - THUMB_SIZE) / 2,
            left: (SIZE - THUMB_SIZE) / 2,
          }}
        />
      </div>
      <button
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(240,235,227,0.08)',
          border: '1px solid rgba(240,235,227,0.2)',
          color: '#F0EBE3',
          fontSize: 12,
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 500,
          zIndex: 220,
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          onInteract()
        }}
        onClick={onInteract}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Interact"
      >
        E
      </button>
    </div>
  )
}
