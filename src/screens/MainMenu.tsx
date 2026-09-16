import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type TouchEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hints, BackButton } from '../components/ui'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { useKeyNav } from '../hooks/useKeyNav'
import { useMedia } from '../hooks/useMedia'
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
   Layout traced from the game's menu: the nine words sit along one arc that
   runs from the top-left down to the bottom-right (right ends anchored, the
   tilt easing from +12° to −16°). Each word owns a share of that arc in
   proportion to its letter size; the selected word's share grows with it, so
   its neighbours slide along the arc just far enough to make room and the
   column keeps its rhythm whatever is chosen. The design space is scaled
   like `background-size: cover`, so it stays registered to the plate.
   ───────────────────────────────────────────────────────── */

const DESIGN = { w: 1920, h: 1080 }
const SELECT_SCALE = 1.4
/** extra arc after the chosen word, relative to its grown size: room for its hint line */
const SELECT_ROOM = 0.22

interface Neutral {
  x: number // right-end anchor
  y: number
  r: number // rotation (deg, clockwise positive)
  s: number // letter size (design px)
  cap: number // drop-cap multiplier
}

/*                 x     y    rot  size  cap        game word  */
const NEUTRAL: Neutral[] = [
  { x: 670, y: 205, r: 12, s: 104, cap: 1.5 }, // SKILL
  { x: 610, y: 315, r: 10, s: 105, cap: 1.5 }, // ITEM
  { x: 650, y: 432, r: 8, s: 121, cap: 2.2 }, // EQUIPMENT
  { x: 675, y: 552, r: 4, s: 117, cap: 1.6 }, // PARTY
  { x: 655, y: 668, r: -3, s: 121, cap: 2.1 }, // FOLLOWER
  { x: 640, y: 762, r: -7, s: 100, cap: 1.5 }, // QUEST
  { x: 770, y: 832, r: -10, s: 107, cap: 1.7 }, // CALENDAR
  { x: 890, y: 896, r: -13, s: 88, cap: 1.4 }, // MEMORANDUM
  { x: 1010, y: 955, r: -16, s: 94, cap: 1.5 }, // SYSTEM
]

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

/* a phone on its side: the same words on an evenly spaced, near-vertical
   line that stays on the left — the game's fan drifts to the centre, out of
   the thumb's easy reach */
const SIDE: Neutral[] = NEUTRAL.map((n, i) => ({ x: 660 + i * 6, y: 150 + i * 138, r: 5 - i * 1.2, s: n.s, cap: n.cap }))

/* the arc through the anchors, extended half a step past the top and barely
   past the bottom so the first and last words rest where the game puts them */
function buildArc(neutral: Neutral[]) {
  const n = neutral.length
  const ext = (a: Neutral, b: Neutral, k: number) => ({ x: a.x + (a.x - b.x) * k, y: a.y + (a.y - b.y) * k, r: a.r + (a.r - b.r) * k })
  const pts = [ext(neutral[0], neutral[1], 0.5), ...neutral.map(({ x, y, r }) => ({ x, y, r })), ext(neutral[n - 1], neutral[n - 2], 0.12)]
  const len = [0]
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  return { pts, len, total: len[len.length - 1] }
}
type Arc = ReturnType<typeof buildArc>
const ARC = buildArc(NEUTRAL)
const ARC_SIDE = buildArc(SIDE)

/** point on the arc at distance d from its top */
function alongArc(arc: Arc, d: number) {
  const { pts, len } = arc
  let i = 1
  while (i < len.length - 1 && len[i] < d) i++
  const t = (d - len[i - 1]) / Math.max(1, len[i] - len[i - 1])
  const a = pts[i - 1]
  const b = pts[i]
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, r: a.r + (b.r - a.r) * t }
}

function layout(active: number, side = false): Placed[] {
  const arc = side ? ARC_SIDE : ARC
  const sizes = NEUTRAL.map((n, i) => (i === active ? n.s * SELECT_SCALE : n.s))
  const shares = sizes.map((s, i) => (i === active ? s * (1 + SELECT_ROOM) : s))
  const sum = shares.reduce((a, b) => a + b, 0)
  let acc = 0
  return NEUTRAL.map((_, i) => {
    // the word sits at the centre of its own height; the extra room trails after it
    const centre = ((acc + sizes[i] / 2) / sum) * arc.total
    acc += shares[i]
    const p = alongArc(arc, centre)
    return { x: p.x, y: p.y, angle: p.r, size: sizes[i] }
  })
}

