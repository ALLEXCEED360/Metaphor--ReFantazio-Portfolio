import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Field, Flow, GameButton, Panel, Rule, Screen, Tag } from '../components/ui'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { projects, statusLabel } from '../data/projects'
import './screens.css'

export function QuestDetail({ id }: { id: string }) {
  const { go, back, direction } = useNav()
  const { reducedMotion } = useSettings()
  const idx = projects.findIndex((p) => p.id === id)
  const p = projects[idx] ?? projects[0]
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]

  // ← → switch project, Esc back to the log
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') go(`/quests/${next.id}`)
      else if (e.key === 'ArrowLeft' || e.key === 'a') go(`/quests/${prev.id}`)
      else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault()
        back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, back, next.id, prev.id])

  useEffect(() => {
    sessionStorage.setItem('aryan-portfolio:quest-cursor', String(Math.max(0, idx)))
  }, [idx])

  const dx = direction === 'back' ? -40 : 40
  const rise = (i: number) => ({
    initial: reducedMotion ? false : { opacity: 0, x: dx },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <Screen
      head={
        <ScreenTitle size="md" sub={`${p.index} · ${p.category} · ${statusLabel[p.status]}`}>
          {p.title}
        </ScreenTitle>
      }
      backLabel="Quest log"
      hints={[
        { key: '← →', label: 'Switch' },
        { key: 'Esc', label: 'Back' },
      ]}
    >
      <Background art={p.art} mobileArt={((idx % 7) + 1) as number} focus="left" dim={0.5} />
      <div className="qd__grid">
        <motion.div {...rise(0)}>
          <Panel tone="cream">
            <Field label="Type">{p.type}</Field>
            <Field label="Platform">{p.platform}</Field>
            <Field label="Technology">
              <ul>
                {p.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Field>
            <Field label="Status">{statusLabel[p.status]}</Field>
          </Panel>
        </motion.div>

        <div className="stack">
          <motion.p className="t-body" style={{ maxWidth: '62ch', fontSize: '1.15rem' }} {...rise(1)}>
            {p.description}
          </motion.p>

          <motion.div {...rise(2)}>
            <div className="t-label" style={{ marginBottom: 10 }}>
              Features
            </div>
            <ul className="qd__features t-ui">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </motion.div>

          <Rule />

          <motion.div {...rise(3)}>
            <div className="t-label" style={{ marginBottom: 10 }}>
              Architecture
            </div>
            <Flow steps={p.architecture} />
          </motion.div>

          <motion.div className="qp__actions" {...rise(4)}>
            {p.caseStudy && (
              <GameButton tone="red" href={p.caseStudy}>
                View case study
              </GameButton>
            )}
            {p.github && (
              <GameButton tone="cream" href={p.github}>
                GitHub
              </GameButton>
            )}
            {p.liveDemo && (
              <GameButton tone="ghost" href={p.liveDemo}>
                Live demo
              </GameButton>
            )}
            {!p.caseStudy && !p.github && !p.liveDemo && (
              <div className="tags">
                <Tag>Links coming soon</Tag>
              </div>
            )}
          </motion.div>

          <div className="qd__switch">
            <button className="t-mono" onClick={() => go(`/quests/${prev.id}`)}>
              ◀ {prev.index} {prev.title}
            </button>
            <button className="t-mono" onClick={() => go(`/quests/${next.id}`)}>
              {next.index} {next.title} ▶
            </button>
          </div>
        </div>
      </div>
    </Screen>
  )
}
