import { SignUp } from '@clerk/clerk-react'
import { clerkAppearance } from '../auth/clerkTheme'

export default function RegisterPage() {
  return (
    <div style={wrap}>
      <SignUp appearance={clerkAppearance} signInUrl="/sign-in" />
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 12, background: '#0a0a1a',
  overflowY: 'auto',
}
