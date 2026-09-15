import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNav, WIPE_COVER_MS, WIPE_REVEAL_MS } from '../app/router'
import './Wipe.css'

const EASE = [0.76, 0, 0.18, 1] as const

/**
 * The big section transition. Three skewed slabs tear across the screen —
 * cream leads, crimson follows, ink lands on top and holds while the
 * destination word slams in. On reveal the ink leaves first so a red/cream
 * stripe trails behind it, uncovering the new screen.
 */
export function Wipe() {
  const { wipe } = useNav()
  const cover = wipe?.phase === 'cover'
  const coverS = WIPE_COVER_MS / 1000
  const revealS = WIPE_REVEAL_MS / 1000

  const slab = (tone: 'cream' | 'red' | 'ink', inDelay: number, outDelay: number) => (
    <motion.div
      key={tone}
      className={`wipe__slab wipe__slab--${tone}`}
      initial={{ x: '-125%' }}
      animate={{ x: cover ? '0%' : '125%' }}
      transition={{
        duration: cover ? coverS : revealS,
        delay: cover ? inDelay : outDelay,
        ease: EASE,
      }}
    />
  )

  return (
    <AnimatePresence>
      {wipe && (
        <div className="wipe" aria-hidden="true">
          {slab('cream', 0, 0.16)}
          {slab('red', 0.05, 0.08)}
          {slab('ink', 0.1, 0)}
          <motion.div
            className="wipe__word t-hero"
            style={{ '--fit': `${(86 / (wipe.word.length * 0.82)).toFixed(1)}vw` } as CSSProperties}
            initial={{ opacity: 0, x: -90, scaleX: 1.9 }}
            animate={cover ? { opacity: 1, x: 0, scaleX: 1.32 } : { opacity: 0, x: 160, scaleX: 1.5 }}
            transition={{
              duration: cover ? 0.4 : 0.28,
              delay: cover ? 0.34 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {wipe.word}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
