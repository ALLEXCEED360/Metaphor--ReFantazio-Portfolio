import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { artUrl, Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Screen } from '../components/ui'
import { useBackKey } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { archive, archiveCategories, type ArchiveKind } from '../data/archive'
import './screens.css'

export function Archive() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  useBackKey(back)
  const [filter, setFilter] = useState<ArchiveKind | 'All'>('All')
  const items = filter === 'All' ? archive : archive.filter((a) => a.kind === filter)

  return (
    <Screen head={<ScreenTitle sub="Motion · Graphics · Illustration · UI · Video">Archive</ScreenTitle>} hints={[{ key: 'Esc', label: 'Back' }]}>
      <Background art={2} mobileArt={3} focus="left" dim={0.6} />
      <div className="arch__filters" role="tablist">
        {(['All', ...archiveCategories] as const).map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            className={`arch__filter t-ui-bold ${filter === c ? 'is-active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.ul className="arch__grid" layout>
        <AnimatePresence initial={false}>
          {items.map((a, i) => (
            <motion.li
              key={a.id}
              className="arch__item"
              layout
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                className="arch__img"
                src={a.src ?? artUrl(a.art ?? 1)}
                alt={a.title}
                loading="lazy"
                decoding="async"
              />
              <div className="arch__cap">
                <span className="arch__cap-title t-ui-bold">{a.title}</span>
                <span className="arch__cap-kind t-mono">
                  {a.kind} · {a.tool}
                </span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Screen>
  )
}
