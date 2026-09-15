import { type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background, charaUrl } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { Screen, Tag } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useIsMobile } from '../hooks/useMedia'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { experience, kindLabel, type Experience } from '../data/experience'
import './Chronicle.css'

const ease = [0.16, 1, 0.3, 1] as const

// newest first
const entries = [...experience].sort((a, b) => b.start - a.start)
const N = entries.length
const NOW = (() => {
  const d = new Date()
  return d.getFullYear() + (d.getMonth() + 0.5) / 12
})()

/** how long a record ran, as a big figure + unit */
function duration(e: Experience): { value: string; unit: string } {
  const end = e.ongoing ? Math.max(NOW, e.start + 1 / 12) : e.end
  const months = Math.max(1, Math.round((end - e.start) * 12))
  if (months < 12) return { value: String(months), unit: months === 1 ? 'month' : 'months' }
  // whole and half years read better than decimals
  const years = Math.round(months / 6) / 2
  const v = Number.isInteger(years) ? String(years) : years.toFixed(1)
  return { value: v, unit: v === '1' ? 'year' : 'years' }
}

/* ─────────────────────────────────────────────────────────
   CHRONICLE — one record fills the screen at a time, like a bond page:
   an index of numerals down the left, the hero dossier in the middle,
   a character portrait bleeding in from the right. ↑/↓ turns the page.
   ───────────────────────────────────────────────────────── */

export function Chronicle() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const { index, setIndex } = useKeyNav({
    count: N,
    axis: 'both',
    loop: false,
    initial: (() => {
      const q = Number(new URLSearchParams(window.location.search).get('sel'))
      if (Number.isFinite(q) && q >= 1 && q <= N) return q - 1
      return 0
    })(),
    onBack: () => go('/menu'),
  })
  const e = entries[index]
  const dur = duration(e)
  const num = String(index + 1).padStart(2, '0')

  return (
    <Screen
      head={<ScreenTitle sub={`${N} records · work, teaching and leadership`}>Chronicle</ScreenTitle>}
      hints={[
        { key: '↕', label: 'Record' },
      ]}
      onBack={() => go('/menu')}
      className="chronicle"
    >
      <Background art={e.art} mobileArt={e.portrait} focus="center" dim={0.72} position="center 35%" />

      <div className={`ch ${isMobile ? 'ch--mobile' : ''}`} style={{ '--paint': e.paint } as CSSProperties}>
        <motion.div
          className="ch__glow"
          aria-hidden="true"
          animate={{ background: `radial-gradient(ellipse at 70% 60%, ${e.paint} 0%, transparent 55%)` }}
          transition={{ duration: 0.6 }}
        />

        {/* ── portrait ─────────────────────────────────────────────────── */}
        {!isMobile && (
          <div className="ch__portrait" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={e.id}
                className="ch__portrait-inner"
                initial={reducedMotion ? false : { opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
                transition={{ duration: 0.55, ease }}
              >
                <img src={charaUrl(e.portrait)} alt="" />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={e.id}
                className="ch__ghost t-num"
                initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.14 } }}
                transition={{ duration: 0.5, ease }}
              >
                {num}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        {/* ── index ────────────────────────────────────────────────────── */}
        <nav className="ch__index" aria-label="Records">
          {entries.map((x, i) => {
            const on = i === index
            return (
              <button
                key={x.id}
                className={`idx ${on ? 'is-active' : ''}`}
                style={{ '--col': x.paint } as CSSProperties}
                onPointerMove={(e) => e.pointerType === 'mouse' && setIndex(i)}
                onClick={() => setIndex(i)}
                aria-pressed={on}
                aria-label={`${x.role}, ${x.org}`}
              >
                {on && (
                  <motion.span
                    layoutId="ch-idx-mark"
                    className="idx__mark"
                    aria-hidden="true"
                    transition={{ duration: reducedMotion ? 0 : 0.35, ease }}
                  >
                    <Splat color={x.paint} seed={i + 2} />
                  </motion.span>
                )}
                <span className="idx__num t-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="idx__text">
                  <span className="idx__org">{x.org}</span>
                  <span className="idx__period t-mono">{x.period}</span>
                </span>
              </button>
            )
          })}
        </nav>

        {/* ── dossier ──────────────────────────────────────────────────── */}
        <div className="ch__main" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={e.id}
              className="dos"
              initial={reducedMotion ? false : { opacity: 0, x: 40, skewX: -3 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -24, transition: { duration: 0.16 } }}
              transition={{ duration: 0.38, ease }}
            >
              <span className="dos__kicker t-mono">
                Record {num} · {kindLabel[e.kind]} · {e.location}
              </span>

              <h2 className="dos__role t-hero">
                <span className="dos__role-splat" aria-hidden="true">
                  <Splat color={e.paint} seed={index + 4} />
                  <Splat color={e.paint} seed={index + 9} className="splat--second" />
                </span>
                <span className="dos__role-text">{e.role}</span>
              </h2>
              <p className="dos__org">{e.org}</p>

              {/* stat band */}
              <div className="dos__stats">
                <div className="dstat">
                  <span className="t-label">Period</span>
                  <span className="dstat__val t-num">{e.period}</span>
                </div>
                <div className="dstat">
                  <span className="t-label">Duration</span>
                  <span className="dstat__val t-num">
                    {dur.value} <small>{dur.unit}</small>
                  </span>
                </div>
                <div className="dstat">
                  <span className="t-label">Kind</span>
                  <span className="dstat__val dstat__val--ui">{kindLabel[e.kind]}</span>
                </div>
              </div>

              <p className="dos__summary t-body">{e.summary}</p>

              <div className="dos__duties">
                <span className="t-label">Duties</span>
                <ol>
                  {e.duties.map((d, k) => (
                    <motion.li
                      key={d}
                      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16 + k * 0.05, duration: 0.3, ease }}
                    >
                      <span className="dos__duty-num t-num">{String(k + 1).padStart(2, '0')}</span>
                      <span className="t-ui">{d}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              <div className="tags dos__tags">
                {e.tech.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </Screen>
  )
}
