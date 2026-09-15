import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background, charaUrl } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { Screen } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useIsMobile } from '../hooks/useMedia'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { skillCategories } from '../data/skills'
import './Abilities.css'

const ease = [0.16, 1, 0.3, 1] as const
const N = skillCategories.length
const STEP = 360 / N
const total = skillCategories.reduce((n, c) => n + c.skills.length, 0)

/* ─────────────────────────────────────────────────────────
   ABILITIES — the discipline wheel. Seven sectors around a ring; ←/→
   turns the chosen one to the top and its tools fill the panel, with a
   character portrait on the right.
   ───────────────────────────────────────────────────────── */

export function Abilities() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const { index, setIndex } = useKeyNav({
    count: N,
    axis: 'both',
    initial: 0,
    onBack: () => go('/menu'),
  })
  const c = skillCategories[index]

  // phones swap the portrait per discipline: fetch them all up front so a turn never waits
  useEffect(() => {
    if (!isMobile) return
    for (const x of skillCategories) new Image().src = charaUrl(x.portrait)
  }, [isMobile])

  // phones: a horizontal swipe across the wheel turns it one step
  const touchX = useRef<number | null>(null)
  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 40) return
    setIndex((index + (dx < 0 ? 1 : N - 1)) % N)
  }

  return (
    <Screen
      head={<ScreenTitle sub={`${N} disciplines · ${total} tools`}>Abilities</ScreenTitle>}
      hints={[
        { key: '↔', label: 'Discipline' },
      ]}
      onBack={() => go('/menu')}
      className="abilities"
    >
      <Background art={5} mobileArt={c.portrait} focus="center" dim={0.78} position="center 30%" />

      <div className="ab" style={{ '--paint': c.paint } as CSSProperties}>
        <motion.div
          className="ab__glow"
          aria-hidden="true"
          animate={{ background: `radial-gradient(ellipse at 30% 55%, ${c.paint} 0%, transparent 55%)` }}
          transition={{ duration: 0.6 }}
        />

        {/* ── wheel ─────────────────────────────────────────────────────── */}
        <div className="ab__wheel-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <Wheel index={index} onPick={setIndex} reduced={reducedMotion} compact={isMobile} />
        </div>

        {/* ── panel ─────────────────────────────────────────────────────── */}
        <div className="ab__panel" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={c.id}
              className="ab__panel-inner"
              initial={reducedMotion ? false : { opacity: 0, x: 30, skewX: -3 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -20, transition: { duration: 0.16 } }}
              transition={{ duration: 0.34, ease }}
            >
              <span className="ab__kicker t-mono">
                Discipline {String(index + 1).padStart(2, '0')} · {c.skills.length} tools
              </span>
              <h2 className="ab__title t-hero">
                <span className="ab__title-splat" aria-hidden="true">
                  <Splat color={c.paint} seed={index + 3} />
                </span>
                <span className="ab__title-text">{c.title}</span>
              </h2>

              <ul className="tiles">
                {c.skills.map((s, k) => (
                  <motion.li
                    key={s}
                    className="tile"
                    initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 + k * 0.05, duration: 0.32, ease }}
                  >
                    <span className="tile__mark" aria-hidden="true" />
                    <span className="tile__name">{s}</span>
                    <span className="tile__idx t-mono">{String(k + 1).padStart(2, '0')}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── portrait ─────────────────────────────────────────────────── */}
        {!isMobile && (
          <div className="ab__portrait" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={c.id}
                src={charaUrl(c.portrait)}
                alt=""
                initial={reducedMotion ? false : { opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30, transition: { duration: 0.18 } }}
                transition={{ duration: 0.5, ease }}
              />
            </AnimatePresence>
          </div>
        )}
      </div>
    </Screen>
  )
}

