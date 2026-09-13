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
    { key: 'Esc', label: 'Back' },
  ]
  return (
    <div className="hints" aria-hidden="true">
      {list.map((h) => (
        <span className="hint" key={h.key + h.label}>
          <kbd className="hint__key t-mono">{h.key}</kbd>
          <span className="hint__label t-ui">{h.label}</span>
        </span>
      ))}
    </div>
  )
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

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <div className="field__label t-label">{label}</div>
      <div className="field__value">{children}</div>
    </div>
  )
}

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

/* ── Panel — angled cream/ink card ──────────────────────────────────────── */

export function Panel({
  children,
  tone = 'ink',
  className = '',
  accent,
}: {
  children: ReactNode
  tone?: 'ink' | 'cream'
  className?: string
  accent?: 'red' | 'teal' | 'gold' | 'blue'
}) {
  return (
    <div className={`panel panel--${tone} ${accent ? `panel--accent-${accent}` : ''} ${className}`}>
      <span className="panel__corner" />
      {children}
    </div>
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

/* ── Divider line with a small red flick ────────────────────────────────── */

export function Rule({ className = '' }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />
}
