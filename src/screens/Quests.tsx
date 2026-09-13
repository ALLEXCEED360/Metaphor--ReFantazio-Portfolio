import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { MenuList } from '../components/MenuList'
import { GameButton, Screen, Tag } from '../components/ui'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { projects, statusFill, statusLabel } from '../data/projects'
import './screens.css'

const KEY = 'aryan-portfolio:quest-cursor'

export function Quests() {
  const { go, back } = useNav()
  const { reducedMotion } = useSettings()
  const [active, setActive] = useState(() => {
    const saved = Number(sessionStorage.getItem(KEY))
    return Number.isFinite(saved) && saved >= 0 && saved < projects.length ? saved : 0
  })
  const p = projects[active]

  const select = (i: number) => {
    sessionStorage.setItem(KEY, String(i))
    go(`/quests/${projects[i].id}`)
  }

  const fillTone = p.status === 'in-progress' ? 'gold' : p.status === 'under-review' ? 'teal' : ''

  return (
    <Screen head={<ScreenTitle sub={`${projects.length} entries`}>Quest Log</ScreenTitle>}>
      <Background art={p.art} mobileArt={((active % 7) + 1) as number} focus="left" dim={0.4} />
      <div className="cols cols--wide">
        <div className="quests__list">
          <MenuList
            items={projects.map((q) => ({ id: q.id, label: q.title, index: q.index }))}
            active={active}
            onActive={(i) => {
              setActive(i)
              sessionStorage.setItem(KEY, String(i))
            }}
            onSelect={select}
            onBack={back}
          />
          <div className="quests__mobile-cta">
            <GameButton tone="red" onClick={() => select(active)}>
              Open quest
            </GameButton>
          </div>
        </div>

        <div className="quests__preview" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.id}
              className="qp"
              initial={reducedMotion ? false : { opacity: 0, x: 24, skewX: -3 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -24, skewX: 3 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="kicker">
                {p.index} · {p.category}
              </span>
              <h2 className="qp__title t-display">{p.title}</h2>
              <p className="qp__tagline t-ui">{p.tagline}</p>
              <div className="tags">
                {p.technologies.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <p className="qp__desc t-body">{p.description}</p>

              <div className="qp__status">
                <span className="t-label">Status</span>
                <div className="qp__bar">
                  <motion.div
                    className={`qp__bar-fill ${fillTone ? `qp__bar-fill--${fillTone}` : ''}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${statusFill[p.status] * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="t-mono" style={{ color: 'var(--fg-dim)' }}>
                  {statusLabel[p.status]}
                </span>
              </div>

              <div className="qp__actions">
                <GameButton tone="red" onClick={() => select(active)}>
                  View project
                </GameButton>
                {p.github && (
                  <GameButton tone="ghost" href={p.github}>
                    GitHub
                  </GameButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Screen>
  )
}
