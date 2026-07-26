import { useEffect, useRef } from 'react'

export function useFocusTrap(active: boolean) {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return

    const el = elRef.current
    if (!el) return

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const prevFocus = document.activeElement as HTMLElement | null

    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const focusable = el.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    requestAnimationFrame(() => {
      const first = el.querySelector<HTMLElement>(focusableSelector)
      first?.focus()
    })

    el.addEventListener('keydown', trap)
    return () => {
      el.removeEventListener('keydown', trap)
      prevFocus?.focus()
    }
  }, [active])

  return elRef
}
