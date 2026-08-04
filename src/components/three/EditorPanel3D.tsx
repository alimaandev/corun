import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CodePuzzle } from '../../game/types'
import { evaluateCode } from '../../game/engine/data/codePuzzles'
import { playSuccess, playError } from '../../game/sound'

const CANVAS_W = 640
const CANVAS_H = 480
const LINE_H = 20
const GUTTER = 32
const CODE_X = GUTTER + 8
const CODE_Y0 = 80
const TITLE_H = 32
const DESC_H = 50
const BTN_H = 36
const BOTTOM_MARGIN = 8

const KEYWORDS = new Set([
  'function',
  'const',
  'let',
  'var',
  'if',
  'else',
  'for',
  'while',
  'return',
  'true',
  'false',
  'null',
  'undefined',
  'async',
  'await',
  'try',
  'catch',
  'throw',
  'new',
  'this',
  'class',
  'import',
  'export',
  'from',
  'of',
  'in',
  'switch',
  'case',
  'break',
  'continue',
  'typeof',
  'instanceof',
  'void',
  'delete',
])

const PUNCT = new Set(['{', '}', '(', ')', '[', ']', ';', ':', ',', '.', '=>', '...'])

const STRING_DELIMS = new Set(["'", '"', '`'])

interface Props {
  puzzle: CodePuzzle
  onSolve: () => void
  onClose: () => void
  playerX: number
}

function tokenizeLine(
  line: string,
): { text: string; type: 'keyword' | 'string' | 'comment' | 'punct' | 'number' | 'normal' }[] {
  const tokens: {
    text: string
    type: 'keyword' | 'string' | 'comment' | 'punct' | 'number' | 'normal'
  }[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' })
      break
    }
    if (STRING_DELIMS.has(line[i])) {
      const delim = line[i]
      let j = i + 1
      while (j < line.length && line[j] !== delim) j++
      if (j < line.length) j++
      tokens.push({ text: line.slice(i, j), type: 'string' })
      i = j
      continue
    }
    if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
      let j = i
      while (j < line.length && /\d/.test(line[j])) j++
      tokens.push({ text: line.slice(i, j), type: 'number' })
      i = j
      continue
    }
    if (/\w/.test(line[i]) || line[i] === '$') {
      let j = i
      while (j < line.length && /\w/.test(line[j])) j++
      const word = line.slice(i, j)
      tokens.push({ text: word, type: KEYWORDS.has(word) ? 'keyword' : 'normal' })
      i = j
      continue
    }
    if (line[i] === '=' && line[i + 1] === '>') {
      tokens.push({ text: '=>', type: 'punct' })
      i += 2
      continue
    }
    if (line[i] === '.' && line[i + 1] === '.' && line[i + 2] === '.') {
      tokens.push({ text: '...', type: 'punct' })
      i += 3
      continue
    }
    if (PUNCT.has(line[i])) {
      tokens.push({ text: line[i], type: 'punct' })
      i++
      continue
    }
    let j = i
    while (
      j < line.length &&
      !/\w/.test(line[j]) &&
      !PUNCT.has(line[j]) &&
      !STRING_DELIMS.has(line[j]) &&
      line[j] !== '/' &&
      !(line[j] === '/' && line[j + 1] === '/')
    )
      j++
    if (j === i) j = i + 1
    tokens.push({ text: line.slice(i, j), type: 'normal' })
    i = j
  }
  return tokens
}

function countLines(code: string): number {
  let n = 1
  for (const ch of code) if (ch === '\n') n++
  return n
}

function offsetToLineCol(code: string, offset: number): [number, number] {
  let line = 0
  let col = 0
  for (let i = 0; i < offset && i < code.length; i++) {
    if (code[i] === '\n') {
      line++
      col = 0
    } else col++
  }
  return [line, col]
}

