import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { Screen } from '../components/ui'
import { useBackKey } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useSettings, type Settings as S } from '../app/settings'
import { useFinePointer } from '../hooks/useMedia'
import './screens.css'

interface Row<K extends keyof S> {
  key: K
  label: string
  desc: string
  options: { value: S[K]; label: string }[]
  disabled?: boolean
}

export function Settings() {
  const { back } = useNav()
  const { settings, set, reducedMotion } = useSettings()
  const fine = useFinePointer()
  useBackKey(back)

  const rows: Row<keyof S>[] = [
    {
      key: 'motion',
      label: 'Animation',
      desc: 'Reduced keeps the layout, drops the big transitions.',
      options: [
        { value: 'full', label: 'Full' },
        { value: 'reduced', label: 'Reduced' },
      ],
    },
    {
      key: 'theme',
      label: 'Theme',
      desc: 'Original uses the artwork backdrops. Dark is pure ink.',
      options: [
        { value: 'original', label: 'Original' },
        { value: 'dark', label: 'Dark' },
      ],
    },
    {
      key: 'cursor',
      label: 'Cursor',
      desc: fine ? 'Custom diamond cursor on desktop.' : 'Only available with a mouse or trackpad.',
      options: [
        { value: 'custom', label: 'Custom' },
        { value: 'default', label: 'Default' },
      ],
      disabled: !fine,
    },
    {
      key: 'sound',
      label: 'Sound',
      desc: 'Menu and transition sounds. Coming soon — off by default.',
      options: [
        { value: 'off', label: 'Off' },
        { value: 'on', label: 'On' },
      ],
      disabled: true,
    },
  ]

  return (
    <Screen head={<ScreenTitle sub="Motion, theme, cursor">Settings</ScreenTitle>} hints={[{ key: 'Esc', label: 'Back' }]}>
      <Background art={12} mobileArt={4} focus="left" dim={0.55} />
      <div className="set">
        {rows.map((r, i) => (
          <motion.div
            key={r.key}
            className="set__row"
            initial={reducedMotion ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={r.disabled ? { opacity: 0.5 } : undefined}
          >
            <div>
              <div className="set__label t-ui-bold">{r.label}</div>
              <div className="set__desc t-ui">{r.desc}</div>
            </div>
            <div className="set__opts" role="radiogroup" aria-label={r.label}>
              {r.options.map((o) => {
                const active = settings[r.key] === o.value
                return (
                  <button
                    key={String(o.value)}
                    role="radio"
                    aria-checked={active}
                    disabled={r.disabled}
                    className={`set__opt t-ui-bold ${active ? 'is-active' : ''}`}
                    onClick={() => set(r.key, o.value)}
                  >
                    <Splat color="var(--red)" seed={i + 4} />
                    <span>{o.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}
        <p className="set__note t-ui">
          Your choices are saved in this browser. Reduced motion is picked automatically when your system asks for it.
        </p>
      </div>
    </Screen>
  )
}
