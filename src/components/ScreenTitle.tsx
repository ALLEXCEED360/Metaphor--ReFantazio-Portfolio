import { motion } from 'framer-motion'
import { useSettings } from '../app/settings'
import './ScreenTitle.css'

/**
 * The giant extended fat-face word that bleeds off the top-left of every
 * Metaphor screen. Textured by a turbulence mask so it reads as printed ink.
 */
export function ScreenTitle({
  children,
  sub,
}: {
  children: string
  sub?: string
}) {
  const { reducedMotion } = useSettings()
  return (
    <div className="title">
      <motion.h1
        className="t-hero title__word"
        initial={reducedMotion ? false : { x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.h1>
      {sub && (
        <motion.p
          className="title__sub t-ui"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}
