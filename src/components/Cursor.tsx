import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../app/settings'
import { useFinePointer } from '../hooks/useMedia'
import './Cursor.css'

/**
 * Custom desktop cursor — a geometric ink-splashed blade that becomes a
 * target reticle over interactive elements.
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
    const isInteractive = (t: EventTarget | null) =>
      !!(t as HTMLElement | null)?.closest?.('a, button, [role="button"], [data-cursor="interactive"], input, select, textarea, label')
    // hovering never overrides a held press; release always resolves it
    const over = (e: PointerEvent) => {
      const interactive = isInteractive(e.target)
      setState((s) => (s === 'down' ? s : interactive ? 'hover' : 'normal'))
    }
    const down = () => setState('down')
    const release = (e?: Event) => {
      const t = e && 'clientX' in e ? document.elementFromPoint((e as PointerEvent).clientX, (e as PointerEvent).clientY) : null
      setState(isInteractive(t) ? 'hover' : 'normal')
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
      document.documentElement.removeEventListener('mouseleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={ref} className={`cursor cursor--${state} ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      {/* default: a sharp geometric blade with an ink splatter behind it */}
      <svg className="cursor__blade" viewBox="0 0 32 32" width="32" height="32">
        <path d="M 4,4 C 8,2 14,8 12,14 C 18,12 24,18 20,24 C 16,28 10,22 4,20 C 2,14 0,8 4,4 Z" fill="#E60033" opacity="0.85" />
        <circle cx="22" cy="8" r="1.5" fill="#E60033" />
        <circle cx="26" cy="14" r="1" fill="#111111" />
        <polygon points="2,2 22,10 12,14 10,22" fill="#111111" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="4,4 18,10 11,13 9,18" fill="#00E5FF" />
        <line x1="4" y1="4" x2="11" y2="13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {/* over anything that can act: a target reticle with an ink burst */}
      <svg className="cursor__reticle" viewBox="0 0 32 32" width="32" height="32">
        <path d="M 12,2 C 20,0 28,6 26,14 C 32,18 28,28 20,26 C 14,30 4,24 6,16 C 0,10 6,2 12,2 Z" fill="#E60033" />
        <circle className="cursor__ring" cx="16" cy="16" r="12" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 3" />
        <circle cx="16" cy="16" r="6" fill="#111111" stroke="#00E5FF" strokeWidth="1.5" />
        <line x1="16" y1="0" x2="16" y2="7" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="16" y1="25" x2="16" y2="32" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="0" y1="16" x2="7" y2="16" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="25" y1="16" x2="32" y2="16" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="16" cy="16" r="2.5" fill="#00E5FF" />
      </svg>
    </div>
  )
}