export default function EditorPanel3D({ puzzle, onSolve, onClose, playerX }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const [code, setCode] = useState(puzzle.template)
  const [result, setResult] = useState<{ success: boolean; output: string } | null>(null)
  const [running, setRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const cursorOffset = useRef(puzzle.template.length)
  const codeRef = useRef(code)
  const resultRef = useRef(result)
  const hintRef = useRef(showHint)
  const runningRef = useRef(running)
  const dirtyRef = useRef(true)
  const cursorTimer = useRef(0)
  const cursorVisible = useRef(true)

  codeRef.current = code
  resultRef.current = result
  hintRef.current = showHint
  runningRef.current = running

  const { ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = CANVAS_W
    c.height = CANVAS_H
    const t = new THREE.CanvasTexture(c)
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    return { ctx: c.getContext('2d')!, texture: t }
  }, [])

  useEffect(() => {
    setCode(puzzle.template)
    setResult(null)
    setShowHint(false)
    setRunning(false)
    cursorOffset.current = puzzle.template.length
    dirtyRef.current = true
    cursorVisible.current = true
    cursorTimer.current = 0
  }, [puzzle.id, puzzle.template])

  const handleSubmit = useCallback(async () => {
    if (runningRef.current) return
    setRunning(true)
    runningRef.current = true
    setResult(null)
    resultRef.current = null
    dirtyRef.current = true
    const res = await evaluateCode(codeRef.current, puzzle.test)
    setResult(res)
    resultRef.current = res
    setRunning(false)
    runningRef.current = false
    dirtyRef.current = true
    if (res.success) {
      try {
        playSuccess()
      } catch {}
      setTimeout(() => onSolve(), 1200)
    } else {
      try {
        playError()
      } catch {}
    }
  }, [puzzle.test, onSolve])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
        return
      }
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault()
        setShowHint((s) => {
          hintRef.current = !s
          dirtyRef.current = true
          return !s
        })
        return
      }

      if (e.ctrlKey || e.metaKey) return

      const c = codeRef.current
      const pos = cursorOffset.current
      let newCode = c
      let newPos = pos

      if (e.key === 'Backspace' && pos > 0) {
        if (c[pos - 1] === '\n' && pos > 1 && c[pos - 2] === '\r') {
          newCode = c.slice(0, pos - 2) + c.slice(pos)
          newPos = pos - 2
        } else {
          newCode = c.slice(0, pos - 1) + c.slice(pos)
          newPos = pos - 1
        }
      } else if (e.key === 'Delete' && pos < c.length) {
        newCode = c.slice(0, pos) + c.slice(pos + 1)
        newPos = pos
      } else if (e.key === 'Enter') {
        const indent = c.slice(0, pos).match(/[ \t]*$/)?.[0] || ''
        const nextIndent = '  '
        newCode = c.slice(0, pos) + '\n' + indent + nextIndent + c.slice(pos)
        newPos = pos + 1 + indent.length + nextIndent.length
      } else if (e.key === 'Tab') {
        e.preventDefault()
        newCode = c.slice(0, pos) + '  ' + c.slice(pos)
        newPos = pos + 2
      } else if (e.key === 'Home') {
        e.preventDefault()
        const [line] = offsetToLineCol(c, pos)
        let lineStart = 0
        for (let i = 0; i < line; i++) lineStart = c.indexOf('\n', lineStart) + 1
        e.shiftKey ? null : (newPos = lineStart)
      } else if (e.key === 'End') {
        e.preventDefault()
        const [line] = offsetToLineCol(c, pos)
        let lineStart = 0
        for (let i = 0; i < line; i++) lineStart = c.indexOf('\n', lineStart) + 1
        let lineEnd = c.indexOf('\n', lineStart)
        if (lineEnd === -1) lineEnd = c.length
        newPos = lineEnd
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        newPos = Math.max(0, pos - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        newPos = Math.min(c.length, pos + 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const [line, col] = offsetToLineCol(c, pos)
        if (line > 0) {
          let prevLineStart = 0
          for (let i = 0; i < line - 1; i++) prevLineStart = c.indexOf('\n', prevLineStart) + 1
          const thisLineStart = c.indexOf('\n', prevLineStart) + 1
          let prevLineEnd = thisLineStart - 1
          if (prevLineEnd > 0 && c[prevLineEnd - 1] === '\r') prevLineEnd--
          newPos = Math.min(prevLineStart + col, prevLineEnd)
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const [line, col] = offsetToLineCol(c, pos)
        const totalLines = countLines(c)
        if (line < totalLines - 1) {
          let thisLineStart = 0
          for (let i = 0; i < line; i++) thisLineStart = c.indexOf('\n', thisLineStart) + 1
          let nextLineStart = c.indexOf('\n', thisLineStart) + 1
          if (nextLineStart === 0) nextLineStart = c.length
          let nextLineEnd = c.indexOf('\n', nextLineStart)
          if (nextLineEnd === -1) nextLineEnd = c.length
          newPos = Math.min(nextLineStart + col, nextLineEnd)
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        newCode = c.slice(0, pos) + e.key + c.slice(pos)
        newPos = pos + 1
      } else {
        return
      }

      e.preventDefault()
      if (newCode !== c) {
        setCode(newCode)
        codeRef.current = newCode
      }
      cursorOffset.current = newPos
      dirtyRef.current = true
      cursorVisible.current = true
      cursorTimer.current = 0
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, handleSubmit])

  useFrame((_, delta) => {
    if (!dirtyRef.current) {
      cursorTimer.current += delta
      if (cursorTimer.current > 0.53) {
        cursorTimer.current = 0
        cursorVisible.current = !cursorVisible.current
        dirtyRef.current = true
      }
      if (!dirtyRef.current) return
    }

    dirtyRef.current = false
    const c = codeRef.current
    const showH = hintRef.current
    const res = resultRef.current
    const run = runningRef.current

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.strokeStyle = 'rgba(240,235,227,0.12)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(12, 12, CANVAS_W - 24, CANVAS_H - 24)

    ctx.fillStyle = 'rgba(240,235,227,0.04)'
    ctx.fillRect(12, 12, CANVAS_W - 24, TITLE_H)

    ctx.fillStyle = 'rgba(240,235,227,0.5)'
    ctx.font = '11px "Courier New", monospace'
    ctx.fillText(`corun@terminal:~/puzzle/${puzzle.id}`, 22, 31)

    ctx.fillStyle = '#F0EBE3'
    ctx.font = '13px "Poppins", sans-serif'
    ctx.fillText(puzzle.title, 22, 63)

    ctx.fillStyle = 'rgba(240,235,227,0.6)'
    ctx.font = '10px "Roboto", sans-serif'
    ctx.fillText(puzzle.description, 22, CODE_Y0 - 10)

    const codeTop = CODE_Y0
    const y = codeTop

    const lines = c.split('\n')
    const visibleLines = Math.min(
      lines.length,
      Math.floor((CANVAS_H - codeTop - BTN_H - BOTTOM_MARGIN) / LINE_H) - 1,
    )

    ctx.font = '12px "Courier New", monospace'

    for (let i = 0; i < visibleLines && i < lines.length; i++) {
      const lineNum = i + 1
      const lineY = y + i * LINE_H

      ctx.fillStyle = 'rgba(240,235,227,0.2)'
      ctx.textAlign = 'right'
      ctx.fillText(String(lineNum), GUTTER - 4, lineY + 14)
      ctx.textAlign = 'left'

      const tokens = tokenizeLine(lines[i])
      let x = CODE_X
      for (const tok of tokens) {
        switch (tok.type) {
          case 'keyword':
            ctx.fillStyle = '#769826'
            break
          case 'string':
            ctx.fillStyle = '#a8c84e'
            break
          case 'comment':
            ctx.fillStyle = 'rgba(240,235,227,0.25)'
            break
          case 'number':
            ctx.fillStyle = '#8ab3cf'
            break
          case 'punct':
            ctx.fillStyle = 'rgba(240,235,227,0.5)'
            break
          default:
            ctx.fillStyle = '#F0EBE3'
        }
        ctx.fillText(tok.text, x, lineY + 14)
        x += ctx.measureText(tok.text).width
      }
    }

    const [cursorLine, cursorCol] = offsetToLineCol(c, cursorOffset.current)
    if (cursorLine < visibleLines) {
      const cursorY = y + cursorLine * LINE_H
      let cursorX = CODE_X
      const lineText = lines[cursorLine] || ''
      const preCursor = lineText.slice(0, cursorCol)
      cursorX += ctx.measureText(preCursor).width

      if (cursorVisible.current) {
        ctx.fillStyle = '#F0EBE3'
        ctx.fillRect(cursorX, cursorY + 2, 7, 14)
      }
    }

    const btnY = CANVAS_H - BTN_H - BOTTOM_MARGIN

    if (showH) {
      ctx.fillStyle = 'rgba(118,152,38,0.08)'
      ctx.fillRect(18, btnY - 36, CANVAS_W - 36, 28)
      ctx.fillStyle = '#769826'
      ctx.font = '10px "Roboto", sans-serif'
      ctx.fillText(puzzle.hint, 24, btnY - 18)
    }

    ctx.fillStyle = run ? 'rgba(240,235,227,0.3)' : 'rgba(240,235,227,0.05)'
    ctx.fillRect(18, btnY, 60, BTN_H - 4)
    ctx.strokeStyle = 'rgba(240,235,227,0.15)'
    ctx.lineWidth = 1
    ctx.strokeRect(18, btnY, 60, BTN_H - 4)
    ctx.fillStyle = run ? 'rgba(240,235,227,0.3)' : 'rgba(240,235,227,0.6)'
    ctx.font = '9px "Roboto", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(showH ? 'HIDE HINT' : 'HINT', 48, btnY + 16)
    ctx.textAlign = 'left'

    ctx.fillStyle = run ? '#a0a0a0' : '#F0EBE3'
    ctx.fillRect(CANVAS_W - 18 - 80, btnY, 80, BTN_H - 4)
    ctx.fillStyle = run ? '#0a0a0a' : '#0a0a0a'
    ctx.font = '10px "Roboto", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(run ? '⟳ RUNNING' : '▶ RUN', CANVAS_W - 18 - 40, btnY + 16)
    ctx.textAlign = 'left'

    if (res) {
      ctx.fillStyle = '#0d0d0d'
      ctx.fillRect(18, btnY + BTN_H + 4, CANVAS_W - 36, 36)
      ctx.strokeStyle = res.success ? '#769826' : 'rgba(240,235,227,0.2)'
      ctx.lineWidth = 1
      ctx.strokeRect(18, btnY + BTN_H + 4, CANVAS_W - 36, 36)
      ctx.fillStyle = res.success ? '#769826' : 'rgba(240,235,227,0.6)'
      ctx.font = '11px "Courier New", monospace'
      const msg = res.success ? `✓ ${puzzle.successMessage}` : `✗ ${res.output || 'Test failed'}`
      ctx.fillText(msg, 24, btnY + BTN_H + 26)
    }

    ctx.fillStyle = 'rgba(240,235,227,0.2)'
    ctx.font = '9px "Roboto", sans-serif'
    ctx.fillText('Ctrl+Enter Run · Ctrl+H Hint · Esc Close', 22, CANVAS_H - 10)

    texture.needsUpdate = true
  })

  const aspect = CANVAS_W / CANVAS_H
  const panelW = 3
  const panelH = panelW / aspect

  return (
    <mesh
      ref={meshRef}
      position={[playerX + 0.01, 1.8, -0.8]}
      onClick={(e) => {
        e.stopPropagation()
        const uv = e.uv
        if (!uv) return
        const cx = uv.x * CANVAS_W
        const cy = (1 - uv.y) * CANVAS_H
        const btnY = CANVAS_H - BTN_H - BOTTOM_MARGIN
        if (cy >= btnY && cy <= btnY + BTN_H - 4) {
          if (cx >= 18 && cx <= 78) {
            setShowHint((s) => {
              hintRef.current = !s
              dirtyRef.current = true
              return !s
            })
          }
          if (cx >= CANVAS_W - 18 - 80 && cx <= CANVAS_W - 18) {
            handleSubmit()
          }
        }
      }}
    >
      <planeGeometry args={[panelW, panelH]} />
      <meshBasicMaterial map={texture} transparent depthTest />
    </mesh>
  )
}
