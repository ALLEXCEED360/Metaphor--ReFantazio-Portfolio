import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../app/settings'
import { useFinePointer } from '../hooks/useMedia'
import './Cursor.css'

/**
 * Custom desktop cursor — a small diamond that fills on interactive targets.
 * Rendered only for fine pointers with the 'custom' setting.
 */
export function Cursor() {
  const { settings } = useSettings()
  const fine = useFinePointer()
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'normal' | 'hover' | 'down'>('normal')
  const [visible, setVisible] = useState(false)

  const enabled = fine && settings.cursor === 'custom'

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    let x = -100
    let y = -100
    const el = ref.current
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      setVisible(true)
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        })
      }
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      const interactive = !!t?.closest('a, button, [role="button"], [data-cursor="interactive"], input, select')
      setState((s) => (s === 'down' ? s : interactive ? 'hover' : 'normal'))
    }
    const down = () => setState('down')
    const up = (e: PointerEvent) => over(e)
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerdown', down)
    document.addEventListener('pointerup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={ref} className={`cursor cursor--${state} ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <span className="cursor__diamond" />
      <span className="cursor__ring" />
    </div>
  )
}
