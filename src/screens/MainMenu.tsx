import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hints } from '../components/ui'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { useKeyNav } from '../hooks/useKeyNav'
import { useIsMobile } from '../hooks/useMedia'
import { mainMenu } from '../data/menu'
import { profile } from '../data/profile'
import { journey } from '../data/education'
import { projects } from '../data/projects'
import { skillCategories } from '../data/skills'
import { experience } from '../data/experience'
import { archive } from '../data/archive'
import './MainMenu.css'

export const MENU_CURSOR_KEY = 'aryan-portfolio:menu-cursor'
const KEY = MENU_CURSOR_KEY

/* one line per entry, counted from the data */
const briefs: Record<string, string> = {
  journey: `${journey.length} milestones, from school in Dhaka to graduate study at Georgia Tech`,
  quests: `${projects.length} projects, ${projects.filter((p) => p.tier === 'main').length} main and ${projects.filter((p) => p.tier === 'side').length} side, led by Dragon Drop on Steam`,
  abilities: `${skillCategories.reduce((n, c) => n + c.skills.length, 0)} tools across ${skillCategories.length} disciplines, from Unity to After Effects`,
  chronicle: `${experience.length} roles in work, teaching and leadership, 2022 to present`,
  research: 'One undergraduate thesis on emotional reasoning in language models, graded A',
  archive: `${archive.length} works: Unreal Engine cinematics, motion graphics and illustration`,
  profile: 'Who I am, where I am from, and what I care about building',
  contact: 'Write a letter, or find me on LinkedIn, GitHub, ArtStation and Behance',
  settings: 'Animation, cursor, music and sound, saved in this browser',
}
const ease = [0.16, 1, 0.3, 1] as const

/* ─────────────────────────────────────────────────────────
   Layout fitted to two measured states of the game's menu (SKILL selected /
   SYSTEM selected). Each word has a neutral right-end anchor + rotation in a
   1920×1080 design space; every word on the far side of the selection is
   pushed ~70px away (and fans a little more), and the selected word grows
   1.45× while drifting toward the vertical centre. The design space is
   scaled exactly like `background-size: cover`, so it stays registered to
   the backdrop plate.
   ───────────────────────────────────────────────────────── */

const DESIGN = { w: 1920, h: 1080 }
const SELECT_SCALE = 1.35
const PUSH = 54
const CENTRE_Y = 560

interface Neutral {
  x: number // right-end anchor
  y: number
  r: number // rotation (deg, clockwise positive)
  d: number // extra fan rotation when pushed
  s: number // letter size (design px)
  cap: number // drop-cap multiplier
}

/*                 x     y    rot   fan  size  cap        game word  */
const NEUTRAL: Neutral[] = [
  { x: 670, y: 205, r: 12, d: 2, s: 104, cap: 1.5 }, // SKILL
  { x: 610, y: 315, r: 10, d: 2, s: 105, cap: 1.5 }, // ITEM
  { x: 650, y: 432, r: 8, d: 2, s: 121, cap: 2.2 }, // EQUIPMENT
  { x: 675, y: 552, r: 4, d: 2, s: 117, cap: 1.6 }, // PARTY
  { x: 655, y: 668, r: -3, d: 2, s: 121, cap: 2.1 }, // FOLLOWER
  { x: 640, y: 762, r: -7, d: 2, s: 100, cap: 1.5 }, // QUEST
  { x: 770, y: 832, r: -10, d: 2, s: 107, cap: 1.7 }, // CALENDAR
  { x: 890, y: 896, r: -13, d: 2, s: 88, cap: 1.4 }, // MEMORANDUM
  { x: 1010, y: 955, r: -16, d: 2, s: 94, cap: 1.5 }, // SYSTEM
]
/** keep the first / last word fully on screen whatever is selected */
const CLAMP_TOP = 200
const CLAMP_BOTTOM = 958

/** the game's splat colour for each row: purple → pink → red → … → teal */
const PAINT = ['#b94abb', '#d84291', '#f14352', '#eb523d', '#ea6c1b', '#d4a900', '#a8a800', '#0c8e5e', '#3a96aa']

/** first letter is a drop cap, the rest taper down along the word */
function letterScale(k: number, n: number, cap: number) {
  if (k === 0) return cap
  if (n <= 2) return 1
  return 1.0 - (0.4 * (k - 1)) / (n - 2)
}

interface Placed {
  x: number
  y: number
  angle: number
  size: number
}

