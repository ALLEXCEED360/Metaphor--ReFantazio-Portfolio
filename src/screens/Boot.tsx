import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { Flick } from '../components/Splat'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { useIsMobile } from '../hooks/useMedia'
import { profile } from '../data/profile'
import './Boot.css'

const ease = [0.16, 1, 0.3, 1] as const

export function Boot() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const [armed, setArmed] = useState(false)

  // any key / tap advances — but ignore the first ~600ms so an accidental
  // keypress during the fade doesn't skip the whole title
  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), reducedMotion ? 0 : 600)
    return () => clearTimeout(t)
  }, [reducedMotion])

  useEffect(() => {
    if (!armed) return
    const start = () => go('/menu', { word: 'Begin' })
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'F5' || e.key === 'F12' || e.key === 'Tab') return
      start()
    }
    const onPointer = () => start()
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [armed, go])

  const d = (n: number) => (reducedMotion ? 0 : n)

  return (
    <div className="boot" data-cursor="interactive">
      <Background
        art={7}
        mobileArt={1}
        focus="center"
        dim={0.55}
        position="70% center"
        video="/video/boot-loop.mp4"
        poster="/video/boot-poster.jpg"
        videoDelay={reducedMotion ? 0 : 3300}
      />

      <motion.div
        className="boot__veil"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: d(1.2), delay: d(0.2), ease: 'easeOut' }}
      />

      <div className="boot__center">
        <div className="boot__name">
          <motion.span
            className="t-hero boot__first"
            initial={{ opacity: 0, x: -120, scaleX: 1.9 }}
            animate={{ opacity: 1, x: 0, scaleX: 1.32 }}
            transition={{ duration: d(0.9), delay: d(0.55), ease }}
          >
            {profile.first}
          </motion.span>
          <motion.span
            className="t-hero boot__last"
            initial={{ opacity: 0, x: 120, scaleX: 1.9 }}
            animate={{ opacity: 1, x: 0, scaleX: 1.32 }}
            transition={{ duration: d(0.9), delay: d(0.72), ease }}
          >
            {profile.last}
          </motion.span>
        </div>

        <motion.div
          className="boot__slash"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: d(0.7), delay: d(1.15), ease }}
        >
          <Flick color="var(--red)" />
        </motion.div>

        <motion.div
          className="boot__titles t-ui"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: d(0.6), delay: d(1.4), ease }}
        >
          {profile.titles.map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="boot__dot" aria-hidden="true" />}
              {t}
            </span>
          ))}
        </motion.div>

        <motion.button
          className="boot__press t-ui-bold"
          onClick={() => go('/menu', { word: 'Begin' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: d(0.6), delay: d(2.0) }}
        >
          <span className="boot__press-line" aria-hidden="true" />
          <span className="boot__press-text">{isMobile ? 'Tap to begin' : 'Press any key'}</span>
          <span className="boot__press-line" aria-hidden="true" />
        </motion.button>
      </div>

      <motion.div
        className="boot__corner t-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: d(0.6), delay: d(2.2) }}
      >
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Portfolio · v1.0</span>
      </motion.div>
    </div>
  )
}
