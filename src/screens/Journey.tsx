import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { Screen, Tag } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useIsMobile } from '../hooks/useMedia'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { journey, type Milestone } from '../data/education'
import './Journey.css'

const ease = [0.16, 1, 0.3, 1] as const

/** "01" for chapters, "01.2" for entries nested under a chapter */
const NUMBER: string[] = (() => {
  const out: string[] = []
  let top = 0
  let sub = 0
  let lastTop = ''
  for (const m of journey) {
    if (!m.parent) {
      top++
      sub = 0
      lastTop = String(top).padStart(2, '0')
      out.push(lastTop)
    } else {
      sub++
      out.push(`${lastTop}.${sub}`)
    }
  }
  return out
})()

/* ─────────────────────────────────────────────────────────
   JOURNEY — chapters on a rail (left); the focused chapter's record on the
   right: its own art, a giant chapter number, a splat-backed title and the
   details sliding in. Mobile turns the record into an inline card.
   ───────────────────────────────────────────────────────── */

export function Journey() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState<string | null>(null)
  const { index, setIndex } = useKeyNav({
    count: journey.length,
    // touch screens have no cursor, so nothing starts highlighted
    initial: isMobile ? -1 : 0,
    onSelect: (i) => i >= 0 && setOpen((o) => (o === journey[i].id ? null : journey[i].id)),
    onBack: back,
  })
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const m = journey[Math.max(index, 0)]

  useEffect(() => {
    refs.current[index]?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [index, reducedMotion])

  return (
    <Screen
      head={<ScreenTitle sub="Education · Work · Research · the path so far">The Journey</ScreenTitle>}
      hints={[
        { key: '↕', label: 'Chapter' },
      ]}
      className="journey"
    >
      <Background art={m.art} mobileArt={((index % 7) + 1) as number} focus="left" dim={0.55} />

      <div className="jy" style={{ '--paint': m.paint } as CSSProperties}>
        {/* ── rail ─────────────────────────────────────────────────────── */}
        <ol className="jy__rail" aria-label="Chapters">
          {journey.map((x, i) => {
            const active = i === index
            return (
              <motion.li
                key={x.id}
                ref={(el) => {
                  refs.current[i] = el
                }}
                className={`jy__row jy__row--${x.weight} ${x.parent ? 'jy__row--sub' : ''} ${active ? 'is-active' : ''}`}
                initial={reducedMotion ? false : { opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease }}
              >
                <button
                  className="jy__btn"
                  onPointerMove={(e) => e.pointerType === 'mouse' && setIndex(i)}
                  onClick={() => {
                    setIndex(i)
                    if (isMobile) setOpen(open === x.id ? null : x.id)
                  }}
                  aria-current={active ? 'true' : undefined}
                >
                  <span className="jy__node" aria-hidden="true" />
                  <span className="jy__year t-num">{x.year}</span>
                  <span className="jy__name">
                    <span className="jy__title">{x.title}</span>
                    <span className="jy__chapter t-label">{x.chapter}</span>
                  </span>
                  <span className="jy__splat" aria-hidden="true">
                    <Splat color={x.paint} seed={(i % 4) + 1} />
                  </span>
                </button>

                {isMobile && (
                  <AnimatePresence initial={false}>
                    {open === x.id && (
                      <motion.div
                        className="jy__inline"
                        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.36, ease }}
                      >
                        <Record m={x} i={i} compact />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.li>
            )
          })}
          <li className="jy__end t-mono" aria-hidden="true">
            to be continued
          </li>
        </ol>

        {/* ── record ───────────────────────────────────────────────────── */}
        {!isMobile && (
          <div className="jy__record" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={m.id}
                className="jy__record-inner"
                initial={reducedMotion ? false : { opacity: 0, x: 40, skewX: -4 }}
                animate={{ opacity: 1, x: 0, skewX: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30, skewX: 3, transition: { duration: 0.18 } }}
                transition={{ duration: 0.34, ease }}
              >
                <Record m={m} i={index} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </Screen>
  )
}

function Record({ m, i, compact = false }: { m: Milestone; i: number; compact?: boolean }) {
  const { reducedMotion } = useSettings()
  const rise = (k: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.08 + k * 0.06, duration: 0.4, ease },
  })
  return (
    <div className={`rec ${compact ? 'rec--compact' : ''}`}>
      {!compact && (
        <span className={`rec__num t-display ${NUMBER[i].includes('.') ? 'rec__num--sub' : ''}`} aria-hidden="true">
          {NUMBER[i]}
        </span>
      )}

      <motion.div className="rec__head" {...rise(0)}>
        <span className="rec__kicker t-mono">
          {m.year} · {m.chapter}
        </span>
        <h2 className="rec__title t-hero">
          <span className="rec__title-splat" aria-hidden="true">
            <Splat color={m.paint} seed={i + 5} />
          </span>
          <span className="rec__title-text">{m.title}</span>
        </h2>
        <p className="rec__sub t-ui">{m.subtitle}</p>
      </motion.div>

      <motion.p className="rec__summary t-body" {...rise(1)}>
        {m.summary}
      </motion.p>

      {m.meta && (
        <motion.div className="rec__meta" {...rise(2)}>
          {m.meta.map((x) => (
            <div key={x.label} className="rec__meta-item">
              <span className="t-label">{x.label}</span>
              <span className="rec__meta-val t-num">{x.value}</span>
            </div>
          ))}
        </motion.div>
      )}

      <div className="rec__sections">
        {m.sections?.map((s, k) => (
          <motion.div key={s.label} className={`rec__section ${s.text ? 'rec__section--text' : ''}`} {...rise(3 + k)}>
            <span className="t-label">{s.label}</span>
            {s.steps && (
              <ol className="rec__steps">
                {s.steps.map((st, k) => (
                  <li key={st} className="t-ui-bold">
                    {k > 0 && <span className="rec__steps-arrow" aria-hidden="true" />}
                    {st}
                  </li>
                ))}
              </ol>
            )}
            {s.items && (
              <ul className="rec__list">
                {s.items.map((it) => (
                  <li key={it} className="t-ui">
                    {it}
                  </li>
                ))}
              </ul>
            )}
            {s.text && <p className="rec__chapter t-quote">{s.text}</p>}
          </motion.div>
        ))}
      </div>

      <motion.div className="tags rec__tags" {...rise(6)}>
        {m.tags.map((t) => (
          <Tag key={t} tone={toneFor(t)}>
            {t}
          </Tag>
        ))}
      </motion.div>
    </div>
  )
}

function toneFor(tag: string): 'default' | 'red' | 'teal' | 'gold' {
  switch (tag) {
    case 'education':
      return 'gold'
    case 'work':
      return 'red'
    case 'research':
    case 'development':
      return 'teal'
    default:
      return 'default'
  }
}
