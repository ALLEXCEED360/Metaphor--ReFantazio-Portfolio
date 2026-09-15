import { useMemo, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { ScreenTitle } from '../components/ScreenTitle'
import { Splat } from '../components/Splat'
import { Screen } from '../components/ui'
import { useKeyNav } from '../hooks/useKeyNav'
import { useNav } from '../app/router'
import { useIsMobile } from '../hooks/useMedia'
import { useSettings } from '../app/settings'
import { profile } from '../data/profile'
import './Contact.css'

const ease = [0.16, 1, 0.3, 1] as const

const channels = [
  { id: 'email', label: 'Email', handle: profile.links.email, href: `mailto:${profile.links.email}`, paint: '#f14352', note: 'The surest way' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'fardeen-alam', href: profile.links.linkedin, paint: '#3a96aa', note: 'Work and history' },
  { id: 'github', label: 'GitHub', handle: 'ALLEXCEED360', href: profile.links.github, paint: '#d4a900', note: 'Code' },
  { id: 'artstation', label: 'ArtStation', handle: 'allexceed360', href: profile.links.artstation, paint: '#0c8e5e', note: 'Unreal Engine cinematics' },
  { id: 'behance', label: 'Behance', handle: 'aryan138alam', href: profile.links.behance, paint: '#b94abb', note: 'Motion and illustration' },
]

/* ─────────────────────────────────────────────────────────
   CONTACT — a letter. Write on the cream sheet (left); it composes an
   email in your own mail app. The channels stand as a numbered index on
   the right (↑/↓ + ↵ opens one). A signature closes the record.
   ───────────────────────────────────────────────────────── */

export function Contact() {
  const { go } = useNav()
  const { reducedMotion } = useSettings()
  const isMobile = useIsMobile()
  const { index, setIndex } = useKeyNav({
    count: channels.length,
    axis: 'both',
    initial: isMobile ? -1 : 0,
    onSelect: (i) => i >= 0 && window.open(channels[i].href, channels[i].href.startsWith('mailto') ? '_self' : '_blank', 'noreferrer'),
    onBack: () => go('/menu'),
  })

  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [state, setState] = useState<'idle' | 'trying' | 'nohandler' | 'copied'>('idle')

  // the composed message, in every form a visitor might need it
  const letter = useMemo(() => {
    const s = subject.trim() || 'Hello from your portfolio'
    const b = [body.trim(), from.trim() ? `\n\n${from.trim()}` : ''].join('')
    const to = profile.links.email
    const enc = encodeURIComponent
    return {
      mailto: `mailto:${to}?subject=${enc(s)}&body=${enc(b)}`,
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(to)}&su=${enc(s)}&body=${enc(b)}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(to)}&subject=${enc(s)}&body=${enc(b)}`,
      plain: `To: ${to}\nSubject: ${s}\n\n${b}`,
    }
  }, [from, subject, body])

  // try the visitor's mail app; if the page never loses focus, nothing is registered for mailto:
  const send = () => {
    setState('trying')
    let left = false
    const onBlur = () => {
      left = true
    }
    window.addEventListener('blur', onBlur, { once: true })
    window.location.href = letter.mailto
    window.setTimeout(() => {
      window.removeEventListener('blur', onBlur)
      setState(left || !document.hasFocus() ? 'idle' : 'nohandler')
    }, 1400)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter.plain)
      setState('copied')
      window.setTimeout(() => setState((v) => (v === 'copied' ? 'nohandler' : v)), 1800)
    } catch {
      window.prompt('Copy the letter', letter.plain)
    }
  }

  const rise = (k: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 + k * 0.07, duration: 0.45, ease },
  })

  return (
    <Screen
      head={<ScreenTitle sub={`${profile.location} · ${channels.length} ways to reach me`}>Contact</ScreenTitle>}
      hints={[
        { key: '↕', label: 'Channel' },
        { key: '↵', label: 'Open' },
      ]}
      onBack={() => go('/menu')}
      className="contact"
    >
      <Background art={15} mobileArt={7} focus="center" dim={0.78} position="center 45%" />

      <div className="ct">
        {/* ── the letter ───────────────────────────────────────────────── */}
        <motion.form
          className="letter"
          {...rise(0)}
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <header className="letter__head">
            <span className="letter__to">
              <span className="t-label">To</span>
              <span className="letter__addr">{profile.name}</span>
            </span>
            <span className="letter__stamp t-label">Letter</span>
          </header>

          <label className="letter__field">
            <span className="t-label">From</span>
            <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your name" autoComplete="name" />
          </label>
          <label className="letter__field">
            <span className="t-label">Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What is this about" />
          </label>
          <label className="letter__field letter__field--grow">
            <span className="t-label">Message</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write here. A project, a role, a question, a game you think I should play." />
          </label>

          <footer className="letter__foot">
            <div className="letter__ways">
              <span className="letter__hint t-mono">
                {state === 'nohandler'
                  ? 'No mail app opened here. Use one of these instead:'
                  : state === 'copied'
                    ? 'Copied. Paste it into any mail.'
                    : 'Send opens your mail app · nothing is stored'}
              </span>
              <span className="letter__alt">
                <span className="letter__alt-or">or via</span>
                <a href={letter.gmail} target="_blank" rel="noreferrer">
                  Gmail
                </a>
                <a href={letter.outlook} target="_blank" rel="noreferrer">
                  Outlook
                </a>
                <button type="button" onClick={copy}>
                  Copy the letter
                </button>
              </span>
            </div>
            <button type="submit" className="letter__send" disabled={state === 'trying'}>
              <span className="letter__send-splat" aria-hidden="true">
                <Splat color="var(--red)" seed={6} />
              </span>
              <span className="letter__send-text">{state === 'trying' ? 'Opening…' : 'Send the letter'}</span>
            </button>
          </footer>
        </motion.form>

        {/* ── channels ─────────────────────────────────────────────────── */}
        <motion.nav className="ct__channels" aria-label="Channels" {...rise(1)}>
          <span className="ct__channels-head t-label">Channels</span>
          {channels.map((c, i) => {
            const on = i === index
            return (
              <a
                key={c.id}
                className={`chan ${on ? 'is-active' : ''}`}
                style={{ '--col': c.paint } as CSSProperties}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                onPointerMove={() => setIndex(i)}
                aria-current={on}
              >
                {on && (
                  <motion.span layoutId="ct-chan-mark" className="chan__mark" aria-hidden="true" transition={{ duration: reducedMotion ? 0 : 0.3, ease }}>
                    <Splat color={c.paint} seed={i + 3} />
                  </motion.span>
                )}
                <span className="chan__num t-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="chan__text">
                  <span className="chan__label">{c.label}</span>
                  <span className="chan__handle t-mono">{c.handle}</span>
                </span>
                <span className="chan__note">{c.note}</span>
                <span className="chan__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            )
          })}
        </motion.nav>

        {/* ── signature ────────────────────────────────────────────────── */}
        <motion.footer className="ct__sign" {...rise(3)}>
          <span className="ct__sign-kicker t-mono">End of record · {new Date().getFullYear()}</span>
          <span className="ct__sign-name t-hero">{profile.name}</span>
          <span className="ct__sign-line t-ui">
            {profile.class} · {profile.subclass} · {profile.location}
          </span>
        </motion.footer>
      </div>
    </Screen>
  )
}
