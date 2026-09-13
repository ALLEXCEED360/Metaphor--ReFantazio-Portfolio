import { useState } from 'react'
import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { MenuList } from '../components/MenuList'
import { Hints } from '../components/ui'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { mainMenu } from '../data/menu'
import { profile } from '../data/profile'
import './MainMenu.css'

const ease = [0.16, 1, 0.3, 1] as const
const KEY = 'aryan-portfolio:menu-cursor'

export function MainMenu() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const [active, setActive] = useState(() => {
    const saved = Number(sessionStorage.getItem(KEY))
    return Number.isFinite(saved) && saved >= 0 && saved < mainMenu.length ? saved : 0
  })
  const item = mainMenu[active]
  const onActive = (i: number) => {
    setActive(i)
    sessionStorage.setItem(KEY, String(i))
  }

  return (
    <motion.div
      className="stage menu"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Background art={2} mobileArt={1} focus="left" dim={0.35} position="80% center" />

      <header className="menu__head">
        <motion.div
          className="menu__name"
          initial={reducedMotion ? false : { opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="t-display menu__name-word">{profile.first}</span>
          <span className="t-display menu__name-word menu__name-word--last">{profile.last}</span>
        </motion.div>
        <motion.p
          className="menu__titles t-ui"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {profile.titles.join('  ·  ')}
        </motion.p>
      </header>

      <div className="stage__body menu__body">
        <nav className="menu__nav" aria-label="Main menu">
          <MenuList
            items={mainMenu.map((m) => ({ id: m.id, label: m.label, hint: m.hint }))}
            active={active}
            onActive={onActive}
            onSelect={(i) => go(mainMenu[i].path, { word: mainMenu[i].word })}
          />
        </nav>

        <motion.aside
          className="menu__side"
          key={item.id}
          initial={reducedMotion ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease }}
          aria-hidden="true"
        >
          <span className="menu__side-word t-display">{item.word}</span>
          <span className="menu__side-hint t-mono">{item.hint}</span>
        </motion.aside>
      </div>

      <footer className="menu__foot">
        <span className="menu__loc t-mono">{profile.location}</span>
        <Hints />
      </footer>
    </motion.div>
  )
}
