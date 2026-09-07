import { GlassPanel as Base } from '../ui/primitives'

export default function GlassPanel({
  glow,
  ...props
}: React.ComponentProps<typeof Base> & { glow?: string }) {
  return (
    <Base
      {...props}
      style={{ ...(glow ? { boxShadow: `0 0 24px ${glow}22` } : {}), ...props.style }}
    />
  )
}
