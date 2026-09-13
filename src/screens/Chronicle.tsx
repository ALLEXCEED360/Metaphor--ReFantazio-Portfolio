import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Screen, Tag } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { experience } from '../data/experience'
import './screens.css'

export function Chronicle() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  const [open, setOpen] = useState<string | null>(experience[0].id)
  const { setIndex } = useKeyNav({
    count: experience.length,
    onSelect: (i) => setOpen((o) => (o === experience[i].id ? null : experience[i].id)),
    onBack: back,
  })

  return (
    <Screen head={<ScreenTitle sub="Professional record">Chronicle</ScreenTitle>}>
      <Background art={1} mobileArt={6} focus="left" dim={0.5} position="center 40%" />
      <div className="chron">
        {experience.map((x, i) => {
          const isOpen = open === x.id
          return (
            <motion.article
              key={x.id}
              className="chron__item"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                className="chron__head"
                onClick={() => {
                  setIndex(i)
                  setOpen(isOpen ? null : x.id)
                }}
                onPointerMove={() => setIndex(i)}
                aria-expanded={isOpen}
              >
                <span className="chron__year t-num">{x.year}</span>
                <span>
                  <span className="chron__company t-ui-bold" style={{ display: 'block' }}>
                    {x.company}
                  </span>
                  <span className="chron__role t-mono" style={{ display: 'block' }}>
                    {x.role}
                  </span>
                  <span className="tags chron__tags">
                    {x.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </span>
                </span>
                <span className="chron__toggle t-mono">{isOpen ? '− Details' : '+ Details'}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="chron__body"
                    initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ul className="chron__details t-ui">
                      {x.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>
    </Screen>
  )
}
