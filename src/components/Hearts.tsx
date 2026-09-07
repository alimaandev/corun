import { colors } from '../lib/theme'

export default function Hearts({ lives, max = 3 }: { lives: number; max?: number }) {
  const safe = Math.max(0, Math.min(max, lives))
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'JetBrains Mono', monospace",
        color: safe <= 1 ? colors.danger : colors.fg,
        letterSpacing: 1,
      }}
    >
      {'♥'.repeat(safe)}
      {'♡'.repeat(Math.max(0, max - safe))}
    </span>
  )
}
