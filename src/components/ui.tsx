import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { useIsMobile } from '../hooks/useMedia'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { Splat } from './Splat'
import './ui.css'

/* ── Control hints (bottom-right "Confirm / Back" flags) ─────────────────── */

export interface Hint {
  key: string
  label: string
}

export function Hints({ hints }: { hints?: Hint[] }) {
  const isMobile = useIsMobile()
  // keyboard hints mean nothing on a touch screen — the Back button carries it
  if (isMobile) return null
  const list: Hint[] = hints ?? [
    { key: '↑↓', label: 'Move' },
    { key: 'Enter', label: 'Confirm' },
  ]
  if (list.length === 0) return null
  return (
    <div className="hints" aria-hidden="true">
      {list.map((h) => (
        <span className="hint" key={h.key + h.label}>
          <kbd className="hint__key t-mono">
            <KeyGlyph k={h.key} />
          </kbd>
          <span className="hint__label t-ui">{h.label}</span>
        </span>
      ))}
    </div>
  )
}

/** the fonts lack clean arrow glyphs, so common keys get small SVG icons */
export function KeyGlyph({ k }: { k: string }) {
  const common = { width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (k) {
    case '↕':
    case '↑↓':
      return (
        <svg {...common}>
          <path d="M6 1.5v9M3.2 4.2 6 1.5l2.8 2.7M3.2 7.8 6 10.5l2.8-2.7" />
        </svg>
      )
    case '↔':
    case '← →':
      return (
        <svg {...common}>
          <path d="M1.5 6h9M4.2 3.2 1.5 6l2.7 2.8M7.8 3.2 10.5 6 7.8 8.8" />
        </svg>
      )
    case '⌫':
    case 'Esc':
      return (
        <svg {...common}>
          <path d="M4.2 2.5h6.3v7H4.2L1.5 6l2.7-3.5ZM6 4.5l3 3M9 4.5l-3 3" />
        </svg>
      )
    case '↵':
    case 'Enter':
      return (
        <svg {...common}>
          <path d="M10.5 2v4.2H2.5M5 3.8 2.5 6.2 5 8.6" />
        </svg>
      )
    default:
      return <>{k}</>
  }
}

/* ── Back button (top-right, "◁ Back") ──────────────────────────────────── */

export function BackButton({ label = 'Back', onClick }: { label?: string; onClick?: () => void }) {
  const { back } = useNav()
  return (
    <button className="backbtn t-ui" onClick={onClick ?? back} aria-label={label}>
      <span className="backbtn__tri" />
      <span>{label}</span>
    </button>
  )
}

/* ── Screen layout: head (title) / body / foot (hints) ──────────────────── */

export function Screen({
  head,
  children,
  hints,
  backLabel,
  onBack,
  className = '',
}: {
  head: ReactNode
  children: ReactNode
  hints?: Hint[]
  backLabel?: string
  onBack?: () => void
  className?: string
}) {
  const { direction } = useNav()
  const { reducedMotion } = useSettings()
  const dx = direction === 'back' ? -28 : 28
  return (
    <motion.section
      className={`stage screen ${className}`}
      initial={reducedMotion ? false : { opacity: 0, x: dx }}
      animate={{ opacity: 1, x: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -dx }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="screen__head">
        <div className="screen__title">{head}</div>
      </header>
      <div className="stage__body screen__body">{children}</div>
      <footer className="screen__foot">
        <div className="screen__back">
          <BackButton label={backLabel} onClick={onBack} />
        </div>
        <Hints hints={hints} />
      </footer>
    </motion.section>
  )
}

/* ── Tag / badge (mono) ─────────────────────────────────────────────────── */

export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'red' | 'teal' | 'gold' }) {
  return <span className={`tag tag--${tone} t-mono`}>{children}</span>
}

/* ── Label + value pair ("CLASS / Software Engineer") ───────────────────── */

/* ── Game button — cream flag with red splat on hover ───────────────────── */

export function GameButton({
  children,
  tone = 'cream',
  href,
  onClick,
  ...rest
}: {
  children: ReactNode
  tone?: 'cream' | 'red' | 'ghost'
  href?: string
  onClick?: () => void
} & Omit<HTMLMotionProps<'button'>, 'children' | 'onClick'>) {
  const cls = `gbtn gbtn--${tone} t-ui-bold`
  const inner = (
    <>
      <span className="gbtn__splat">
        <Splat color={tone === 'red' ? 'var(--cream)' : 'var(--red)'} seed={7} />
      </span>
      <span className="gbtn__label">{children}</span>
    </>
  )
  if (href) {
    return (
      <a className={cls} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {inner}
      </a>
    )
  }
  return (
    <motion.button className={cls} onClick={onClick} whileTap={{ scale: 0.97 }} {...rest}>
      {inner}
    </motion.button>
  )
}

/* ── Pipeline / architecture flow ───────────────────────────────────────── */

export function Flow({ steps, tone = 'red' }: { steps: string[]; tone?: 'red' | 'teal' }) {
  return (
    <ol className={`flow flow--${tone}`}>
      {steps.map((s, i) => (
        <li key={s} className="flow__step">
          <span className="flow__num t-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="flow__label t-ui-bold">{s}</span>
          {i < steps.length - 1 && <span className="flow__arrow" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}
