import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
      return
    }

    function handler(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') setShowPrompt(false)
    setDeferredPrompt(null)
  }

  if (isStandalone || !showPrompt) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5000,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        background: '#0a0a0a',
        border: '1px solid rgba(240,235,227,0.15)',
        borderRadius: 12,
        padding: '10px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      <span
        style={{
          color: '#F0EBE3',
          fontSize: 13,
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 300,
        }}
      >
        Install corun for offline play
      </span>
      <button
        onClick={handleInstall}
        style={{
          background: '#F0EBE3',
          border: 'none',
          color: '#0a0a0a',
          fontFamily: "'Roboto', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          padding: '6px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          letterSpacing: 1,
        }}
      >
        INSTALL
      </button>
      <button
        onClick={() => setShowPrompt(false)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(240,235,227,0.4)',
          fontFamily: "'Roboto', sans-serif",
          fontSize: 13,
          cursor: 'pointer',
          padding: '4px 8px',
        }}
      >
        ✕
      </button>
    </div>
  )
}
