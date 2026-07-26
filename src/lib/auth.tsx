import { createContext, useContext, type ReactNode } from 'react'
import { useAuth0, Auth0Provider } from '@auth0/auth0-react'

export const IS_AUTH_CONFIGURED = !!(
  import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID
)

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  user?: { sub?: string }
  loginWithRedirect: (...args: any[]) => Promise<void>
  logout: (...args: any[]) => void
}

const defaultAuth: AuthContextValue = {
  isAuthenticated: false,
  isLoading: false,
  user: undefined,
  loginWithRedirect: async () => {},
  logout: () => {},
}

const AuthCtx = createContext<AuthContextValue>(defaultAuth)

function Auth0Inner({ children }: { children: ReactNode }) {
  const auth = useAuth0()
  return <AuthCtx.Provider value={auth as unknown as AuthContextValue}>{children}</AuthCtx.Provider>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!IS_AUTH_CONFIGURED) {
    return <AuthCtx.Provider value={defaultAuth}>{children}</AuthCtx.Provider>
  }

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN!}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID!}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      authorizationParams={{
        redirect_uri: window.location.origin + '/game',
      }}
    >
      <Auth0Inner>{children}</Auth0Inner>
    </Auth0Provider>
  )
}

export function useAuth(): AuthContextValue {
  return useContext(AuthCtx)
}
