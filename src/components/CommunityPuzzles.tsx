import { useState, useCallback } from 'react'
import { CodePuzzle } from '../game/types'
import { getCustomPuzzles, deleteCustomPuzzle } from '../game/puzzleShare'
import { useFocusTrap } from '../lib/useFocusTrap'

interface Props {
  onSelect: (puzzle: CodePuzzle) => void
  onClose: () => void
}

export default function CommunityPuzzles({ onSelect, onClose }: Props) {
  const [customPuzzles, setCustomPuzzles] = useState<Record<string, CodePuzzle>>(getCustomPuzzles)
  const [filter, setFilter] = useState('')

  const customList = Object.values(customPuzzles)
  const filtered = filter
    ? customList.filter((p) => p.title.toLowerCase().includes(filter.toLowerCase()))
    : customList

  const handleDelete = useCallback((id: string) => {
    deleteCustomPuzzle(id)
    setCustomPuzzles((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const s: Record<string, React.CSSProperties> = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 500,
    },
    panel: {
      width: '90%',
      maxWidth: 500,
      maxHeight: '80vh',
      overflow: 'auto',
      background: '#0a0a0a',
      border: '1px solid rgba(240,235,227,0.12)',
      borderRadius: 12,
      padding: 24,
    },
    h1: {
      color: '#F0EBE3',
      fontSize: 14,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
      marginBottom: 16,
    },
    search: {
      width: '100%',
      background: '#0d0d0d',
      border: '1px solid rgba(240,235,227,0.1)',
      color: '#F0EBE3',
      fontFamily: "'Roboto', sans-serif",
      fontSize: 13,
      padding: '8px 10px',
      borderRadius: 6,
      marginBottom: 12,
      boxSizing: 'border-box',
    },
    item: {
      padding: '10px 12px',
      border: '1px solid rgba(240,235,227,0.08)',
      borderRadius: 8,
      marginBottom: 8,
      cursor: 'pointer',
      background: 'rgba(240,235,227,0.02)',
    },
    title: { color: '#F0EBE3', fontSize: 14, fontFamily: "'Poppins', sans-serif", fontWeight: 500 },
    desc: {
      color: 'rgba(240,235,227,0.5)',
      fontSize: 13,
      fontFamily: "'Roboto', sans-serif",
      marginTop: 4,
    },
    row: { display: 'flex', gap: 8, marginTop: 20 },
    btn: {
      background: '#F0EBE3',
      border: 'none',
      color: '#0a0a0a',
      cursor: 'pointer',
      fontFamily: "'Roboto', sans-serif",
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 20px',
      borderRadius: 8,
      letterSpacing: 2,
    },
    btnSmall: {
      background: 'rgba(240,235,227,0.05)',
      border: '1px solid rgba(240,235,227,0.15)',
      color: 'rgba(240,235,227,0.5)',
      cursor: 'pointer',
      fontFamily: "'Roboto', sans-serif",
      fontSize: 13,
      padding: '4px 10px',
      borderRadius: 6,
    },
    empty: {
      color: 'rgba(240,235,227,0.3)',
      fontSize: 13,
      fontFamily: "'Roboto', sans-serif",
      textAlign: 'center',
      padding: 20,
    },
  }

  const trapRef = useFocusTrap(true)
  return (
    <div
      ref={trapRef}
      style={s.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Custom Puzzles"
    >
      <div style={s.panel} onClick={(e) => e.stopPropagation()}>
        <div style={s.h1}>Custom Puzzles ({customList.length})</div>

        {customList.length > 0 && (
          <input
            style={s.search}
            placeholder="Filter puzzles..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        )}

        {filtered.length === 0 && (
          <div style={s.empty}>
            {customList.length === 0
              ? 'No custom puzzles yet. Create one with the Puzzle Editor!'
              : 'No puzzles match your filter.'}
          </div>
        )}

        {filtered.map((p) => (
          <div key={p.id} style={s.item} onClick={() => onSelect(p)}>
            <div style={s.title}>{p.title}</div>
            <div style={s.desc}>{p.description.slice(0, 80)}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <span
                style={{
                  color: 'rgba(240,235,227,0.3)',
                  fontSize: 13,
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Level {p.levelId}
              </span>
            </div>
            <div style={{ marginTop: 6 }}>
              <button
                style={s.btnSmall}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(p.id)
                }}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}

        <div style={s.row}>
          <button style={s.btn} onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
