import { sfx } from './audio'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSettings } from './settings'

/* ─────────────────────────────────────────────────────────
   Hash router + transition engine.

   go(path)                 → light crossfade (ordinary navigation)
   go(path, { word })       → big Metaphor-style wipe with a giant word
   back()                   → returns up one level with the reverse motion
   ───────────────────────────────────────────────────────── */

export type Screen =
  | 'boot'
  | 'menu'
  | 'profile'
  | 'journey'
  | 'quests'
  | 'quest'
  | 'abilities'
  | 'chronicle'
  | 'research'
  | 'archive'
  | 'contact'
  | 'settings'

export interface Route {
  path: string
  screen: Screen
  id?: string
}

function matchRoute(path: string): Route {
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  if (parts.length === 0) return { path: '/', screen: 'boot' }
  const [head, id] = parts
  switch (head) {
    case 'menu':
      return { path, screen: 'menu' }
    case 'quests':
      return id ? { path, screen: 'quest', id } : { path, screen: 'quests' }
    case 'profile':
    case 'journey':
    case 'abilities':
    case 'chronicle':
    case 'research':
    case 'archive':
    case 'contact':
    case 'settings':
      return { path, screen: head }
    default:
      return { path: '/menu', screen: 'menu' }
  }
}

/** Parent of a route — used by back() */
function parentOf(route: Route): string {
  if (route.screen === 'quest') return '/quests'
  if (route.screen === 'boot' || route.screen === 'menu') return '/menu'
  return '/menu'
}

export interface Wipe {
  word: string
  phase: 'cover' | 'reveal'
}

export type Direction = 'forward' | 'back'

interface NavCtx {
  route: Route
  direction: Direction
  wipe: Wipe | null
  busy: boolean
  go: (path: string, opts?: { word?: string }) => void
  back: () => void
}

const NavContext = createContext<NavCtx | null>(null)

export const WIPE_COVER_MS = 480
const WIPE_HOLD_MS = 420
export const WIPE_REVEAL_MS = 560

function readHash(): string {
  const h = window.location.hash.replace(/^#/, '')
  return h || '/'
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useSettings()
  const [route, setRoute] = useState<Route>(() => matchRoute(readHash()))
  const [direction, setDirection] = useState<Direction>('forward')
  const [wipe, setWipe] = useState<Wipe | null>(null)
  const busyRef = useRef(false)
  const timers = useRef<number[]>([])

  const commit = useCallback((path: string) => {
    const next = matchRoute(path)
    // write the hash without triggering our own hashchange handler twice
    if (readHash() !== next.path) {
      window.history.pushState(null, '', `#${next.path}`)
    }
    setRoute(next)
  }, [])

  // browser back / forward
  useEffect(() => {
    const onPop = () => {
      setDirection('back')
      setRoute(matchRoute(readHash()))
    }
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const go = useCallback(
    (path: string, opts?: { word?: string }) => {
      if (busyRef.current) return
      if (matchRoute(path).path === route.path) return
      setDirection('forward')

      if (!opts?.word || reducedMotion) {
        commit(path)
        return
      }

      busyRef.current = true
      if (opts.word !== 'Begin') sfx.wipe()
      setWipe({ word: opts.word, phase: 'cover' })
      timers.current.push(
        window.setTimeout(() => {
          commit(path)
        }, WIPE_COVER_MS),
        window.setTimeout(() => {
          setWipe((w) => (w ? { ...w, phase: 'reveal' } : w))
        }, WIPE_COVER_MS + WIPE_HOLD_MS),
        window.setTimeout(() => {
          setWipe(null)
          busyRef.current = false
        }, WIPE_COVER_MS + WIPE_HOLD_MS + WIPE_REVEAL_MS),
      )
    },
    [commit, reducedMotion, route.path],
  )

  const back = useCallback(() => {
    if (busyRef.current) return
    setDirection('back')
    commit(parentOf(route))
  }, [commit, route])

  const value = useMemo<NavCtx>(
    () => ({ route, direction, wipe, busy: wipe !== null, go, back }),
    [route, direction, wipe, go, back],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav outside RouterProvider')
  return ctx
}
