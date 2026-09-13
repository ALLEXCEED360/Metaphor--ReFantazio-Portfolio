import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Field, Flow, Panel, Rule, Screen, Tag } from '../components/ui'
import { useBackKey } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { research } from '../data/research'
import './screens.css'

export function Research() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  useBackKey(back)

  const rise = (i: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <Screen head={<ScreenTitle sub="Published work">Research</ScreenTitle>} hints={[{ key: 'Esc', label: 'Back' }]}>
      <Background art={3} mobileArt={5} focus="left" dim={0.5} position="center 40%" />
      <div className="cols cols--wide">
        <div className="stack">
          <motion.div {...rise(0)}>
            <h2 className="res__title t-hero">{research.title}</h2>
            <p className="res__sub t-ui">{research.subtitle}</p>
          </motion.div>

          <motion.div {...rise(1)}>
            <Panel tone="ink" accent="teal">
              <Field label="Research area">
                <ul>
                  {research.areas.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </Field>
              <Field label="Dataset">
                <div>{research.dataset.name}</div>
                <div className="res__dataset">
                  <span className="res__num t-num">{research.dataset.from}</span>
                  <span className="res__arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="res__num t-num">{research.dataset.to}</span>
                  <span className="t-mono" style={{ color: 'var(--fg-dim)' }}>
                    {research.dataset.unit}
                  </span>
                </div>
              </Field>
              <Field label="Status">
                <span className="res__status">
                  <span className="res__dot" aria-hidden="true" />
                  {research.status} · {research.venue}
                </span>
              </Field>
            </Panel>
          </motion.div>
        </div>

        <div className="stack">
          <motion.p className="t-body" style={{ maxWidth: '58ch', fontSize: '1.15rem' }} {...rise(2)}>
            {research.abstract}
          </motion.p>
          <Rule />
          <motion.div {...rise(3)}>
            <div className="t-label" style={{ marginBottom: 10 }}>
              Pipeline
            </div>
            <Flow steps={research.pipeline} tone="teal" />
          </motion.div>
          <motion.div className="tags" {...rise(4)}>
            <Tag tone="teal">NLP</Tag>
            <Tag tone="teal">LLM</Tag>
            <Tag tone="gold">{research.venue}</Tag>
          </motion.div>
        </div>
      </div>
    </Screen>
  )
}