function layout(active: number): Placed[] {
  // the bottom fan is packed tight, so a selection there shoves its neighbours further
  const pushUp = active >= 7 ? PUSH + 70 : active >= 5 ? PUSH + 35 : PUSH
  const pushDown = active <= 1 ? PUSH + 20 : PUSH
  const placed = NEUTRAL.map((n, i) => {
    if (i === active) {
      return {
        x: n.x + (i >= 7 ? 60 : i >= 5 ? 25 : 0),
        y: n.y + (CENTRE_Y - n.y) * 0.2,
        angle: n.r + 6,
        size: n.s * SELECT_SCALE,
      }
    }
    const below = i > active
    return {
      x: n.x,
      y: n.y + (below ? pushDown : -pushUp),
      angle: n.r + (below ? -n.d : n.d),
      size: n.s,
    }
  })
  // squeeze the ends back inside the frame instead of letting them clip
  const top = placed[0].y
  if (top < CLAMP_TOP) {
    const k = (CLAMP_TOP - top) / Math.max(1, active)
    for (let i = 0; i < active; i++) placed[i].y += k * (active - i)
  }
  const last = NEUTRAL.length - 1
  const bottom = placed[last].y
  if (bottom > CLAMP_BOTTOM) {
    const k = (bottom - CLAMP_BOTTOM) / Math.max(1, last - active)
    for (let i = last; i > active; i--) placed[i].y -= k * (i - active)
  }
  return placed
}

/** phones: a plain tilted stack, right-aligned, in viewport px */
function layoutMobile(active: number, W: number, H: number): Placed[] {
  const size = Math.min(W * 0.11, H * 0.05)
  const pitch = size * 1.55
  const top = H * 0.16
  return NEUTRAL.map((_, i) => ({
    x: W * 0.9,
    y: top + i * pitch + (i > active ? size * 0.5 : 0) + (i === active ? size * 0.2 : 0),
    angle: -6,
    size: i === active ? size * 1.4 : size,
  }))
}

/**
 * Scale the design space to the viewport HEIGHT so the word column is never
 * cropped (the plate behind it still covers). On narrow windows also make
 * sure the column (≈1250 design px wide) fits the width.
 */
