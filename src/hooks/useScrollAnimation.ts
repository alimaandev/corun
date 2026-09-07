export function useScrollAnimation() {
  function sectionStyle(
    index: number,
    currentSection: number,
    sectionProgress: number
  ): React.CSSProperties {
    if (index < currentSection) {
      return {
        opacity: 0,
        transform: 'translateY(-30px)',
        pointerEvents: 'none' as const,
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }
    }
    if (index === currentSection) {
      const opacity = Math.min(1, 0.5 + sectionProgress * 3)
      return {
        opacity,
        transform: `translateY(${(1 - opacity) * 20}px)`,
        pointerEvents: 'auto' as const,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }
    }
    return {
      opacity: 0,
      transform: 'translateY(30px)',
      pointerEvents: 'none' as const,
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }
  }

  function fadeIn(delay: number, sectionProgress: number): React.CSSProperties {
    const p = Math.max(0, Math.min(1, (sectionProgress - delay) / (1 - delay)))
    return {
      opacity: p,
      transform: `translateY(${(1 - p) * 24}px)`,
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }
  }

  return { sectionStyle, fadeIn }
}