/** the ring: N annular sectors, the active one turned to the top */
function Wheel({ index, onPick, reduced, compact }: { index: number; onPick: (i: number) => void; reduced: boolean; compact: boolean }) {
  const R = 170
  const r = 112
  const gap = 3
  const P = (rad: number, ang: number) => [200 + rad * Math.cos((ang * Math.PI) / 180), 200 + rad * Math.sin((ang * Math.PI) / 180)]
  const sector = (i: number) => {
    const start = -90 + i * STEP - STEP / 2 + gap / 2
    const end = start + STEP - gap
    const [x1, y1] = P(R, start)
    const [x2, y2] = P(R, end)
    const [x3, y3] = P(r, end)
    const [x4, y4] = P(r, start)
    return `M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 0 0 ${x4} ${y4} Z`
  }

  // keep turning the same way: accumulate the shortest step between indices
  const rot = useRef({ index, angle: -index * STEP })
  if (rot.current.index !== index) {
    let step = index - rot.current.index
    if (step > N / 2) step -= N
    if (step < -N / 2) step += N
    rot.current = { index, angle: rot.current.angle - step * STEP }
  }
  const rotation = rot.current.angle
  const active = skillCategories[index]

  // the ring's rendered size, so the names can be placed with transforms
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="wheel" ref={ref}>
      <motion.svg viewBox="0 0 400 400" className="wheel__svg" animate={{ rotate: rotation }} transition={{ duration: reduced ? 0 : 0.6, ease }}>
        <circle cx="200" cy="200" r="192" className="wheel__hair" />
        <circle cx="200" cy="200" r="184" className="wheel__hair wheel__hair--dash" />
        <circle cx="200" cy="200" r="98" className="wheel__hair" />
        {skillCategories.map((x, i) => (
          <g key={x.id} className={`wheel__sector ${i === index ? 'is-active' : ''}`} onClick={() => onPick(i)}>
            <path d={sector(i)} fill={x.paint} />
            {/* one node per tool along the outer edge */}
            {x.skills.map((s, k, arr) => {
              const start = -90 + i * STEP - STEP / 2 + 6
              const ang = start + (arr.length === 1 ? (STEP - 12) / 2 : (k / (arr.length - 1)) * (STEP - 12))
              const [cx, cy] = P(R + 11, ang)
              return <rect key={s} x={cx - 3} y={cy - 3} width="6" height="6" transform={`rotate(45 ${cx} ${cy})`} className="wheel__node" />
            })}
          </g>
        ))}
        {Array.from({ length: 36 }, (_, k) => {
          const ang = (k * 10 * Math.PI) / 180
          return <line key={k} x1={200 + 176 * Math.cos(ang)} y1={200 + 176 * Math.sin(ang)} x2={200 + (k % 9 === 0 ? 170 : 173) * Math.cos(ang)} y2={200 + (k % 9 === 0 ? 170 : 173) * Math.sin(ang)} className="wheel__tick" />
        })}
      </motion.svg>

      {/* centre: the active discipline's count (static overlay, never turns) */}
      <svg viewBox="0 0 400 400" className="wheel__centre" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.text
            key={active.id}
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            className="wheel__initial"
            style={{ fill: active.paint, transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={reduced ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, transition: { duration: 0.14 } }}
            transition={{ duration: 0.3, ease }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.text>
        </AnimatePresence>
      </svg>

      {/* names sit around the ring, always upright; they glide as it turns */}
      {skillCategories.map((x, i) => {
        const ang = ((-90 + (i - index) * STEP) * Math.PI) / 180
        const rad = size * (compact ? 0.55 : 0.58)
        const on = i === index
        return (
          <motion.div
            key={x.id}
            className="wheel__name-pos"
            initial={false}
            animate={{ x: rad * Math.cos(ang), y: rad * Math.sin(ang) }}
            transition={{ duration: reduced ? 0 : 0.6, ease }}
          >
            <button className={`wheel__name ${on ? 'is-active' : ''}`} style={{ color: on ? x.paint : undefined }} onClick={() => onPick(i)} aria-pressed={on}>
              {x.short}
            </button>
          </motion.div>
        )
      })}
      <span className="wheel__marker" aria-hidden="true" />
    </div>
  )
}
