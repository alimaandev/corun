import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    function goOffline() {
      setOffline(true)
    }
    function goOnline() {
      setOffline(false)
    }
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(118,152,38,0.9)',
        color: '#0a0a0a',
        textAlign: 'center',
        padding: '4px 0',
        fontFamily: "'Roboto', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: 1,
      }}
    >
      OFFLINE — Scores will sync when connected
    </div>
  )
}