/**
 * Which word the mouse is over, by geometry rather than DOM boxes: the
 * rotated, overlapping letter boxes make hover jumpy, and a word growing
 * under the cursor would otherwise hand the hover to its neighbour. Each
 * word is a rotated band running left from its anchor (the right end of the
 * baseline); when bands overlap the one whose midline is nearest wins.
 */
function wordAt(x: number, y: number, placed: Placed[], active: number): number | null {
  const inBand = (i: number, loose: number) => {
    const p = placed[i]
    const a = (-p.angle * Math.PI) / 180
    const dx = x - p.x
    const dy = y - p.y
    // into the word's frame: lx runs along the baseline, ly up from it
    const lx = dx * Math.cos(a) - dy * Math.sin(a)
    const ly = dx * Math.sin(a) + dy * Math.cos(a)
    const n = mainMenu[i].label.length
    const width = p.size * (0.36 * (n - 1) + 0.45 * NEUTRAL[i].cap)
    if (lx > 0.25 * p.size * loose || lx < -width - 0.2 * p.size * (loose - 1)) return null
    if (ly > 0.22 * p.size * loose || ly < -0.85 * p.size * loose) return null
    return Math.abs(ly + 0.32 * p.size)
  }
  let best: { i: number; off: number } | null = null
  for (let i = 0; i < placed.length; i++) {
    const off = inBand(i, 1)
    if (off != null && (!best || off < best.off)) best = { i, off }
  }
  if (best) return (best as { i: number }).i
  // just off the letters of the chosen word (it grew under the cursor): keep it
  return inBand(active, 1.6) != null ? active : null
}

/**
 * Scale the design space to the viewport HEIGHT so the word column is never
 * cropped (the plate behind it still covers). On narrow windows also make
 * sure the column (≈1250 design px wide) fits the width.
 *
 * A phone on its side is the exception: there the words are scaled up for
 * the thumb (the column is taller than the screen) and the wheel pans so
 * the chosen word stays in view — swiping over it scrolls the selection.
 */
