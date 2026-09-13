import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Screen, Tag } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { journey } from '../data/education'
import './screens.css'

export function Journey() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  const [open, setOpen] = useState<string | null>(journey[0].id)
  const { index, setIndex } = useKeyNav({
    count: journey.length,
    onSelect: (i) => setOpen((o) => (o === journey[i].id ? null : journey[i].id)),
    onBack: back,
  })

  return (
    <Screen head={<ScreenTitle sub="Education & path">The Journey</ScreenTitle>}>
      <Background art={11} mobileArt={8} focus="left" dim={0.45} position="60% center" />
      <ol className="timeline">
        {journey.map((m, i) => {
          const isOpen = open === m.id
          return (
            <motion.li
              key={m.id}
              className={`tl-item ${isOpen ? 'is-open' : ''} ${index === i ? 'is-focus' : ''}`}
              initial={reducedMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="tl-item__year t-num">{m.year}</span>
              <span className="tl-item__node" aria-hidden="true" />
              <button
                className="tl-item__card"
                onClick={() => {
                  setIndex(i)
                  setOpen(isOpen ? null : m.id)
                }}
                onPointerEnter={() => setIndex(i)}
                aria-expanded={isOpen}
              >
                <div className="tl-item__title t-ui-bold">{m.title}</div>
                <div className="tl-item__sub t-ui">{m.subtitle}</div>
                {(m.courses || m.meta || m.note) && (
                  <span className="tl-item__expand t-mono">
                    {isOpen ? '− Collapse' : '+ Expand'}
                  </span>
                )}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="tl-item__body"
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="tl-item__inner">
                        {m.meta && (
                          <div className="tl-item__meta">
                            {m.meta.map((x) => (
                              <div key={x.label}>
                                <div className="t-label">{x.label}</div>
                                <div className="tl-item__meta-val t-num">{x.value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {m.courses && (
                          <>
                            <div className="t-label" style={{ marginBottom: 6 }}>
                              Selected courses
                            </div>
                            <ul className="tl-item__courses t-ui">
                              {m.courses.map((c) => (
                                <li key={c}>{c}</li>
                              ))}
                            </ul>
                          </>
                        )}
                        {m.note && <p className="t-body" style={{ color: 'var(--fg-dim)' }}>{m.note}</p>}
                        <div className="tags" style={{ marginTop: 12 }}>
                          <Tag tone={m.kind === 'education' ? 'gold' : 'teal'}>{m.kind}</Tag>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </Screen>
  )
}