function useCoverTransform() {
  const [t, setT] = useState({ s: 1, ox: 0, oy: 0 })
  useLayoutEffect(() => {
    const calc = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      const s = Math.min(H / DESIGN.h, W / 1250)
      setT({ s, ox: 0, oy: (H - DESIGN.h * s) / 2 })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return t
}

export function MainMenu() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const cover = useCoverTransform()

  const [active, setActive] = useState(() => {
    const q = Number(new URLSearchParams(window.location.search).get('sel'))
    const saved = Number.isFinite(q) && window.location.search.includes('sel=') ? q : Number(sessionStorage.getItem(KEY))
    return Number.isFinite(saved) && saved >= 0 && saved < mainMenu.length ? saved : 0
  })
  const { index, setIndex } = useKeyNav({
    count: mainMenu.length,
    initial: active,
    onSelect: (i) => go(mainMenu[i].path, { word: mainMenu[i].label }),
    // Backspace / Esc → back to the title screen; the cursor starts fresh from there
    onBack: () => {
      sessionStorage.removeItem(KEY)
      go('/')
    },
  })
  const first = useRef(true)
  useEffect(() => {
    setActive(index)
    sessionStorage.setItem(KEY, String(index))
  }, [index])
  useEffect(() => {
    first.current = false
  }, [])

  const item = mainMenu[active]
  const paint = PAINT[active]
  const placed = isMobile ? layoutMobile(active, window.innerWidth, window.innerHeight) : layout(active)
  const sel = placed[active]
  const wheelStyle = isMobile
    ? { width: '100%', height: '100%' }
    : { width: DESIGN.w, height: DESIGN.h, transform: `translate(${cover.ox}px, ${cover.oy}px) scale(${cover.s})` }

  // phones: a clean upright list, nothing pre-selected, a tap goes straight through
  if (isMobile) {
    return (
      <motion.div className="menu menu--mobile" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
        <div className="menu__bg" aria-hidden="true" />
        <div className="menu__grain" aria-hidden="true" />
        <div className="menu__shade" aria-hidden="true" />
        <nav className="mnav" aria-label="Main menu">
          {mainMenu.map((m, i) => (
            <motion.button
              key={m.id}
              className="mnav__item"
              style={{ '--col': PAINT[i] } as CSSProperties}
              initial={reducedMotion ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i, ease }}
              onClick={() => go(m.path, { word: m.label })}
              aria-label={m.label}
            >
              <span className="mnav__num t-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="mnav__text">
                <span className="mnav__word t-hero">{m.label}</span>
                <span className="mnav__hint">{m.hint}</span>
              </span>
            </motion.button>
          ))}
        </nav>
        <span className="mnav__name t-ui-bold" aria-hidden="true">
          {profile.name}
        </span>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`menu ${isMobile ? 'menu--mobile' : ''}`}
      style={{ '--paint': paint } as CSSProperties}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="menu__bg"
        aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease }}
      />
      <div className="menu__grain" aria-hidden="true" />

      {/* ── the wheel of words, in design space ─────────────────────────── */}
      <nav
        className="menu__wheel"
        aria-label="Main menu"
        style={wheelStyle}
      >
        {/* selection stroke: a wide brush from the left edge past the word */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`splat-${active}`}
            className="wheel__splat"
            style={{ left: sel.x + 120, top: sel.y - sel.size * 0.22, height: sel.size * 2.15 }}
            initial={reducedMotion ? false : { opacity: 0, x: '-100%', y: '-50%', rotate: sel.angle, scaleX: 0.85 }}
            animate={{ opacity: 1, x: '-100%', y: '-50%', rotate: sel.angle, scaleX: 1 }}
            exit={{ opacity: 0, x: '-100%', y: '-50%', rotate: sel.angle, transition: { duration: 0.18 } }}
            transition={{ duration: 0.32, ease }}
          >
            <svg viewBox="0 0 2400 200" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <filter id="stroke-rough" x="-5%" y="-40%" width="110%" height="180%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.006 0.05" numOctaves="3" seed={active + 3} result="t" />
                  <feDisplacementMap in="SourceGraphic" in2="t" scale="46" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <g filter="url(#stroke-rough)" fill="var(--paint)">
                <path d="M-100 40 C 500 10, 1300 30, 2200 60 L 2330 92 C 2360 120, 2300 160, 2180 158 C 1500 190, 600 180, -100 150 Z" />
                <ellipse cx="2280" cy="34" rx="34" ry="16" />
                <ellipse cx="2350" cy="150" rx="26" ry="12" />
                <ellipse cx="2200" cy="182" rx="18" ry="9" />
                <ellipse cx="2390" cy="76" rx="14" ry="10" />
              </g>
            </svg>
          </motion.div>
        </AnimatePresence>

        {mainMenu.map((m, i) => {
          const p = placed[i]
          const isActive = i === active
          const letters = [...m.label.toUpperCase()]
          return (
            <motion.button
              key={m.id}
              className={`wheel__item ${isActive ? 'is-active' : ''}`}
              style={{ left: p.x, top: p.y }}
              initial={
                reducedMotion || !first.current
                  ? false
                  : { opacity: 0, x: '-130%', y: '-72%', rotate: p.angle, fontSize: p.size }
              }
              animate={{ opacity: 1, x: '-100%', y: '-72%', rotate: p.angle, fontSize: p.size }}
              transition={{ duration: reducedMotion ? 0 : 0.42, delay: first.current ? 0.04 * i : 0, ease }}
              onPointerMove={() => setIndex(i)}
              onFocus={() => setIndex(i)}
              onClick={() => {
                setIndex(i)
                go(m.path, { word: m.label })
              }}
              aria-current={isActive ? 'true' : undefined}
              aria-label={m.label}
            >
              <span className="wheel__word" aria-hidden="true">
                {letters.map((ch, k) => (
                  <span key={k} style={{ fontSize: `${letterScale(k, letters.length, NEUTRAL[i].cap)}em` }}>
                    {ch}
                  </span>
                ))}
              </span>
              {isActive && (
                <motion.span
                  className="wheel__hint"
                  initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.14, duration: 0.3 }}
                >
                  {m.hint}
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* ── corner: giant slot number + vertical name ("3 / COMMAND") ──── */}
      <div className="menu__corner" aria-hidden="true">
        <span className="menu__num t-display" data-index={mainMenu.indexOf(item)}>
          {String(mainMenu.indexOf(item) + 1).padStart(2, '0')}
        </span>
        <span className="menu__vname t-ui-bold">{profile.name}</span>
      </div>

      {/* ── brief: what the chosen entry holds ─────────────────────────── */}
      <aside className="menu__brief" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            className="mbrief"
            initial={reducedMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10, transition: { duration: 0.12 } }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mbrief__kicker t-mono">
              {String(mainMenu.indexOf(item) + 1).padStart(2, '0')} · {item.hint}
            </span>
            <span className="mbrief__title">{item.label}</span>
            <span className="mbrief__line t-ui">{briefs[item.id] ?? ''}</span>
          </motion.div>
        </AnimatePresence>
        <div className="mbrief__keys">
          <Hints
            hints={[
              { key: '↕', label: 'Move' },
              { key: '↵', label: 'Confirm' },
              { key: '⌫', label: 'Title' },
            ]}
          />
        </div>
      </aside>
    </motion.div>
  )
}
