import { dark } from '@clerk/themes'

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#4FC3F7',
    colorBackground: '#0a0a1a',
    colorInputBackground: '#0d0d0d',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: '#aaaaaa',
    colorDanger: '#F44336',
    fontFamily: "'JetBrains Mono', monospace",
    borderRadius: '0',
    spacingUnit: '1.5rem',
  },
  elements: {
    card: {
      border: '4px solid rgba(79,195,247,0.3)',
      background: 'rgba(0,0,0,0.8)',
      maxWidth: '400px',
      width: '100%',
      margin: '0 auto',
    },
    headerTitle: {
      fontFamily: "'Press Start 2P', monospace",
      color: '#4FC3F7',
      fontSize: '22px',
      letterSpacing: '4px',
    },
    headerSubtitle: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
      color: '#888',
      letterSpacing: '2px',
    },
    formButtonPrimary: {
      border: '4px solid rgba(79,195,247,0.4)',
      background: '#1a2a3a',
      color: '#4FC3F7',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '11px',
      letterSpacing: '3px',
      borderRadius: '0',
      padding: '10px 24px',
      transition: 'all 0.1s',
    },
    formFieldInput: {
      border: '3px solid #2a2a2a',
      background: '#0d0d0d',
      color: '#ffffff',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '14px',
      borderRadius: '0',
      padding: '10px 12px',
    },
    formFieldLabel: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
      color: '#aaa',
      letterSpacing: '1px',
      marginBottom: '4px',
    },
    footerActionText: {
      color: '#666',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
    },
    footerActionLink: {
      color: '#4FC3F7',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
      textDecoration: 'none',
    },
    dividerLine: {
      background: '#2a2a2a',
    },
    identityPreviewText: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
    },
    socialButtonsBlockButton: {
      border: '3px solid #2a2a2a',
      background: '#0d0d0d',
      borderRadius: '0',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
    },
    formFieldError: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '7px',
    },
    alert: {
      borderRadius: '0',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '7px',
    },
  },
}
