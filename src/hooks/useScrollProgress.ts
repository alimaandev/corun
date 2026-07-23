import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

const SECTIONS = ['hero', 'story', 'modes', 'arcs']
const SECTION_COUNT = SECTIONS.length

export function useScrollProgress() {
  const lenisRef = useRef<Lenis | null>(null)
  const progressRef = useRef(0)
  const sectionRef = useRef(0)
  const sectionProgressRef = useRef(0)
  const [section, setSection] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    lenisRef.current = lenis

    lenis.on('scroll', (e: { scroll: number; limit: number; progress: number }) => {
      const raw = e.progress
      progressRef.current = Math.max(0, Math.min(1, raw))
      const idx = Math.min(SECTION_COUNT - 1, Math.floor(raw * SECTION_COUNT))
      const sp = (raw * SECTION_COUNT) - idx
      sectionProgressRef.current = Math.max(0, Math.min(1, sp))
      if (idx !== sectionRef.current) {
        sectionRef.current = idx
        setSection(idx)
      }
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return {
    lenis: lenisRef,
    progressRef,
    sectionRef,
    sectionProgressRef,
    section,
    sections: SECTIONS,
  }
}
