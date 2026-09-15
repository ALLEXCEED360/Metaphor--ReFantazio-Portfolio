import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { KeyGlyph, Screen } from '../components/ui'
import { useNav } from '../app/router'
import { useSettings, type Settings as S } from '../app/settings'
import { useFinePointer, useIsMobile } from '../hooks/useMedia'
import { sfx } from '../app/audio'
import './Settings.css'

const ease = [0.16, 1, 0.3, 1] as const

interface Option<K extends keyof S> {
  value: S[K]
  label: string
  note: string
}
interface Row<K extends keyof S = keyof S> {
  key: K
  label: string
  desc: string
  paint: string
  options: Option<K>[]
  disabled?: string
}

const controls = [
  { k: '↕', label: 'Move', desc: 'Step through lists, rows and records' },
  { k: '↔', label: 'Turn', desc: 'Change a value, turn a page or a wheel' },
  { k: '↵', label: 'Confirm', desc: 'Open the chosen item or link' },
  { k: '⌫', label: 'Back', desc: 'Return to the menu; from the menu, to the title' },
  { k: 'Mouse', label: 'Hover', desc: 'Pointing selects, clicking confirms' },
]

/* ─────────────────────────────────────────────────────────
   SETTINGS — option slabs on the left (↑/↓ chooses a row, ←/→ changes it),
   the controls legend on the right.
   ───────────────────────────────────────────────────────── */

export function Settings() {
  const { go } = useNav()
  const { settings, set, reset, reducedMotion } = useSettings()
  const fine = useFinePointer()
  const isMobile = useIsMobile()

  const rows: Row[] = [
    {
      key: 'cursor',
      label: 'Cursor',
      desc: 'The geometric blade pointer, turning into a reticle over anything you can press.',
      paint: '#d4a900',
      options: [
        { value: 'custom', label: 'Blade', note: 'The site pointer' },
        { value: 'default', label: 'System', note: 'Your usual arrow' },
      ],
      disabled: fine ? undefined : 'Only with a mouse or trackpad',
    },
    {
      key: 'music',
      label: 'Music',
      desc: 'Ode to Heroes, from Metaphor: ReFantazio. Plays from the title screen and carries across every page.',
      paint: '#b94abb',
      options: [
        { value: 'on', label: 'On', note: 'Looping quietly' },
        { value: 'off', label: 'Off', note: 'Silent' },
      ],
    },
    {
      key: 'sound',
      label: 'Sound',
      desc: 'Cursor ticks, confirms and the swell under the page wipes.',
      paint: '#3a96aa',
      options: [
        { value: 'on', label: 'On', note: 'With sound' },
        { value: 'off', label: 'Off', note: 'Silent' },
      ],
    },
  ]
  const ACTIONS = rows.length // index of the restore row
  const count = rows.length + 1

  const [index, setIndex] = useState(isMobile ? -1 : 0)
  const change = useCallback(
    (dir: 1 | -1) => {
      const r = rows[index]
      if (!r || r.disabled) return
      const k = r.options.findIndex((o) => o.value === settings[r.key])
      const next = r.options[(k + dir + r.options.length) % r.options.length]
      set(r.key, next.value)
      // the flag flips after render, so let the confirmation land a beat later
      window.setTimeout(() => sfx.toggle(), 40)
    },
    [index, rows, settings, set],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setIndex((i) => {
            const n = Math.min(count - 1, i + 1)
            if (n !== i) sfx.tick()
            return n
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setIndex((i) => {
            const n = Math.max(0, i - 1)
            if (n !== i) sfx.tick()
            return n
          })
          break
        case 'ArrowRight':
          e.preventDefault()
          change(1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          change(-1)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (index === ACTIONS) {
            sfx.confirm()
            reset()
          } else change(1)
          break
        case 'Escape':
        case 'Backspace':
          e.preventDefault()
          sfx.back()
          go('/menu')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [change, count, index, ACTIONS, reset, go])

  const rise = (k: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 + k * 0.07, duration: 0.4, ease },
  })

  return (
    <Screen
      head={<ScreenTitle sub="Saved in this browser">Settings</ScreenTitle>}
      hints={[
        { key: '↕', label: 'Option' },
        { key: '↔', label: 'Change' },
      ]}
      onBack={() => go('/menu')}
      className="settings"
    >
      <Background art={12} mobileArt={4} focus="center" dim={0.8} position="center 40%" />

      <div className="st">
        {/* ── options ──────────────────────────────────────────────────── */}
        <div className="st__rows">
          {rows.map((r, i) => {
            const on = i === index
            const current = r.options.find((o) => o.value === settings[r.key])
            return (
              <motion.section
                key={r.key}
                className={`opt ${on ? 'is-active' : ''} ${r.disabled ? 'is-disabled' : ''}`}
                style={{ '--col': r.paint } as CSSProperties}
                onPointerMove={(e) => e.pointerType === 'mouse' && setIndex((cur) => (cur === i ? cur : (sfx.tick(), i)))}
                {...rise(i)}
              >
                <span className="opt__num t-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="opt__text">
                  <h3 className="opt__label">{r.label}</h3>
                  <p className="opt__desc t-ui">{r.disabled ?? r.desc}</p>
                </div>
                <div className="opt__seg" role="radiogroup" aria-label={r.label}>
                  {r.options.map((o) => {
                    const active = o.value === settings[r.key]
                    return (
                      <button
                        key={String(o.value)}
                        role="radio"
                        aria-checked={active}
                        disabled={!!r.disabled}
                        className={`seg ${active ? 'is-on' : ''}`}
                        onClick={() => {
                          setIndex(i)
                          set(r.key, o.value)
                          window.setTimeout(() => sfx.toggle(), 40)
                        }}
                      >
                        {active && (
                          <motion.span layoutId={`st-seg-${r.key}`} className="seg__mark" aria-hidden="true" transition={{ duration: reducedMotion ? 0 : 0.28, ease }}>
                            <Splat color={r.paint} seed={i + 7} />
                          </motion.span>
                        )}
                        <span className="seg__label">{o.label}</span>
                      </button>
                    )
                  })}
                </div>
                <span className="opt__note t-mono">{current?.note}</span>
              </motion.section>
            )
          })}

          {/* actions */}
          <motion.section className={`opt opt--actions ${index === ACTIONS ? 'is-active' : ''}`} onPointerMove={(e) => e.pointerType === 'mouse' && setIndex((cur) => (cur === ACTIONS ? cur : (sfx.tick(), ACTIONS)))} {...rise(rows.length)}>
            <span className="opt__num t-num">{String(rows.length + 1).padStart(2, '0')}</span>
            <div className="opt__text">
              <h3 className="opt__label">Memory</h3>
              <p className="opt__desc t-ui">Choices live in this browser only.</p>
            </div>
            <div className="opt__seg">
              <button
                className="seg seg--plain"
                onClick={() => {
                  sfx.confirm()
                  reset()
                }}
              >
                <span className="seg__label">Restore defaults</span>
              </button>
            </div>
          </motion.section>
        </div>

        {/* ── controls legend ───────────────────────────────────────────── */}
        <motion.aside className="st__side" {...rise(1)}>
          <div className="legend">
            <span className="t-label">Controls</span>
            <ul>
              {controls.map((c) => (
                <li key={c.label} className="legend__row">
                  <kbd className="legend__key t-mono">
                    <KeyGlyph k={c.k} />
                  </kbd>
                  <span className="legend__label">{c.label}</span>
                  <span className="legend__desc t-ui">{c.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>
    </Screen>
  )
}
