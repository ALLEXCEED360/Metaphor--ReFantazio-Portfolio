import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { GameButton, Rule, Screen } from '../components/ui'
import { useBackKey } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { profile } from '../data/profile'
import './screens.css'

const wants = ['Games', 'Software', 'Systems', 'Experiences']

export function Contact() {
  const { back } = useNav()
  const { reducedMotion } = useSettings()
  useBackKey(back)

  const rise = (i: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  })

  const links = [
    { label: 'GitHub', href: profile.links.github, meta: 'Code' },
    { label: 'LinkedIn', href: profile.links.linkedin, meta: 'Profile' },
    { label: 'Email', href: `mailto:${profile.links.email}`, meta: profile.links.email },
  ]

  return (
    <Screen head={<ScreenTitle sub="The journey does not end here">The Next Journey</ScreenTitle>} hints={[{ key: 'Esc', label: 'Back' }]}>
      <Background art={10} mobileArt={8} focus="left" dim={0.45} position="center 60%" />
      <div className="cols cols--even">
        <div className="stack">
          <motion.p className="contact__lead t-ui" {...rise(0)}>
            Looking forward to building:
          </motion.p>
          <motion.ul className="contact__list t-hero" {...rise(1)}>
            {wants.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </motion.ul>
          <Rule />
          <motion.div {...rise(2)}>
            <GameButton tone="red" href={`mailto:${profile.links.email}?subject=Let%27s%20build%20something`}>
              Begin a conversation
            </GameButton>
          </motion.div>
        </div>

        <motion.div className="contact__links" {...rise(2)}>
          {links.map((l) => (
            <a key={l.label} className="contact__link t-ui-bold" href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span>{l.label}</span>
              <span className="contact__link-meta t-mono">{l.meta}</span>
            </a>
          ))}
        </motion.div>
      </div>

      <motion.footer className="contact__end" {...rise(3)}>
        <span className="contact__end-kicker t-mono">End of record</span>
        <span className="contact__end-name t-hero">{profile.last}</span>
        <span className="contact__end-year t-mono">// {new Date().getFullYear()}</span>
      </motion.footer>
    </Screen>
  )
}
