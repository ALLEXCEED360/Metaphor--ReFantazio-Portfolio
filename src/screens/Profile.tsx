import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Field, Panel, Rule, Screen, Tag } from '../components/ui'
import { useBackKey } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { profile } from '../data/profile'
import './screens.css'

export function Profile() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  useBackKey(back)

  const rise = (i: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <Screen head={<ScreenTitle sub="Character profile">Profile</ScreenTitle>} hints={[{ key: 'Esc', label: 'Back' }]}>
      <Background art={6} mobileArt={1} focus="left" dim={0.3} position="75% center" />
      <div className="cols cols--wide">
        <div className="stack">
          <motion.div className="profile__hero" {...rise(0)}>
            <span className="kicker">The journey continues</span>
            <h2 className="t-hero big-name">{profile.first}</h2>
            <h2 className="t-hero big-name big-name--red">{profile.last}</h2>
            <p className="kicker">{profile.titles.join(' · ')}</p>
          </motion.div>

          <motion.div {...rise(1)}>
            <Panel tone="ink">
              <div className="profile__sheet">
                <Field label="Class">{profile.class}</Field>
                <Field label="Location">{profile.location}</Field>
                <div className="field field--full">
                  <div className="field__label t-label">Specialization</div>
                  <div className="field__value">
                    <ul>
                      {profile.specialization.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>
        </div>

        <motion.div className="stack" {...rise(2)}>
          <blockquote className="profile__quote t-quote">“{profile.quote}”</blockquote>
          <Rule />
          <p className="profile__bio t-body">{profile.bio}</p>
          <div className="tags">
            <Tag tone="red">Games</Tag>
            <Tag>Frontend</Tag>
            <Tag tone="teal">AI / ML</Tag>
            <Tag tone="gold">Research</Tag>
          </div>
        </motion.div>
      </div>
    </Screen>
  )
}
