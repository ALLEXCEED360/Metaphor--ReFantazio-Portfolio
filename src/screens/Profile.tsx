import { useEffect, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { Screen } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useIsMobile } from '../hooks/useMedia'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { profile } from '../data/profile'
import { journey } from '../data/education'
import { projects } from '../data/projects'
import { skillCategories } from '../data/skills'
import { experience } from '../data/experience'
import { archive } from '../data/archive'
import { research } from '../data/research'
import './Profile.css'

const ease = [0.16, 1, 0.3, 1] as const
const KEY = 'aryan-portfolio:profile'

/* the ledger: every other screen, counted live from its data */
const ledger = [
  { id: 'journey', label: 'Education', value: journey.length, unit: 'milestones', path: '/journey', paint: '#b94abb', word: 'Journey' },
  { id: 'quests', label: 'Projects', value: projects.length, unit: `${projects.filter((p) => p.tier === 'main').length} main · ${projects.filter((p) => p.tier === 'side').length} side`, path: '/quests', paint: '#d84291', word: 'Quests' },
  { id: 'abilities', label: 'Skills', value: skillCategories.reduce((n, c) => n + c.skills.length, 0), unit: `tools · ${skillCategories.length} areas`, path: '/abilities', paint: '#f14352', word: 'Abilities' },
  { id: 'chronicle', label: 'Experience', value: experience.length, unit: 'roles', path: '/chronicle', paint: '#eb523d', word: 'Chronicle' },
  { id: 'research', label: 'Research', value: 1, unit: `thesis · grade ${research.grade}`, path: '/research', paint: '#ea6c1b', word: 'Research' },
  { id: 'archive', label: 'Creative work', value: archive.length, unit: 'works', path: '/archive', paint: '#d4a900', word: 'Archive' },
]

const links = [
  { label: 'GitHub', href: profile.links.github },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'ArtStation', href: profile.links.artstation },
  { label: 'Behance', href: profile.links.behance },
  { label: 'Email', href: `mailto:${profile.links.email}` },
]

/* ─────────────────────────────────────────────────────────
   PROFILE — portrait left, name and bio in the middle, a summary of every
   section on the right (↑/↓ + ↵ jumps there), five highlights along the bottom.
   ───────────────────────────────────────────────────────── */

export function Profile() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const { index, setIndex } = useKeyNav({
    count: ledger.length,
    axis: 'both',
    initial: (() => {
      const saved = Number(sessionStorage.getItem(KEY))
      return Number.isFinite(saved) && saved >= 0 && saved < ledger.length ? saved : 0
    })(),
    onSelect: (i) => go(ledger[i].path, { word: ledger[i].word }),
    onBack: () => go('/menu'),
  })
  useEffect(() => sessionStorage.setItem(KEY, String(index)), [index])

  const rise = (k: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 + k * 0.07, duration: 0.45, ease },
  })

  return (
    <Screen
      head={<ScreenTitle sub={`${profile.class} · ${profile.subclass}`}>Profile</ScreenTitle>}
      hints={[
        { key: '↕', label: 'Section' },
        { key: '↵', label: 'Open' },
        { key: '⌫', label: 'Back' },
      ]}
      onBack={() => go('/menu')}
      className="profile"
    >
      <Background art={6} mobileArt={profile.portrait} focus="center" dim={0.8} position="center 30%" />

      <div className="pf">
        {/* ── portrait ─────────────────────────────────────────────────── */}
        {!isMobile && (
          <motion.div className="pf__portrait" {...rise(0)}>
            <img src={profile.photo} alt={profile.name} />
            <div className="pf__plate">
              <span className="pf__plate-row">
                <span className="t-label">Role</span>
                <span className="pf__plate-val">{profile.class}</span>
              </span>
              <span className="pf__plate-row">
                <span className="t-label">From</span>
                <span className="pf__plate-val">{profile.origin}</span>
              </span>
              <span className="pf__plate-row">
                <span className="t-label">Based in</span>
                <span className="pf__plate-val">{profile.location}</span>
              </span>
            </div>
          </motion.div>
        )}

        {/* ── name & creed ─────────────────────────────────────────────── */}
        <div className="pf__self">
          <motion.h2 className="pf__name t-hero" {...rise(1)}>
            <span className="pf__name-line">{profile.first}</span>
            <span className="pf__name-line pf__name-line--red">
              <span className="pf__name-splat" aria-hidden="true">
                <Splat color="var(--red)" seed={2} />
              </span>
              <span className="pf__name-text">{profile.last}</span>
            </span>
          </motion.h2>
          <motion.p className="pf__titles" {...rise(2)}>
            {profile.titles.join(' · ')}
          </motion.p>
          <motion.blockquote className="pf__creed" {...rise(3)}>
            <span className="t-label">Motto</span>
            <p className="t-quote">“{profile.quote}”</p>
          </motion.blockquote>
          <motion.p className="pf__bio t-body" {...rise(4)}>
            {profile.bio}
          </motion.p>
          <motion.p className="pf__bio pf__bio--dim t-body" {...rise(5)}>
            {profile.bio2}
          </motion.p>
          <motion.ul className="pf__links" aria-label="Find me" {...rise(6)}>
            {links.map((l) => (
              <li key={l.label}>
                <a className="plink" href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <span className="plink__mark" aria-hidden="true" />
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ── ledger ───────────────────────────────────────────────────── */}
        <motion.nav className="pf__ledger" aria-label="Sections" {...rise(2)}>
          <span className="pf__ledger-head t-label">At a glance</span>
          {ledger.map((row, i) => {
            const on = i === index
            return (
              <button
                key={row.id}
                className={`led ${on ? 'is-active' : ''}`}
                style={{ '--col': row.paint } as CSSProperties}
                onPointerMove={() => setIndex(i)}
                onClick={() => go(row.path, { word: row.word })}
                aria-pressed={on}
              >
                {on && (
                  <motion.span layoutId="pf-led-mark" className="led__mark" aria-hidden="true" transition={{ duration: reducedMotion ? 0 : 0.3, ease }}>
                    <Splat color={row.paint} seed={i + 4} />
                  </motion.span>
                )}
                <span className="led__label">{row.label}</span>
                <span className="led__value t-num">{String(row.value).padStart(2, '0')}</span>
                <span className="led__unit t-mono">{row.unit}</span>
                <span className="led__arrow" aria-hidden="true">
                  ▸
                </span>
              </button>
            )
          })}
        </motion.nav>

        {/* ── virtues ──────────────────────────────────────────────────── */}
        <motion.ul className="pf__virtues" aria-label="Highlights" {...rise(4)}>
          {profile.highlights.map((v, k) => (
            <motion.li
              key={v.name}
              className="virtue"
              style={{ '--col': v.paint } as CSSProperties}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + k * 0.08, duration: 0.4, ease }}
            >
              <span className="virtue__gem" aria-hidden="true">
                <span className="virtue__gem-num t-num">{k + 1}</span>
              </span>
              <span className="virtue__name">{v.name}</span>
              <span className="virtue__text t-ui">{v.text}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Screen>
  )
}
