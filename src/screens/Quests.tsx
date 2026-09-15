import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Flow, GameButton, Screen, Tag } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useIsMobile } from '../hooks/useMedia'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { projects, statusLabel, type Project } from '../data/projects'
import './Quests.css'

const ease = [0.16, 1, 0.3, 1] as const

/** segments lit on the status bar (out of 10) */
const PROGRESS: Record<Project['status'], number> = {
  complete: 10,
  released: 10,
  testing: 8,
  'under-review': 9,
  'in-progress': 6,
}

/* ─────────────────────────────────────────────────────────
   QUEST LOG — a hand of poster cards fanned across the screen. ←/→ flips
   through them; the active card stands upright on its splat with a brief
   below; Enter (or "Open record") slides in the full record as a drawer.
   ───────────────────────────────────────────────────────── */

export function Quests({ initialId }: { initialId?: string }) {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const touchX = useRef<number | null>(null)
  const [drawer, setDrawer] = useState(false)
  const { index, setIndex } = useKeyNav({
    count: projects.length,
    axis: 'horizontal',
    loop: false,
    initial: (() => {
      const byId = initialId ? projects.findIndex((p) => p.id === initialId) : -1
      if (byId >= 0) return byId
      return 0
    })(),
    onSelect: () => setDrawer((d) => !d),
    onBack: () => (drawer ? setDrawer(false) : go('/menu')),
  })
  const p = projects[index]

  // a deep link arriving while the screen is already mounted
  useEffect(() => {
    const byId = initialId ? projects.findIndex((x) => x.id === initialId) : -1
    if (byId >= 0) setIndex(byId)
  }, [initialId, setIndex])

  useEffect(() => {
    const path = `#/quests/${projects[index].id}`
    if (window.location.hash !== path) window.history.replaceState(null, '', path)
  }, [index])

  return (
    <Screen
      head={<ScreenTitle sub={`${projects.filter((x) => x.tier === 'main').length} main quests · ${projects.filter((x) => x.tier === 'side').length} side quests`}>Quest Log</ScreenTitle>}
      hints={[
        { key: '↔', label: 'Quest' },
        { key: '↵', label: drawer ? 'Close' : 'Record' },
      ]}
      onBack={() => go('/menu')}
      className="quests"
    >
      <Background art={p.art} mobileArt={((index % 7) + 1) as number} focus="center" dim={0.42} position="center 35%" />

      <div className="qb" style={{ '--paint': p.paint } as CSSProperties}>
        {/* ── the hand of cards ─────────────────────────────────────────── */}
        <div
          className={`qb__hand ${isMobile ? 'qb__hand--mobile' : ''}`}
          role="listbox"
          aria-label="Quests"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 48) setIndex(Math.max(0, Math.min(projects.length - 1, index + (dx < 0 ? 1 : -1))))
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={p.id}
              className="qb__aura"
              aria-hidden="true"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.4, ease }}
            >
              <span className="qb__aura-glow" />
              <span className="qb__aura-frame qb__aura-frame--a" />
              <span className="qb__aura-frame qb__aura-frame--b" />
              <svg className="qb__aura-ring" viewBox="0 0 200 200" aria-hidden="true">
                <circle cx="100" cy="100" r="96" />
                <circle cx="100" cy="100" r="78" strokeDasharray="6 10" />
              </svg>
            </motion.span>
          </AnimatePresence>
          {projects.map((x, i) => {
            const d = i - index
            const abs = Math.abs(d)
            const active = d === 0
            const hidden = abs > 3
            const layout = isMobile
              ? { x: d * (typeof window !== 'undefined' ? window.innerWidth : 400), rotate: 0, scale: active ? 1 : 0.92, y: 0 }
              : {
                  x: d * 16.5 + Math.sign(d) * 7,
                  rotate: d * 4,
                  scale: active ? 1 : 0.86 - abs * 0.04,
                  y: active ? 0 : abs * 18 + 26,
                }
            return (
              <motion.button
                key={x.id}
                className={`card card--${x.tier} ${active ? 'is-active' : ''}`}
                style={{ zIndex: 20 - abs, pointerEvents: hidden ? 'none' : 'auto' }}
                initial={false}
                animate={{
                  x: isMobile ? layout.x : `${layout.x}vw`,
                  y: layout.y,
                  rotate: layout.rotate,
                  scale: layout.scale,
                  opacity: hidden ? 0 : active ? 1 : 0.95 - abs * 0.12,
                  filter: active ? 'saturate(1)' : 'saturate(0.6)',
                }}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease }}
                onClick={() => (active ? setDrawer(true) : setIndex(i))}
                aria-selected={active}
                aria-label={x.title}
                tabIndex={hidden ? -1 : 0}
              >
                <span className="card__band" style={{ background: x.paint }}>
                  <span className="card__num t-display">{String(i + 1).padStart(2, '0')}</span>
                  <span className="card__band-side">
                    <span className="card__tier t-label">{x.tier === 'side' ? 'Side quest' : 'Main quest'}</span>
                    <span className="card__year t-num">{x.year}</span>
                  </span>
                </span>
                <span className="card__mark t-display" aria-hidden="true">
                  {x.title.charAt(0)}
                </span>
                <span className="card__text">
                  <span className="card__cat t-label">{x.category}</span>
                  <span className="card__title">{x.title}</span>
                  <span className="card__rule" style={{ background: x.paint }} aria-hidden="true" />
                  <span className="card__obj t-ui">{x.tagline}</span>
                  <span className="card__foot">
                    <span className="card__tech t-mono">{x.technologies.slice(0, 3).join(' · ')}</span>
                    <span className="card__role t-label">{x.role}</span>
                  </span>
                </span>
                <span className={`card__stamp card__stamp--${x.status} t-mono`} style={{ color: x.paint }}>
                  {statusLabel[x.status]}
                </span>
                <svg className="card__lines" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
                  <circle cx="82" cy="118" r="34" />
                  <circle cx="82" cy="118" r="22" />
                  <line x1="-10" y1="132" x2="110" y2="70" />
                </svg>
              </motion.button>
            )
          })}
        </div>

        {isMobile && (
          <div className="qb__pager" role="tablist" aria-label="Quests">
            {projects.map((x, i) => (
              <button key={x.id} className={`qb__page ${i === index ? 'is-on' : ''}`} style={{ '--col': x.paint } as CSSProperties} onClick={() => setIndex(i)} role="tab" aria-selected={i === index} aria-label={x.title}>
                <span className="t-num">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── quest brief for the active card ─────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.id}
            className="brief"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.14 } }}
            transition={{ duration: 0.34, ease }}
          >
            <div className="brief__slab" style={{ background: p.paint }}>
              <span className="brief__slab-num t-display">{String(index + 1).padStart(2, '0')}</span>
              <span className="brief__slab-label t-label">{p.tier === 'side' ? 'Side quest' : 'Main quest'}</span>
            </div>

            <div className="brief__main">
              <span className="brief__label t-label">Objective</span>
              <p className="brief__objective">{p.tagline}</p>
              <div className="tags brief__tags">
                {p.technologies.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>

            <dl className="brief__meta">
              <div>
                <dt className="t-label">Platform</dt>
                <dd className="t-ui-bold">{p.platform}</dd>
              </div>
              <div>
                <dt className="t-label">Role</dt>
                <dd className="t-ui-bold">{p.role}</dd>
              </div>
              <div>
                <dt className="t-label">Year</dt>
                <dd className="t-num">{p.year}</dd>
              </div>
              <div className="brief__progress">
                <dt className="t-label">Status</dt>
                <dd>
                  <span className="brief__bar" aria-hidden="true">
                    {Array.from({ length: 10 }, (_, k) => (
                      <i key={k} className={k < PROGRESS[p.status] ? 'is-on' : ''} style={{ background: k < PROGRESS[p.status] ? p.paint : undefined }} />
                    ))}
                  </span>
                  <span className="brief__status t-mono" style={{ color: p.paint }}>
                    {statusLabel[p.status]}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="brief__actions">
              <GameButton tone="red" onClick={() => setDrawer(true)}>
                Open record
              </GameButton>
              {p.links[0] && (
                <GameButton tone="ghost" href={p.links[0].href}>
                  {p.links[0].kind === 'steam' ? 'Steam' : p.links[0].kind === 'artstation' ? 'ArtStation' : p.links[0].label}
                </GameButton>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── drawer with the full record (portaled above every screen layer) ── */}
        {createPortal(
          <AnimatePresence>
            {drawer && (
              <div className="qb__overlay" style={{ '--paint': p.paint } as CSSProperties}>
                <motion.div
                  className="qb__scrim"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setDrawer(false)}
                />
                <motion.aside
                  className="qb__drawer"
                  initial={reducedMotion ? { opacity: 0 } : { x: '104%' }}
                  animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { x: '104%' }}
                  transition={{ duration: 0.42, ease }}
                  aria-label={`${p.title} record`}
                >
                  <RecordBody p={p} i={index} onClose={() => setDrawer(false)} />
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </div>
    </Screen>
  )
}

function RecordBody({ p, i, onClose }: { p: Project; i: number; onClose: () => void }) {
  const [shot, setShot] = useState(0)
  useEffect(() => setShot(0), [p.id])
  const imgs = p.images ?? []
  return (
    <div className="rd">
      <button className="rd__close t-mono" onClick={onClose} aria-label="Close record">
        ✕ Close
      </button>

      {imgs.length > 0 && (
        <div className={`rd__gallery ${p.portrait ? 'rd__gallery--portrait' : ''}`}>
          {p.portrait ? (
            imgs.map((src) => <img key={src} className="rd__phone" src={src} alt="" />)
          ) : (
            <>
              <img className="rd__hero" src={imgs[shot]} alt="" />
              {imgs.length > 1 && (
                <div className="rd__thumbs">
                  {imgs.map((src, k) => (
                    <button key={src} className={`rd__thumb ${k === shot ? 'is-on' : ''}`} onClick={() => setShot(k)} aria-label={`Screenshot ${k + 1}`}>
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="rd__body">
        <span className="rd__kicker t-mono">
          Quest {String(i + 1).padStart(2, '0')} · {p.category}
        </span>
        <h2 className="rd__title t-display">{p.title}</h2>
        <div className="rd__facts">
          <div>
            <span className="t-label">Platform</span>
            <span className="t-ui-bold">{p.platform}</span>
          </div>
          <div>
            <span className="t-label">Role</span>
            <span className="t-ui-bold">{p.role}</span>
          </div>
          <div>
            <span className="t-label">Status</span>
            <span className="t-ui-bold" style={{ color: 'var(--paint)' }}>
              {statusLabel[p.status]}
            </span>
          </div>
        </div>
        <p className="rd__desc t-body">{p.description}</p>
        <div className="rd__section">
          <span className="t-label">Features</span>
          <ul className="rd__features">
            {p.features.map((f) => (
              <li key={f} className="t-ui">
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rd__section">
          <span className="t-label">Pipeline</span>
          <Flow steps={p.architecture} />
        </div>
        {p.links.length > 0 && (
          <div className="rd__actions">
            {p.links.map((l, k) => (
              <GameButton key={l.href} tone={k === 0 ? 'red' : 'ghost'} href={l.href}>
                {l.kind === 'steam' ? 'View on Steam' : l.kind === 'artstation' ? 'View on ArtStation' : l.label}
              </GameButton>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
