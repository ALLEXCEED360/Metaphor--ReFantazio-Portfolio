import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setSfxEnabled } from './audio'

export interface Settings {
  motion: 'full' | 'reduced'
  cursor: 'custom' | 'default'
  sound: 'off' | 'on'
  music: 'off' | 'on'
}

const KEY = 'aryan-portfolio:settings:v2'

function systemDefaults(): Settings {
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  return {
    motion: prefersReduced ? 'reduced' : 'full',
    cursor: finePointer ? 'custom' : 'default',
    sound: 'on',
    music: 'on',
  }
}

function load(): Settings {
  const base = systemDefaults()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<Settings> & { theme?: unknown }
    delete saved.theme
    return { ...base, ...saved }
  } catch {
    return base
  }
}

interface Ctx {
  settings: Settings
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  reset: () => void
  reducedMotion: boolean
}

const SettingsContext = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {
      /* private mode etc. */
    }
    const root = document.documentElement
    root.dataset.motion = settings.motion
    setSfxEnabled(settings.sound === 'on')
    delete root.dataset.theme
    // custom cursor only ever applies to fine pointers
    const fine = window.matchMedia('(pointer: fine)').matches
    document.body.dataset.cursor = fine ? settings.cursor : 'default'
  }, [settings])

  const value = useMemo<Ctx>(
    () => ({
      settings,
      set: (key, v) => setSettings((s) => ({ ...s, [key]: v })),
      reset: () => setSettings(systemDefaults()),
      reducedMotion: settings.motion === 'reduced',
    }),
    [settings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings outside SettingsProvider')
  return ctx
}
