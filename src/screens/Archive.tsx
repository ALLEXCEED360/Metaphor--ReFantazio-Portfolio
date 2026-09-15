import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { GameButton, Screen, Tag } from '../components/ui'
import { useNav } from '../app/router'
import { useSettings } from '../app/settings'
import { useIsMobile } from '../hooks/useMedia'
import { sfx } from '../app/audio'
import { archive, collectionOf, collections, pieceUrl, type Collection } from '../data/archive'
import './Archive.css'

const ease = [0.16, 1, 0.3, 1] as const
const COLS = 3
type Filter = 'all' | Collection

/* ─────────────────────────────────────────────────────────
   ARCHIVE — a catalogue. Framed pieces in a strict grid under their
   collection headings on the left (scrolls, grows with the work); the
   chosen piece plays in the viewing panel on the right.
   Arrows move through the grid, ↵ opens the original, ⌫ goes back.
   ───────────────────────────────────────────────────────── */

export function Archive() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const [filter, setFilter] = useState<Filter>('all')
  const shown = useMemo(() => (filter === 'all' ? archive : archive.filter((p) => p.collection === filter)), [filter])

  const [index, setIndex] = useState(() => {
    const q = Number(new URLSearchParams(window.location.search).get('sel'))
    if (Number.isFinite(q) && q >= 1 && q <= archive.length) return q - 1
      return 0
  })
  const p = archive[index]
  const col = collectionOf(p.collection)
  // phones: a piece opens its link only on a second tap, after a first tap has shown it in the viewer
  const [tapped, setTapped] = useState<string | null>(null)

  // position of the chosen piece inside the visible list
  const pos = Math.max(0, shown.indexOf(p))
  const pick = useCallback(
    (k: number) => {
      const target = shown[Math.max(0, Math.min(shown.length - 1, k))]
      if (target) {
        const i = archive.indexOf(target)
        if (i !== index) sfx.tick()
        setIndex(i)
      }
    },
    [shown, index],
  )
  // when the filter changes, land on the first piece of that collection if the current one is hidden
  useEffect(() => {
    if (!shown.includes(archive[index])) setIndex(archive.indexOf(shown[0]))
  }, [shown, index])

  // grid keyboard: ←/→ step, ↑/↓ jump a row, Tab cycles collections
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          pick(pos + 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          pick(pos - 1)
          break
        case 'ArrowDown':
          e.preventDefault()
          pick(pos + COLS)
          break
        case 'ArrowUp':
          e.preventDefault()
          pick(pos - COLS)
          break
        case 'Tab': {
          e.preventDefault()
          const order: Filter[] = ['all', ...collections.map((c) => c.id)]
          const k = order.indexOf(filter)
          sfx.toggle()
          setFilter(order[(k + (e.shiftKey ? order.length - 1 : 1)) % order.length])
          break
        }
        case 'Enter':
        case ' ':
          e.preventDefault()
          sfx.confirm()
          window.open(p.link, '_blank', 'noreferrer')
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
  }, [pick, pos, filter, p, go])

  // keep the chosen frame in view
  const gridRef = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  useEffect(() => {
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-id="${p.id}"]`)
    el?.scrollIntoView({ behavior: reducedMotion || first.current ? 'auto' : 'smooth', block: 'nearest' })
    first.current = false
  }, [p.id, reducedMotion, filter])

  // rows grouped by collection, in display order
  const groups = collections.map((c) => ({ c, items: shown.filter((x) => x.collection === c.id) })).filter((g) => g.items.length)

  return (
    <Screen
      head={<ScreenTitle sub={`${archive.length} pieces · ${collections.length} collections`}>Archive</ScreenTitle>}
      hints={[
        { key: '↕', label: 'Row' },
        { key: '↔', label: 'Piece' },
        { key: '↵', label: p.linkLabel },
      ]}
      onBack={() => go('/menu')}
      className="archive"
    >
      <Background art={11} mobileArt={6} focus="center" dim={0.82} position="center 40%" />

      <div className="arc" style={{ '--paint': col.paint } as CSSProperties}>
        {/* ── catalogue ────────────────────────────────────────────────── */}
        <div className="arc__cat">
          <div className="arc__filters" role="tablist" aria-label="Collections">
            <button className={`filt ${filter === 'all' ? 'is-active' : ''}`} style={{ '--col': 'var(--cream)' } as CSSProperties} onClick={() => {
                sfx.toggle()
                setFilter('all')
              }} role="tab" aria-selected={filter === 'all'}>
              <span className="filt__count t-num">{String(archive.length).padStart(2, '0')}</span>
              <span className="filt__name">All work</span>
            </button>
            {collections.map((c) => {
              const n = archive.filter((x) => x.collection === c.id).length
              const on = filter === c.id
              return (
                <button key={c.id} className={`filt ${on ? 'is-active' : ''}`} style={{ '--col': c.paint } as CSSProperties} onClick={() => {
                    sfx.toggle()
                    setFilter(c.id)
                  }} role="tab" aria-selected={on}>
                  <span className="filt__count t-num">{String(n).padStart(2, '0')}</span>
                  <span className="filt__name">{c.title}</span>
                </button>
              )
            })}
          </div>

          <div className="arc__grid" ref={gridRef}>
            {groups.map(({ c, items }) => (
              <section key={c.id} className="grp" style={{ '--col': c.paint } as CSSProperties}>
                <header className="grp__head">
                  <h3 className="grp__title t-display">{c.title}</h3>
                  <span className="grp__count t-mono">
                    {String(items.length).padStart(2, '0')} {items.length === 1 ? 'piece' : 'pieces'}
                  </span>
                  <span className="grp__rule" aria-hidden="true" />
                </header>
                <ul className="grp__grid" role="listbox">
                  {items.map((x) => {
                    const i = archive.indexOf(x)
                    const on = i === index
                    return (
                      <li key={x.id}>
                        <button
                          data-id={x.id}
                          className={`piece ${on ? 'is-active' : ''}`}
                          onPointerMove={(e) => {
                            if (e.pointerType !== 'mouse') return
                            if (!on) sfx.tick()
                            setIndex(i)
                          }}
                          onClick={() => {
                            if (on && (!isMobile || tapped === x.id)) {
                              sfx.confirm()
                              window.open(x.link, '_blank', 'noreferrer')
                              return
                            }
                            if (!on) sfx.tick()
                            setIndex(i)
                            setTapped(x.id)
                            // on a phone the viewer sits above the grid: bring it back into view
                            if (isMobile) document.querySelector('.stage__body')?.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
                          }}
                          aria-selected={on}
                          aria-label={`${x.title}, ${c.title}, ${x.year}`}
                        >
                          <span className="piece__frame">
                            <img src={pieceUrl(x.image)} alt="" loading="lazy" className={x.fit === 'contain' ? 'is-contain' : ''} />
                            {x.fit === 'contain' && <span className="piece__wash" style={{ backgroundImage: `url(${pieceUrl(x.image)})` }} />}
                            {x.video && <span className="piece__reel" aria-hidden="true" />}
                            <span className="piece__num t-num">{String(i + 1).padStart(2, '0')}</span>
                          </span>
                          <span className="piece__cap">
                            <span className="piece__title">{x.title}</span>
                            <span className="piece__year t-mono">{x.year}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* ── viewing panel ────────────────────────────────────────────── */}
        <aside className="view" aria-live="polite">
          <div className="view__screen">
            <AnimatePresence initial={false}>
              <motion.div
                key={p.id}
                className="view__media"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.6, ease }}
              >
                {p.video && !reducedMotion ? (
                  <video src={pieceUrl(p.video)} poster={pieceUrl(p.image)} autoPlay muted loop playsInline preload="auto" />
                ) : (
                  <>
                    {p.fit === 'contain' && <span className="view__wash" style={{ backgroundImage: `url(${pieceUrl(p.image)})` }} />}
                    <img src={pieceUrl(p.image)} alt="" className={p.fit === 'contain' ? 'is-contain' : ''} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            <span className="view__corner view__corner--tl" aria-hidden="true" />
            <span className="view__corner view__corner--br" aria-hidden="true" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.id}
              className="view__info"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.32, ease }}
            >
              <span className="view__kicker t-mono">
                {col.title} · {String(index + 1).padStart(2, '0')} of {String(archive.length).padStart(2, '0')} · {p.year}
              </span>
              <h2 className="view__title t-hero">
                <span className="view__title-splat" aria-hidden="true">
                  <Splat color={col.paint} seed={index + 2} />
                </span>
                <span className="view__title-text">{p.title}</span>
              </h2>
              <p className="view__note t-body">{p.note}</p>
              <div className="tags">
                {p.tools.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <GameButton href={p.link} tone="cream">
                Open on {p.linkLabel}
              </GameButton>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </Screen>
  )
}
