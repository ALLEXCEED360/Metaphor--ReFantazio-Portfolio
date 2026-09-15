import { useCallback, useEffect, useRef, useState } from 'react'
import { sfx } from '../app/audio'

interface Options {
  count: number
  initial?: number
  onSelect?: (index: number) => void
  onBack?: () => void
  /** 'vertical' (↑↓) or 'horizontal' (←→) */
  axis?: 'vertical' | 'horizontal' | 'both'
  enabled?: boolean
  loop?: boolean
}

/**
 * Game-style list navigation: arrow keys / WASD move the cursor,
 * Enter / Space confirm, Escape / Backspace go back.
 */
export function useKeyNav({
  count,
  initial = 0,
  onSelect,
  onBack,
  axis = 'vertical',
  enabled = true,
  loop = true,
}: Options) {
  const [index, setIndex] = useState(initial)
  // refs so two key presses in the same frame never see a stale index/callback
  const indexRef = useRef(index)
  indexRef.current = index
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect
  const backRef = useRef(onBack)
  backRef.current = onBack

  const move = useCallback(
    (delta: number) => {
      const next = indexRef.current + delta
      const clamped = loop ? (next + count) % count : Math.max(0, Math.min(count - 1, next))
      if (clamped !== indexRef.current) sfx.tick()
      indexRef.current = clamped
      setIndex(clamped)
    },
    [count, loop],
  )

  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      const vertical = axis !== 'horizontal'
      const horizontal = axis !== 'vertical'
      switch (e.key) {
        case 'ArrowDown':
        case 's':
          if (vertical) {
            e.preventDefault()
            move(1)
          }
          break
        case 'ArrowUp':
        case 'w':
          if (vertical) {
            e.preventDefault()
            move(-1)
          }
          break
        case 'ArrowRight':
        case 'd':
          if (horizontal) {
            e.preventDefault()
            move(1)
          }
          break
        case 'ArrowLeft':
        case 'a':
          if (horizontal) {
            e.preventDefault()
            move(-1)
          }
          break
        case 'Enter':
        case ' ':
          if (selectRef.current) {
            e.preventDefault()
            sfx.confirm()
            selectRef.current(indexRef.current)
          }
          break
        case 'Escape':
        case 'Backspace':
          if (backRef.current) {
            e.preventDefault()
            sfx.back()
            backRef.current()
          }
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [axis, enabled, move])

  // hover / click selection from the screens: same tick as the keys
  const pick = useCallback((i: number) => {
    if (i !== indexRef.current) sfx.tick()
    indexRef.current = i
    setIndex(i)
  }, [])

  return { index, setIndex: pick }
}
