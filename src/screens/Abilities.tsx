import { AnimatePresence, motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { Panel, Screen, Tag } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { archetypes, skillGroups } from '../data/skills'
import './screens.css'

export function Abilities() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  const { index: arch, setIndex: setArch } = useKeyNav({
    count: archetypes.length,
    axis: 'horizontal',
    onBack: back,
  })
  const a = archetypes[arch]

  return (
    <Screen
      head={<ScreenTitle sub="Skills & archetypes">Abilities</ScreenTitle>}
      hints={[
        { key: '← →', label: 'Archetype' },
        { key: 'Esc', label: 'Back' },
      ]}
    >
      <Background art={5} mobileArt={a.art} focus="left" dim={0.55} position="center 30%" />

      <div className="ab__groups">
        {skillGroups.map((g, i) => (
          <motion.div
            key={g.id}
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Panel tone="ink" accent={g.accent}>
              <h3 className="ab__group-title t-ui-bold">{g.title}</h3>
              <ul>
                {g.skills.map((s) => (
                  <li key={s.name} className="ab__row">
                    <span className="ab__skill t-ui">{s.name}</span>
                    <span className={`ab__level t-mono ab__level--${s.level}`}>{s.level}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>
        ))}
      </div>

      <section className="arche" aria-label="Archetypes">
        <span className="kicker">Archetypes</span>
        <div className="arche__tabs" role="tablist">
          {archetypes.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={arch === i}
              className={`arche__tab t-ui-bold ${arch === i ? 'is-active' : ''}`}
              onClick={() => setArch(i)}
              onPointerEnter={() => setArch(i)}
            >
              <Splat color="var(--red)" seed={i + 2} />
              <span>{x.title}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={a.id}
            className="arche__body"
            initial={reducedMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <h3 className="arche__title t-hero">{a.title}</h3>
              <ul className="arche__lines t-ui">
                {a.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="tags" style={{ alignContent: 'start' }}>
              {a.tags.map((t) => (
                <Tag key={t} tone="red">
                  {t}
                </Tag>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </Screen>
  )
}
