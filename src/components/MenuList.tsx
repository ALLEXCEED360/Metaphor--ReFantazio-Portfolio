import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Splat } from './Splat'
import { useKeyNav } from '../hooks/useKeyNav'
import { useSettings } from '../app/settings'

export interface MenuItem {
  id: string
  label: string
  index?: string
  hint?: string
}

interface Props {
  items: MenuItem[]
  active?: number
  onActive?: (i: number) => void
  onSelect: (i: number) => void
  onBack?: () => void
  color?: string
  /** stagger entrance */
  animate?: boolean
  enabledKeys?: boolean
  className?: string
}

/**
 * Game-style vertical menu. Hover or arrow keys move the cursor; click or
 * Enter confirms. The active row gets the paint-stroke band.
 */
export function MenuList({
  items,
  active,
  onActive,
  onSelect,
  onBack,
  color = 'var(--red)',
  animate = true,
  enabledKeys = true,
  className = '',
}: Props) {
  const { reducedMotion } = useSettings()
  const { index, setIndex } = useKeyNav({
    count: items.length,
    initial: active ?? 0,
    onSelect,
    onBack,
    enabled: enabledKeys,
  })
  const cur = index

  // two-way sync: keyboard moves the internal index → tell the parent;
  // parent (hover / restore) changes `active` → move the internal index
  const onActiveRef = useRef(onActive)
  onActiveRef.current = onActive
  useEffect(() => {
    onActiveRef.current?.(index)
  }, [index])
  useEffect(() => {
    if (active !== undefined) setIndex(active)
  }, [active, setIndex])

  const set = (i: number) => setIndex(i)

  return (
    <ul className={`mlist ${className}`} role="menu">
      {items.map((it, i) => (
        <motion.li
          key={it.id}
          role="none"
          initial={animate && !reducedMotion ? { opacity: 0, x: -24 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06 * i + 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            role="menuitem"
            className={`mitem ${cur === i ? 'is-active' : ''}`}
            onPointerEnter={() => set(i)}
            onFocus={() => set(i)}
            onClick={() => {
              set(i)
              onSelect(i)
            }}
            aria-current={cur === i ? 'true' : undefined}
          >
            <span className="mitem__splat">
              <Splat color={color} seed={(i % 5) + 1} />
            </span>
            <span className="mitem__tri" aria-hidden="true" />
            {it.index && <span className="mitem__idx t-mono">{it.index}</span>}
            <span className="mitem__label t-ui">{it.label}</span>
            {it.hint && <span className="mitem__hint t-mono">{it.hint}</span>}
          </button>
        </motion.li>
      ))}
    </ul>
  )
}