function useCoverTransform(roomy: boolean) {
  const [t, setT] = useState({ s: 1, ox: 0, oy: 0, H: 0 })
  useLayoutEffect(() => {
    const calc = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      const s = roomy ? Math.min(W / 1250, H / 640) : Math.min(H / DESIGN.h, W / 1250)
      // sideways the column shifts left a little to clear the brief panel
      setT({ s, ox: roomy ? -W * 0.06 : 0, oy: (H - DESIGN.h * s) / 2, H })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [roomy])
  return t
}

export function MainMenu() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  // only a portrait phone gets the plain list; a phone on its side shows the wheel like the desktop
  const isMobile = useMedia('(max-width: 760px)')
  // a touch screen has no Backspace: the brief's foot carries a Title button instead of key hints
  const isTouch = useMedia('(pointer: coarse)')
  // a phone on its side: bigger words, the wheel pans to the chosen one, a swipe moves it
  const shortLandscape = useMedia('(max-height: 500px) and (orientation: landscape)')
  const sideways = isTouch && shortLandscape
  const cover = useCoverTransform(sideways)

  const [active, setActive] = useState(() => {
    const q = Number(new URLSearchParams(window.location.search).get('sel'))
    const saved = Number.isFinite(q) && window.location.search.includes('sel=') ? q : Number(sessionStorage.getItem(KEY))
    return Number.isFinite(saved) && saved >= 0 && saved < mainMenu.length ? saved : 0
  })
  // Backspace / Esc (or the phone's Title button) → back to the title screen; the cursor starts fresh from there
  const toTitle = () => {
    sessionStorage.removeItem(KEY)
    go('/')
  }
  const { index, setIndex } = useKeyNav({
    count: mainMenu.length,
    initial: active,
    onSelect: (i) => go(mainMenu[i].path, { word: mainMenu[i].label }),
    onBack: toTitle,
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
  const placed = layout(active, sideways)
  const sel = placed[active]

  // mouse: hit-test in design space over the whole wheel (see wordAt)
  const wheelRef = useRef<HTMLElement>(null)
  const under = (e: PointerEvent | MouseEvent) => {
    const el = wheelRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    return wordAt((e.clientX - r.left) / cover.s, (e.clientY - r.top) / cover.s, placed, active)
  }
  const onWheelMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const i = under(e)
    wheelRef.current?.toggleAttribute('data-cursor', i != null)
    if (i != null) wheelRef.current?.setAttribute('data-cursor', 'interactive')
    if (i != null && i !== index) setIndex(i)
  }
  const onWheelClick = (e: MouseEvent) => {
    const i = under(e)
    if (i == null) return
    setIndex(i)
    // on a touch screen the first tap only moves the cursor there; a second tap confirms
    if (isTouch && i !== index) return
    go(mainMenu[i].path, { word: mainMenu[i].label })
  }
  // sideways the wheel pans so the chosen word sits mid-screen; elsewhere the whole column is centred
  const panY = sideways ? cover.H / 2 - sel.y * cover.s : cover.oy
  // the sideways line runs past the design height; the box must still contain every word for taps
  const wheelStyle = { width: DESIGN.w, height: sideways ? 1400 : DESIGN.h }

  // sideways: a vertical swipe over the wheel moves the cursor one step
  const swipeY = useRef<number | null>(null)
  const onWheelTouchStart = (e: TouchEvent) => {
    swipeY.current = e.touches[0].clientY
  }
  const onWheelTouchEnd = (e: TouchEvent) => {
    if (swipeY.current == null) return
    const dy = e.changedTouches[0].clientY - swipeY.current
    swipeY.current = null
    if (Math.abs(dy) < 30) return
    setIndex(Math.max(0, Math.min(mainMenu.length - 1, index + (dy < 0 ? 1 : -1))))
  }

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
        <div className="mnav__back">
          <BackButton label="Title" onClick={toTitle} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="menu"
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
      {/* the blended grain forces a full-screen recomposite every frame the wheel pans */}
      {!sideways && <div className="menu__grain" aria-hidden="true" />}

      {/* ── the wheel of words, in design space ─────────────────────────── */}
      <nav
        ref={wheelRef}
        className="menu__wheel"
        aria-label="Main menu"
        style={{ ...wheelStyle, transform: `translate(${cover.ox}px, ${panY}px) scale(${cover.s})`, transitionDuration: reducedMotion ? '0s' : undefined }}
        onPointerMove={onWheelMove}
        onPointerLeave={() => wheelRef.current?.removeAttribute('data-cursor')}
        onClick={onWheelClick}
        onTouchStart={sideways ? onWheelTouchStart : undefined}
        onTouchEnd={sideways ? onWheelTouchEnd : undefined}
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
              {/* the roughened edge is a live SVG filter over a 2400px brush: too much for a phone GPU while the wheel moves */}
              {!isTouch && (
                <defs>
                  <filter id="stroke-rough" x="-5%" y="-40%" width="110%" height="180%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.006 0.05" numOctaves="3" seed={active + 3} result="t" />
                    <feDisplacementMap in="SourceGraphic" in2="t" scale="46" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
              )}
              <g filter={isTouch ? undefined : 'url(#stroke-rough)'} fill="var(--paint)">
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
            <motion.div
              key={m.id}
              className={`wheel__slot ${isActive ? 'is-active' : ''}`}
              initial={reducedMotion || !first.current || sideways ? false : { opacity: 0, x: p.x - 90, y: p.y, rotate: p.angle }}
              animate={{ opacity: 1, x: p.x, y: p.y, rotate: p.angle }}
              transition={{ duration: reducedMotion || sideways ? 0 : 0.42, delay: first.current && !sideways ? 0.04 * i : 0, ease }}
            >
              <motion.button
                className="wheel__item"
                initial={false}
                animate={{ fontSize: p.size }}
                transition={{ duration: reducedMotion || sideways ? 0 : 0.42, ease }}
                onFocus={() => setIndex(i)}
                onClick={(e) => {
                  // keyboard activation; mouse clicks are handled by the wheel
                  e.stopPropagation()
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
            </motion.div>
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
          {isTouch ? (
            <BackButton label="Title" onClick={toTitle} />
          ) : (
            <Hints
              hints={[
                { key: '↕', label: 'Move' },
                { key: '↵', label: 'Confirm' },
                { key: '⌫', label: 'Title' },
              ]}
            />
          )}
        </div>
      </aside>
    </motion.div>
  )
}
